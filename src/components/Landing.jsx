import React from "react";
import Hero from "./Hero";
import Problem from "./Problem";
import Solution from "./Solution";
import Results from "./Results";
import Navbar from "./Navbar";
import WhyAGE from "./WhyPage";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhyAGE />
        <Solution />
        <Results />
        <footer className="mt-16 py-8 text-center">
          <p className="text-base font-semibold text-slate-700 tracking-wide">
            Built by Pratham Pandey
          </p>
        </footer>{" "}
      </main>
    </div>
  );
};

export default Landing;
