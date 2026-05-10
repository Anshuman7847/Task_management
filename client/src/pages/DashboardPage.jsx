import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    recentTasks: [],
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    if (!user?.role) {
      return;
    }

    let isMounted = true;

    const loadDashboard = async (showLoader = false) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const requests = [api.get("/dashboard/stats")];

        if (user?.role === "member") {
          requests.push(api.get("/tasks"));
        }

        const [statsResponse, tasksResponse] = await Promise.all(requests);

        if (!isMounted) {
          return;
        }

        setStats(statsResponse.data);
        setTasks(Array.isArray(tasksResponse?.data) ? tasksResponse.data : []);
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "Unable to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const handleWindowFocus = () => {
      loadDashboard();
    };

    loadDashboard(true);
    window.addEventListener("focus", handleWindowFocus);
    const refreshTimer = window.setInterval(() => {
      loadDashboard();
    }, 20000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleWindowFocus);
      window.clearInterval(refreshTimer);
    };
  }, [user?.role]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project?.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const completionRate = stats.totalTasks === 0 ? 0 : Math.round((stats.completedTasks / stats.totalTasks) * 100);
  const primaryProjectName =
    tasks.length > 0
      ? tasks.reduce((counts, task) => {
          const key = task.project?.title || "Workspace";
          counts[key] = (counts[key] || 0) + 1;
          return counts;
        }, {})
      : null;

  const dominantProject = primaryProjectName
    ? Object.entries(primaryProjectName).sort((a, b) => b[1] - a[1])[0]?.[0]
    : "No active project";

  const upcomingDeadlines = [...tasks]
    .filter((task) => task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  if (user?.role === "member") {
    return (
      <div className="space-y-6 md:space-y-8">
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.28)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Welcome back</p>
              <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{user?.name} 👋</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Stay focused on your assigned work, update progress on time, and keep your deadlines under control.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</p>
                <div className="mt-3">
                  <StatusBadge value={user?.role} />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Productivity</p>
                <p className="mt-3 text-2xl font-semibold text-white">{loading ? "..." : `${completionRate}%`}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Team / Project</p>
                <p className="mt-3 text-sm font-semibold text-white">{loading ? "Loading..." : dominantProject}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Assigned Tasks" value={loading ? "..." : stats.totalTasks} accent="bg-cyan-400" />
          <StatCard label="Completed Tasks" value={loading ? "..." : stats.completedTasks} accent="bg-emerald-400" />
          <StatCard label="Pending Tasks" value={loading ? "..." : stats.pendingTasks} accent="bg-amber-400" />
          <StatCard label="Overdue Tasks" value={loading ? "..." : stats.overdueTasks} accent="bg-rose-400" />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Assigned Tasks</h2>
              <p className="mt-2 text-sm text-slate-400">Search and filter your current work.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search tasks"
                className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredTasks.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-slate-950/60 p-6 text-sm text-slate-400 xl:col-span-2">
                No assigned tasks match your filters.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article key={task._id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">Project: {task.project?.title}</p>
                    </div>
                    <StatusBadge value={task.priority} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge value={task.status} />
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5">
                    <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Update Status</label>
                    <select
                      value={task.status}
                      onChange={async (event) => {
                        await api.put(`/tasks/${task._id}`, { status: event.target.value });
                        const { data } = await api.get("/tasks");
                        setTasks(data);
                        setStats((prev) => {
                          const completedTasks = data.filter((item) => item.status === "completed").length;
                          const pendingTasks = data.filter((item) => item.status !== "completed").length;
                          const overdueTasks = data.filter(
                            (item) => item.status !== "completed" && new Date(item.dueDate) < new Date()
                          ).length;

                          return {
                            ...prev,
                            totalTasks: data.length,
                            completedTasks,
                            pendingTasks,
                            overdueTasks,
                            recentTasks: data.slice(0, 5),
                          };
                        });
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    >
                      <option value="pending">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Task Progress</h2>
              <p className="text-sm font-semibold text-cyan-300">{loading ? "..." : `${completionRate}%`}</p>
            </div>
            <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              You have completed {stats.completedTasks} out of {stats.totalTasks} assigned tasks.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Deadlines</h2>
            <div className="mt-5 space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-slate-400">No upcoming deadlines right now.</p>
              ) : (
                upcomingDeadlines.map((task) => (
                  <article
                    key={task._id}
                    className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{task.project?.title}</p>
                    </div>
                    <p className="text-sm font-medium text-amber-200">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <div className="mt-5 space-y-3">
            {stats.recentTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No recent activity yet.</p>
            ) : (
              stats.recentTasks.map((task) => (
                <article
                  key={task._id}
                  className="flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      You {task.status === "completed" ? "completed" : "updated"} {task.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{task.project?.title}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Project and task analytics"
        description="Track delivery across your workspace, spot overdue work early, and keep the team aligned."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Projects" value={loading ? "..." : stats.totalProjects} accent="bg-cyan-400" />
        <StatCard label="Total Tasks" value={loading ? "..." : stats.totalTasks} accent="bg-sky-400" />
        <StatCard label="Completed" value={loading ? "..." : stats.completedTasks} accent="bg-emerald-400" />
        <StatCard label="Pending" value={loading ? "..." : stats.pendingTasks} accent="bg-amber-400" />
        <StatCard label="Overdue" value={loading ? "..." : stats.overdueTasks} accent="bg-rose-400" />
      </div>

      <section className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 sm:p-5 md:rounded-[2rem] md:p-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Recent task activity</h2>
        <div className="mt-5 space-y-3">
          {stats.recentTasks.length === 0 ? (
            <p className="text-sm text-slate-400">No task activity yet.</p>
          ) : (
            stats.recentTasks.map((task) => (
              <article
                key={task._id}
                className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 sm:rounded-3xl md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {task.project?.title} • {task.assignedTo?.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={task.status} />
                  <p className="text-xs text-slate-500">
                    Updated {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
