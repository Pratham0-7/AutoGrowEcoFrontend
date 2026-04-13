import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("company_id", data.company_id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("company_name", data.company_name);

        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F5E6E] text-sm font-bold text-white">
            AGE
          </div>
          <span className="text-sm font-semibold text-[#1A2E35]">Automated Growth Ecosystem</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A2E35]">Welcome back</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A2E35] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1A2E35] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#0F5E6E] focus:ring-2 focus:ring-[#0F5E6E]/15 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A2E35] mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1A2E35] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#0F5E6E] focus:ring-2 focus:ring-[#0F5E6E]/15 transition"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#E8563A] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#d14b30] transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#6B7280]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="font-medium text-[#0F5E6E] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
