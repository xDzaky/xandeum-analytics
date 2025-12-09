/**
 * Node Details Modal
 * Displays detailed node information in a side panel
 */

import { X, Copy, Check, Activity, HardDrive, Zap } from 'lucide-react';
import type { PNode } from '../../types';
import { formatTimeAgo } from '../../utils/formatters';
import { useState } from 'react';

interface NodeDetailsModalProps {
  node: PNode;
  onClose: () => void;
}

// Country flag mapping
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'USA': '🇺🇸',
    'United States': '🇺🇸',
    'Germany': '🇩🇪',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'United Kingdom': '🇬🇧',
    'France': '🇫🇷',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Netherlands': '🇳🇱',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'Brazil': '🇧🇷',
    'India': '🇮🇳',
    'South Korea': '🇰🇷',
    'China': '🇨🇳',
  };
  return flags[country] || '🌍';
};

export default function NodeDetailsModal({ node, onClose }: NodeDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const statusConfig = {
    active: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Online' },
    syncing: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Syncing' },
    inactive: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Offline' },
  };

  const status = statusConfig[node.status as keyof typeof statusConfig] || statusConfig.active;
  const flag = node.location ? getCountryFlag(node.location.country) : '🌍';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="relative w-full max-w-lg h-full bg-[#0A0A0A] border-l border-[#1F1F1F] overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1F1F1F] px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{flag}</span>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {node.location ? `${node.location.city}` : 'Unknown Location'}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">{node.id.slice(0, 16)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${status.bg} ${status.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {status.label}
                </span>
                <span className="text-xs text-gray-500 font-mono">v{node.version}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-3 text-center">
              <Activity className="w-4 h-4 text-green-400 mx-auto mb-1.5" />
              <div className="text-lg font-bold text-white">{node.uptime.toFixed(0)}%</div>
              <div className="text-[10px] text-gray-500 uppercase">Uptime</div>
            </div>
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-3 text-center">
              <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1.5" />
              <div className="text-lg font-bold text-white truncate">{node.performance?.latency?.toFixed(0) || 0}ms</div>
              <div className="text-[10px] text-gray-500 uppercase">Latency</div>
            </div>
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-3 text-center">
              <HardDrive className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
              <div className="text-lg font-bold text-white">{node.port}</div>
              <div className="text-[10px] text-gray-500 uppercase">Port</div>
            </div>
          </div>

          {/* Node Information */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Node ID</label>
                <button
                  onClick={() => handleCopy(node.id, 'nodeId')}
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedField === 'nodeId' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-300 font-mono break-all">{node.id}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Public Key</label>
                <button
                  onClick={() => handleCopy(node.publicKey, 'publicKey')}
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedField === 'publicKey' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-300 font-mono break-all">{node.publicKey}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">IP Address</label>
                <button
                  onClick={() => handleCopy(`${node.ipAddress}:${node.port}`, 'ipAddress')}
                  className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedField === 'ipAddress' ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg px-3 py-2.5">
                <p className="text-xs text-gray-300 font-mono">{node.ipAddress}:{node.port}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">First Seen</p>
              <p className="text-sm text-white font-medium">{formatTimeAgo(node.firstSeen)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Seen</p>
              <p className="text-sm text-white font-medium">{formatTimeAgo(node.lastSeen)}</p>
            </div>
            {node.performance?.shredVersion && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Shred Version</p>
                <p className="text-sm text-white font-medium font-mono">{node.performance.shredVersion}</p>
              </div>
            )}
            {node.performance?.featureSet && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Feature Set</p>
                <p className="text-sm text-white font-medium font-mono">{node.performance.featureSet}</p>
              </div>
            )}
            {node.performance?.rpcPort && (
              <div>
                <p className="text-xs text-gray-500 mb-1">RPC Port</p>
                <p className="text-sm text-white font-medium font-mono">{node.performance.rpcPort}</p>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          {node.performance && (
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Performance</h3>
              
              {/* Storage Info */}
              {node.performance.storageCapacity && (
                <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Storage</span>
                    <span className="text-xs text-white font-mono">
                      {(node.performance.storageUsed / 1024 / 1024 / 1024).toFixed(2)} / {(node.performance.storageCapacity / 1024 / 1024 / 1024).toFixed(2)} GB
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                      style={{ width: `${(node.performance.storageUsed / node.performance.storageCapacity) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-600">Used: {((node.performance.storageUsed / node.performance.storageCapacity) * 100).toFixed(1)}%</span>
                    <span className="text-[10px] text-gray-600">Available: {((node.performance.storageCapacity - node.performance.storageUsed) / 1024 / 1024 / 1024).toFixed(2)} GB</span>
                  </div>
                </div>
              )}

              {/* Bandwidth */}
              {node.performance.bandwidth && (
                <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Bandwidth</span>
                    <span className="text-sm text-white font-medium">
                      {(node.performance.bandwidth / 1024 / 1024).toFixed(2)} MB/s
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location Details */}
          {node.location && (
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Location Coordinates</p>
              <p className="text-sm text-white font-mono">
                {node.location.latitude?.toFixed(6)}, {node.location.longitude?.toFixed(6)}
              </p>
            </div>
          )}

          {/* Metadata */}
          {node.metadata && Object.keys(node.metadata).length > 0 && (
            <div className="bg-[#050505] border border-[#1F1F1F] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-3">Additional Metadata</p>
              <div className="space-y-2">
                {Object.entries(node.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start text-xs">
                    <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-white font-mono text-right ml-2 break-all max-w-[60%]">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
