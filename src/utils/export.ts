import type { PNode, NetworkStats } from '../types';

/**
 * Export utilities for Xandeum Analytics Platform
 * Supports CSV and JSON export for nodes and network stats
 */

/**
 * Convert nodes to CSV format
 */
export function exportNodesToCSV(nodes: PNode[]): void {
  const headers = [
    'ID',
    'Public Key',
    'IP Address',
    'Port',
    'Status',
    'Version',
    'Uptime (%)',
    'Last Seen',
    'First Seen',
    'Country',
    'City',
    'Latitude',
    'Longitude',
    'Storage Capacity (GB)',
    'Storage Used (GB)',
    'Latency (ms)',
    'Bandwidth (Mbps)',
  ];

  const rows = nodes.map((node) => [
    node.id,
    node.publicKey,
    node.ipAddress,
    node.port,
    node.status,
    node.version,
    node.uptime.toFixed(2),
    node.lastSeen.toISOString(),
    node.firstSeen.toISOString(),
    node.location?.country || 'N/A',
    node.location?.city || 'N/A',
    node.location?.latitude.toFixed(4) || 'N/A',
    node.location?.longitude.toFixed(4) || 'N/A',
    node.performance?.storageCapacity ? (node.performance.storageCapacity / 1e9).toFixed(2) : 'N/A',
    node.performance?.storageUsed ? (node.performance.storageUsed / 1e9).toFixed(2) : 'N/A',
    node.performance?.latency?.toFixed(2) || 'N/A',
    node.performance?.bandwidth ? (node.performance.bandwidth / 1e6).toFixed(2) : 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, `xandeum-nodes-${getTimestamp()}.csv`, 'text/csv');
}

/**
 * Convert nodes to JSON format
 */
export function exportNodesToJSON(nodes: PNode[]): void {
  const data = {
    exportDate: new Date().toISOString(),
    totalNodes: nodes.length,
    nodes: nodes.map((node) => ({
      id: node.id,
      publicKey: node.publicKey,
      ipAddress: node.ipAddress,
      port: node.port,
      status: node.status,
      version: node.version,
      uptime: node.uptime,
      lastSeen: node.lastSeen.toISOString(),
      firstSeen: node.firstSeen.toISOString(),
      location: node.location,
      performance: node.performance,
      metadata: node.metadata,
    })),
  };

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `xandeum-nodes-${getTimestamp()}.json`, 'application/json');
}

/**
 * Export network stats to CSV
 */
export function exportStatsToCSV(stats: NetworkStats): void {
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Nodes', stats.totalNodes],
    ['Active Nodes', stats.activeNodes],
    ['Inactive Nodes', stats.inactiveNodes],
    ['Average Uptime (%)', stats.averageUptime.toFixed(2)],
    ['Total Storage (GB)', (stats.totalStorage / 1e9).toFixed(2)],
    ['Used Storage (GB)', (stats.usedStorage / 1e9).toFixed(2)],
    ['Network Health', stats.networkHealth.toFixed(2)],
    ['Last Updated', stats.lastUpdated.toISOString()],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, `xandeum-stats-${getTimestamp()}.csv`, 'text/csv');
}

/**
 * Export network stats to JSON
 */
export function exportStatsToJSON(stats: NetworkStats): void {
  const data = {
    exportDate: new Date().toISOString(),
    networkStats: {
      totalNodes: stats.totalNodes,
      activeNodes: stats.activeNodes,
      inactiveNodes: stats.inactiveNodes,
      averageUptime: stats.averageUptime,
      totalStorage: stats.totalStorage,
      usedStorage: stats.usedStorage,
      networkHealth: stats.networkHealth,
      lastUpdated: stats.lastUpdated.toISOString(),
    },
  };

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `xandeum-stats-${getTimestamp()}.json`, 'application/json');
}

/**
 * Export filtered nodes (for search results)
 */
export function exportFilteredNodes(nodes: PNode[], filterName: string = 'filtered'): void {
  const data = {
    exportDate: new Date().toISOString(),
    filter: filterName,
    totalNodes: nodes.length,
    nodes: nodes,
  };

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(
    jsonContent,
    `xandeum-nodes-${filterName}-${getTimestamp()}.json`,
    'application/json'
  );
}

/**
 * Helper function to trigger file download
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get timestamp for filename
 */
function getTimestamp(): string {
  const now = new Date();
  return now
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '_');
}

/**
 * Copy data to clipboard as JSON
 */
export async function copyToClipboardAsJSON(data: unknown): Promise<boolean> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Export single node details
 */
export function exportNodeDetails(node: PNode): void {
  const data = {
    exportDate: new Date().toISOString(),
    node: {
      id: node.id,
      publicKey: node.publicKey,
      ipAddress: node.ipAddress,
      port: node.port,
      status: node.status,
      version: node.version,
      uptime: node.uptime,
      lastSeen: node.lastSeen.toISOString(),
      firstSeen: node.firstSeen.toISOString(),
      location: node.location,
      performance: node.performance,
      metadata: node.metadata,
    },
  };

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `xandeum-node-${node.id}-${getTimestamp()}.json`, 'application/json');
}
