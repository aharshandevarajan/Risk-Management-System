import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavLogo: React.FC<{ type: 'dashboard' | 'risks' | 'ai' | 'archive' }> = ({ type }) => {
  if (type === 'dashboard') {
    return (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="5" rx="1" />
        <rect x="13" y="10" width="8" height="11" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
      </svg>
    );
  }
  if (type === 'risks') {
    return (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l9 4.5v6c0 5-3.8 9.7-9 10.5C6.8 23.2 3 18.5 3 13.5v-6L12 3z" />
        <path d="M12 8v5" />
        <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === 'ai') {
    return (
      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard', type: 'dashboard' as const, gradient: 'from-indigo-500 to-purple-500' },
  { to: '/risks', label: 'Risks', type: 'risks' as const, gradient: 'from-purple-500 to-pink-500' },
  { to: '/ai', label: 'AI Insights', type: 'ai' as const, gradient: 'from-pink-500 to-red-500' },
  { to: '/archive', label: 'Archive', type: 'archive' as const, gradient: 'from-slate-500 to-slate-600' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="relative flex h-full w-80 flex-col border-r border-slate-800/50 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -left-20 top-20 h-64 w-64 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />
        <div
          className="absolute -right-20 bottom-20 h-64 w-64 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 border-b border-slate-800/50 p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/50">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l9 4.5v6c0 5-3.8 9.7-9 10.5C6.8 23.2 3 18.5 3 13.5v-6L12 3z" />
              <path d="M8.5 12.5L11 15l4.5-4.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black gradient-text">SecureOps</h1>
            <p className="text-xs font-bold text-slate-500">Command Center</p>
          </div>
        </div>
      </div>

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
              {active && <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/10 to-transparent" />}
              <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <NavLogo type={item.type} />
              </span>
              <span className="relative z-10">{item.label}</span>
              {active && <div className="absolute right-4 h-2 w-2 animate-pulse rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 border-t border-slate-800/50 p-6">
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-slate-900/50 p-4 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl font-black text-white shadow-lg shadow-indigo-500/50">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
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
          Sign Out
        </button>
      </div>
    </aside>
  );
};
