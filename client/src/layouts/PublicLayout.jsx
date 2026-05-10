import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PublicLayout = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_40%,#111827_100%)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_24%)]" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <Link to="/" className="text-xl font-semibold tracking-wide text-white">
            Task<span className="text-cyan-300">Flow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? "text-cyan-300" : "text-slate-200 hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-right">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{user.role}</p>
              </div>
              <Link to="/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-full border border-white/10 p-2 md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-200"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{user.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={closeMenu} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
