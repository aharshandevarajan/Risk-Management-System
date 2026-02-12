import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black text-slate-100">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-500/10 blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] animate-pulse rounded-full bg-pink-500/10 blur-[120px]" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
