import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: {
    Open: number;
    Investigating: number;
    Mitigated: number;
    Closed: number;
  };
}

export const RiskStatusChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'Open', value: data.Open },
    { name: 'Investigating', value: data.Investigating },
    { name: 'Mitigated', value: data.Mitigated },
    { name: 'Closed', value: data.Closed },
  ];

  return (
    <div className="card h-80">
      <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Status Overview
      </h2>
      <p className="text-xs text-slate-400 mt-1 mb-4">
        Track how risks move across the lifecycle
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            fontWeight="bold"
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            fontWeight="bold"
            allowDecimals={false} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
          <Bar 
            dataKey="value" 
            fill="url(#colorGradient)" 
            radius={[8, 8, 0, 0]} 
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
