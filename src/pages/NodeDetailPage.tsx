import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { xandeumAPI } from '../services/api';
import { formatBytes, formatDuration, formatDate } from '../utils/formatters';
import { Copy, ArrowLeft, Activity, HardDrive, MapPin, Wifi, Clock, Server } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import ExportButton from '../components/ui/ExportButton';
import FavoriteButton from '../components/ui/FavoriteButton';
import Tooltip from '../components/ui/Tooltip';
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
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Node Details</h1>
              <p className="text-gray-400">Complete information about this pNode</p>
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
              <span
                className={`px-4 py-2 rounded-lg border ${statusColors[node.status]} font-medium text-sm uppercase`}
              >
                {node.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="text-gray-400 text-sm font-medium">Uptime</h3>
            </div>
            <p className="text-2xl font-bold text-white">{node.uptime.toFixed(2)}%</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-5 h-5 text-blue-400" />
              <h3 className="text-gray-400 text-sm font-medium">Version</h3>
            </div>
            <p className="text-2xl font-bold text-white">{node.version}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-400" />
              <h3 className="text-gray-400 text-sm font-medium">Last Seen</h3>
            </div>
            <p className="text-xl font-bold text-white">{lastSeenDuration}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Wifi className="w-5 h-5 text-orange-400" />
              <h3 className="text-gray-400 text-sm font-medium">Latency</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {node.performance?.latency ? `${node.performance.latency.toFixed(1)}ms` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Node Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Identity Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Identity Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Public Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-purple-400 text-sm font-mono break-all">
                    {node.publicKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(node.publicKey, 'pubkey')}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Copy public key"
                  >
                    <Copy className={`w-4 h-4 ${copiedField === 'pubkey' ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                </div>
                {copiedField === 'pubkey' && (
                  <span className="text-green-400 text-xs mt-1 inline-block">✓ Copied!</span>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">IP Address</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-blue-400 text-sm font-mono">
                    {node.ipAddress}:{node.port}
                  </code>
                  <Tooltip content={copiedField === 'ip' ? 'Copied!' : 'Copy IP address'}>
                    <button
                      onClick={() => copyToClipboard(`${node.ipAddress}:${node.port}`, 'ip')}
                      className="p-2 hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Copy IP address"
                    >
                      <Copy className={`w-4 h-4 ${copiedField === 'ip' ? 'text-green-400' : 'text-gray-400'}`} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">First Seen</label>
                  <p className="text-white">{formatDate(node.firstSeen)}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Last Active</label>
                  <p className="text-white">{formatDate(node.lastSeen)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Location</h2>
            {node.location ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">{node.location.city}</p>
                    <p className="text-gray-400 text-sm">{node.location.country}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Latitude</label>
                    <p className="text-white">{node.location.latitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Longitude</label>
                    <p className="text-white">{node.location.longitude.toFixed(4)}</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Geographic Coordinates</p>
                  <code className="text-purple-400 text-xs font-mono">
                    {node.location.latitude.toFixed(6)}, {node.location.longitude.toFixed(6)}
                  </code>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Location information not available</p>
            )}
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
