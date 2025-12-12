/**
 * Insights Panel
 * Shows network insights with metrics in tab format
 */

import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { Check, Clock, Shield, AlertTriangle, TrendingUp, Activity, RefreshCcw } from 'lucide-react';
import type { PNode } from '../../types';

type IconType = ComponentType<{ className?: string }>;

interface InsightItemProps {
  icon: IconType;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'info';
}

interface EventItem {
  id: string;
  icon: IconType;
  severity: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
}

function InsightItem({ icon: Icon, title, description, status }: InsightItemProps) {
  const statusColors = {
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-primary',
  };

  const statusBg = {
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    info: 'bg-primary/10 border-primary/20',
  };

  return (
    <div className="p-4 hover:bg-white/5 transition-colors cursor-default group">
      <div className="flex gap-3">
        <div className={`mt-0.5 w-5 h-5 rounded-full ${statusBg[status]} ${statusColors[status]} flex items-center justify-center shrink-0 border`}>
          <Icon className="w-3 h-3" />
        </div>
        <div>
          <h4 className="text-xs font-medium text-white">{title}</h4>
          <p className="text-[10px] text-muted mt-1 font-mono">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface InsightsPanelProps {
  nodes?: PNode[];
}

export default function InsightsPanel({ nodes }: InsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'events'>('insights');

  // Calculate insights from nodes data
  const totalNodes = nodes?.length || 0;
  const activeNodes = nodes?.filter(n => n.status === 'active').length || 0;
  const averageUptime = (nodes?.reduce((acc, n) => acc + n.uptime, 0) || 0) / (totalNodes || 1);
  
  // Get version distribution
  const versionCounts = nodes?.reduce((acc, node) => {
    acc[node.version] = (acc[node.version] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const latestVersion = Object.keys(versionCounts).sort().reverse()[0] || '0.0.0';
  const nodesOnLatest = versionCounts[latestVersion] || 0;
  const versionHealthPercent = totalNodes > 0 ? Math.round((nodesOnLatest / totalNodes) * 100) : 0;
  
  // Calculate network health score
  const healthScore = Math.round((averageUptime * 0.4) + (versionHealthPercent * 0.35) + (activeNodes / totalNodes * 100 * 0.25));
  
  // Check for issues
  const hasLowUptime = averageUptime < 95;
  const hasOldVersions = versionHealthPercent < 80;
  const hasOfflineNodes = activeNodes < totalNodes;

  const events = useMemo<EventItem[]>(() => {
    if (!totalNodes) return [];

    const now = new Date();
    const items: EventItem[] = [];

    if (hasOfflineNodes) {
      items.push({
        id: 'offline',
        icon: AlertTriangle,
        severity: 'warning',
        title: 'Some nodes offline',
        description: `${activeNodes} of ${totalNodes} nodes online. ${totalNodes - activeNodes} offline.`,
        timestamp: now,
      });
    }

    if (hasOldVersions) {
      items.push({
        id: 'version',
        icon: RefreshCcw,
        severity: 'info',
        title: 'Version upgrade recommended',
        description: `${versionHealthPercent}% on v${latestVersion}. ${totalNodes - nodesOnLatest} nodes need update.`,
        timestamp: now,
      });
    }

    if (hasLowUptime) {
      items.push({
        id: 'uptime',
        icon: Activity,
        severity: 'warning',
        title: 'Consensus needs attention',
        description: `Health score: ${healthScore}. Average uptime: ${averageUptime.toFixed(1)}%.`,
        timestamp: now,
      });
    }

    items.push({
      id: 'healthy',
      icon: Check,
      severity: 'success',
      title: 'Excellent uptime',
      description: `Average uptime: ${averageUptime.toFixed(1)}%. Network stable.`,
      timestamp: now,
    });

    return items;
  }, [activeNodes, averageUptime, hasLowUptime, hasOfflineNodes, hasOldVersions, healthScore, latestVersion, nodesOnLatest, totalNodes, versionHealthPercent]);

  return (
    <>
      <div className="flex items-center border-b border-border">
        <button
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'insights' ? 'text-white border-b-2 border-primary bg-white/5' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
        <button
          className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'events' ? 'text-white border-b-2 border-primary bg-white/5' : 'text-muted hover:text-white'}`}
          onClick={() => setActiveTab('events')}
        >
          Events
          <span className="text-[10px] bg-white/10 px-1 rounded-sm">{events.length}</span>
        </button>
      </div>
      <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
        {activeTab === 'insights' ? (
          <div className="divide-y divide-border/50">
            {/* Network Availability */}
            <InsightItem
              icon={activeNodes === totalNodes ? Check : AlertTriangle}
              title={activeNodes === totalNodes ? "Full network availability" : "Some nodes offline"}
              description={activeNodes === totalNodes 
                ? `All ${totalNodes} nodes are online and responsive.`
                : `${activeNodes} of ${totalNodes} nodes online. ${totalNodes - activeNodes} offline.`}
              status={activeNodes === totalNodes ? "success" : "warning"}
            />
            
            {/* Version Health */}
            <InsightItem
              icon={versionHealthPercent === 100 ? Check : TrendingUp}
              title={versionHealthPercent === 100 ? "Excellent version health" : "Version upgrade recommended"}
              description={versionHealthPercent === 100
                ? `100% of nodes on latest version ${latestVersion}.`
                : `${versionHealthPercent}% on v${latestVersion}. ${totalNodes - nodesOnLatest} nodes need update.`}
              status={versionHealthPercent >= 90 ? "success" : "info"}
            />
            
            {/* Consensus Health */}
            <InsightItem
              icon={Shield}
              title={healthScore >= 85 ? "Consensus is healthy" : "Consensus needs attention"}
              description={`Health score: ${healthScore}. ${healthScore >= 85 ? 'No issues detected.' : 'Some improvements needed.'}`}
              status={healthScore >= 85 ? "success" : "warning"}
            />
            
            {/* Uptime Status */}
            <InsightItem
              icon={averageUptime >= 95 ? Check : Clock}
              title={averageUptime >= 95 ? "Excellent uptime" : "Uptime monitoring"}
              description={`Average uptime: ${averageUptime.toFixed(1)}%. ${averageUptime >= 95 ? 'Network stable.' : 'Some degradation observed.'}`}
              status={averageUptime >= 95 ? "success" : "warning"}
            />
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {events.length === 0 && (
              <div className="py-6 text-center text-muted text-xs">No events detected</div>
            )}
            {events.map(event => (
              <div key={event.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border ${event.severity === 'warning' ? 'bg-warning/10 border-warning/20 text-warning' : event.severity === 'info' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-success/10 border-success/20 text-success'} flex items-center justify-center shrink-0`}>
                    <event.icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-medium text-white">{event.title}</h4>
                      <span className="text-[10px] text-muted font-mono">{event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[10px] text-muted mt-1 font-mono">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
