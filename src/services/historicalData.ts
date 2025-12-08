/**
 * Historical Data Service
 * Stores network health snapshots for time-series visualization
 */

export interface HealthSnapshot {
  timestamp: number;
  health: number;
  activeNodes: number;
  totalNodes: number;
  averageUptime: number;
}

class HistoricalDataService {
  private snapshots: HealthSnapshot[] = [];
  private maxSnapshots = 1000; // Keep last 1000 snapshots (~ 8 hours at 30s intervals)
  private storageKey = 'xandeum_health_history';

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
    } catch (error) {
      console.warn('Failed to load history from storage:', error);
      this.snapshots = [];
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
