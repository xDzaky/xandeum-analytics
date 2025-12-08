import { Activity, Database, TrendingUp, Zap } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';
import ExportButton from '../components/ui/ExportButton';
import NetworkHealthGauge from '../components/ui/NetworkHealthGauge';
import { useNodes, useNetworkStats } from '../hooks/useNodes';
import { formatNumber, formatPercentage, formatTimeAgo } from '../utils/formatters';
import { generateNetworkStats } from '../utils/calculations';
import { exportStatsToCSV, exportStatsToJSON, exportNodesToCSV, exportNodesToJSON } from '../utils/export';

export default function Dashboard() {
  const { data: nodes, isLoading: nodesLoading, dataUpdatedAt } = useNodes();
  const { data: statsFromAPI, isLoading: statsLoading } = useNetworkStats();

  if (nodesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Use stats from API or calculate from nodes
  const stats = statsFromAPI || (nodes ? generateNetworkStats(nodes) : null);

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Unable to load network statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Network Dashboard</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-400">
            Real-time overview of Xandeum pNode network
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">Last updated</p>
            <p className="text-xs sm:text-sm text-gray-300">
              {formatTimeAgo(new Date(dataUpdatedAt))}
            </p>
          </div>
          {/* Export Buttons */}
          <div className="flex gap-2">
            <ExportButton
              format="csv"
              onExport={() => exportStatsToCSV(stats)}
              label="Stats CSV"
              size="sm"
            />
            <ExportButton
              format="json"
              onExport={() => exportStatsToJSON(stats)}
              label="Stats JSON"
              size="sm"
            />
            {nodes && (
              <>
                <ExportButton
                  format="csv"
                  onExport={() => exportNodesToCSV(nodes)}
                  label="Nodes CSV"
                  size="sm"
                  variant="primary"
                />
                <ExportButton
                  format="json"
                  onExport={() => exportNodesToJSON(nodes)}
                  label="Nodes JSON"
                  size="sm"
                  variant="primary"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Nodes"
          value={formatNumber(stats.totalNodes)}
          icon={Database}
          color="info"
        />
        
        <StatsCard
          title="Active Nodes"
          value={formatNumber(stats.activeNodes)}
          icon={Activity}
          color="success"
        />
        
        <StatsCard
          title="Network Health"
          value={formatPercentage(stats.networkHealth)}
          icon={TrendingUp}
          color={stats.networkHealth > 90 ? 'success' : stats.networkHealth > 70 ? 'warning' : 'error'}
          trend={{
            direction: 'up',
            percentage: 1.2,
          }}
        />
        
        <StatsCard
          title="Average Uptime"
          value={formatPercentage(stats.averageUptime)}
          icon={Zap}
          color="success"
        />
      </div>

      {/* Network Health Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Health Gauge */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 flex items-center justify-center">
          <NetworkHealthGauge value={stats.networkHealth} size="lg" />
        </div>

        {/* Health Metrics */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Network Health Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Node Availability</span>
                <span className="text-sm font-medium text-white">
                  {((stats.activeNodes / stats.totalNodes) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.activeNodes / stats.totalNodes) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Average Uptime</span>
                <span className="text-sm font-medium text-white">
                  {stats.averageUptime.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.averageUptime}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Storage Utilization</span>
                <span className="text-sm font-medium text-white">
                  {((stats.usedStorage / stats.totalStorage) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.usedStorage / stats.totalStorage) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Network Reliability</span>
                <span className="text-sm font-medium text-white">
                  {stats.networkHealth.toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stats.networkHealth >= 80
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : stats.networkHealth >= 60
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${stats.networkHealth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Status Distribution */}
        <div className="bg-card rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Node Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StatusBadge status="active" showPulse />
                <span className="text-sm text-gray-300">Active</span>
              </div>
              <span className="text-sm font-medium text-white">
                {stats.activeNodes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StatusBadge status="inactive" />
                <span className="text-sm text-gray-300">Inactive</span>
              </div>
              <span className="text-sm font-medium text-white">
                {stats.inactiveNodes}
              </span>
            </div>
            {nodes && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <StatusBadge status="syncing" />
                  <span className="text-sm text-gray-300">Syncing</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {nodes.filter(n => n.status === 'syncing').length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Version Distribution */}
        <div className="bg-card rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Version Distribution</h3>
          <div className="space-y-3">
            {nodes && Object.entries(
              nodes.reduce((acc, node) => {
                acc[node.version] = (acc[node.version] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([version, count]) => (
                <div key={version} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 font-mono">{version}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / nodes.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-card rounded-lg border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Locations</h3>
          <div className="space-y-3">
            {nodes && Object.entries(
              nodes.reduce((acc, node) => {
                const country = node.location?.country || 'Unknown';
                acc[country] = (acc[country] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-info"
                        style={{ width: `${(count / nodes.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Nodes Table Preview */}
      <div className="bg-card rounded-lg border border-gray-800 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Recent Nodes</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Latest 10 nodes in the network</p>
            </div>
            <a
              href="/nodes"
              className="text-primary hover:text-primary/80 text-sm font-medium self-start sm:self-auto"
            >
              View All →
            </a>
          </div>
        </div>
        
        {nodes && nodes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Node ID</th>
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">IP Address</th>
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Version</th>
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Uptime</th>
                  <th className="text-left py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-400">Location</th>
                </tr>
              </thead>
              <tbody>
                {nodes.slice(0, 10).map((node) => (
                  <tr key={node.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm text-white font-mono">{node.id}</td>
                    <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm text-gray-300">{node.ipAddress}</td>
                    <td className="py-3 px-3 sm:px-6">
                      <StatusBadge status={node.status} showPulse={node.status === 'active'} />
                    </td>
                    <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm text-gray-300 font-mono">{node.version}</td>
                    <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm">
                      <span className={`font-medium ${
                        node.uptime >= 99 ? 'text-success' :
                        node.uptime >= 95 ? 'text-warning' :
                        'text-error'
                      }`}>
                        {formatPercentage(node.uptime)}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-6 text-xs sm:text-sm text-gray-300">
                      {node.location?.city || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">No nodes available</p>
        )}
      </div>
    </div>
  );
}
