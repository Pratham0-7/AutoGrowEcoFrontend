import React from "react";
import Hero from "./Hero";
import Problem from "./Problem";
import Solution from "./Solution";
import Results from "./Results";
import Navbar from "./Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Results />
      </main>
    </div>
  );
};

export default Landing;