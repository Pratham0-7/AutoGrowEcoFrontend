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

const oldWay = [
  "Tracks contacts. Doesn't follow up for you.",
  "Complex dashboards and workflows you never fully use.",
  "Follow-ups slow down when your team gets busy.",
  "Lead status buried inside pipeline stages nobody checks.",
];

const ageWay = [
  "Automatically follows up until they reply or say no.",
  "Simple, focused on one thing: consistent outreach.",
  "Runs on a schedule. Never misses a touch.",
  "Clear Yes / No / Pending on every lead at a glance.",
];

const proofStats = [
  {
    value: "80%",
    label: "of successful sales take 5+ follow-ups",
    source: "HubSpot / Invesp",
    url: "https://blog.hubspot.com/sales/sales-statistics",
  },
  {
    value: "44%",
    label: "give up after just one follow-up",
    source: "HubSpot / Invesp",
    url: "https://blog.hubspot.com/sales/sales-statistics",
  },
  {
    value: "42 hrs",
    label: "average response time among responders",
    source: "Harvard Business Review",
    url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
];

const lossFlow = [
  { label: "Monthly leads", value: "300", width: "100%" },
  { label: "Warm leads", value: "60", width: "52%" },
  { label: "Lost from weak follow-up", value: "30", width: "28%" },
];

const WhyAGE = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [proofRef, proofInView] = useInView(0.1);
  const [comparisonRef, comparisonInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.1);

  return (
    <section className="relative bg-[#FFFBF5] py-20 sm:py-28">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main heading */}
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
            Why AGE
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-[#1A2E35] sm:text-5xl">
            AGE isn't a CRM.{" "}
            <span className="text-[#0F5E6E]">It's a closer.</span>
          </h2>

          <p className="mt-4 text-lg text-[#6B7280]">
            Traditional CRMs help you organize leads. AGE helps you convert them.
          </p>
        </div>

        {/* THE HIDDEN LEAK heading */}
        <div className="mt-16 text-center sm:mt-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F5E6E]">
            The Hidden Leak
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#1A2E35] sm:text-3xl">
            Most businesses are not only losing leads.
            <span className="text-[#0F5E6E]"> They are losing revenue already in the pipeline.</span>
          </h3>
        </div>

        {/* Hidden leak visual card */}
        <div
          ref={proofRef}
          style={{
            opacity: proofInView ? 1 : 0,
            transform: proofInView ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
          className="mt-8 overflow-hidden rounded-3xl border border-[#0F5E6E]/15 bg-white shadow-sm"
        >
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left side */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E8563A]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                  Lead follow-up proof
                </span>
                <span className="rounded-full bg-[#0F5E6E]/8 px-3 py-1 text-xs font-semibold text-[#0F5E6E]">
                  Source-backed
                </span>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#3D5560] sm:text-lg">
                Leads rarely disappear in one moment. They go cold when the
                follow-up does not happen enough, fast enough, or consistently enough.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {proofStats.map((stat) => (
                  <a
                    key={stat.label}
                    href={stat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-5 transition hover:-translate-y-0.5 hover:border-[#0F5E6E]/30 hover:shadow-sm"
                  >
                    <p className="text-4xl font-black tracking-tight text-[#0F5E6E]">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#1A2E35]">
                      {stat.label}
                    </p>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                      {stat.source}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="bg-[#0D1F24] p-6 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                    Visual example
                  </p>
                  <h4 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    ₹7.5L/month
                  </h4>
                  <p className="mt-2 text-base font-semibold text-white/75">
                    can be lost from weak follow-up
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">
                    Example
                  </p>
                  <p className="mt-1 text-sm font-black text-white">₹25k/deal</p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                {lossFlow.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/75">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#E8563A]"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white/70">
                    30 lost warm leads × ₹25,000
                  </p>
                  <p className="text-2xl font-black text-white">₹7,50,000</p>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white/70">
                    Possible yearly leak
                  </p>
                  <p className="text-2xl font-black text-[#E8563A]">₹90,00,000</p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-6 text-white/45">
                Illustrative model only: 300 leads, 20% warm leads, 50% of warm
                leads lost due to weak follow-up, ₹25,000 average deal value.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-[#FFFBF5] px-6 py-5 text-center">
            <p className="text-sm font-bold text-[#1A2E35] sm:text-base">
              The problem is not always lack of leads. It is losing the leads you already paid for.
            </p>
          </div>
        </div>

        {/* THE COMPARISON heading */}
        <div className="mt-16 text-center sm:mt-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0F5E6E]">
            The Comparison
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#1A2E35] sm:text-3xl">
            Traditional CRM shows you leads.
            <span className="text-[#0F5E6E]"> AGE follows up with them.</span>
          </h3>
        </div>

        {/* Comparison card */}
        <div
          ref={comparisonRef}
          style={{
            opacity: comparisonInView ? 1 : 0,
            transform: comparisonInView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
          className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="grid sm:grid-cols-2">
            {/* Old way */}
            <div className="border-b border-slate-200 bg-slate-50 p-6 sm:border-b-0 sm:border-r sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200">
                  <svg
                    className="h-4 w-4 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Traditional CRM
                </p>
              </div>

              <ul className="space-y-4">
                {oldWay.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-[#6B7280]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AGE way */}
            <div className="bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5E6E]/10">
                  <svg
                    className="h-4 w-4 text-[#0F5E6E]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#0F5E6E]">
                  With AGE
                </p>
              </div>

              <ul className="space-y-4">
                {ageWay.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F5E6E]/10 text-[#0F5E6E]">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-[#1A2E35]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-[#0F5E6E] px-6 py-4 text-center">
            <p className="text-sm font-medium text-white">
              AGE replaces the follow-up part of your CRM and actually does it.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div
          ref={featRef}
          style={{
            opacity: featInView ? 1 : 0,
            transform: featInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            "Email + SMS",
            "AI-written messages",
            "Auto-scheduling",
            "Yes / No / Pending tracking",
            "Built for sales teams",
          ].map((pill) => (
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

export default WhyAGE;