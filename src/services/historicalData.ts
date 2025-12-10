/**
 * Historical Data Service
 * Stores network health snapshots for time-series visualization
 * Now tracks real data from API polling
 */

export interface HealthSnapshot {
  timestamp: number;
  health: number;
  activeNodes: number;
  totalNodes: number;
  averageUptime: number;
}

export interface NetworkSnapshot {
  timestamp: number;
  totalNodes: number;
  activeNodes: number;
  inactiveNodes: number;
}

class HistoricalDataService {
  private snapshots: HealthSnapshot[] = [];
  private networkSnapshots: NetworkSnapshot[] = [];
  private maxSnapshots = 288; // Keep 24 hours at 5-minute intervals
  private storageKey = 'xandeum_health_history';
  private networkStorageKey = 'xandeum_network_timeline';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a new health snapshot
   */
  addSnapshot(health: number, activeNodes: number, totalNodes: number, averageUptime: number): void {
    const snapshot: HealthSnapshot = {
      timestamp: Date.now(),
      health,
      activeNodes,
      totalNodes,
      averageUptime,
    };

    this.snapshots.push(snapshot);

    // Keep only the last N snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }

    this.saveToStorage();
  }

  /**
   * Add a network timeline snapshot (for Network Timeline chart)
   */
  addNetworkSnapshot(totalNodes: number, activeNodes: number, inactiveNodes: number): void {
    const snapshot: NetworkSnapshot = {
      timestamp: Date.now(),
      totalNodes,
      activeNodes,
      inactiveNodes,
    };

    this.networkSnapshots.push(snapshot);

    // Keep only the last N snapshots
    if (this.networkSnapshots.length > this.maxSnapshots) {
      this.networkSnapshots = this.networkSnapshots.slice(-this.maxSnapshots);
    }

    this.saveNetworkToStorage();
  }

  /**
   * Get snapshots for a specific time period
   */
  getSnapshots(periodHours: number): HealthSnapshot[] {
    const now = Date.now();
    const cutoffTime = now - (periodHours * 60 * 60 * 1000);

    const filtered = this.snapshots.filter(s => s.timestamp >= cutoffTime);

    // If we have data, return it
    if (filtered.length > 0) {
      return filtered;
    }

    // Otherwise generate mock data for the period
    return this.generateMockData(periodHours);
  }

  /**
   * Get network timeline snapshots for the last N hours
   */
  getNetworkTimeline(hours: number = 24): NetworkSnapshot[] {
    const now = Date.now();
    const cutoffTime = now - (hours * 60 * 60 * 1000);

    const filtered = this.networkSnapshots.filter(s => s.timestamp >= cutoffTime);

    // If we have real data, use it
    if (filtered.length >= 10) {
      // Downsample to max 48 points for performance
      const step = Math.max(1, Math.floor(filtered.length / 48));
      return filtered.filter((_, i) => i % step === 0);
    }

    // Otherwise return empty array - let Analytics.tsx handle mock data
    return [];
  }

  /**
   * Generate mock historical data
   */
  private generateMockData(periodHours: number): HealthSnapshot[] {
    const data: HealthSnapshot[] = [];
    const now = Date.now();
    const interval = periodHours <= 1 ? 2 * 60 * 1000 : // 2 minutes for 1h
                     periodHours <= 6 ? 10 * 60 * 1000 : // 10 minutes for 6h
                     30 * 60 * 1000; // 30 minutes for 24h+

    const points = periodHours <= 1 ? 30 : 
                   periodHours <= 6 ? 36 : 
                   48;

    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * interval);
      
      // Simulate gradual health degradation
      let health = 95;
      if (i < points * 0.25) {
        health = 75 + Math.random() * 10; // Recent: 75-85%
      } else if (i < points * 0.5) {
        health = 85 + Math.random() * 10; // Mid: 85-95%
      } else {
        health = 92 + Math.random() * 6; // Earlier: 92-98%
      }

      data.push({
        timestamp,
        health: parseFloat(health.toFixed(1)),
        activeNodes: Math.floor(20 + Math.random() * 2),
        totalNodes: 21,
        averageUptime: parseFloat((health + Math.random() * 5).toFixed(1)),
      });
    }

    return data;
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.snapshots));
    } catch (error) {
      console.warn('Failed to save history to storage:', error);
    }
  }

  /**
   * Save network timeline to localStorage
   */
  private saveNetworkToStorage(): void {
    try {
      localStorage.setItem(this.networkStorageKey, JSON.stringify(this.networkSnapshots));
    } catch (error) {
      console.warn('Failed to save network timeline to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.snapshots = parsed.filter((s: HealthSnapshot) => {
          // Keep only snapshots from last 24 hours
          return s.timestamp > Date.now() - (24 * 60 * 60 * 1000);
        });
      }

      // Load network timeline
      const networkStored = localStorage.getItem(this.networkStorageKey);
      if (networkStored) {
        const parsed = JSON.parse(networkStored);
        this.networkSnapshots = parsed.filter((s: NetworkSnapshot) => {
          // Keep only snapshots from last 24 hours
          return s.timestamp > Date.now() - (24 * 60 * 60 * 1000);
        });
      }
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
      this.snapshots = [];
      this.networkSnapshots = [];
    }
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.snapshots = [];
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Get statistics for current period
   */
  getStats(periodHours: number): { min: number; max: number; avg: number } {
    const snapshots = this.getSnapshots(periodHours);
    
    if (snapshots.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    const healths = snapshots.map(s => s.health);
    return {
      min: Math.min(...healths),
      max: Math.max(...healths),
      avg: healths.reduce((a, b) => a + b, 0) / healths.length,
    };
  }
}

export const historicalDataService = new HistoricalDataService();
