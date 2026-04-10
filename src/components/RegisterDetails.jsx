import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RegisterDetails() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.fullName || user?.firstName || "",
    company_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.company_name.trim() || !form.phone.trim()) {
      setError("Company name and phone number are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/submit_details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user.id,
          name: form.name.trim(),
          company_name: form.company_name.trim(),
          phone: form.phone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/book-demo");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">AutoGrowth Eco</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Tell us about yourself</h1>
          <p className="mt-2 text-sm text-slate-400">
            Just a few details so we can get you set up properly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="Your company name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50 mt-2"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>

        <button
          onClick={() => signOut()}
          className="mt-6 w-full text-center text-xs text-slate-600 hover:text-slate-400 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
