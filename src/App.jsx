import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";
import BookDemo from "./components/BookDemo";
import AdminDashboard from "./components/AdminDashboard";
import PricingPage from "./components/PricingPage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Shared hook ──────────────────────────────────────────────────────────────
// Syncs with backend and returns the user's current state.

function useUserStatus() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState({
    approved: false,
    onboardingCompleted: false,
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setChecking(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sync_clerk_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerk_user_id: user.id,
            name: user.fullName || user.firstName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
          }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("user_id", data.user_id || "");
          localStorage.setItem("company_id", data.company_id || "");
          localStorage.setItem("name", data.name || "");
          localStorage.setItem("company_name", data.company_name || "");
          setStatus({
            approved: !!data.approved,
            onboardingCompleted: !!data.onboarding_completed,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    })();
  }, [isLoaded, isSignedIn, user]);

  return { isLoaded, isSignedIn, checking, ...status };
}

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-white text-sm">
    Loading…
  </div>
);

// ── Route guards ─────────────────────────────────────────────────────────────

/**
 * /book-demo — shown to every new user right after Clerk sign-up.
 * Stays here until admin approves. Once approved, forwards to /onboarding.
 */
const ProtectedBookDemo = () => {
  const { isLoaded, isSignedIn, checking, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (approved && onboardingCompleted) return <Navigate to="/dashboard" replace />;
  if (approved) return <Navigate to="/onboarding" replace />;
  return <BookDemo />;
};

/**
 * /onboarding — full account setup (company details, MSG91, etc.).
 * Only accessible after admin approval.
 */
const ProtectedOnboarding = () => {
  const { isLoaded, isSignedIn, checking, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!approved) return <Navigate to="/book-demo" replace />;
  if (onboardingCompleted) return <Navigate to="/dashboard" replace />;
  return <Onboarding />;
};

/**
 * /dashboard — main app.
 * Requires both admin approval and completed onboarding.
 * Also handles post-sign-in routing for returning users.
 */
const ProtectedDashboard = () => {
  const { isLoaded, isSignedIn, checking, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!approved) return <Navigate to="/book-demo" replace />;
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return <Dashboard />;
};

// ── App ───────────────────────────────────────────────────────────────────────

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/sign-in/*"
        element={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <SignIn routing="path" path="/sign-in" />
          </div>
        }
      />

      <Route
        path="/sign-up/*"
        element={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <SignUp routing="path" path="/sign-up" />
          </div>
        }
      />

      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/book-demo" element={<ProtectedBookDemo />} />
      <Route path="/onboarding" element={<ProtectedOnboarding />} />
      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
