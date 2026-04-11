import { useEffect, useRef, useState } from "react";

const useInView = (threshold = 0.12) => {
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

const CheckIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const plans = [
  {
    name: "Solo",
    price: "$59",
    period: "/month",
    commitment: "3 month minimum",
    tagline: "For small teams just getting started with follow-up automation.",
    popular: false,
    accent: "violet",
    features: [
      "Up to 500 contacts",
      "2 users",
      "1 active sequence",
      "Pre-built follow-up templates",
      "AI message generation",
      "Email + SMS",
      "Basic dashboard",
      "Standard support",
    ],
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    commitment: "3 month minimum",
    tagline: "For growing teams who want full control over their follow-up pipeline.",
    popular: true,
    accent: "violet",
    features: [
      "Up to 2,000 contacts",
      "5 users",
      "5 active sequences",
      "Pre-built + customizable templates",
      "AI message generation",
      "Email + SMS",
      "Full pipeline dashboard",
      "Sequence analytics",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: "$299",
    period: "/month",
    commitment: "6 month minimum",
    tagline: "For agencies managing multiple clients and high lead volumes.",
    popular: false,
    accent: "blue",
    features: [
      "Unlimited contacts",
      "15 users",
      "Unlimited sequences",
      "Full template access + build your own",
      "AI message generation",
      "Email + SMS",
      "Multi-client dashboard",
      "Advanced analytics",
      "Dedicated support",
    ],
  },
];

const accentMap = {
  violet: {
    badge: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    check: "text-violet-400",
    border: "border-violet-500/30",
    glow: "bg-violet-600/10",
    cta: "bg-violet-600 hover:bg-violet-500 shadow-violet-900/40",
    ctaOutline: "border-violet-500/30 text-violet-300 hover:bg-violet-500/10",
  },
  blue: {
    badge: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    check: "text-blue-400",
    border: "border-blue-500/30",
    glow: "bg-blue-600/10",
    cta: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40",
    ctaOutline: "border-blue-500/30 text-blue-300 hover:bg-blue-500/10",
  },
};

const PlanCard = ({ plan, delay }) => {
  const [ref, inView] = useInView();
  const a = accentMap[plan.accent];

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className={`relative flex flex-col rounded-2xl border p-7 ${
        plan.popular
          ? "border-violet-500/40 bg-violet-600/10"
          : "border-white/5 bg-white/3"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-violet-900/30">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name */}
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">{plan.name}</p>

      {/* Price */}
      <p className="mt-3 text-xs font-medium uppercase tracking-widest text-slate-500">Starting at</p>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-5xl font-black text-white">{plan.price}</span>
        <span className="mb-1.5 text-base text-slate-400">{plan.period}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{plan.commitment}</p>

      {/* Tagline */}
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{plan.tagline}</p>

      {/* Divider */}
      <div className="my-6 h-px bg-white/5" />

      {/* Features */}
      <ul className="flex flex-col gap-2.5">
        {plan.features.map((f, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-sm text-slate-300 ${a.check}`}>
            <span className={`mt-0.5 ${a.check}`}><CheckIcon /></span>
            <span className="text-slate-300">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
        className={`mt-8 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 shadow-lg ${
          plan.popular
            ? `${a.cta}`
            : `border ${a.ctaOutline} bg-transparent`
        }`}
      >
        Book a Demo
      </button>
    </div>
  );
};

const Pricing = () => {
  const [headerRef, headerInView] = useInView(0.2);
  const [addonRef, addonInView] = useInView(0.2);
  const [noteRef, noteInView] = useInView(0.2);

  return (
    <section className="relative bg-slate-950 py-24 sm:py-32">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute right-0 bottom-1/3 h-72 w-72 rounded-full bg-blue-600/8 blur-3xl" />
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
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Simple pricing.{" "}
            <span className="text-violet-400">No surprises.</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Every plan includes a full onboarding session. We handle the setup. You focus on closing.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} delay={i * 100} />
          ))}
        </div>

        {/* WhatsApp Add-on */}
        <div
          ref={addonRef}
          style={{
            opacity: addonInView ? 1 : 0,
            transform: addonInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
          className="mt-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5"
        >
          <div className="flex flex-col items-start gap-5 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              {/* WhatsApp icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">WhatsApp Add-on</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  Add WhatsApp to any plan and follow up on the most personal channel your leads use.{" "}
                  <span className="text-slate-500">Available on all plans.</span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-black text-white">$35</p>
                <p className="text-xs text-slate-500">/month</p>
              </div>
              <button
                onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Add to Plan
              </button>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div
          ref={noteRef}
          style={{
            opacity: noteInView ? 1 : 0,
            transition: "opacity 0.6s ease 0.2s",
          }}
          className="mt-8 text-center text-xs leading-relaxed text-slate-600"
        >
          All plans include a 10-day onboarding session where we handle DLT registration, channel setup, and sequence configuration.{" "}
          Pricing shown in USD.{" "}
          <button
            onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")}
            className="text-slate-400 underline underline-offset-2 transition hover:text-white"
          >
            Book a demo
          </button>{" "}
          to discuss your specific requirements and volume.
        </div>

      </div>
    </section>
  );
};

export default Pricing;
