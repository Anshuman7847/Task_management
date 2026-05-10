import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const TeamPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/users");
    setUsers(data);
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const handleToggleBlock = async (memberId) => {
    try {
      const { data } = await api.patch(`/users/${memberId}/block`);
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update member status");
    }
  };

  const handleDelete = async (memberId) => {
    try {
      await api.delete(`/users/${memberId}`);
      toast.success("Member deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete member");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Team"
        title="Team Members"
        description="View and manage registered member accounts."
      />

      {users.length === 0 ? (
        <EmptyState title="No members found" description="Registered member accounts will appear here once users sign up." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {users.map((member) => (
            <article key={member._id} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{member.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">{member.email}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={member.role} />
                  <StatusBadge value={member.isBlocked ? "blocked" : "active"} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleBlock(member._id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium ${
                    member.isBlocked
                      ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border border-amber-400/30 bg-amber-400/10 text-amber-200"
                  }`}
                >
                  {member.isBlocked ? "Unblock Member" : "Block Member"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member._id)}
                  className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200"
                >
                  Delete Member
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
