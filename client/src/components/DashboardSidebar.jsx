import { FolderKanban, LayoutDashboard, LogOut, LucideX, ListTodo, UserCircle2, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const DashboardSidebar = ({ user, onLogout, isOpen, onClose }) => {
  const isAdmin = user?.role === "admin";
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/tasks", label: "Tasks", icon: ListTodo },
    ...(isAdmin ? [{ to: "/team", label: "Team Members", icon: Users }] : []),
    { to: "/profile", label: "Profile", icon: UserCircle2 },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[292px] max-w-[86vw] border-r border-white/10 bg-slate-900/95 shadow-[0_20px_70px_rgba(15,23,42,0.45)] backdrop-blur transition-transform duration-300 lg:sticky lg:top-[89px] lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:border lg:bg-slate-900/85 lg:h-[calc(100vh-105px)] ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex w-full flex-col">
        <div className="flex items-start justify-between border-b border-white/10 bg-gradient-to-br from-cyan-400/20 via-sky-500/10 to-orange-500/15 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-[1.7rem] font-bold leading-none text-white sm:text-[1.9rem]">
              {isAdmin ? "Admin" : "User"} <span className="text-cyan-300">Panel</span>
            </h2>
            <p className="mt-3 truncate text-base text-slate-200 sm:text-lg">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 lg:hidden"
          >
            <LucideX size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-3 py-4 sm:px-4 sm:py-5">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-4 rounded-2xl px-4 py-3 text-base font-semibold transition sm:px-5 sm:py-4 sm:text-[1.05rem] ${
                      isActive
                        ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30"
                        : "text-slate-100 hover:bg-white/5"
                    }`
                  }
                >
                  <IconComponent
                    size={20}
                    strokeWidth={2.2}
                    className={item.to === "/dashboard" ? "text-cyan-200" : "text-slate-300"}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-base font-medium text-slate-100 transition hover:bg-white/5 sm:px-5 sm:py-4 sm:text-[1.05rem]"
            >
              <LogOut size={20} strokeWidth={2.2} className="text-slate-300" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
