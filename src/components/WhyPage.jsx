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
  "Runs on a schedule. Never misses a touch, ever.",
  "Clear Yes / No / Pending on every lead at a glance.",
];

const proofStats = [
  {
    value: "80%",
    label: "of successful sales take 5+ follow-up calls",
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

const lossExample = [
  { label: "Monthly leads", value: 300, display: "300", width: "100%" },
  { label: "Warm leads", value: 60, display: "60", width: "55%" },
  { label: "Lost from weak follow-up", value: 30, display: "30", width: "32%" },
];

const WhyAGE = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [proofRef, proofInView] = useInView(0.1);
  const [cardRef, cardInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.1);

  return (
    <section className="relative bg-[#FFFBF5] py-24 sm:py-32">
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

          {/* Lead loss proof section */}
          <div
            ref={proofRef}
            style={{
              opacity: proofInView ? 1 : 0,
              transform: proofInView ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
            className="mt-10 overflow-hidden rounded-3xl border border-[#0F5E6E]/15 bg-white shadow-sm"
          >
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left: narrative and stats */}
              <div className="p-6 text-left sm:p-8">
                <div className="inline-flex rounded-full bg-[#E8563A]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                  The hidden leak
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1A2E35] sm:text-3xl">
                  Leads do not go cold all at once.
                  <span className="text-[#0F5E6E]"> They get forgotten.</span>
                </h3>

                <p className="mt-4 text-base leading-relaxed text-[#3D5560]">
                  Most businesses already paid to generate the lead through ads,
                  referrals, walk-ins, calls, Instagram, or website forms. When
                  follow-ups are delayed, inconsistent, or skipped, that paid
                  interest quietly turns into lost revenue.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {proofStats.map((stat) => (
                    <a
                      key={stat.label}
                      href={stat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-slate-200 bg-[#FFFBF5] p-4 transition hover:-translate-y-0.5 hover:border-[#0F5E6E]/30 hover:shadow-sm"
                    >
                      <p className="text-3xl font-black tracking-tight text-[#0F5E6E]">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-[#1A2E35]">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[#6B7280]">
                        Source: {stat.source}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: graph */}
              <div className="border-t border-slate-200 bg-[#0D1F24] p-6 text-left sm:p-8 lg:border-l lg:border-t-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#E8563A]">
                      Revenue leak example
                    </p>
                    <h4 className="mt-2 text-2xl font-bold text-white">
                      ₹7.5L/month can disappear from weak follow-up
                    </h4>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      Example
                    </p>
                    <p className="text-sm font-bold text-white">₹25k/deal</p>
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  {lossExample.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-white/75">
                          {item.label}
                        </p>
                        <p className="text-sm font-bold text-white">
                          {item.display}
                        </p>
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

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white/70">
                      30 lost warm leads × ₹25,000
                    </p>
                    <p className="text-xl font-black text-white">₹7,50,000</p>
                  </div>

                  <div className="mt-3 h-px bg-white/10" />

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-white/70">
                      Possible yearly leak
                    </p>
                    <p className="text-xl font-black text-[#E8563A]">
                      ₹90,00,000
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/45">
                  This is an illustrative model, not an industry-wide guarantee:
                  300 leads, 20% warm, 50% of warm leads lost due to weak
                  follow-up, ₹25,000 average deal value.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-[#FFFBF5] px-6 py-4 text-center sm:px-8">
              <p className="text-sm font-semibold text-[#1A2E35]">
                The problem is not always lack of leads. It is losing the leads
                you already paid for.
              </p>
            </div>
          </div>

          <h2 className="mt-16 text-4xl font-bold tracking-tight text-[#1A2E35] sm:text-5xl">
            AGE isn't a CRM.{" "}
            <span className="text-[#0F5E6E]">It's a closer.</span>
          </h2>

          <p className="mt-4 text-lg text-[#6B7280]">
            Traditional CRMs help you organize leads. AGE helps you convert them.
          </p>
        </div>

        {/* Comparison card */}
        <div
          ref={cardRef}
          style={{
            opacity: cardInView ? 1 : 0,
            transform: cardInView ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
          className="mt-16 overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="grid sm:grid-cols-2">
            {/* Old way */}
            <div className="border-b border-slate-200 bg-slate-50 p-8 sm:border-b-0 sm:border-r">
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
            <div className="bg-white p-8">
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

          {/* Bottom bar */}
          <div className="border-t border-slate-200 bg-[#0F5E6E] px-8 py-4 text-center">
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