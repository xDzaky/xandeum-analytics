import { useQuery } from '@tanstack/react-query';
import { xandeumAPI } from '../services/api';
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
 */
export function useNetworkStats() {
  return useQuery<NetworkStats, Error>({
    queryKey: ['network-stats'],
    queryFn: () => xandeumAPI.getNetworkStats(),
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
