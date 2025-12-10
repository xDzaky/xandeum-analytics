import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

interface NodeStatusProps {
  data: Array<{
    status: string;
    count: number;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  active: 'rgb(34, 197, 94)',    // green
  inactive: 'rgb(239, 68, 68)',   // red
  syncing: 'rgb(251, 191, 36)',   // yellow
};

export default function NodeStatusChart({ data }: NodeStatusProps) {
  const renderLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    if (cx === undefined || cy === undefined || innerRadius === undefined || 
        outerRadius === undefined || midAngle === undefined || index === undefined) {
      return null;
    }
    
    const RADIAN = Math.PI / 180;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > Number(cx) ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${data[index].status} (${((percent || 0) * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Node Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry.status}`} fill={STATUS_COLORS[entry.status] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: '#9CA3AF',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
