import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { isValidEmail } from "../utils/validation";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.put("/users/profile", formData);
      updateUser(data);
      setFormData((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Manage your account"
        description="Update your basic details here. Password changes are optional and handled securely."
      />

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/15 text-2xl font-bold text-cyan-200">
              {userInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Current role</p>
              <div className="mt-3">
                <StatusBadge value={user?.role} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Account summary</p>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Display name</span>
                  <span className="text-right text-white">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Email</span>
                  <span className="text-right text-white">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Joined</span>
                  <span className="text-right text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="Email"
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (optional)"
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
