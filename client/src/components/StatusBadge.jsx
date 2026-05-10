const STATUS_STYLES = {
  completed: "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-100 ring-amber-400/30",
  "in-progress": "bg-sky-500/15 text-sky-100 ring-sky-400/30",
  high: "bg-rose-500/15 text-rose-100 ring-rose-400/30",
  medium: "bg-orange-500/15 text-orange-100 ring-orange-400/30",
  low: "bg-teal-500/15 text-teal-100 ring-teal-400/30",
  admin: "bg-fuchsia-500/15 text-fuchsia-100 ring-fuchsia-400/30",
  member: "bg-slate-500/15 text-slate-100 ring-slate-300/30",
  blocked: "bg-rose-500/15 text-rose-100 ring-rose-400/30",
  active: "bg-emerald-500/15 text-emerald-100 ring-emerald-400/30",
};

const StatusBadge = ({ value }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
      STATUS_STYLES[value] || "bg-white/10 text-slate-100 ring-white/10"
    }`}
  >
    {value?.replace("-", " ")}
  </span>
);

export default StatusBadge;
