import { useQuery } from '@tanstack/react-query';
import { xandeumAPI } from '../services/api';
import { historicalDataService } from '../services/historicalData';
import type { PNode, NetworkStats } from '../types';

/**
 * Hook to fetch all pNodes
 */
export function useNodes() {
  return useQuery<PNode[], Error>({
    queryKey: ['nodes'],
    queryFn: () => xandeumAPI.getAllNodes(false),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  });
}

/**
 * Hook to fetch a specific node by ID
 */
export function useNode(nodeId: string) {
  return useQuery<PNode | null, Error>({
    queryKey: ['node', nodeId],
    queryFn: () => xandeumAPI.getNodeById(nodeId),
    enabled: !!nodeId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch network statistics
 * Also saves historical data for time-series charts
 */
export function useNetworkStats() {
  return useQuery<NetworkStats, Error>({
    queryKey: ['network-stats'],
    queryFn: async () => {
      const stats = await xandeumAPI.getNetworkStats();
      
      // Save snapshot to historical data
      historicalDataService.addSnapshot(
        stats.networkHealth,
        stats.activeNodes,
        stats.totalNodes,
        stats.averageUptime
      );
      
      return stats;
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

/**
 * Hook to check API health
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => xandeumAPI.healthCheck(),
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

