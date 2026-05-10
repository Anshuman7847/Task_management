const StatCard = ({ label, value, accent }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.35)]">
    <div className={`h-2 w-20 rounded-full ${accent}`} />
    <p className="mt-5 text-sm text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
  </div>
);

export default StatCard;
