const features = [
  {
    label: "Lead Generation",
    description:
      "Automatically source and enrich leads from LinkedIn, websites, and industry directories — no manual research needed.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Automated Calls",
    description:
      "AI-powered voice calls that qualify leads, handle objections, and hand off warm prospects to your team — around the clock.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Client Requisition",
    description:
      "Structured re-engagement flows that bring back past clients — automated nudges, personalised offers, and win-back sequences.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    label: "Auto Meeting Setup",
    description:
      "From first reply to booked call in one step — AGE reads intent, picks the right slot, and sends a confirmed calendar invite automatically.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const FutureFeatures = () => {
  return (
    <section className="relative bg-[#1A2E35] py-24">
      {/* top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-[#0F5E6E]/50 bg-[#0F5E6E]/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#2D8FA2]">
            What's coming
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The full growth stack,{" "}
            <span className="text-[#2D8FA2]">in one place.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-white/50">
            AGE is growing. Here's what we're building next — so you can automate
            every stage of your pipeline, not just follow-ups.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:border-[#0F5E6E]/40 hover:bg-[#0F5E6E]/5"
            >
              {/* Coming soon badge */}
              <div className="absolute right-4 top-4">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Soon
                </span>
              </div>

              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#0F5E6E]/30 bg-[#0F5E6E]/15 text-[#2D8FA2] transition group-hover:border-[#0F5E6E]/50 group-hover:bg-[#0F5E6E]/25">
                {f.icon}
              </div>

              {/* Text */}
              <div>
                <p className="font-semibold text-white">{f.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/50">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-xs text-white/25">
          Features are built based on what our users need most. Got a request?{" "}
          <a
            href="/schedule"
            className="text-white/40 underline underline-offset-2 transition hover:text-white/70"
          >
            Talk to us.
          </a>
        </p>
      </div>
    </section>
  );
};

export default FutureFeatures;
