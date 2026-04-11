import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const linkCls = `rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${
    scrolled
      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? "border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
        : "border-b border-white/10 bg-transparent"
    }`}>

      {/* ── Desktop bar ── */}
      <div className="mx-auto hidden max-w-7xl grid-cols-3 items-center px-6 py-4 md:grid lg:px-8">

        {/* Left — nav links */}
        <div className="flex items-center gap-1">
          <button onClick={() => go("/pricing")} className={linkCls}>
            Pricing
          </button>
        </div>

        {/* Center — logo */}
        <div className="flex justify-center">
          <button onClick={() => go("/")} className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300 ${
              scrolled ? "bg-violet-600 text-white" : "bg-white/10 text-white"
            }`}>
              AGE
            </div>
            <span className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-slate-900" : "text-white"
            }`}>
              Automated Growth Ecosystem
            </span>
          </button>
        </div>

        {/* Right — auth */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => go("/sign-in")} className={linkCls}>
            Login
          </button>
          <button
            onClick={() => go("/sign-up")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              scrolled
                ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
            }`}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden">

        {/* Logo — left on mobile */}
        <button onClick={() => go("/")} className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300 ${
            scrolled ? "bg-violet-600 text-white" : "bg-white/10 text-white"
          }`}>
            AGE
          </div>
          <span className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
            scrolled ? "text-slate-900" : "text-white"
          }`}>
            Automated Growth Ecosystem
          </span>
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className={`rounded-lg p-2 transition-colors duration-200 ${
            scrolled
              ? "text-slate-600 hover:bg-slate-100"
              : "text-white/70 hover:bg-white/10"
          }`}
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`overflow-hidden transition-all duration-300 md:hidden ${
        menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
      } ${scrolled ? "bg-white/95 backdrop-blur-md" : "bg-slate-950/95 backdrop-blur-md"}`}>
        <div className="flex flex-col gap-1 px-4 pb-5 pt-2">
          <button
            onClick={() => go("/pricing")}
            className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => go("/sign-in")}
            className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white/80 hover:bg-white/10"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => go("/sign-up")}
            className="mt-1 rounded-xl bg-violet-600 px-4 py-2.5 text-left text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Get Started
          </button>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
