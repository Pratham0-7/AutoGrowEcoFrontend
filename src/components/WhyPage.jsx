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

const oldWay = [
  "Tracks contacts. Doesn't follow up for you.",
  "Complex dashboards and workflows you never fully use.",
  "Follow-ups slow down when your team gets busy.",
  "Lead status buried inside pipeline stages nobody checks.",
];

const ageWay = [
  "Automatically follows up until they reply — or say no.",
  "Simple, focused on one thing: consistent outreach.",
  "Runs on a schedule. Never misses a touch, ever.",
  "Clear Yes / No / Pending on every lead at a glance.",
];

const WhyAGE = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [cardRef, cardInView] = useInView(0.1);
  const [featRef, featInView] = useInView(0.1);

  return (
    <section className="relative bg-white py-24 sm:py-32">
      {/* Top separator from dark section */}
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
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Why AGE
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            AGE isn't a CRM.{" "}
            <span className="text-violet-600">It's a closer.</span>
          </h2>

          <p className="mt-4 text-lg text-slate-500">
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
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-slate-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AGE way */}
            <div className="bg-white p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                  <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                  With AGE
                </p>
              </div>

              <ul className="space-y-4">
                {ageWay.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 bg-violet-600 px-8 py-4 text-center">
            <p className="text-sm font-medium text-white">
              AGE replaces the follow-up part of your CRM — and actually does it.
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

export default WhyAGE;
