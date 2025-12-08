import { useNodes } from '../hooks/useNodes';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import HealthScore from '../components/ui/HealthScore';
import NetworkTimelineChart from '../components/charts/NetworkTimelineChart';
import VersionDistributionChart from '../components/charts/VersionDistributionChart';
import UptimeComparisonChart from '../components/charts/UptimeComparisonChart';
import LocationDistributionChart from '../components/charts/LocationDistributionChart';
import { useMemo } from 'react';
import { generateNetworkStats } from '../utils/calculations';

export default function Analytics() {
  const { data: nodes, isLoading } = useNodes();

  // Generate timeline data (simulated hourly data)
  const timelineData = useMemo(() => {
    if (!nodes) return [];
    
    const hours = 24;
    const baseActive = nodes.filter(n => n.status === 'active').length;
    const baseInactive = nodes.filter(n => n.status === 'inactive').length;
    
    return Array.from({ length: hours }, (_, i) => {
      // Use index-based variation for consistent data
      const activeVariation = ((i * 7) % 5) - 2;
      const totalVariation = ((i * 3) % 3) - 1;
      
      return {
        time: `${i}:00`,
        totalNodes: nodes.length + totalVariation,
        activeNodes: baseActive + activeVariation,
        inactiveNodes: baseInactive - activeVariation,
      };
    });
  }, [nodes]);

  // Generate version distribution data
  const versionData = useMemo(() => {
    if (!nodes) return [];
    
    const versionCounts = nodes.reduce((acc, node) => {
      acc[node.version] = (acc[node.version] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(versionCounts)
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [nodes]);

  // Generate uptime comparison data
  const uptimeData = useMemo(() => {
    if (!nodes) return [];
    
    return nodes
      .sort((a, b) => b.uptime - a.uptime)
      .slice(0, 10)
      .map(node => ({
        name: node.id,
        uptime: node.uptime,
      }));
  }, [nodes]);

  // Generate location distribution data
  const locationData = useMemo(() => {
    if (!nodes) return [];
    
    const locationCounts = nodes.reduce((acc, node) => {
      const country = node.location?.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [nodes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available for analytics</p>
      </div>
    );
  }

  const stats = generateNetworkStats(nodes);

  return (
    <div className="space-y-6 p-6">
      {/* Header with Health Score */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Network Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            Advanced analytics and visualizations • {nodes.length} nodes analyzed
          </p>
        </div>
        <div className="card px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Health Score</div>
            <HealthScore score={stats.networkHealth} />
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card card-hover">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Most Common Version</span>
            <div className="w-2 h-2 rounded-full bg-chart-2"></div>
          </div>
          <p className="text-2xl font-bold text-white font-mono mb-1">
            {versionData[0]?.version || 'N/A'}
          </p>
          <p className="text-xs text-muted">
            {versionData[0]?.count || 0} nodes using this version
          </p>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Top Location</span>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {locationData[0]?.country || 'N/A'}
          </p>
          <p className="text-xs text-muted">
            {locationData[0]?.count || 0} nodes in this location
          </p>
        </div>

        <div className="stat-card card-hover">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Highest Uptime</span>
            <div className="w-2 h-2 rounded-full bg-success"></div>
          </div>
          <p className="text-2xl font-bold text-success mb-1">
            {uptimeData[0]?.uptime.toFixed(2) || 'N/A'}%
          </p>
          <p className="text-xs text-muted font-mono">
            {uptimeData[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      {/* Timeline Chart - Full Width */}
      <NetworkTimelineChart data={timelineData} />

      {/* Two Column Layout for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VersionDistributionChart data={versionData} />
        <LocationDistributionChart data={locationData} />
      </div>

      {/* Uptime Comparison - Full Width */}
      <UptimeComparisonChart data={uptimeData} />
    </div>
  );
}
