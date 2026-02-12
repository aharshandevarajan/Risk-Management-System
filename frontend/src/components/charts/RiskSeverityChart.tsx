import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

interface Props {
  data: {
    Low: number;
    Medium: number;
    High: number;
  };
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export const RiskSeverityChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Low', value: data.Low },
    { name: 'Medium', value: data.Medium },
    { name: 'High', value: data.High },
  ];

  return (
    <div className="card h-80">
      <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Severity Distribution
      </h2>
      <p className="text-xs text-slate-400 mt-1 mb-4">
        Breakdown of risks by calculated severity band
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            dataKey="value"
            strokeWidth={2}
            stroke="#1e293b"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
