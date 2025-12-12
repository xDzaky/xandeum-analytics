import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { xandeumAPI } from '../services/api';
import { formatBytes, formatDuration, formatDate } from '../utils/formatters';
import { 
  Copy, 
  ArrowLeft, 
  Activity, 
  Clock, 
  Database,
  Zap,
  Globe,
  Key,
  Monitor
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ExportButton from '../components/ui/ExportButton';
import FavoriteButton from '../components/ui/FavoriteButton';
import { NodeDetailSkeleton } from '../components/ui/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { exportNodeDetails } from '../utils/export';

export default function NodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const { data: node, isLoading, error } = useQuery({
    queryKey: ['node', id],
    queryFn: () => xandeumAPI.getNodeById(id!),
    enabled: !!id,
    refetchInterval: 30000,
  });

  // Update current time every minute for "last seen" calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lastSeenDuration = node ? formatDuration(currentTime - node.lastSeen.getTime()) : '';

  if (isLoading) {
    return <NodeDetailSkeleton />;
  }

  if (error || !node) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Node Not Found</h2>
          <p className="text-gray-400 mb-6">The node you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
    syncing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Simple Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="bg-[#111111] rounded-lg border border-gray-800 p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Node Details
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded border ${statusColors[node.status]} text-xs font-semibold uppercase`}
                  >
                    {node.status}
                  </span>
                  <span className="px-2.5 py-1 rounded border border-gray-700 bg-gray-800/50 text-gray-300 text-xs">
                    v{node.version}
                  </span>
                  {node.location?.country && (
                    <span className="px-2.5 py-1 rounded border border-gray-700 bg-gray-800/50 text-gray-300 text-xs">
                      📍 {node.location.country}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FavoriteButton
                  nodeId={node.id}
                  isFavorite={isFavorite(node.id)}
                  onToggle={toggleFavorite}
                  size="lg"
                  showLabel
                />
                <ExportButton
                  format="json"
                  onExport={() => exportNodeDetails(node)}
                  label="Export"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Simple 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] rounded-lg border border-gray-800 p-4">
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Uptime
            </div>
            <div className="text-2xl font-bold text-green-400">
              {node.uptime.toFixed(1)}%
            </div>
          </div>

          <div className="bg-[#111111] rounded-lg border border-gray-800 p-4">
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5" />
              Version
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {node.version}
            </div>
          </div>

          <div className="bg-[#111111] rounded-lg border border-gray-800 p-4">
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last Seen
            </div>
            <div className="text-xl font-bold text-purple-400">
              {lastSeenDuration}
            </div>
          </div>

          <div className="bg-[#111111] rounded-lg border border-gray-800 p-4">
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Latency
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {node.performance?.latency ? `${node.performance.latency.toFixed(0)}ms` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Identity */}
          <div className="bg-[#111111] rounded-lg border border-gray-800 p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-green-400" />
              Identity
            </h2>

            <div className="space-y-4">
              {/* Node ID */}
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Node ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/50 rounded px-3 py-2 border border-gray-800">
                    <code className="text-green-400 text-xs font-mono break-all">
                      {node.id}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(node.id, 'id')}
                    className="p-2 hover:bg-gray-800 rounded border border-gray-800 transition-colors"
                  >
                    <Copy className={`w-3.5 h-3.5 ${copiedField === 'id' ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>

              {/* Public Key */}
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Public Key</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/50 rounded px-3 py-2 border border-gray-800">
                    <code className="text-purple-400 text-xs font-mono break-all">
                      {node.publicKey}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(node.publicKey, 'pubkey')}
                    className="p-2 hover:bg-gray-800 rounded border border-gray-800 transition-colors"
                  >
                    <Copy className={`w-3.5 h-3.5 ${copiedField === 'pubkey' ? 'text-purple-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Gossip Address</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black/50 rounded px-3 py-2 border border-gray-800">
                      <code className="text-blue-400 text-xs font-mono">
                        {node.ipAddress}:{node.port}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${node.ipAddress}:${node.port}`, 'ip')}
                      className="p-2 hover:bg-gray-800 rounded border border-gray-800 transition-colors"
                    >
                      <Copy className={`w-3.5 h-3.5 ${copiedField === 'ip' ? 'text-blue-400' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>

                {node.performance?.rpcPort && (
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">RPC Endpoint</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/50 rounded px-3 py-2 border border-gray-800">
                        <code className="text-orange-400 text-xs font-mono">
                          {node.ipAddress}:{node.performance.rpcPort}
                        </code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${node.ipAddress}:${node.performance?.rpcPort}`, 'rpc')}
                        className="p-2 hover:bg-gray-800 rounded border border-gray-800 transition-colors"
                      >
                        <Copy className={`w-3.5 h-3.5 ${copiedField === 'rpc' ? 'text-orange-400' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-800">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">First Seen</label>
                  <p className="text-white text-sm">{formatDate(node.firstSeen)}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Last Active</label>
                  <p className="text-white text-sm">{formatDate(node.lastSeen)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Software */}
          <div className="space-y-6">
            {/* Location */}
            {node.location && (
              <div className="bg-[#0d1014] rounded-lg border border-gray-800 p-5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      Location
                    </h2>
                    <span className={`text-[10px] px-2 py-1 rounded-full border ${
                      node.location.city !== 'Unknown' && node.location.country !== 'Unknown' && node.location.latitude !== 0
                        ? 'border-green-500/30 text-green-400 bg-green-500/5'
                        : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5'
                    }`}>
                      {node.location.city !== 'Unknown' && node.location.country !== 'Unknown' && node.location.latitude !== 0
                        ? 'Located'
                        : 'Needs public IP'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xl font-bold text-white">
                      {node.location.city !== 'Unknown' ? node.location.city : 'Unknown'}
                    </div>
                    <div className="text-sm text-blue-400">
                      {node.location.country !== 'Unknown' ? node.location.country : 'Unable to infer country'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800 mt-4">
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Latitude</label>
                      <code className="text-white text-sm">{node.location.latitude.toFixed(4)}°</code>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs block mb-1">Longitude</label>
                      <code className="text-white text-sm">{node.location.longitude.toFixed(4)}°</code>
                    </div>
                  </div>

                  {node.location.city === 'Unknown' && (
                    <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-100">
                      <div className="font-semibold mb-1">Why Unknown?</div>
                      <p className="text-blue-200/80">
                        Location is inferred from the gossip IP. Private/obfuscated IPs (10.x, 192.168.x, or Cloudflare tunnels) cannot be geolocated. Use a public gossip address to enable location.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Software */}
            <div className="bg-[#111111] rounded-lg border border-gray-800 p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-400" />
                Software
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400 text-sm">Version</span>
                  <span className="text-white font-mono">{node.version}</span>
                </div>
                
                {node.performance?.shredVersion && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm">Shred Version</span>
                    <span className="text-white font-mono">{node.performance.shredVersion}</span>
                  </div>
                )}
                
                {node.performance?.featureSet && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400 text-sm">Feature Set</span>
                    <span className="text-white font-mono text-xs">{node.performance.featureSet}</span>
                  </div>
                )}

                {/* Performance */}
                <div className="pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Uptime</span>
                    <span className="text-green-400 font-bold">{node.uptime.toFixed(1)}%</span>
                  </div>
                  {node.performance?.latency && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Latency</span>
                      <span className="text-orange-400 font-bold">{node.performance.latency.toFixed(0)}ms</span>
                    </div>
                  )}
                  {node.performance?.bandwidth && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Bandwidth</span>
                      <span className="text-blue-400 font-bold">{formatBytes(node.performance.bandwidth)}/s</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage - Full Width */}
        {node.performance && (node.performance.storageCapacity > 0 || node.performance.storageUsed > 0) && (
          <div className="bg-[#111111] rounded-lg border border-gray-800 p-5 mt-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Storage
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Capacity</label>
                <p className="text-xl font-bold text-white">{formatBytes(node.performance.storageCapacity)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Used</label>
                <p className="text-xl font-bold text-white">{formatBytes(node.performance.storageUsed)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Usage</label>
                <p className="text-xl font-bold text-white">
                  {((node.performance.storageUsed / node.performance.storageCapacity) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (node.performance.storageUsed / node.performance.storageCapacity) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
