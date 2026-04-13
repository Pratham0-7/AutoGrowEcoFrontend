import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(-50%, 0px) scale(1); }
          50% { transform: translate(-50%, -24px) scale(1.06); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-anim-1 { animation: fadeUp 0.7s ease forwards; opacity: 0; }
        .hero-anim-2 { animation: fadeUp 0.7s ease 0.15s forwards; opacity: 0; }
        .hero-anim-3 { animation: fadeUp 0.7s ease 0.3s forwards; opacity: 0; }
        .hero-anim-4 { animation: fadeUp 0.7s ease 0.45s forwards; opacity: 0; }
        .hero-anim-5 { animation: fadeUp 0.7s ease 0.62s forwards; opacity: 0; }
        .blob-float { animation: floatBlob 9s ease-in-out infinite; }
        .gradient-text {
          background: linear-gradient(135deg, #2D8FA2, #0F5E6E, #2D8FA2);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#1A2E35] pt-24">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="blob-float absolute left-1/2 -top-40 h-160 w-240 -translate-x-1/2 rounded-full bg-[#0F5E6E]/25 blur-3xl" />
          <div className="absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#0F5E6E]/10 blur-3xl" />
          <div className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-[#0F5E6E]/15 blur-3xl" />
        </div>

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Softer bottom fade */}

        {/* Content */}
        <div className="relative mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="hero-anim-1 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8563A] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E8563A]" />
            </span>
            Lead Follow-Up Automation · Built for Sales Teams
          </div>

          {/* Headline */}
          <h1 className="hero-anim-2 mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Stop Losing Leads
            <br />
            <span className="gradient-text">to Missed Follow-Ups</span>
          </h1>

          {/* Sub */}
          <p className="hero-anim-3 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            AGE sends automatic, personalized follow-ups so your team stays consistent,
            responds on time, and closes more deals.
          </p>

          {/* CTAs */}
          <div className="hero-anim-4 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/sign-up")}
              className="group inline-flex items-center gap-2 rounded-xl bg-[#E8563A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E8563A]/30 transition hover:bg-[#d14b30]"
            >
              Get Started Free
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                window.open("https://calendly.com/076pandeypratham/30min", "_blank")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <svg
                className="h-4 w-4 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              Book a Demo
            </button>
          </div>

          {/* Stats */}
          <div className="hero-anim-5 mx-auto mt-14 flex max-w-md flex-wrap items-center justify-center gap-x-10 gap-y-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">70%</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
                leads go cold
              </p>
            </div>

            <div className="hidden h-10 w-px bg-white/10 sm:block" />

            <div className="text-center">
              <p className="text-3xl font-bold text-white">3×</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
                more replies
              </p>
            </div>

            <div className="hidden h-10 w-px bg-white/10 sm:block" />

            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
                auto follow-ups
              </p>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="hero-anim-5 mt-12 flex justify-center">
            <div className="flex flex-col items-center gap-1.5 text-xs text-white/25">
              <svg
                className="h-4 w-4 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;