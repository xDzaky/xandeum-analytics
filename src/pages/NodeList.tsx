import { useState } from 'react';
import { Search, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNodes } from '../hooks/useNodes';
import { useFavorites } from '../hooks/useFavorites';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatusBadge from '../components/ui/StatusBadge';
import FavoriteButton from '../components/ui/FavoriteButton';
import { formatPercentage, formatPublicKey, formatTimeAgo } from '../utils/formatters';
import { exportNodesToCSV, exportNodesToJSON } from '../utils/export';

export default function NodeList() {
  const { data: nodes, isLoading } = useNodes();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
    
    const matchesFavorites = !showFavoritesOnly || isFavorite(node.id);

    return matchesSearch && matchesStatus && matchesFavorites;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header with Export Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">pNode Explorer</h1>
          <p className="mt-1 text-sm text-muted">
            Browse and search all Xandeum pNodes • {nodes.length} total nodes
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => exportNodesToCSV(filteredNodes)}
            className="px-4 py-2 text-xs text-muted hover:text-white rounded-md hover:bg-card-hover transition-colors border border-border"
          >
            Export CSV
          </button>
          <button 
            onClick={() => exportNodesToJSON(filteredNodes)}
            className="btn-primary text-xs"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by ID, IP, or Public Key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
              aria-label="Search nodes"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-background border border-border rounded-md text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm min-w-[140px]"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="syncing">Syncing</option>
          </select>
          
          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`
              px-4 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center gap-2 text-sm
              focus:outline-none focus:ring-1 focus:ring-warning
              ${showFavoritesOnly 
                ? 'bg-warning/20 text-warning border border-warning/50' 
                : 'bg-background text-muted border border-border hover:border-warning/50 hover:text-warning'
              }
            `}
            aria-label={showFavoritesOnly ? 'Show all nodes' : 'Show watchlist only'}
            aria-pressed={showFavoritesOnly}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-warning' : ''}`} />
            <span className="whitespace-nowrap">
              Watchlist {favorites.length > 0 && `(${favorites.length})`}
            </span>
          </button>
        </div>

        {/* Results count */}
        <div className="mt-3 text-xs text-muted flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          Showing {filteredNodes.length} of {nodes.length} nodes
        </div>
      </div>

      {/* Nodes Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted w-8"></th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted whitespace-nowrap">Node ID</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted whitespace-nowrap">Public Key</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted whitespace-nowrap">IP Address</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted">Status</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted">Version</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted">Uptime</th>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wide text-muted whitespace-nowrap">Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {filteredNodes.map((node, index) => (
                <tr
                  key={`${node.id}-${node.publicKey}-${index}`}
                  className="border-b border-border last:border-0 hover:bg-card-hover transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <FavoriteButton
                      nodeId={node.id}
                      isFavorite={isFavorite(node.id)}
                      onToggle={toggleFavorite}
                      size="sm"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-sm text-white font-mono">
                    <Link 
                      to={`/nodes/${node.id}`}
                      className="text-primary hover:text-primary-light flex items-center gap-2 group-hover:underline"
                    >
                      {node.id}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-muted-foreground font-mono">
                    {formatPublicKey(node.publicKey)}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-foreground">
                    {node.ipAddress}:{node.port}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={node.status} showPulse={node.status === 'active'} />
                  </td>
                  <td className="py-3.5 px-4 text-sm text-foreground font-mono">
                    {node.version}
                  </td>
                  <td className="py-3.5 px-4 text-sm">
                    <span className={`font-semibold ${
                      node.uptime >= 99 ? 'text-success' :
                      node.uptime >= 95 ? 'text-warning' :
                      'text-error'
                    }`}>
                      {formatPercentage(node.uptime)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-muted">
                    {formatTimeAgo(node.lastSeen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No nodes match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
