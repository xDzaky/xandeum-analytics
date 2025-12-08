import { DashboardSkeleton } from '../components/ui/Skeleton';
import NetworkHealthTimeline from '../components/dashboard/NetworkHealthTimeline';
import GlobalDistributionMap from '../components/dashboard/GlobalDistributionMap';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import VersionDistribution from '../components/dashboard/VersionDistribution';
import { useNodes, useNetworkStats } from '../hooks/useNodes';
import { formatNumber, formatTimeAgo } from '../utils/formatters';
import { generateNetworkStats } from '../utils/calculations';
import { Server, Globe, Wifi, TriangleAlert, MoreHorizontal, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { data: nodes, isLoading: nodesLoading, dataUpdatedAt } = useNodes();
  const { data: statsFromAPI, isLoading: statsLoading } = useNetworkStats();

  if (nodesLoading || statsLoading) {
    return <DashboardSkeleton />;
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
    <div className="space-y-6">
      {/* Top Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-[280px]">
        {/* 1. Health Score (Tall Card) */}
        <div className="lg:col-span-1 lg:row-span-1 bg-surface border border-border rounded-xl p-6 relative overflow-hidden group hover:border-border-light transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-muted uppercase tracking-widest">Network Health</span>
            <button className="text-muted hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          {/* Gauge */}
          <div className="flex-1 flex items-center justify-center relative my-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="#1F1F1F" strokeWidth="6" fill="none" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="58" 
                  stroke="#22c55e" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray="365" 
                  strokeDashoffset={365 - (365 * stats.networkHealth / 100)} 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white font-mono tracking-tighter">{Math.round(stats.networkHealth)}</span>
                <span className="text-[10px] text-primary uppercase tracking-wider font-semibold bg-primary/10 px-2 py-0.5 rounded mt-1">
                  {stats.networkHealth >= 90 ? 'Excellent' : stats.networkHealth >= 80 ? 'Healthy' : 'Warning'}
                </span>
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">Availability</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-success transition-all" style={{ width: `${stats.averageUptime}%` }}></div>
                </div>
                <span className="text-success w-8 text-right">{Math.round(stats.averageUptime)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Version Health</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-success transition-all" style={{ width: `100%` }}></div>
                </div>
                <span className="text-success w-8 text-right">100%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50 text-[10px] font-mono text-muted text-center flex justify-between">
            <span className="bg-white/5 px-1.5 py-0.5 rounded">Score = (A*40%) + (V*35%)</span>
            <a href="#" className="hover:text-white flex items-center gap-1">
              Details <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 2. Middle Column Cards (Total Nodes & Countries) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Total Nodes */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-muted uppercase tracking-widest">Total Nodes</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-white font-mono mt-2">{formatNumber(stats.totalNodes)}</div>
              <div className="text-xs text-muted mt-1">+2 from yesterday</div>
            </div>
          </div>
          
          {/* Countries */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-muted uppercase tracking-widest">Countries</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-medium text-white font-mono mt-2">8</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs text-muted">Global spread</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Right Column Cards (Online & At Risk) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Online Status (Wide) */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-all flex items-center justify-between group relative overflow-hidden">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-success" />
                <span className="text-xs font-medium text-muted uppercase tracking-widest">Online Nodes</span>
              </div>
              <div className="text-4xl font-medium text-white font-mono">
                {Math.round(stats.activeNodes / stats.totalNodes * 100)}
                <span className="text-lg text-muted">%</span>
              </div>
              <div className="text-xs text-success mt-1 font-mono">{stats.activeNodes} / {stats.totalNodes} operational</div>
            </div>
            {/* Sparkline Chart */}
            <div className="w-48 h-16 opacity-50 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                <path 
                  d="M0,30 L20,28 L40,32 L60,30 L80,30 L100,25 L120,30 L140,30 L160,10 L180,30 L200,30" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  vectorEffect="non-scaling-stroke" 
                />
                <circle cx="160" cy="10" r="3" fill="#22c55e" className="animate-ping" />
                <circle cx="160" cy="10" r="2" fill="#22c55e" />
              </svg>
            </div>
          </div>

          {/* At Risk (Wide) */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-all flex items-center justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TriangleAlert className="w-4 h-4 text-muted group-hover:text-warning transition-colors" />
                <span className="text-xs font-medium text-muted uppercase tracking-widest">At Risk</span>
              </div>
              <div className="text-3xl font-medium text-white font-mono">{stats.totalNodes - stats.activeNodes}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
              {stats.activeNodes === stats.totalNodes ? (
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <TriangleAlert className="w-5 h-5 text-warning" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <NetworkHealthTimeline />

      {/* Bottom Three-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:h-[400px]">
        {/* 1. Insights & Events (Tabs) */}
        <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
          <InsightsPanel />
        </div>

        {/* 2. Global Distribution Map */}
        <div className="bg-surface border border-border rounded-xl p-0 relative overflow-hidden flex flex-col">
          <GlobalDistributionMap />
        </div>

        {/* 3. Node Search & List */}
        <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-3">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search node ID..." 
                className="w-full bg-black/40 border border-border rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-muted focus:outline-none focus:border-primary/50 font-mono transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button className="px-2 py-1 text-[10px] font-medium rounded bg-white/10 text-white whitespace-nowrap">All</button>
              <button className="px-2 py-1 text-[10px] font-medium rounded hover:bg-white/5 text-muted hover:text-white whitespace-nowrap">Online</button>
              <button className="px-2 py-1 text-[10px] font-medium rounded hover:bg-white/5 text-muted hover:text-white whitespace-nowrap">Offline</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-border/50 text-xs">
                {nodes?.slice(0, 4).map((node) => (
                  <tr key={node.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-success' : 'bg-warning animate-pulse'}`}></div>
                        <div className="flex flex-col">
                          <span className="font-mono text-white group-hover:text-primary transition-colors">
                            {node.id.slice(0, 10)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] text-muted font-mono">
                        v{node.version}
                      </span>
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-success transition-all" style={{ width: `${node.uptime}%` }}></div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2 border-t border-border text-[10px] text-center text-muted">
            Showing 4 of {stats.totalNodes} nodes
          </div>
        </div>
      </div>

      {/* Footer / Version Dist */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-32">
        <div className="md:col-span-1">
          <VersionDistribution />
        </div>
        <div className="md:col-span-3 flex items-end justify-end pb-2">
          <div className="flex gap-2">
            <button className="bg-surface border border-border text-xs text-muted hover:text-white px-3 py-1.5 rounded hover:bg-white/5 transition-colors font-mono">CSV</button>
            <button className="bg-surface border border-border text-xs text-muted hover:text-white px-3 py-1.5 rounded hover:bg-white/5 transition-colors font-mono">JSON</button>
            <button className="bg-primary text-black text-xs font-medium px-3 py-1.5 rounded hover:bg-primary/90 transition-colors">Docs</button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-muted font-mono pt-4 border-t border-border/30">
        <span>Xandeum LATTICE // Updated {formatTimeAgo(new Date(dataUpdatedAt))}</span>
        <span>{stats.totalNodes} data points processed</span>
      </div>
    </div>
  );
}

