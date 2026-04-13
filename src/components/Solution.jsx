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

const features = [
  {
    tag: "Personalization",
    title: "Context-aware messages",
    description: "Generate messages that feel personal, not automated — tailored using basic lead data and context you provide.",
    color: "teal",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    tag: "Automation",
    title: "Multi-channel follow-ups",
    description: "Reach leads across email and SMS without manually sending a single message. AGE handles the cadence.",
    color: "blue",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    tag: "Tracking",
    title: "Simple lead visibility",
    description: "Instantly see who's engaged, who's pending, and who said no — no pipeline stages to dig through.",
    color: "emerald",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    tag: "Consistency",
    title: "Built-in follow-up system",
    description: "Follow-ups happen on a set schedule whether you remember or not. No lead gets ignored or forgotten.",
    color: "amber",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
];

const colorMap = {
  teal:   { icon: "bg-[#0F5E6E]/10 text-[#0F5E6E] border-[#0F5E6E]/20", tag: "text-[#0F5E6E] bg-[#0F5E6E]/5 border-[#0F5E6E]/20" },
  blue:   { icon: "bg-blue-50 text-blue-600 border-blue-200",             tag: "text-blue-600 bg-blue-50 border-blue-200" },
  emerald:{ icon: "bg-emerald-50 text-emerald-600 border-emerald-200",     tag: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  amber:  { icon: "bg-amber-50 text-amber-600 border-amber-200",           tag: "text-amber-600 bg-amber-50 border-amber-200" },
};

const FeatureCard = ({ feature, delay }) => {
  const [ref, inView] = useInView();
  const c = colorMap[feature.color];

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#0F5E6E]/20 hover:shadow-md transition-all duration-300"
    >
      <div className={`mb-4 inline-flex items-center justify-center rounded-xl border p-2.5 ${c.icon}`}>
        {feature.icon}
      </div>

      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.tag}`}>
        {feature.tag}
      </span>

      <h3 className="mt-3 text-base font-semibold text-[#1A2E35]">
        {feature.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
        {feature.description}
      </p>
    </div>
  );
};

const Solution = () => {
  const [headerRef, headerInView] = useInView(0.2);

  return (
    <section className="relative bg-[#FFFBF5] py-24 sm:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      {/* Subtle center glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-[#0F5E6E]/5 blur-3xl" />
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F5E6E]/20 bg-[#0F5E6E]/5 px-4 py-1.5 text-sm font-medium text-[#0F5E6E]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            The Solution
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1A2E35] sm:text-5xl">
            Stay consistent without{" "}
            <span className="text-[#0F5E6E]">extra effort</span>
          </h2>

          <p className="mt-4 text-lg text-[#6B7280]">
            AGE works in the background so your follow-ups never depend on memory or manual work.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} delay={i * 100} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Solution;
