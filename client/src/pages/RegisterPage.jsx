import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { isValidEmail } from "../utils/validation";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      await register(formData);
      toast.success("Account created. Please login to continue");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md items-center py-10">
      <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">Get started</p>
      <h2 className="mt-4 text-3xl font-semibold text-white">Create your account</h2>
      <p className="mt-3 text-sm text-slate-300">Create your workspace account to access your team dashboard.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Full name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-300"
            placeholder="Anshuman"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-300"
            placeholder="anshuman@gmail.com"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Password</span>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-300"
            placeholder="Minimum 6 characters"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-orange-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-orange-300 hover:text-orange-200">
          Login
        </Link>
      </p>
      </div>
    </div>
  );
};

export default RegisterPage;
