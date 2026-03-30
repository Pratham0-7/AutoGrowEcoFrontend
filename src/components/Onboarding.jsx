import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const Onboarding = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    sender_email: "",
    sender_phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
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
          localStorage.setItem("user_id", data.user_id);
          localStorage.setItem("company_id", data.company_id || "");
          localStorage.setItem("name", data.name || "");
          localStorage.setItem("company_name", data.company_name || "");

          if (data.onboarding_completed) {
            navigate("/dashboard");
          }
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to sync user");
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/complete_onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerk_user_id: user.id,
          company_name: formData.company_name,
          sender_email: formData.sender_email,
          sender_phone: formData.sender_phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("company_id", data.company_id);
        localStorage.setItem("company_name", data.company_name);
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          
          <div className="hidden border-r border-slate-200 bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">AGE</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Set up your workspace.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Add your business details so AGE can help you send outreach,
                track replies, and automate follow-ups from one place.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">What you’re setting up</p>
                <p className="mt-1 font-semibold text-white">
                  Company identity, sender email, and sender phone
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">What happens next</p>
                <p className="mt-1 font-semibold text-white">
                  Upload leads, create campaigns, and start follow-ups
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <p className="text-sm font-medium text-slate-500">Welcome to AGE</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Complete onboarding
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This only takes a minute. You can always update these details later.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Enter your company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    name="sender_email"
                    placeholder="Enter your sender email"
                    value={formData.sender_email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Sender Phone
                  </label>
                  <input
                    type="text"
                    name="sender_phone"
                    placeholder="Enter your sender phone"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Continue to Dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;