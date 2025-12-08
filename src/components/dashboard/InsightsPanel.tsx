/**
 * Insights Panel
 * Shows network insights with metrics in tab format
 */

import { Check, Clock, Shield } from 'lucide-react';

interface InsightItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'info';
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

export default function InsightsPanel() {
  return (
    <>
      <div className="flex items-center border-b border-border">
        <button className="flex-1 py-3 text-xs font-medium text-white border-b-2 border-primary bg-white/5">
          Insights
        </button>
        <button className="flex-1 py-3 text-xs font-medium text-muted hover:text-white transition-colors">
          Events <span className="ml-1 text-[10px] bg-white/10 px-1 rounded-sm">3</span>
        </button>
      </div>
      <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
        <div className="divide-y divide-border/50">
          <InsightItem
            icon={Check}
            title="Full network availability"
            description="All nodes are online and responsive."
            status="success"
          />
          
          <InsightItem
            icon={Check}
            title="Excellent version health"
            description="100% of nodes on latest version."
            status="success"
          />
          
          <InsightItem
            icon={Shield}
            title="Consensus is healthy"
            description="Health score: 86. No issues detected."
            status="success"
          />
          
          <InsightItem
            icon={Clock}
            title="Latency Spike Detected"
            description="Region EU-West observed >150ms."
            status="warning"
          />
        </div>
      </div>
    </>
  );
}

