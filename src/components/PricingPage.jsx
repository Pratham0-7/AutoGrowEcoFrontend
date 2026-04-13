import Navbar from "./Navbar";
import Pricing from "./Pricing";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative bg-[#1A2E35]">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5E6E] text-xs font-bold text-white">
              AGE
            </div>
            <span className="text-sm font-semibold text-white">Automated Growth Ecosystem</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/60">
            <button onClick={() => navigate("/")} className="transition hover:text-white">Home</button>
            <button onClick={() => navigate("/sign-up")} className="transition hover:text-white">Get Started</button>
            <button onClick={() => window.open("https://calendly.com/076pandeypratham/30min", "_blank")} className="transition hover:text-white">Book a Demo</button>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Automated Growth Ecosystem. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const PricingPage = () => {
  return (
    <div className="bg-[#FFFBF5] text-[#1A2E35]">
      <Navbar />
      <main>
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
