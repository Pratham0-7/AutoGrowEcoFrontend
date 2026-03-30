import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
            Built for faster follow-ups
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Automated Growth Ecosystem
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            70% of your leads go cold. AGE helps you follow up faster, stay
            consistent, and turn more conversations into closings.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/sign-up")}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:px-7"
            >
              Get Started
            </button>

            <button
            onClick={()=> window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:px-7"
            >
              Book Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;