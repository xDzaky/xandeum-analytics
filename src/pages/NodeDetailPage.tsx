import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { xandeumAPI } from '../services/api';
import { formatBytes, formatDuration, formatDate } from '../utils/formatters';
import { Copy, ArrowLeft, Activity, HardDrive, MapPin, Wifi, Clock, Server } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import ExportButton from '../components/ui/ExportButton';
import FavoriteButton from '../components/ui/FavoriteButton';
import { NodeDetailSkeleton } from '../components/ui/Skeleton';
import { useFavorites } from '../hooks/useFavorites';
import { exportNodeDetails } from '../utils/export';

// Generate historical data outside component
const generateHistoricalData = () => {
  const now = Date.now();
  
  const uptimeData = [];
  const latencyData = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * 3600000).toLocaleTimeString('en-US', { hour: '2-digit' });
    uptimeData.push({
      time,
      uptime: 95 + Math.random() * 4.9,
    });
    latencyData.push({
      time,
      latency: 20 + Math.random() * 80,
    });
  }
  
  return { uptimeData, latencyData };
};

const generateStorageData = (baseUsed: number, capacity: number) => {
  const now = Date.now();
  const data = [];
  
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3600000).toLocaleTimeString('en-US', { hour: '2-digit' }),
      used: baseUsed + (Math.random() - 0.5) * baseUsed * 0.1,
      capacity: capacity,
    });
  }
  
  return data;
};

