import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
  assignedTo: "",
  project: "",
};

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data);
  };

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const requests = [fetchTasks(), fetchProjects()];

      if (user.role === "admin") {
        requests.push(
          api.get("/users").then(({ data }) => {
            setUsers(data);
          })
        );
      }

      await Promise.all(requests);
    };

    loadData();
  }, [user.role]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, formData);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", formData);
        toast.success("Task created");
      }
      resetForm();
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.slice(0, 10),
      assignedTo: task.assignedTo?._id,
      project: task.project?._id,
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Task deleted");
      fetchTasks();
      if (editingId === taskId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete task");
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update task status");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tasks"
        title={user.role === "admin" ? "Assign and track team tasks" : "Track your assigned work"}
        description="Keep due dates, ownership, and task progress visible across the workspace."
      />

      {user.role === "admin" ? (
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">{editingId ? "Edit task" : "Create task"}</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="">Select member</option>
              {users.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2 xl:col-span-3"
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
                {editingId ? "Update Task" : "+ Assign Task"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-white/10 px-5 py-3 text-slate-200"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}

      <section className="space-y-4">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Tasks will appear here once they are assigned inside a project."
          />
        ) : (
          tasks.map((task) => (
            <article key={task._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{task.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{task.description || "No description provided."}</p>
                  <p className="mt-4 text-sm text-slate-400">
                    Project: {task.project?.title} • Assigned to {task.assignedTo?.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={task.status} />
                  <StatusBadge value={task.priority} />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {user.role === "admin" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task._id)}
                      className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusUpdate(task._id, event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-white outline-none focus:border-cyan-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default TasksPage;
