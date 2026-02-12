import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-indigo-500 to-purple-500' },
  { to: '/risks', label: 'Risks', icon: '🛡️', gradient: 'from-purple-500 to-pink-500' },
  { to: '/ai', label: 'AI Insights', icon: '🤖', gradient: 'from-pink-500 to-red-500' },
  { to: '/archive', label: 'Archive', icon: '📦', gradient: 'from-slate-500 to-slate-600' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="relative flex h-full w-80 flex-col border-r border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -left-20 top-20 h-64 w-64 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-64 w-64 animate-pulse rounded-full bg-purple-500/20 blur-3xl" style={{ animationDelay: '1s' }} />
      </div>

      {/* Logo Section */}
      <div className="relative z-10 border-b border-slate-800/50 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/50">
            <span className="text-3xl">🔐</span>
          </div>
          <div>
            <h1 className="text-xl font-black gradient-text">SecureOps</h1>
            <p className="text-xs font-bold text-slate-500">Command Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 space-y-2 p-6">
        {navItems.map((item, i) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 text-sm font-black transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-2xl'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {active && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/10 to-transparent" />
              )}
              <span className="relative z-10 text-2xl">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
              {active && (
                <div className="absolute right-4 h-2 w-2 animate-pulse rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="relative z-10 border-t border-slate-800/50 p-6">
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-slate-900/50 p-4 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl font-black text-white shadow-lg shadow-indigo-500/50">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-black text-slate-100">{user?.name}</p>
            <p className="truncate text-xs font-bold text-slate-500">{user?.email}</p>
            <div className="mt-1 inline-flex rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-400">
              {user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-2xl border-2 border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-black text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="mr-2">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};
