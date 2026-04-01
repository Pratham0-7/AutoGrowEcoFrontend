import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useUser,
} from "@clerk/clerk-react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [checking, setChecking] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded) return;
      if (!isSignedIn || !user) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/sync_clerk_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
          setOnboardingCompleted(!!data.onboarding_completed);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Dashboard />;
};

const ProtectedOnboarding = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [checking, setChecking] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (!isLoaded) return;
      if (!isSignedIn || !user) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/sync_clerk_user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
          setOnboardingCompleted(!!data.onboarding_completed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Onboarding />;
};

const App = () => {
  return (
    <>
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

        <Route path="/onboarding" element={<ProtectedOnboarding />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
      </Routes>
      <footer className="mt-16 py-8 text-center">
        <p className="text-base font-semibold text-slate-700 tracking-wide">
          Built by Pratham Pandey
        </p>
      </footer>{" "}
    </>
  );
};

export default App;
