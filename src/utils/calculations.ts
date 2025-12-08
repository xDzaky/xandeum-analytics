import type { PNode, NetworkStats } from '../types';

/**
 * Calculation utilities for network metrics
 */

/**
 * Calculate network health score (0-100)
 */
export function calculateNetworkHealth(nodes: PNode[]): number {
  if (nodes.length === 0) return 0;

  const activeNodes = nodes.filter(n => n.status === 'active').length;
  const activeRatio = activeNodes / nodes.length;
  
  const avgUptime = nodes.reduce((sum, node) => sum + node.uptime, 0) / nodes.length;
  
  // Weight: 60% active ratio, 40% uptime
  const healthScore = (activeRatio * 60) + (avgUptime * 0.4);
  
  return Math.min(100, Math.max(0, healthScore));
}

/**
 * Calculate average uptime from nodes
 */
export function calculateAverageUptime(nodes: PNode[]): number {
  if (nodes.length === 0) return 0;
  
  const totalUptime = nodes.reduce((sum, node) => sum + node.uptime, 0);
  return totalUptime / nodes.length;
}

/**
 * Calculate total storage from nodes
 */
export function calculateTotalStorage(nodes: PNode[]): number {
  return nodes.reduce((sum, node) => {
    return sum + (node.performance?.storageCapacity || 0);
  }, 0);
}

/**
 * Calculate used storage from nodes
 */
export function calculateUsedStorage(nodes: PNode[]): number {
  return nodes.reduce((sum, node) => {
    return sum + (node.performance?.storageUsed || 0);
  }, 0);
}

/**
 * Generate network statistics from nodes
 */
export function generateNetworkStats(nodes: PNode[]): NetworkStats {
  const activeNodes = nodes.filter(n => n.status === 'active').length;
  const inactiveNodes = nodes.filter(n => n.status === 'inactive').length;
  
  return {
    totalNodes: nodes.length,
    activeNodes,
    inactiveNodes,
    averageUptime: calculateAverageUptime(nodes),
    totalStorage: calculateTotalStorage(nodes),
    usedStorage: calculateUsedStorage(nodes),
    networkHealth: calculateNetworkHealth(nodes),
    lastUpdated: new Date(),
  };
}

/**
 * Calculate trend direction and percentage
 */
export function calculateTrend(current: number, previous: number): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
} {
  if (previous === 0) {
    return { direction: 'stable', percentage: 0 };
  }
  
  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < 0.1) {
    return { direction: 'stable', percentage: 0 };
  }
  
  return {
    direction: change > 0 ? 'up' : 'down',
    percentage: Math.abs(change),
  };
}

/**
 * Get status color based on node status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'rgb(34 197 94)'; // success
    case 'inactive':
      return 'rgb(239 68 68)'; // error
    case 'syncing':
      return 'rgb(234 179 8)'; // warning
    default:
      return 'rgb(59 130 246)'; // info
  }
}
