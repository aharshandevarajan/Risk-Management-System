import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Topbar: React.FC = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-3xl font-black gradient-text">Cybersecurity Risk Management</h1>
          <p className="mt-1 text-sm font-bold text-slate-500">Monitor | Analyze | Respond | Protect</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 px-6 py-3 backdrop-blur-xl">
            <div className="text-xs font-bold text-slate-500">System Time</div>
            <div className="text-lg font-black gradient-text-2">{time.toLocaleTimeString()}</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              <span className="text-sm font-black text-emerald-400">All Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-800/50 bg-slate-900/50 px-6 py-3 backdrop-blur-xl">
            <div className="text-right">
              <p className="text-sm font-black text-slate-100">{user?.name}</p>
              <p className="text-xs font-black uppercase tracking-wider gradient-text">{user?.role}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-indigo-500/50">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/50 bg-slate-950/80 px-8 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="font-bold text-slate-400">
                Threats Monitored: <span className="text-slate-200">24/7</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="font-bold text-slate-400">
                AI Analysis: <span className="text-slate-200">Active</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-pink-500" />
              <span className="font-bold text-slate-400">
                Last Scan: <span className="text-slate-200">2 min ago</span>
              </span>
            </div>
          </div>
          <div className="font-bold text-slate-500">Version 2.0.0 | Powered by Gemini AI</div>
        </div>
      </div>
    </header>
  );
};
