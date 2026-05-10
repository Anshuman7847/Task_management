const LoadingScreen = ({ message = "Loading workspace...", compact = false }) => {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 text-sm text-slate-100 shadow-lg backdrop-blur"
          : "flex min-h-screen items-center justify-center bg-slate-950 text-slate-100"
      }
    >
      <div className={compact ? "flex items-center gap-3" : "rounded-2xl border border-white/10 bg-white/5 px-6 py-4"}>
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
        <span className={compact ? "" : "ml-3 text-sm"}>{message}</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