export default function NodeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [historicalData] = useState(() => generateHistoricalData());
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

  const uptimeHistory = historicalData.uptimeData;
  const latencyHistory = historicalData.latencyData;
  const storageHistory = node?.performance
    ? generateStorageData(node.performance.storageUsed, node.performance.storageCapacity)
    : [];

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
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Gradient Background */}
        <div className="mb-8 relative">
          {/* Gradient decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e]/10 via-[#3b82f6]/10 to-purple-500/10 rounded-2xl blur-3xl -z-10" />
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#22c55e] transition-all mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl border border-[#1F1F1F] p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      Node Details
                    </h1>
                    <p className="text-sm text-gray-400 font-mono">
                      {node.id.substring(0, 8)}...{node.id.slice(-6)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1.5 rounded-lg border ${statusColors[node.status]} font-semibold text-xs uppercase tracking-wide`}
                  >
                    ● {node.status}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 font-semibold text-xs">
                    v{node.version}
                  </span>
                  {node.location?.country && (
                    <span className="px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 font-semibold text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {node.location.country}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
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

        {/* Quick Stats - Modern Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Uptime Card */}
          <div className="group relative bg-gradient-to-br from-[#0A0A0A] to-[#0A0A0A]/50 rounded-xl p-5 border border-[#1F1F1F] hover:border-[#22c55e]/50 transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[#22c55e]" />
                </div>
                <div className="text-xs text-gray-500 font-mono">Live</div>
              </div>
              <div className="mb-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
                  {node.uptime.toFixed(1)}%
                </p>
              </div>
              <p className="text-sm text-gray-400 font-medium">Uptime</p>
            </div>
          </div>

          {/* Version Card */}
          <div className="group relative bg-gradient-to-br from-[#0A0A0A] to-[#0A0A0A]/50 rounded-xl p-5 border border-[#1F1F1F] hover:border-[#3b82f6]/50 transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <div className="text-xs px-2 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6] font-mono">
                  Latest
                </div>
              </div>
              <div className="mb-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent">
                  {node.version}
                </p>
              </div>
              <p className="text-sm text-gray-400 font-medium">Version</p>
            </div>
          </div>

          {/* Last Seen Card */}
          <div className="group relative bg-gradient-to-br from-[#0A0A0A] to-[#0A0A0A]/50 rounded-xl p-5 border border-[#1F1F1F] hover:border-purple-500/50 transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              </div>
              <div className="mb-1">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {lastSeenDuration}
                </p>
              </div>
              <p className="text-sm text-gray-400 font-medium">Last Seen</p>
            </div>
          </div>

          {/* Latency Card */}
          <div className="group relative bg-gradient-to-br from-[#0A0A0A] to-[#0A0A0A]/50 rounded-xl p-5 border border-[#1F1F1F] hover:border-orange-500/50 transition-all hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-xs text-gray-500 font-mono">ms</div>
              </div>
              <div className="mb-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  {node.performance?.latency ? node.performance.latency.toFixed(0) : 'N/A'}
                </p>
              </div>
              <p className="text-sm text-gray-400 font-medium">Latency</p>
            </div>
          </div>
        </div>

        {/* Node Information - Modern 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Identity Section */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl border border-[#1F1F1F] overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-[#22c55e]/10 to-transparent p-6 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#22c55e]" />
                </div>
                <h2 className="text-xl font-bold text-white">Identity</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Node ID */}
              <div className="group">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Node ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F] group-hover:border-[#22c55e]/30 transition-colors">
                    <code className="text-[#22c55e] text-sm font-mono break-all">
                      {node.id}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(node.id, 'id')}
                    className="p-3 hover:bg-[#22c55e]/10 rounded-lg transition-all border border-[#1F1F1F] hover:border-[#22c55e]/50"
                    title="Copy Node ID"
                  >
                    <Copy className={`w-4 h-4 transition-colors ${copiedField === 'id' ? 'text-[#22c55e]' : 'text-gray-400'}`} />
                  </button>
                </div>
                {copiedField === 'id' && (
                  <span className="text-[#22c55e] text-xs mt-1.5 inline-flex items-center gap-1 font-medium">
                    <span className="w-1 h-1 bg-[#22c55e] rounded-full animate-pulse" />
                    Copied to clipboard
                  </span>
                )}
              </div>

              {/* Public Key */}
              <div className="group">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Public Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F] group-hover:border-purple-500/30 transition-colors">
                    <code className="text-purple-400 text-sm font-mono break-all">
                      {node.publicKey}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(node.publicKey, 'pubkey')}
                    className="p-3 hover:bg-purple-500/10 rounded-lg transition-all border border-[#1F1F1F] hover:border-purple-500/50"
                    title="Copy public key"
                  >
                    <Copy className={`w-4 h-4 transition-colors ${copiedField === 'pubkey' ? 'text-purple-400' : 'text-gray-400'}`} />
                  </button>
                </div>
                {copiedField === 'pubkey' && (
                  <span className="text-purple-400 text-xs mt-1.5 inline-flex items-center gap-1 font-medium">
                    <span className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                    Copied to clipboard
                  </span>
                )}
              </div>

              {/* IP Address */}
              <div className="group">
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                  Gossip Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F] group-hover:border-[#3b82f6]/30 transition-colors">
                    <code className="text-[#3b82f6] text-sm font-mono">
                      {node.ipAddress}:{node.port}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${node.ipAddress}:${node.port}`, 'ip')}
                    className="p-3 hover:bg-[#3b82f6]/10 rounded-lg transition-all border border-[#1F1F1F] hover:border-[#3b82f6]/50"
                    title="Copy IP address"
                  >
                    <Copy className={`w-4 h-4 transition-colors ${copiedField === 'ip' ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                  </button>
                </div>
                {copiedField === 'ip' && (
                  <span className="text-[#3b82f6] text-xs mt-1.5 inline-flex items-center gap-1 font-medium">
                    <span className="w-1 h-1 bg-[#3b82f6] rounded-full animate-pulse" />
                    Copied to clipboard
                  </span>
                )}
              </div>

              {/* RPC Port (if available) */}
              {node.performance?.rpcPort && (
                <div className="group">
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    RPC Endpoint
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F] group-hover:border-orange-500/30 transition-colors">
                      <code className="text-orange-400 text-sm font-mono">
                        {node.ipAddress}:{node.performance.rpcPort}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${node.ipAddress}:${node.performance?.rpcPort}`, 'rpc')}
                      className="p-3 hover:bg-orange-500/10 rounded-lg transition-all border border-[#1F1F1F] hover:border-orange-500/50"
                      title="Copy RPC endpoint"
                    >
                      <Copy className={`w-4 h-4 transition-colors ${copiedField === 'rpc' ? 'text-orange-400' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  {copiedField === 'rpc' && (
                    <span className="text-orange-400 text-xs mt-1.5 inline-flex items-center gap-1 font-medium">
                      <span className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                      Copied to clipboard
                    </span>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1F1F1F]">
                <div>
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    First Seen
                  </label>
                  <p className="text-white font-medium">{formatDate(node.firstSeen)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Initial discovery</p>
                </div>
                <div>
                  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Last Active
                  </label>
                  <p className="text-white font-medium">{formatDate(node.lastSeen)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{lastSeenDuration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Network & Software Section */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl border border-[#1F1F1F] overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-[#3b82f6]/10 to-transparent p-6 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <h2 className="text-xl font-bold text-white">Network & Software</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Location Info */}
              {node.location && (
                <div className="bg-gradient-to-r from-[#3b82f6]/5 to-transparent rounded-xl p-4 border border-[#1F1F1F]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#3b82f6]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{node.location.city}</h3>
                        <span className="px-2 py-0.5 rounded bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-mono">
                          {node.location.country}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Latitude</p>
                          <p className="text-white font-mono text-sm">{node.location.latitude.toFixed(4)}°</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Longitude</p>
                          <p className="text-white font-mono text-sm">{node.location.longitude.toFixed(4)}°</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#1F1F1F]">
                        <p className="text-gray-500 text-xs mb-1">Coordinates</p>
                        <code className="text-[#3b82f6] text-xs font-mono">
                          {node.location.latitude.toFixed(6)}, {node.location.longitude.toFixed(6)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Software Version */}
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 block">
                  Software Information
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Version</span>
                      <span className="text-white font-mono font-semibold">{node.version}</span>
                    </div>
                  </div>
                  
                  {node.performance?.shredVersion && (
                    <div className="bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Shred Version</span>
                        <span className="text-white font-mono font-semibold">{node.performance.shredVersion}</span>
                      </div>
                    </div>
                  )}
                  
                  {node.performance?.featureSet && (
                    <div className="bg-[#050505] rounded-lg px-4 py-3 border border-[#1F1F1F]">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Feature Set</span>
                        <span className="text-white font-mono text-xs">{node.performance.featureSet}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Network Stats */}
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 block">
                  Network Statistics
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-[#22c55e]/5 to-transparent rounded-lg px-4 py-3 border border-[#1F1F1F]">
                    <p className="text-gray-400 text-xs mb-1">Uptime</p>
                    <p className="text-[#22c55e] font-bold text-lg">{node.uptime.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg px-4 py-3 border border-[#1F1F1F]">
                    <p className="text-gray-400 text-xs mb-1">Latency</p>
                    <p className="text-orange-400 font-bold text-lg">
                      {node.performance?.latency ? `${node.performance.latency.toFixed(0)}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        {node.performance && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Storage</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Total Capacity</label>
                <p className="text-2xl font-bold text-white">{formatBytes(node.performance.storageCapacity)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Used</label>
                <p className="text-2xl font-bold text-white">{formatBytes(node.performance.storageUsed)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Usage Percentage</label>
                <p className="text-2xl font-bold text-white">
                  {((node.performance.storageUsed / node.performance.storageCapacity) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{
                  width: `${(node.performance.storageUsed / node.performance.storageCapacity) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Uptime Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">24-Hour Uptime History</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={uptimeHistory}>
                <defs>
                  <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" domain={[90, 100]} style={{ fontSize: '12px' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="url(#uptimeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Latency Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">24-Hour Latency</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={latencyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Timeline */}
        {node.performance && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Storage Usage Timeline (24 Hours)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={storageHistory}>
                <defs>
                  <linearGradient id="storageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => formatBytes(value)}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => formatBytes(value)}
                />
                <Area type="monotone" dataKey="used" stroke="#8b5cf6" fill="url(#storageGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
