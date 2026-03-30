import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Onboarding from "./components/Onboarding";

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

      <Route
        path="/onboarding"
        element={
          <>
            <SignedIn>
              <Onboarding />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />

      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default App;