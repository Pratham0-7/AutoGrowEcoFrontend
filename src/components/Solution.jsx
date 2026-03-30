import React from "react";

const Solution = () => {
  const features = [
    {
      tag: "Personalization",
      title: "Context-aware messages",
      description:
        "Generate messages that feel personal, not automated — tailored using basic lead data and context.",
    },
    {
      tag: "Automation",
      title: "Multi-channel follow-ups",
      description:
        "Reach leads across SMS and email without manually sending each message.",
    },
    {
      tag: "Tracking",
      title: "Simple lead visibility",
      description:
        "Quickly understand who’s engaged, who needs follow-up, and where to focus next.",
    },
    {
      tag: "Consistency",
      title: "Built-in follow-up system",
      description:
        "Follow-ups happen automatically so no lead gets ignored or forgotten.",
    },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl text-center px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Stay Consistent Without Extra Effort
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            AGE works in the background so your follow-ups don’t depend on memory or manual work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                {item.tag}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;