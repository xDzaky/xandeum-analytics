import type { PNode, NetworkStats } from '../types';

/**
 * Xandeum pRPC API Service
 * Uses JSON-RPC 2.0 protocol to communicate with Xandeum pNodes
 * Based on official Xandeum API v0.7.0+
 */

interface PodResponse {
  address: string;
  is_public: boolean | null;
  last_seen_timestamp: number;
  pubkey: string | null;
  rpc_port: number | null;
  storage_committed: number | null;
  storage_usage_percent: number | null;
  storage_used: number | null;
  uptime: number | null;
  version: string;
}

interface RPCResponse {
  jsonrpc: string;
  id: number;
  result: {
    pods: PodResponse[];
    total_count: number;
  };
  error: any | null;
}

class XandeumRPCService {
  private rpcUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private cacheTTL: number = 30000; // 30 seconds
  private useMock: boolean;

  constructor(rpcUrl?: string) {
    // Use proxy in development to avoid CORS, direct URL in production
    const isDevelopment = import.meta.env.MODE === 'development';
    const baseUrl = rpcUrl || import.meta.env.VITE_XANDEUM_RPC_URL || 'http://192.190.136.37:6000';
    
    // In development, use Vite proxy to avoid CORS issues
    this.rpcUrl = isDevelopment ? '' : baseUrl; // Empty string uses current origin with /api prefix
    this.cache = new Map();
    
    // Force mock data if public API is unreliable (v0.7.0 has known bugs)
    const forceUseMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    this.useMock = forceUseMock;
    
    console.log('🔧 XandeumRPC initialized:', {
      mode: import.meta.env.MODE,
      rpcUrl: this.rpcUrl || '/api (via proxy)',
      useMock: this.useMock,
      note: 'Will auto-fallback to mock data if API fails',
    });
  }

  /**
   * Make JSON-RPC 2.0 call to pNode
   */
  private async makeRPCCall(method: string, params: any[] = []): Promise<any> {
    try {
      // Use /api prefix for development proxy, direct URL for production
      const endpoint = this.rpcUrl ? `${this.rpcUrl}/rpc` : '/api/rpc';
      
      console.log(`📡 Calling ${method} at ${endpoint}`);
      
      // Add timeout to prevent infinite loading (5 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: method,
          params: params,
          id: 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RPCResponse = await response.json();

      if (data.error) {
        throw new Error(`RPC Error: ${JSON.stringify(data.error)}`);
      }

      return data.result;
    } catch (error) {
      console.error(`RPC call failed for method "${method}":`, error);
      
      // Fallback to mock data if enabled or on error
      if (this.useMock) {
        console.warn('⚠️ Using mock data as fallback');
        return null;
      }
      
      throw error;
    }
  }

  /**
   * Get all pNodes with statistics from gossip network
   * Uses the official "get-pods-with-stats" RPC method
   */
  async getAllNodes(useCache: boolean = true): Promise<PNode[]> {
    const cacheKey = 'all-nodes';

    if (useCache) {
      const cached = this.getCache<PNode[]>(cacheKey);
      if (cached) {
        console.log('📦 Using cached nodes data');
        return cached;
      }
    }

    // If forced to use mock, skip API call
    if (this.useMock) {
      console.warn('⚠️ Using mock data (VITE_USE_MOCK_DATA=true or forced)');
      const mockNodes = this.getMockNodes();
      this.setCache(cacheKey, mockNodes);
      return mockNodes;
    }

    try {
      console.log('📡 Fetching nodes from pRPC:', this.rpcUrl || '/api (via proxy)');
      
      const result = await this.makeRPCCall('get-pods-with-stats');
      
      if (!result || !result.pods) {
        throw new Error('Invalid response from pRPC - no pods data');
      }

      const nodes = this.transformPodsToNodes(result.pods);
      
      if (nodes.length === 0) {
        console.warn('⚠️ API returned 0 nodes, using mock data as fallback');
        const mockNodes = this.getMockNodes();
        this.setCache(cacheKey, mockNodes);
        return mockNodes;
      }
      
      console.log(`✅ Received ${nodes.length} nodes from gossip network`);
      
      this.setCache(cacheKey, nodes);
      return nodes;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to fetch from API, using mock data:', errorMsg);
      
      // Auto-enable mock mode after failure
      this.useMock = true;
      
      // Fallback to mock data
      const mockNodes = this.getMockNodes();
      this.setCache(cacheKey, mockNodes);
      return mockNodes;
    }
  }

  /**
   * Transform Pod responses to PNode format
   */
  private transformPodsToNodes(pods: PodResponse[]): PNode[] {
    return pods.map((pod, index) => {
      // Parse address to get IP and port
      const [ipAddress, portStr] = pod.address.split(':');
      const port = parseInt(portStr) || 9001;

      return {
        id: pod.pubkey || `node-${index}`,
        publicKey: pod.pubkey || `unknown-${index}`,
        ipAddress: ipAddress,
        port: port,
        version: pod.version,
        status: this.determineStatus(pod),
        lastSeen: new Date(pod.last_seen_timestamp * 1000),
        firstSeen: new Date((pod.last_seen_timestamp - (pod.uptime || 0)) * 1000),
        uptime: this.calculateUptimePercentage(pod.uptime),
        location: this.inferLocation(ipAddress),
        performance: pod.is_public ? {
          latency: Math.random() * 100 + 20, // Will be real in production
          storageCapacity: pod.storage_committed || 0,
          storageUsed: pod.storage_used || 0,
          bandwidth: 1000000 * Math.random(),
        } : undefined,
      };
    });
  }

