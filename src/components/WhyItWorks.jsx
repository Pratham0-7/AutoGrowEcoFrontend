import { useEffect, useRef, useState } from "react";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const responseSpeedData = [
  { label: "First 5 minutes", value: 8, suffix: "x" },
  { label: "After 5 min–24 hrs", value: 1, suffix: "x" },
];

const touchpointData = [
  { label: "Average touchpoints needed", value: 8, suffix: "" },
];

const statCards = [
  {
    value: "57.1%",
    title: "First calls happen too late",
    desc: "Many first call attempts happen after more than a week.",
  },
  {
    value: "0.1%",
    title: "Fast follow-up is rare",
    desc: "Very few leads are engaged within the first five minutes.",
  },
  {
    value: "10–15%",
    title: "Efficiency improvement",
    desc: "Sales automation can materially improve team efficiency.",
  },
  {
    value: "50%+",
    title: "Buyers use multiple channels",
    desc: "Customers often engage across 3–5 channels before acting.",
  },
];

const bottomPills = [
  "8x stronger early follow-up",
  "8 touchpoints on average",
  "Automation improves efficiency",
  "Multi-channel buyer behavior",
  "Built for conversion, not admin",
];

const WhyItWorks = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [chartRef, chartInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.1);

  return (
    <section className="relative bg-white py-24 sm:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Why it works
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            The numbers behind{" "}
            <span className="text-violet-600">missed conversions.</span>
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Leads convert faster when follow-up is immediate, repeated, and consistent.
            That is exactly what AGE is built to do.
          </p>
        </div>

        {/* Charts */}
        <div
          ref={chartRef}
          style={{
            opacity: chartInView ? 1 : 0,
            transform: chartInView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
          className="mt-16 grid gap-6 lg:grid-cols-2"
        >
          {/* Chart 1 */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                Response speed
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Fast follow-up wins more leads
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Conversion performance is dramatically higher when outreach happens
                in the first five minutes.
              </p>
            </div>

            <div className="space-y-6 px-8 py-8">
              {responseSpeedData.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.value}
                      {item.suffix}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-600 transition-all duration-700"
                      style={{
                        width: `${(item.value / 8) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-violet-600 px-8 py-4 text-center">
              <p className="text-sm font-medium text-white">
                The faster the first follow-up, the higher the conversion potential.
              </p>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                Follow-up depth
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                One message is rarely enough
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Most conversions need repeated contact. AGE keeps outreach running
                instead of stopping after the first attempt.
              </p>
            </div>

            <div className="px-8 py-8">
              {touchpointData.map((item) => (
                <div key={item.label}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-3xl font-bold text-violet-600">
                      {item.value}
                    </span>
                  </div>

                  <div className="grid grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-2xl border border-violet-100 bg-violet-50"
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    Consistency matters more than intention. AGE automates the
                    follow-up sequence so your team does not drop leads midway.
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-violet-600 px-8 py-4 text-center">
              <p className="text-sm font-medium text-white">
                Repeated touchpoints beat one-off outreach.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            opacity: statsInView ? 1 : 0,
            transform: statsInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
          className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-3xl font-bold tracking-tight text-violet-600">
                {card.value}
              </p>
              <h4 className="mt-3 text-base font-semibold text-slate-900">
                {card.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {bottomPills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;