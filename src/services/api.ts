import type { PNode, NetworkStats, APIError } from '../types';

/**
 * Xandeum API Service
 * Handles all API calls to Xandeum pRPC endpoints
 */

class XandeumAPIService {
  private baseURL: string;
  private cache: Map<string, { data: unknown; timestamp: number }>;

  constructor(baseURL: string = 'https://api.xandeum.network') {
    this.baseURL = baseURL;
    this.cache = new Map();
  }

  /**
   * Generic fetch with error handling
   */
  private async fetchWithErrorHandling<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw this.createAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'APIError') {
        throw error;
      }
      
      throw this.createAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0,
        endpoint
      );
    }
  }

  /**
   * Create API Error object
   */
  private createAPIError(message: string, status: number, endpoint: string): APIError {
    return {
      message,
      status,
      endpoint,
    };
  }

  /**
   * Get cached data if available and not expired
   */
  private getCached<T>(key: string, ttl: number = 30000): T | null {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
    
    return null;
  }

  /**
   * Set cache data
   */
  private setCache(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Get all pNodes from gossip
   */
  async getAllNodes(useCache: boolean = true): Promise<PNode[]> {
    const cacheKey = 'all-nodes';
    
    if (useCache) {
      const cached = this.getCached<PNode[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      // TODO: Update with actual endpoint from Xandeum docs
      const data = await this.fetchWithErrorHandling<PNode[]>('/api/v1/gossip/nodes');
      
      // Transform data if needed
      const nodes = this.transformNodeData(data);
      
      this.setCache(cacheKey, nodes);
      return nodes;
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
      
      // Return mock data for development
      return this.getMockNodes();
    }
  }

  /**
   * Get specific pNode by ID
   */
  async getNodeById(nodeId: string): Promise<PNode | null> {
    try {
      // TODO: Update with actual endpoint
      const data = await this.fetchWithErrorHandling<PNode>(`/api/v1/nodes/${nodeId}`);
      return this.transformSingleNode(data);
    } catch (error) {
      console.error(`Failed to fetch node ${nodeId}:`, error);
      return null;
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<NetworkStats> {
    const cacheKey = 'network-stats';
    
    const cached = this.getCached<NetworkStats>(cacheKey);
    if (cached) return cached;

    try {
      // TODO: Update with actual endpoint
      const data = await this.fetchWithErrorHandling<NetworkStats>('/api/v1/network/stats');
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch network stats:', error);
      
      // Calculate from nodes as fallback
      const nodes = await this.getAllNodes();
      return this.calculateStatsFromNodes(nodes);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'down' }> {
    try {
      const data = await this.fetchWithErrorHandling<{ status: string }>('/api/v1/health');
      return { status: data.status as 'ok' | 'degraded' | 'down' };
    } catch {
      return { status: 'down' };
    }
  }

  /**
   * Transform raw API data to PNode format
   */
  private transformNodeData(data: PNode[]): PNode[] {
    return data.map(node => this.transformSingleNode(node));
  }

  /**
   * Transform single node data
   */
  private transformSingleNode(node: PNode): PNode {
    return {
      id: node.id || node.publicKey,
      publicKey: node.publicKey,
      ipAddress: node.ipAddress,
      port: node.port || 8000,
      version: node.version || '1.0.0',
      status: node.status || 'active',
      lastSeen: new Date(node.lastSeen || Date.now()),
      firstSeen: new Date(node.firstSeen || Date.now()),
      uptime: node.uptime || 99.9,
      location: node.location,
      performance: node.performance,
      metadata: node.metadata,
    };
  }

  /**
   * Calculate network stats from nodes array
   */
  private calculateStatsFromNodes(nodes: PNode[]): NetworkStats {
    const activeNodes = nodes.filter(n => n.status === 'active').length;
    const inactiveNodes = nodes.filter(n => n.status === 'inactive').length;
    
    const totalUptime = nodes.reduce((sum, node) => sum + node.uptime, 0);
    const averageUptime = nodes.length > 0 ? totalUptime / nodes.length : 0;
    
    const totalStorage = nodes.reduce((sum, node) => 
      sum + (node.performance?.storageCapacity || 0), 0
    );
    
    const usedStorage = nodes.reduce((sum, node) => 
      sum + (node.performance?.storageUsed || 0), 0
    );
    
    return {
      totalNodes: nodes.length,
      activeNodes,
      inactiveNodes,
      averageUptime,
      totalStorage,
      usedStorage,
      networkHealth: (activeNodes / nodes.length) * 100,
      lastUpdated: new Date(),
    };
  }

  /**
   * Generate mock data for development
   */
  private getMockNodes(): PNode[] {
    const mockNodes: PNode[] = [];
    const statuses: Array<'active' | 'inactive' | 'syncing'> = ['active', 'active', 'active', 'inactive', 'syncing'];
    
    for (let i = 0; i < 50; i++) {
      mockNodes.push({
        id: `node-${i + 1}`,
        publicKey: `0x${Math.random().toString(16).substr(2, 64)}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: 8000 + i,
        version: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        firstSeen: new Date(Date.now() - Math.random() * 86400000 * 30),
        uptime: 95 + Math.random() * 5,
        location: {
          country: ['USA', 'Germany', 'Singapore', 'Japan', 'UK'][Math.floor(Math.random() * 5)],
          city: ['New York', 'Berlin', 'Singapore', 'Tokyo', 'London'][Math.floor(Math.random() * 5)],
          latitude: -90 + Math.random() * 180,
          longitude: -180 + Math.random() * 360,
        },
        performance: {
          latency: 10 + Math.random() * 100,
          storageCapacity: 1000000000000 + Math.random() * 5000000000000,
          storageUsed: 500000000000 + Math.random() * 2000000000000,
          bandwidth: 1000000 + Math.random() * 5000000,
        },
      });
    }
    
    return mockNodes;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const xandeumAPI = new XandeumAPIService();

// Export class for testing
export { XandeumAPIService };
