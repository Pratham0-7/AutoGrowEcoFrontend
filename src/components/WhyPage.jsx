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

const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
};

const clampNumber = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return number;
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
    source: "HubSpot, citing Invesp",
    url: "https://blog.hubspot.com/sales/sales-statistics",
  },
  {
    value: "44%",
    label: "of salespeople give up after one follow-up",
    source: "HubSpot, citing Invesp",
    url: "https://blog.hubspot.com/sales/sales-statistics",
  },
  {
    value: "42 hrs",
    label: "average response time among companies that responded",
    source: "Harvard Business Review",
    url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
];

const WhyAGE = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [proofRef, proofInView] = useInView(0.1);
  const [comparisonRef, comparisonInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.1);

  const [monthlyLeads, setMonthlyLeads] = useState(300);
  const [dealValue, setDealValue] = useState(25000);
  const [warmLeadPercent, setWarmLeadPercent] = useState(20);
  const [weakFollowupLossPercent, setWeakFollowupLossPercent] = useState(50);

  const safeMonthlyLeads = clampNumber(monthlyLeads);
  const safeDealValue = clampNumber(dealValue);

  const warmLeads = Math.round((safeMonthlyLeads * warmLeadPercent) / 100);
  const lostLeads = Math.round((warmLeads * weakFollowupLossPercent) / 100);
  const monthlyLeak = lostLeads * safeDealValue;
  const yearlyLeak = monthlyLeak * 12;

  const maxBar = Math.max(safeMonthlyLeads, 1);

  const calculatorBars = [
    {
      label: "Monthly leads",
      value: safeMonthlyLeads,
      width: "100%",
    },
    {
      label: "Approx warm leads",
      value: warmLeads,
      width: `${Math.max((warmLeads / maxBar) * 100, 4)}%`,
    },
    {
      label: "Approx lost warm leads",
      value: lostLeads,
      width: `${Math.max((lostLeads / maxBar) * 100, 4)}%`,
    },
  ];

  return (
    <section className="relative bg-[#FFFBF5] py-20 sm:py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

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

        {/* The Hidden Leak heading */}
        <div className="mt-16 text-center sm:mt-20">
          <div className="inline-flex rounded-full bg-[#E8563A]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-[#E8563A]">
            The Hidden Leak
          </div>

          <h3 className="mx-auto mt-4 max-w-3xl text-2xl font-bold tracking-tight text-[#1A2E35] sm:text-3xl">
            See how much revenue weak follow-up could be leaking from your
            pipeline.
          </h3>
        </div>

        {/* The Hidden Leak card */}
        <div
          ref={proofRef}
          style={{
            opacity: proofInView ? 1 : 0,
            transform: proofInView ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
          className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Proof section */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#E8563A]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                Why follow-up matters
              </span>

              <span className="rounded-full bg-[#0F5E6E]/10 px-3 py-1 text-xs font-semibold text-[#0F5E6E]">
                Source-backed
              </span>
            </div>

            <h4 className="mt-5 max-w-4xl text-3xl font-bold tracking-tight text-[#1A2E35] sm:text-4xl">
              Leads rarely disappear in one moment.{" "}
              <span className="text-[#0F5E6E]">
                They fade when nobody follows up.
              </span>
            </h4>

            <p className="mt-4 max-w-4xl text-base leading-8 text-[#3D5560] sm:text-lg">
              Most businesses already paid to generate the lead. The leak
              happens when that interest is not followed up with fast enough,
              long enough, or consistently enough.
            </p>

            <div className="mt-8 space-y-4">
              {proofStats.map((stat) => (
                <a
                  key={stat.label}
                  href={stat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-slate-200 bg-[#FFFBF5] p-5 transition hover:-translate-y-0.5 hover:border-[#0F5E6E]/30 hover:shadow-sm"
                >
                  <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
                    <p className="text-4xl font-black tracking-tight text-[#0F5E6E]">
                      {stat.value}
                    </p>

                    <div>
                      <p className="text-base font-semibold leading-7 text-[#1A2E35]">
                        {stat.label}
                      </p>

                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                        {stat.source}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Calculator section */}
          <div className="border-t border-slate-200 bg-[#0D1F24] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E8563A]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                  Interactive calculator
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
                  Live estimate
                </span>
              </div>

              <div>
                <h4 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Estimate your follow-up leak
                </h4>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                  Change the numbers to estimate how much revenue weak
                  follow-up could be costing.
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Monthly leads
                </span>

                <input
                  type="number"
                  min="0"
                  value={monthlyLeads}
                  onChange={(e) => setMonthlyLeads(e.target.value)}
                  onBlur={() => setMonthlyLeads(clampNumber(monthlyLeads))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-[#E8563A]"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Average deal value
                </span>

                <input
                  type="number"
                  min="0"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  onBlur={() => setDealValue(clampNumber(dealValue))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 focus:border-[#E8563A]"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Warm lead estimate
                  </span>

                  <span className="text-xs font-bold text-white">
                    {warmLeadPercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={warmLeadPercent}
                  onChange={(e) => setWarmLeadPercent(Number(e.target.value))}
                  className="mt-3 w-full accent-[#E8563A]"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Weak follow-up loss
                  </span>

                  <span className="text-xs font-bold text-white">
                    {weakFollowupLossPercent}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={weakFollowupLossPercent}
                  onChange={(e) =>
                    setWeakFollowupLossPercent(Number(e.target.value))
                  }
                  className="mt-3 w-full accent-[#E8563A]"
                />
              </label>
            </div>

            {/* Visual bars */}
            <div className="mt-8 space-y-5">
              {calculatorBars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white/75">
                      {item.label}
                    </span>

                    <span className="text-sm font-bold text-white">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#E8563A] transition-all duration-500"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Result card */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-white/70">
                  Estimated monthly revenue leak
                </p>

                <p className="text-2xl font-black text-white">
                  {formatINR(monthlyLeak)}
                </p>
              </div>

              <div className="my-4 h-px bg-white/10" />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-white/70">
                  Estimated yearly revenue leak
                </p>

                <p className="text-2xl font-black text-[#E8563A]">
                  {formatINR(yearlyLeak)}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-xs leading-6 text-white/45">
              This is an estimate, not a guarantee. It uses your monthly leads,
              estimated warm lead percentage, estimated weak follow-up loss, and
              average deal value.
            </p>
          </div>

          {/* Bottom takeaway */}
          <div className="border-t border-slate-200 bg-[#0F5E6E] px-6 py-5 text-center">
            <p className="text-sm font-bold leading-6 text-white sm:text-base">
              The problem is not always lack of leads. It is losing the leads
              you already paid for.
            </p>
          </div>
        </div>

        {/* The Comparison heading */}
        <div className="mt-16 text-center sm:mt-20">
          <div className="inline-flex rounded-full bg-[#0F5E6E]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.18em] text-[#0F5E6E]">
            The Comparison
          </div>

          <h3 className="mx-auto mt-4 max-w-3xl text-2xl font-bold tracking-tight text-[#1A2E35] sm:text-3xl">
            Traditional CRM shows you leads.{" "}
            <span className="text-[#0F5E6E]">AGE follows up with them.</span>
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
            {/* Traditional CRM */}
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

            {/* With AGE */}
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