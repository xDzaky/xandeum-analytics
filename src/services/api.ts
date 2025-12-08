import type { PNode, NetworkStats } from '../types';
import { apiService as xandeumRPC } from './xandeumRPC';

/**
 * Xandeum API Service - Updated to use real pRPC
 * Now connects to actual Xandeum gossip network via JSON-RPC 2.0
 * 
 * This is a wrapper around xandeumRPC for backward compatibility
 */

class XandeumAPIService {
  /**
   * Get all pNodes from gossip - Now using real pRPC
   */
  async getAllNodes(useCache: boolean = true): Promise<PNode[]> {
    // Delegate to real pRPC service
    return await xandeumRPC.getAllNodes(useCache);
  }

  /**
   * Get specific pNode by ID - Now using real pRPC
   */
  async getNodeById(nodeId: string): Promise<PNode | null> {
    // Delegate to real pRPC service
    return await xandeumRPC.getNodeById(nodeId);
  }

  /**
   * Get network statistics - Now using real pRPC
   */
  async getNetworkStats(): Promise<NetworkStats> {
    // Delegate to real pRPC service
    return await xandeumRPC.getNetworkStats();
  }

  /**
   * Health check - Now using real pRPC
   */
  async healthCheck(): Promise<{ status: 'ok' | 'degraded' | 'down' }> {
    // Delegate to real pRPC service
    return await xandeumRPC.healthCheck();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    // Delegate to RPC service (no-op for now)
    console.log('Cache cleared');
  }
}

// Export singleton instance
export const xandeumAPI = new XandeumAPIService();

// Export class for testing
export { XandeumAPIService };
