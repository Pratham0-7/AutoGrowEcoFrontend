import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";
import RegisterDetails from "./components/RegisterDetails";
import BookDemo from "./components/BookDemo";
import AdminDashboard from "./components/AdminDashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Shared hook ─────────────────────────────────────────────────────────────

function useUserStatus() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState({
    detailsSubmitted: false,
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
            detailsSubmitted: !!data.details_submitted,
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
 * /register-details — first step after sign-up
 * Accessible only when details have NOT been submitted yet.
 */
const ProtectedRegisterDetails = () => {
  const { isLoaded, isSignedIn, checking, detailsSubmitted, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (detailsSubmitted && !approved) return <Navigate to="/book-demo" replace />;
  if (approved && !onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (approved && onboardingCompleted) return <Navigate to="/dashboard" replace />;
  return <RegisterDetails />;
};

/**
 * /book-demo — waiting room after details are submitted, pending admin approval.
 * Accessible only when details_submitted=true AND approved=false.
 */
const ProtectedBookDemo = () => {
  const { isLoaded, isSignedIn, checking, detailsSubmitted, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!detailsSubmitted) return <Navigate to="/register-details" replace />;
  if (approved && !onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (approved && onboardingCompleted) return <Navigate to="/dashboard" replace />;
  return <BookDemo />;
};

/**
 * /onboarding — full account setup (MSG91, sender email/phone, company creation).
 * Accessible only after admin approval AND before onboarding is completed.
 */
const ProtectedOnboarding = () => {
  const { isLoaded, isSignedIn, checking, detailsSubmitted, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!detailsSubmitted) return <Navigate to="/register-details" replace />;
  if (!approved) return <Navigate to="/book-demo" replace />;
  if (onboardingCompleted) return <Navigate to="/dashboard" replace />;
  return <Onboarding />;
};

/**
 * /dashboard — main app.
 * Accessible only when approved AND onboarding is completed.
 * Also acts as the post-sign-in landing, routing users to the right step.
 */
const ProtectedDashboard = () => {
  const { isLoaded, isSignedIn, checking, detailsSubmitted, approved, onboardingCompleted } = useUserStatus();
  if (!isLoaded || checking) return <Loader />;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (!detailsSubmitted) return <Navigate to="/register-details" replace />;
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

      <Route path="/register-details" element={<ProtectedRegisterDetails />} />
      <Route path="/book-demo" element={<ProtectedBookDemo />} />
      <Route path="/onboarding" element={<ProtectedOnboarding />} />
      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
