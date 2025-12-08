import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface VersionDistributionProps {
  data: Array<{
    version: string;
    count: number;
  }>;
}

const COLORS = [
  'rgb(139, 92, 246)',  // primary
  'rgb(236, 72, 153)',  // pink
  'rgb(14, 165, 233)',  // blue
  'rgb(34, 197, 94)',   // green
  'rgb(251, 191, 36)',  // yellow
];

export default function VersionDistributionChart({ data }: VersionDistributionProps) {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Version Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ version, percent }) => `${version} (${((percent || 0) * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
