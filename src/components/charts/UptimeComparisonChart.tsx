import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface UptimeComparisonProps {
  data: Array<{
    name: string;
    uptime: number;
  }>;
}

export default function UptimeComparisonChart({ data }: UptimeComparisonProps) {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Top Nodes by Uptime</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            domain={[90, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Uptime']}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: '#9CA3AF',
            }}
          />
          <Bar 
            dataKey="uptime" 
            fill="rgb(34, 197, 94)"
            name="Uptime %"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
