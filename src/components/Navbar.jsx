import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-lg font-semibold tracking-tight text-slate-900 hover:opacity-80"
        >
          <p className="text-2xl">AGE</p>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          <button
            onClick={() => navigate("/sign-in")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/sign-up")}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get Started
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;