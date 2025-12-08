import { cn } from '../../utils/cn';
import type { NodeStatus } from '../../types';

interface StatusBadgeProps {
  status: NodeStatus;
  showPulse?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  showPulse = false,
  className,
}: StatusBadgeProps) {
  const statusConfig = {
    active: {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
      label: 'Active',
    },
    inactive: {
      bg: 'bg-error/10',
      text: 'text-error',
      dot: 'bg-error',
      label: 'Inactive',
    },
    syncing: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      dot: 'bg-warning',
      label: 'Syncing',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && status === 'active' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', config.dot)}></span>
      </span>
      <span>{config.label}</span>
    </div>
  );
}
