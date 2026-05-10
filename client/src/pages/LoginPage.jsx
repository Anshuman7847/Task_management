import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { isValidEmail } from "../utils/validation";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter your email and password");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md items-center py-10">
      <div className="w-full rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Welcome back</p>
      <h2 className="mt-4 text-3xl font-semibold text-white">Login to your workspace</h2>
      <p className="mt-3 text-sm text-slate-300">Use your email and password to continue managing tasks.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="you@company.com"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">Password</span>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="Enter your password"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        Need an account?{" "}
        <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Register
        </Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
