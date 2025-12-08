import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface NetworkTimelineProps {
  data: Array<{
    time: string;
    totalNodes: number;
    activeNodes: number;
    inactiveNodes: number;
  }>;
}

export default function NetworkTimelineChart({ data }: NetworkTimelineProps) {
  return (
    <div className="bg-card rounded-lg border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Network Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
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
          <Line
            type="monotone"
            dataKey="totalNodes"
            stroke="rgb(139, 92, 246)"
            strokeWidth={2}
            name="Total Nodes"
            dot={{ fill: 'rgb(139, 92, 246)', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="activeNodes"
            stroke="rgb(34, 197, 94)"
            strokeWidth={2}
            name="Active Nodes"
            dot={{ fill: 'rgb(34, 197, 94)', r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="inactiveNodes"
            stroke="rgb(239, 68, 68)"
            strokeWidth={2}
            name="Inactive Nodes"
            dot={{ fill: 'rgb(239, 68, 68)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
