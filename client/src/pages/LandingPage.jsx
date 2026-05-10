import { ArrowRight, CheckCircle2, Clock3, LayoutPanelTop, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="pb-20 pt-8 sm:pb-24">
    <section
      id="home"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] px-6 py-10 shadow-[0_30px_120px_rgba(2,6,23,0.42)] sm:px-8 lg:px-12 lg:py-14"
    >
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Team Task Manager
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Organize team work with a clean workspace for projects, tasks, and progress tracking.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Bring your team into one focused place where work stays clear, assignments stay visible, and delivery
            stays on track.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Login
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-3xl font-semibold text-white">Teams</p>
              <p className="mt-2 text-sm text-slate-400">Work together with clear ownership and visibility</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-3xl font-semibold text-white">Tasks</p>
              <p className="mt-2 text-sm text-slate-400">Track pending, active, and completed work easily</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-3xl font-semibold text-white">Progress</p>
              <p className="mt-2 text-sm text-slate-400">Keep delivery timelines and workload under control</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Workspace Preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Daily Team Flow</h2>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                Active
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: "Plan work clearly", value: "Create and organize projects" },
                { label: "Assign with confidence", value: "Give every task a clear owner" },
                { label: "Track delivery", value: "Monitor progress from start to finish" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">What you can do here</p>
              <div className="mt-4 space-y-3">
                {[
                  "Create team workspaces and manage assigned members",
                  "Add tasks with clear deadlines and priorities",
                  "Keep everyone aligned with one shared view of progress",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={18} className="mt-0.5 text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about" className="mt-16 grid gap-6 md:grid-cols-3">
      <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <LayoutPanelTop size={28} className="text-cyan-300" />
        <h2 className="mt-4 text-xl font-semibold text-white">Simple Workspace</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Keep projects, tasks, and team activity organized in one clean dashboard.
        </p>
      </article>
      <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <Users2 size={28} className="text-cyan-300" />
        <h2 className="mt-4 text-xl font-semibold text-white">Better Collaboration</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Make it easier for teams to understand responsibility and stay aligned on work.
        </p>
      </article>
      <article className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
        <Clock3 size={28} className="text-cyan-300" />
        <h2 className="mt-4 text-xl font-semibold text-white">Clear Progress</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Follow task movement, deadlines, and completion updates without extra complexity.
        </p>
      </article>
    </section>

    <section id="contact" className="mt-16 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-300">Contact Us</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Need help setting up your team workspace?
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Reach out for onboarding support, setup guidance, or help getting your team started with a smoother work
            process.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 font-medium text-white">support@teamtaskmanager.com</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Phone</p>
              <p className="mt-2 font-medium text-white">+91 98765 43210</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Office Hours</p>
              <p className="mt-2 font-medium text-white">Mon - Fri, 9 AM - 6 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
