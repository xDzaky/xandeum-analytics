/**
 * Alerts & Notifications Panel
 * Real-time alerts for network events
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Bell, BellOff } from 'lucide-react';
import type { PNode } from '../../types';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
  nodeId?: string;
}

interface AlertsPanelProps {
  nodes?: PNode[];
}

export default function AlertsPanel({ nodes }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isEnabled, setIsEnabled] = useState(() => 
    localStorage.getItem('alertsEnabled') !== 'false'
  );

  useEffect(() => {
    if (!nodes || !isEnabled) return;

    // Check for network conditions and generate alerts
    const checkNetworkConditions = () => {
      const newAlerts: Alert[] = [];
      const now = new Date();

      // Check for offline nodes
      const offlineNodes = nodes.filter(n => n.status !== 'active');
      if (offlineNodes.length > 5) {
        newAlerts.push({
          id: `offline-${now.getTime()}`,
          type: 'critical',
          message: `${offlineNodes.length} nodes are currently offline`,
          timestamp: now,
        });
      }

      // Check for low uptime nodes
      const lowUptimeNodes = nodes.filter(n => n.uptime < 70);
      if (lowUptimeNodes.length > 0) {
        newAlerts.push({
          id: `low-uptime-${now.getTime()}`,
          type: 'warning',
          message: `${lowUptimeNodes.length} nodes have uptime below 70%`,
          timestamp: now,
        });
      }

      // Check for version inconsistencies
      const versions = nodes.map(n => n.version);
      const uniqueVersions = [...new Set(versions)];
      if (uniqueVersions.length > 3) {
        newAlerts.push({
          id: `version-${now.getTime()}`,
          type: 'info',
          message: `${uniqueVersions.length} different versions detected across network`,
          timestamp: now,
        });
      }

      // Network health check
      const activeNodes = nodes.filter(n => n.status === 'active').length;
      const healthRatio = activeNodes / nodes.length;
      if (healthRatio < 0.8) {
        newAlerts.push({
          id: `health-${now.getTime()}`,
          type: 'critical',
          message: `Network health at ${(healthRatio * 100).toFixed(1)}% - Below threshold`,
          timestamp: now,
        });
      } else if (healthRatio > 0.95) {
        newAlerts.push({
          id: `health-good-${now.getTime()}`,
          type: 'success',
          message: `Network health excellent at ${(healthRatio * 100).toFixed(1)}%`,
          timestamp: now,
        });
      }

      // Only update if there are new alerts
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
      }
    };

    checkNetworkConditions();
  }, [nodes, isEnabled]);

  const toggleAlerts = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('alertsEnabled', String(newState));
    if (!newState) {
      setAlerts([]);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      default:
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <h3 className="text-xs font-medium text-white tracking-widest uppercase">
            Network Alerts
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isEnabled && alerts.length > 0 && (
            <button
              onClick={clearAlerts}
              className="px-2 py-1 rounded text-xs transition-colors bg-white/5 text-muted hover:bg-white/10 hover:text-white"
              title="Clear all alerts"
            >
              Clear All
            </button>
          )}
          <button
            onClick={toggleAlerts}
            className={`p-1.5 rounded-lg transition-colors ${
              isEnabled 
                ? 'text-primary hover:bg-primary/10' 
                : 'text-muted hover:bg-white/5'
            }`}
            title={isEnabled ? 'Disable alerts' : 'Enable alerts'}
          >
            {isEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {!isEnabled && (
          <div className="text-center py-8 text-muted text-sm">
            Alerts are disabled
          </div>
        )}
        
        {isEnabled && alerts.length === 0 && (
          <div className="text-center py-8 text-muted text-sm">
            No alerts at this time
          </div>
        )}

        {isEnabled && alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex gap-3 p-3 rounded-lg border ${getAlertColor(alert.type)} transition-all hover:bg-white/5`}
          >
            <div className="shrink-0 mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white">{alert.message}</p>
              <p className="text-[10px] text-muted mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Summary */}
      {isEnabled && alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs font-bold text-red-500">
                {alerts.filter(a => a.type === 'critical').length}
              </div>
              <div className="text-[10px] text-muted">Critical</div>
            </div>
            <div>
              <div className="text-xs font-bold text-yellow-500">
                {alerts.filter(a => a.type === 'warning').length}
              </div>
              <div className="text-[10px] text-muted">Warning</div>
            </div>
            <div>
              <div className="text-xs font-bold text-blue-500">
                {alerts.filter(a => a.type === 'info').length}
              </div>
              <div className="text-[10px] text-muted">Info</div>
            </div>
            <div>
              <div className="text-xs font-bold text-green-500">
                {alerts.filter(a => a.type === 'success').length}
              </div>
              <div className="text-[10px] text-muted">Success</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
