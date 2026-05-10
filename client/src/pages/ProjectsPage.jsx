import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  members: [],
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
    const { data } = await api.get("/projects");
    setProjects(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const requests = [fetchProjects()];

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, formData);
        toast.success("Project updated");
      } else {
        await api.post("/projects", formData);
        toast.success("Project created");
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save project");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      members: project.members.map((member) => member._id),
    });
  };

  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success("Project deleted");
      fetchProjects();
      if (editingId === projectId) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete project");
    }
  };

  const getVisibleMembers = (project) => project.members.filter((member) => member.role !== "admin");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Projects"
        description="Create and manage project workspaces."
      />

      {user.role === "admin" ? (
        <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">{editingId ? "Edit project" : "Create project"}</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project title"
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-sm font-medium text-slate-200">Select team members</p>
              <p className="mt-1 text-xs text-slate-400">You can choose multiple members for the project.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {users.map((member) => {
                  const isSelected = formData.members.includes(member._id);

                  return (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => handleMemberToggle(member._id)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
                          : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {isSelected ? "Selected" : "Member"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description"
              className="md:col-span-2 min-h-32 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <div className="flex gap-3">
              <button type="submit" className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950">
                {editingId ? "Update Project" : "+ Create Project"}
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

      <section className="grid gap-4 xl:grid-cols-2">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Once a project is created, it will appear here with the assigned team members."
          />
        ) : (
          projects.map((project) => (
            <article key={project._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div>
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{project.description || "No description provided."}</p>
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.25em] text-slate-500">Members</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {getVisibleMembers(project).length > 0 ? (
                  getVisibleMembers(project).map((member) => (
                    <span key={member._id} className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">
                      {member.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No members selected</span>
                )}
              </div>
              {user.role === "admin" ? (
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
