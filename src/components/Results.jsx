import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const results = [
  {
    stat: "3×",
    title: "More replies",
    description: "Faster, consistent follow-ups mean more conversations with leads who would have otherwise gone cold.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    color: "teal",
  },
  {
    stat: "Instant",
    title: "Lead clarity",
    description: "Know exactly who's interested, who's not, and who still needs a nudge — no pipeline digging required.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: "blue",
  },
  {
    stat: "More $",
    title: "More closed deals",
    description: "Consistency compounds. More conversations, more conversions, more revenue — without hiring more people.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    color: "emerald",
  },
];

const colorMap = {
  teal:   { icon: "bg-[#0F5E6E]/10 text-[#0F5E6E] border-[#0F5E6E]/20", stat: "text-[#0F5E6E]" },
  blue:   { icon: "bg-blue-50 text-blue-600 border-blue-200",             stat: "text-blue-600" },
  emerald:{ icon: "bg-emerald-50 text-emerald-600 border-emerald-200",     stat: "text-emerald-600" },
};

const ResultCard = ({ result, delay }) => {
  const [ref, inView] = useInView();
  const c = colorMap[result.color];

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <div className={`inline-flex items-center justify-center rounded-xl border p-3 ${c.icon}`}>
        {result.icon}
      </div>

      <p className={`mt-5 text-4xl font-black ${c.stat}`}>{result.stat}</p>

      <h3 className="mt-2 text-lg font-semibold text-[#1A2E35]">{result.title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{result.description}</p>
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  const [headerRef, headerInView] = useInView(0.2);
  const [ctaRef, ctaInView] = useInView(0.2);

  return (
    <section className="relative bg-[#FFFBF5] py-24 sm:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#0F5E6E]/5 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18l9-9 4.5 4.5 6-7.5" />
            </svg>
            The Results
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1A2E35] sm:text-5xl">
            What this means for you
          </h2>

          <p className="mt-4 text-xl font-semibold text-[#1A2E35]">
            One extra deal pays for AGE for a year.
          </p>

          <p className="mt-2 text-base text-[#6B7280]">
            Consistent follow-ups = more conversations = more revenue.
          </p>
        </div>

        {/* Result cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {results.map((result, i) => (
            <ResultCard key={i} result={result} delay={i * 120} />
          ))}
        </div>

        {/* CTA bar */}
        <div
          ref={ctaRef}
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
          className="mt-16 overflow-hidden rounded-3xl border border-[#0F5E6E]/20 bg-linear-to-r from-[#0F5E6E]/8 via-[#0F5E6E]/4 to-[#0F5E6E]/8"
        >
          <div className="flex flex-col items-center gap-6 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-xl font-bold text-[#1A2E35]">
                Ready to stop losing deals to silence?
              </p>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                Set up in minutes. No CRM needed. No credit card required to start.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/sign-up")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8563A] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#E8563A]/20 transition hover:bg-[#d14b30]"
              >
                Get Started Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
                className="inline-flex items-center justify-center rounded-xl border border-[#0F5E6E]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1A2E35] transition hover:bg-[#FFFBF5] hover:border-[#0F5E6E]/40"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Results;
