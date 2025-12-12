import type { PNode } from '../types';

// Simple CSV export for node list
export function exportNodesToCSV(nodes: PNode[]) {
  const headers = ['id', 'publicKey', 'ipAddress', 'port', 'version', 'status', 'uptime', 'country', 'city', 'lat', 'long'];
  const rows = nodes.map((n) => [
    n.id,
    n.publicKey,
    n.ipAddress,
    n.port,
    n.version,
    n.status,
    n.uptime.toFixed(2),
    n.location?.country ?? '',
    n.location?.city ?? '',
    n.location?.latitude ?? '',
    n.location?.longitude ?? '',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.map(escapeCSV).join(','))].join('\n');
  downloadFile(csv, 'xandeum-nodes.csv', 'text/csv');
}

// JSON export for node list
export function exportNodesToJSON(nodes: PNode[]) {
  const json = JSON.stringify(nodes, null, 2);
  downloadFile(json, 'xandeum-nodes.json', 'application/json');
}

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
