import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
    <div className="max-w-md rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The page you were looking for does not exist or has moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
      >
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
