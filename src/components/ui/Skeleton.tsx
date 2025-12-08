/**
 * Loading Skeleton Components
 * Improve perceived performance with skeleton screens
 */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-800/50 rounded overflow-hidden relative ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 7 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-800/50">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <Skeleton className={`h-4 ${i === 0 ? 'w-24' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-3">
        {[100, 80, 90, 70, 95, 85].map((height, i) => (
          <div key={i} className="flex items-end gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton style={{ height: `${height}px` }} className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NodeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
