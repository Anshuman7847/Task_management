import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),_transparent_26%)]" />
    <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Team Task Manager</p>
          <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-tight">
            Keep projects moving with secure, role-based teamwork.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Organize projects, assign tasks, track delivery, and keep every team member aligned from one dashboard.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-2xl font-semibold text-white">JWT</p>
              <p className="mt-2 text-sm text-slate-400">Secure login sessions</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-2xl font-semibold text-white">RBAC</p>
              <p className="mt-2 text-sm text-slate-400">Admin and member access</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-2xl font-semibold text-white">Live</p>
              <p className="mt-2 text-sm text-slate-400">Task visibility across teams</p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <Outlet />
        </section>
      </div>
    </div>
  </div>
);

export default AuthLayout;
