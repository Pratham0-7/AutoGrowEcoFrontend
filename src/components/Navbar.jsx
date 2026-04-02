import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group"
        >
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

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/sign-in")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              scrolled
                ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/sign-up")}
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
    </div>
  );
};

export default Navbar;