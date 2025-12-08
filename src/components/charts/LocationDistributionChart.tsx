import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LocationDistributionProps {
  data: Array<{
    country: string;
    count: number;
  }>;
}

export default function LocationDistributionChart({ data }: LocationDistributionProps) {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            dataKey="country"
            type="category"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            width={100}
          />
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
          <Bar 
            dataKey="count" 
            fill="rgb(59, 130, 246)"
            name="Nodes"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
