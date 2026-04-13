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
  { label: "First 5 min", value: 8, display: "8x" },
  { label: "5 min–24 hrs", value: 1, display: "1x" },
];

const touchpointBars = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
];

const statCards = [
  {
    value: "57.1%",
    title: "First calls happen too late",
    desc: "A large share of first call attempts happen after more than a week.",
    source: "Source: InsideSales research",
  },
  {
    value: "0.1%",
    title: "Fast follow-up is rare",
    desc: "Only a tiny fraction of inbound leads are engaged within five minutes.",
    source: "Source: InsideSales research",
  },
  {
    value: "10–15%",
    title: "Efficiency improvement",
    desc: "Sales automation can materially improve team efficiency.",
    source: "Source: McKinsey",
  },
  {
    value: "1.7x",
    title: "Omnichannel customers shop more",
    desc: "Customers using multiple channels shop more than single-channel shoppers.",
    source: "Source: McKinsey",
  },
];

const bottomPills = [
  "Research-backed",
  "Response speed matters",
  "Repeated touchpoints matter",
  "Automation improves efficiency",
  "Multi-channel buying is real",
];

const SourceLine = ({ children }) => (
  <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">{children}</p>
);

const SimpleBarChart = ({ data, maxValue, colorClass = "bg-[#0F5E6E]" }) => {
  return (
    <div className="mt-6">
      <div className="flex h-56 items-end gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 pb-4 pt-6">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-3">
            <span className="text-sm font-bold text-[#1A2E35]">
              {item.display || item.value}
            </span>

            <div className="flex h-36 w-full items-end justify-center">
              <div
                className={`w-full max-w-[72px] rounded-t-2xl ${colorClass} shadow-sm transition-all duration-700`}
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>

            <span className="text-center text-xs font-medium text-[#6B7280]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WhyItWorks = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [chartRef, chartInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.1);

  return (
    <section className="relative bg-[#FFFBF5] py-24 sm:py-32">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0F5E6E]/20 bg-[#0F5E6E]/5 px-4 py-1.5 text-sm font-medium text-[#0F5E6E]">
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

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1A2E35] sm:text-5xl">
            The numbers behind <span className="text-[#0F5E6E]">missed conversions.</span>
          </h2>

          <p className="mt-4 text-lg text-[#6B7280]">
            AGE is built around what actually moves leads: fast response, repeated follow-up,
            and consistent outreach across channels.
          </p>
        </div>

        <div
          ref={chartRef}
          style={{
            opacity: chartInView ? 1 : 0,
            transform: chartInView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
          className="mt-16 grid gap-6 lg:grid-cols-2"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F5E6E]">
                Response speed
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#1A2E35]">
                Fast follow-up wins more leads
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                Conversion performance is far stronger when outreach happens in the first five minutes.
              </p>
            </div>

            <div className="px-8 py-8">
              <SimpleBarChart data={responseSpeedData} maxValue={8} />
              <SourceLine>Source: InsideSales research</SourceLine>
            </div>

            <div className="border-t border-slate-200 bg-[#0F5E6E] px-8 py-4 text-center">
              <p className="text-sm font-medium text-white">
                The faster the first follow-up, the higher the conversion potential.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-8 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0F5E6E]">
                Follow-up depth
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#1A2E35]">
                One message is rarely enough
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                New prospects usually need repeated touchpoints before they convert or book a meeting.
              </p>
            </div>

            <div className="px-8 py-8">
              <SimpleBarChart
                data={touchpointBars}
                maxValue={8}
                colorClass="bg-[#0F5E6E]/70"
              />
              <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                AGE keeps the sequence going so your team does not stop after the first attempt.
              </p>
              <SourceLine>Source: RAIN Group</SourceLine>
            </div>

            <div className="border-t border-slate-200 bg-[#0F5E6E] px-8 py-4 text-center">
              <p className="text-sm font-medium text-white">
                Repeated touchpoints beat one-off outreach.
              </p>
            </div>
          </div>
        </div>

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
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-3xl font-bold tracking-tight text-[#0F5E6E]">
                {card.value}
              </p>
              <h4 className="mt-3 text-base font-semibold text-[#1A2E35]">
                {card.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                {card.desc}
              </p>
              <SourceLine>{card.source}</SourceLine>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {bottomPills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1A2E35]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F5E6E]" />
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;
