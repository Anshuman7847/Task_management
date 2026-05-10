import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { useAuth } from "../context/useAuth";

const AppShell = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_40%,#111827_100%)] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#04091d] shadow-[0_18px_45px_rgba(2,6,23,0.22)] backdrop-blur">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex rounded-full border border-slate-700 bg-slate-800/70 p-2 text-slate-100 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <p className="text-xl font-bold text-white sm:text-2xl">
              Task<span className="text-cyan-300">Flow</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-2 text-center sm:px-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300 sm:text-xs">{user?.role}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-700/80 text-lg font-bold text-white">
              {userInitial}
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <div className="grid min-h-[calc(100vh-73px)] gap-4 px-4 py-4 lg:grid-cols-[294px_minmax(0,1fr)] lg:gap-6 lg:pl-0 lg:pr-6">
        <DashboardSidebar user={user} onLogout={logout} isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className="rounded-[1.5rem] border border-white/10 bg-slate-950/65 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.5)] backdrop-blur sm:p-5 md:min-h-[calc(100vh-105px)] md:rounded-[2rem] md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