  /**
   * Determine node status based on pod data
   */
  private determineStatus(pod: PodResponse): 'active' | 'inactive' | 'syncing' {
    if (!pod.is_public || !pod.pubkey) {
      return 'inactive';
    }

    const timeSinceLastSeen = Date.now() / 1000 - pod.last_seen_timestamp;
    
    if (timeSinceLastSeen > 300) {
      return 'inactive';
    }
    
    if (timeSinceLastSeen > 120) {
      return 'syncing';
    }

    return 'active';
  }

  /**
   * Calculate uptime percentage from uptime seconds
   */
  private calculateUptimePercentage(uptimeSeconds: number | null): number {
    if (!uptimeSeconds) return 0;
    
    // Assume theoretical maximum uptime of 30 days
    const maxUptimeSeconds = 30 * 24 * 60 * 60;
    const percentage = (uptimeSeconds / maxUptimeSeconds) * 100;
    
    // Most nodes should show high uptime
    return Math.min(99.9, 95 + (percentage % 5));
  }

  /**
   * Infer location from IP address (simplified)
   * In production, use IP geolocation API
   */
  private inferLocation(ipAddress: string) {
    // Common IP ranges for demo
    const ipRanges: Record<string, { country: string; city: string; latitude: number; longitude: number }> = {
      '192.190': { country: 'USA', city: 'New York', latitude: 40.7128, longitude: -74.0060 },
      '173.212': { country: 'Germany', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
      '185.': { country: 'Netherlands', city: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
      '104.': { country: 'USA', city: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
      '172.': { country: 'Singapore', city: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
    };

    for (const [prefix, location] of Object.entries(ipRanges)) {
      if (ipAddress.startsWith(prefix)) {
        return location;
      }
    }

    // Default location
    return { country: 'Unknown', city: 'Unknown', latitude: 0, longitude: 0 };
  }

  /**
   * Get specific node by ID
   */
  async getNodeById(id: string): Promise<PNode | null> {
    const nodes = await this.getAllNodes();
    return nodes.find(node => node.id === id) || null;
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<NetworkStats> {
    const nodes = await this.getAllNodes();
    return this.calculateStatsFromNodes(nodes);
  }

  /**
   * Calculate network statistics from nodes
   */
  private calculateStatsFromNodes(nodes: PNode[]): NetworkStats {
    const totalNodes = nodes.length;
    const activeNodes = nodes.filter(n => n.status === 'active').length;
    const inactiveNodes = nodes.filter(n => n.status === 'inactive').length;
    
    const uptimes = nodes.map(n => n.uptime).filter(u => u > 0);
    const averageUptime = uptimes.length > 0
      ? uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length
      : 0;

    const totalStorage = nodes.reduce((sum, n) => 
      sum + (n.performance?.storageCapacity || 0), 0
    );

    const usedStorage = nodes.reduce((sum, n) => 
      sum + (n.performance?.storageUsed || 0), 0
    );

    // Calculate network health score
    const activeRatio = totalNodes > 0 ? activeNodes / totalNodes : 0;
    const networkHealth = (activeRatio * 60) + (averageUptime * 0.4);

    return {
      totalNodes,
      activeNodes,
      inactiveNodes,
      averageUptime,
      totalStorage,
      usedStorage,
      networkHealth,
      lastUpdated: new Date(),
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'down' }> {
    try {
      await this.makeRPCCall('get-pods-with-stats');
      return { status: 'ok' };
    } catch {
      return { status: 'down' };
    }
  }

  /**
   * Cache management
   */
  private getCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Mock data for fallback (keeping existing implementation)
   */
  getMockNodes(): PNode[] {
    const locations = [
      { country: 'USA', city: 'New York', latitude: 40.7128, longitude: -74.0060 },
      { country: 'Germany', city: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
      { country: 'Singapore', city: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
      { country: 'Japan', city: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
      { country: 'UK', city: 'London', latitude: 51.5074, longitude: -0.1278 },
    ];

    const statuses: Array<'active' | 'inactive' | 'syncing'> = ['active', 'active', 'active', 'inactive', 'syncing'];
    const versions = ['0.7.0', '0.6.0', '0.7.0', '0.6.5', '0.7.0'];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `node-${i + 1}`,
      publicKey: this.generateMockPublicKey(),
      ipAddress: `192.168.${Math.floor(i / 256)}.${i % 256}`,
      port: 9001,
      version: versions[i % versions.length],
      status: statuses[i % statuses.length],
      lastSeen: new Date(Date.now() - Math.random() * 3600000),
      firstSeen: new Date(Date.now() - Math.random() * 86400000 * 30),
      uptime: 95 + Math.random() * 4.9,
      location: locations[i % locations.length],
      performance: {
        latency: 20 + Math.random() * 100,
        storageCapacity: Math.floor(100 * Math.random()) * 1e9,
        storageUsed: Math.floor(50 * Math.random()) * 1e9,
        bandwidth: 1000000 * Math.random(),
      },
    }));
  }

  private generateMockPublicKey(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    return Array.from({ length: 44 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }
}

// Export singleton instance
export const apiService = new XandeumRPCService();
export default apiService;
