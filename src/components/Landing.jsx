import React from "react";
import Hero from "./Hero";
import Problem from "./Problem";
import Solution from "./Solution";
import Results from "./Results";
import Navbar from "./Navbar";
import WhyAGE from "./WhyPage";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-slate-950">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
                AGE
              </div>
              <span className="text-sm font-semibold text-white">AutoGrowthEco</span>
            </div>
            <p className="mt-2.5 max-w-xs text-xs leading-relaxed text-slate-500">
              Automated follow-ups for sales teams who can't afford to let leads go cold.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <button
              onClick={() => navigate("/sign-up")}
              className="transition hover:text-white"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/sign-in")}
              className="transition hover:text-white"
            >
              Login
            </button>
            <button
              onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
              className="transition hover:text-white"
            >
              Book a Demo
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} AutoGrowthEco. All rights reserved.</p>
          <p>
            Built by{" "}
            <span className="font-medium text-slate-400">Pratham Pandey</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

const Landing = () => {
  return (
    <div className="bg-slate-950 text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhyAGE />
        <Solution />
        <Results />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;