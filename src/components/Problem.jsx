import { useEffect, useRef, useState } from "react";

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

const problems = [
  {
    number: "01",
    title: "Follow-ups stop too early",
    description:
      "Most leads need 5–8 touches before they decide. Most salespeople stop after one or two, assuming the lead isn't interested.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Manual tracking breaks down",
    description:
      "Sticky notes, spreadsheets, and memory can't scale. Leads slip through the cracks and deals die silently.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "No clear lead priority",
    description:
      "Teams spend equal energy on hot leads and dead ends. Without visibility, time and effort go to the wrong people.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Speed drops after day one",
    description:
      "The first reply comes fast. After that, follow-up gets slower and slower — and so does buyer intent.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
];

const ProblemCard = ({ problem, delay }) => {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:border-rose-500/20 hover:bg-rose-500/[0.04] transition-colors duration-300"
    >
      {/* Number watermark */}
      <span className="absolute right-4 top-3 text-5xl font-black text-white/[0.04] select-none group-hover:text-rose-500/10 transition-colors duration-300">
        {problem.number}
      </span>

      {/* Icon */}
      <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-rose-400">
        {problem.icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-white">
        {problem.title}
      </h3>

      {/* Description */}
      <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
        {problem.description}
      </p>
    </div>
  );
};

const Problem = () => {
  const [headerRef, headerInView] = useInView(0.2);

  return (
    <section className="relative bg-slate-950 py-24 sm:py-32">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

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
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-1.5 text-sm font-medium text-rose-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            The Problem
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Why your leads go cold
          </h2>

          <p className="mt-4 text-lg text-slate-400">
            It's rarely a lack of leads. It's inconsistent follow-up — and it's costing you deals every week.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, i) => (
            <ProblemCard key={i} problem={problem} delay={i * 100} />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className="mx-auto mt-16 max-w-2xl rounded-2xl border border-rose-500/15 bg-rose-500/[0.05] px-6 py-5 text-center"
          style={{ opacity: 1 }}
        >
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-rose-400">The result?</span>{" "}
            Warm leads turn cold. Good conversations go nowhere. Revenue gets left on the table — not because of a bad product, but because of a broken process.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Problem;