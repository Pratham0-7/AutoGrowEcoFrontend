import { useEffect, useState } from "react";
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
    // DLT fields — collected now, activated later
    msg91_entity_id: "",
    msg91_sender_id: "",
    msg91_api_key: "",
    msg91_template_id_initial: "",
    msg91_template_id_followup: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/complete_onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_user_id: user.id,
          company_name: formData.company_name,
          sender_email: formData.sender_email,
          sender_phone: formData.sender_phone,
          msg91_entity_id: formData.msg91_entity_id,
          msg91_sender_id: formData.msg91_sender_id,
          msg91_api_key: formData.msg91_api_key,
          msg91_template_id_initial: formData.msg91_template_id_initial,
          msg91_template_id_followup: formData.msg91_template_id_followup,
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

          {/* Left panel */}
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
                <p className="text-sm text-slate-300">What you're setting up</p>
                <p className="mt-1 font-semibold text-white">
                  Company identity, sender email, sender phone, and SMS compliance
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">What happens next</p>
                <p className="mt-1 font-semibold text-white">
                  Upload leads, create campaigns, and start follow-ups
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  DLT Compliant
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  We collect your TRAI DLT details upfront so SMS outreach is
                  compliant and ready when you are.
                </p>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <p className="text-sm font-medium text-slate-500">Welcome to AGE</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Complete onboarding
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This only takes a minute. You can always update these details later.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {/* ── Core details ── */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="Your company name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
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
                    placeholder="hello@yourcompany.com"
                    value={formData.sender_email}
                    onChange={handleChange}
                    required
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
                    placeholder="+91 98765 43210"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {/* ── DLT / SMS compliance section (disabled — coming soon) ── */}
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        SMS Compliance (DLT)
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Required by TRAI for bulk SMS in India via MSG91
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      Optional for now
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Principal Entity ID
                        <span className="ml-1 text-slate-400">(from TRAI DLT portal)</span>
                      </label>
                      <input
                        type="text"
                        name="msg91_entity_id"
                        placeholder="e.g. 1234567890123456"
                        value={formData.msg91_entity_id}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Sender ID / Header
                        <span className="ml-1 text-slate-400">(6-char, e.g. AGEATM)</span>
                      </label>
                      <input
                        type="text"
                        name="msg91_sender_id"
                        placeholder="AGEATM"
                        value={formData.msg91_sender_id}
                        onChange={handleChange}
                        maxLength={6}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        MSG91 API Key
                      </label>
                      <input
                        type="password"
                        name="msg91_api_key"
                        placeholder="Your MSG91 auth key"
                        value={formData.msg91_api_key}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Initial Message Template ID
                        </label>
                        <input
                          type="text"
                          name="msg91_template_id_initial"
                          placeholder="DLT template ID"
                          value={formData.msg91_template_id_initial}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          Follow-up Template ID
                        </label>
                        <input
                          type="text"
                          name="msg91_template_id_followup"
                          placeholder="DLT template ID"
                          value={formData.msg91_template_id_followup}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    We'll activate SMS once your DLT registration is verified. You can fill these in now or later.
                  </p>
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
