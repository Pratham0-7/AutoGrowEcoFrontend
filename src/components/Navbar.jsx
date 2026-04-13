import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ variant = "auto" }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (variant === "light") {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isLight = variant === "light" || scrolled;

  const linkCls = `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
    isLight
      ? "text-[#1A2E35] hover:bg-[#0F5E6E]/8 hover:text-[#0F5E6E]"
      : "text-white/70 hover:text-white hover:bg-white/5"
  }`;

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isLight
          ? "border-b border-slate-200 bg-[#FFFBF5]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* Desktop */}
      <div className="mx-auto hidden max-w-7xl grid-cols-3 items-center px-6 py-4 md:grid lg:px-8">
        <div className="flex items-center gap-1">
          <button onClick={() => go("/pricing")} className={linkCls}>
            Pricing
          </button>
        </div>

        <div className="flex justify-center">
          <button onClick={() => go("/")} className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                isLight
                  ? "bg-[#0F5E6E] text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              AGE
            </div>
            <span
              className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
                isLight ? "text-[#1A2E35]" : "text-white"
              }`}
            >
              Automated Growth Ecosystem
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={() => go("/sign-in")} className={linkCls}>
            Login
          </button>

          <button
            onClick={() => go("/sign-up")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              isLight
                ? "bg-[#E8563A] text-white shadow-sm hover:bg-[#d14b30]"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <button onClick={() => go("/")} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
              isLight
                ? "bg-[#0F5E6E] text-white"
                : "bg-white/10 text-white"
            }`}
          >
            AGE
          </div>
          <span
            className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
              isLight ? "text-[#1A2E35]" : "text-white"
            }`}
          >
            Automated Growth Ecosystem
          </span>
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          className={`rounded-lg p-2 transition-colors duration-200 ${
            isLight
              ? "text-[#1A2E35] hover:bg-slate-100"
              : "text-white hover:bg-white/10"
          }`}
        >
          {menuOpen ? (
            <svg
              className="h-5 w-5"
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
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } ${
          isLight
            ? "bg-[#FFFBF5]/95 backdrop-blur-md"
            : "bg-[#1A2E35]/95 backdrop-blur-md"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 pb-5 pt-2">
          <button
            onClick={() => go("/pricing")}
            className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              isLight
                ? "text-[#1A2E35] hover:bg-slate-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            Pricing
          </button>

          <button
            onClick={() => go("/sign-in")}
            className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              isLight
                ? "text-[#1A2E35] hover:bg-slate-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => go("/sign-up")}
            className="mt-1 rounded-xl bg-[#E8563A] px-4 py-2.5 text-left text-sm font-semibold text-white transition hover:bg-[#d14b30]"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;