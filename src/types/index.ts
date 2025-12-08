/**
 * Type Definitions for Xandeum pNode Analytics Platform
 */

export type NodeStatus = 'active' | 'inactive' | 'syncing';

export interface Location {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Performance {
  latency: number;             // milliseconds
  storageCapacity: number;     // bytes
  storageUsed: number;         // bytes
  bandwidth: number;           // bytes/s
}

export interface PNode {
  id: string;                    // Unique identifier
  publicKey: string;             // Node public key
  ipAddress: string;             // IP address
  port: number;                  // Port number
  version: string;               // Software version
  status: NodeStatus;
  lastSeen: Date;                // Last activity timestamp
  firstSeen: Date;               // First discovered
  uptime: number;                // Uptime percentage (0-100)
  location?: Location;
  performance?: Performance;
  metadata?: Record<string, any>;
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  inactiveNodes: number;
  averageUptime: number;         // percentage
  totalStorage: number;          // bytes
  usedStorage: number;           // bytes
  networkHealth: number;         // 0-100 score
  lastUpdated: Date;
}

export interface NetworkSnapshot {
  id: number;
  totalNodes: number;
  activeNodes: number;
  inactiveNodes: number;
  averageUptime: number;
  networkHealth: number;
  snapshotTime: Date;
}

export interface NodePerformanceLog {
  id: number;
  nodeId: string;
  latency: number;
  storageUsed: number;
  bandwidth: number;
  recordedAt: Date;
}

export interface APIError {
  message: string;
  status: number;
  endpoint: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
}
