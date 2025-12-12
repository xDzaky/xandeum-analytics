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
  // Keep up to 7 days of history; polling interval is ~30s so cap storage
  private maxSnapshots = 7 * 24 * 120; // 7 days * 24h * (60/0.5) samples
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
   * Downsample a series to a maximum number of points while keeping the last point
   */
  downsample(snapshots: HealthSnapshot[], maxPoints: number): HealthSnapshot[] {
    if (snapshots.length <= maxPoints) return snapshots;

    const step = Math.ceil(snapshots.length / maxPoints);
    const result: HealthSnapshot[] = [];

    for (let i = 0; i < snapshots.length; i += step) {
      result.push(snapshots[i]);
    }

    const last = snapshots[snapshots.length - 1];
    if (result[result.length - 1]?.timestamp !== last.timestamp) {
      result.push(last);
    }

    return result;
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
    const targetPoints = periodHours <= 1 ? 60 : periodHours <= 6 ? 84 : periodHours <= 24 ? 96 : 140;
    const interval = Math.max(60_000, Math.floor((periodHours * 60 * 60 * 1000) / targetPoints)); // At least 1 minute

    for (let i = targetPoints; i >= 0; i--) {
      const timestamp = now - (i * interval);
      
      // Simulate gradual health moves with occasional dips
      const progress = 1 - i / targetPoints;
      const base = 92 - progress * 8; // slight downward drift
      const volatility = periodHours > 24 ? 4 : 6;
      const dip = Math.random() < 0.1 ? -8 * Math.random() : 0;
      const health = Math.max(55, Math.min(98, base + (Math.random() * volatility) + dip));

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
          // Keep only snapshots from last 7 days
          return s.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000);
        });
      }

      // Load network timeline
      const networkStored = localStorage.getItem(this.networkStorageKey);
      if (networkStored) {
        const parsed = JSON.parse(networkStored);
        this.networkSnapshots = parsed.filter((s: NetworkSnapshot) => {
          // Keep only snapshots from last 7 days
          return s.timestamp > Date.now() - (7 * 24 * 60 * 60 * 1000);
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
    return this.getStatsFromSnapshots(snapshots);
  }

  /**
   * Compute stats from a provided snapshot series
   */
  getStatsFromSnapshots(snapshots: HealthSnapshot[]): { min: number; max: number; avg: number } {
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
