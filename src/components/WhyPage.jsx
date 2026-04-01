import React from "react";

const WhyAGE = () => {
  const points = [
    {
      title: "Most CRMs track leads. AGE follows up.",
      description:
        "Traditional CRMs help you organize contacts and pipeline stages. AGE goes further by helping make sure leads are actually contacted again and again until they convert or clearly drop off.",
    },
    {
      title: "Less complexity, more execution",
      description:
        "Businesses often pay for CRMs packed with dashboards, tabs, and workflows they never fully use. AGE keeps the system focused on what drives revenue: consistent outreach and visibility.",
    },
    {
      title: "Built for teams that lose leads to inconsistency",
      description:
        "When sales teams get busy, follow-ups slow down. AGE helps remove that inconsistency by making outreach more structured, repeatable, and easier to manage.",
    },
    {
      title: "Clearer outcomes at a glance",
      description:
        "With simple status tracking like interested, not interested, and no response, AGE helps teams quickly understand where every lead stands and what needs to happen next.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Why AGE Beats Traditional CRMs
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Traditional CRMs help you manage leads. AGE helps you convert them.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAGE;