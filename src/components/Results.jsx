import React from "react";

const Results = () => {
  const results = [
    {
      title: "More replies",
      description:
        "Faster and consistent follow-ups lead to more conversations with potential customers.",
    },
    {
      title: "Better-qualified leads",
      description:
        "Quickly identify who’s interested, who’s not, and where to focus your time.",
    },
    {
      title: "More closed deals",
      description:
        "Consistency compounds — more conversations turn into more revenue over time.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            What This Means For You
          </h2>

          <p className="mt-6 text-2xl font-semibold text-slate-900 sm:text-3xl">
            One extra deal pays for AGE for a year.
          </p>

          <p className="mt-3 text-base text-slate-600">
            Consistent follow-ups = more conversations = more revenue.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {results.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;