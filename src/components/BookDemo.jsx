import { useClerk } from "@clerk/clerk-react";

export default function BookDemo() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Automated Growth Ecosystem</p>
        <h1 className="mt-3 text-3xl font-bold text-white">You're on the list</h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Your account is pending approval. Our team will review your details and activate your account shortly.
          <br className="hidden sm:block" />
          In the meantime, book a demo to see AutoGrowth Eco in action.
        </p>

        {/* Status badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-800 bg-amber-950 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-400">Pending Approval</span>
        </div>

        {/* Book a demo CTA */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-base font-semibold text-white">Book a Demo</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            See how AutoGrowth Eco can automate your lead outreach and follow-ups.
          </p>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Schedule a call
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-600">
          You'll receive an email once your account is approved and ready to use.
        </p>

        <button
          onClick={() => signOut()}
          className="mt-8 text-xs text-slate-600 hover:text-slate-400 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
