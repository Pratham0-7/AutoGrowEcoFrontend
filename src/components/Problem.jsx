import React from "react";

const Problem = () => {
  const problems = [
    {
      title: "Follow-ups stop too early",
      description:
        "Most leads need multiple touches, but many conversations end after the first message or call.",
    },
    {
      title: "Manual tracking breaks down",
      description:
        "When follow-ups rely on memory, sticky notes, or spreadsheets, leads start slipping through the cracks.",
    },
    {
      title: "No clear lead priority",
      description:
        "Teams often spend the same energy on hot leads, cold leads, and people who were never likely to convert.",
    },
    {
      title: "Speed drops after day one",
      description:
        "The first response is usually quick. After that, consistency fades and buyer intent starts to disappear.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl text-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Why Leads Go Cold
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            It’s rarely a lack of leads. It’s inconsistent follow-up.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;