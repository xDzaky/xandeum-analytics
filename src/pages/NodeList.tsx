import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNodes } from '../hooks/useNodes';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';
import { formatPercentage, formatPublicKey, formatTimeAgo } from '../utils/formatters';

export default function NodeList() {
  const { data: nodes, isLoading } = useNodes();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
        <p className="text-gray-400">No nodes found</p>
      </div>
    );
  }

  // Filter nodes
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ipAddress.includes(searchQuery) ||
      node.publicKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || node.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">pNode Explorer</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-400">
          Browse and search all Xandeum pNodes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, IP, or Public Key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-card border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="syncing">Syncing</option>
        </select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        Showing {filteredNodes.length} of {nodes.length} nodes
      </div>

      {/* Nodes Table */}
      <div className="bg-card rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Node ID</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Public Key</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">IP Address</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Version</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400">Uptime</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node) => (
                <tr
                  key={node.id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                >
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-white font-mono">
                    <Link 
                      to={`/nodes/${node.id}`}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-2 group-hover:underline"
                    >
                      {node.id}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-300 font-mono">
                    {formatPublicKey(node.publicKey)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-300">
                    {node.ipAddress}:{node.port}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <StatusBadge status={node.status} showPulse={node.status === 'active'} />
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-300">
                    {node.version}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm">
                    <span className={`font-medium ${
                      node.uptime >= 99 ? 'text-success' :
                      node.uptime >= 95 ? 'text-warning' :
                      'text-error'
                    }`}>
                      {formatPercentage(node.uptime)}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-400">
                    {formatTimeAgo(node.lastSeen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No nodes match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
