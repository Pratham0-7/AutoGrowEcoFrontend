import React, { useEffect, useState } from "react";
import AIMessageBox from "./AIMessageBox";
import { useUser, UserButton } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [file, setFile] = useState(null);
  const [leads, setLeads] = useState([]);
  const [intervalDays, setIntervalDays] = useState(2);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [emailSubject, setEmailSubject] = useState("Follow-up from AGE");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [leadSchedules, setLeadSchedules] = useState({});

  const company_id = localStorage.getItem("company_id");
  const user_id = localStorage.getItem("user_id");
  const company_name = localStorage.getItem("company_name");

  const name =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const sortLeads = (leadArray) => {
    const responseOrder = {
      yes: 1,
      pending: 2,
      "no reply": 2,
      no: 3,
    };

    return [...leadArray].sort((a, b) => {
      return (
        (responseOrder[a.response_status] || 99) -
        (responseOrder[b.response_status] || 99)
      );
    });
  };

  const getSendStatusStyle = () =>
    "bg-slate-100 text-slate-700 border border-slate-200";

  const getResponseStatusStyle = (status) => {
    if (status === "yes") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    if (status === "no") {
      return "bg-rose-50 text-rose-700 border border-rose-200";
    }
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_leads/${company_id}`);
      const data = await res.json();

      if (res.ok) {
        const sortedLeads = sortLeads(data);
        setLeads(sortedLeads);

        setLeadSchedules((prev) => {
          const updated = { ...prev };

          sortedLeads.forEach((lead) => {
            if (!updated[lead._id]) {
              updated[lead._id] = {
                channel: "email",
                interval_days: 2,
              };
            }
          });

          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetchLeads();
  }, [isLoaded, isSignedIn]);

  const updateLeadSchedule = (leadId, field, value) => {
    setLeadSchedules((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }));
  };

  const handleStartFollowup = async (leadId) => {
    const leadConfig = leadSchedules[leadId] || {};

    await fetch(`${API_BASE_URL}/start_followup/${leadId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: emailSubject,
        message: messageTemplate,
        channel: leadConfig.channel || "email",
        interval_days: Number(leadConfig.interval_days || 2),
      }),
    });

    fetchLeads();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6">

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Your Leads</h2>
          <p className="text-sm text-slate-500">
            Track delivery, replies, and follow-up progress.
          </p>

          {leads.length === 0 ? (
            <p className="mt-4 text-slate-500">No leads</p>
          ) : (
            <div className="mt-6 space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">

                    <div>
                      <h3 className="font-semibold">{lead.name}</h3>
                      <p className="text-sm text-slate-600">{lead.email}</p>
                      <p className="text-sm text-slate-600">{lead.phone}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSendStatusStyle()}`}>
                        {lead.send_status || "not sent"}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getResponseStatusStyle(lead.response_status)}`}>
                        {lead.response_status || "pending"}
                      </span>
                    </div>

                  </div>

                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3 text-sm">

                    <div>
                      <p className="text-slate-500">Follow-ups</p>
                      <p>{lead.followup_count || 0}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Last</p>
                      <p>{formatDate(lead.last_followup_sent_at)}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Next</p>
                      <p>{formatDate(lead.next_followup_at)}</p>
                    </div>

                    <select
                      value={leadSchedules[lead._id]?.channel || "email"}
                      onChange={(e) =>
                        updateLeadSchedule(lead._id, "channel", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1"
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="both">Both</option>
                    </select>

                    <select
                      value={leadSchedules[lead._id]?.interval_days || 2}
                      onChange={(e) =>
                        updateLeadSchedule(
                          lead._id,
                          "interval_days",
                          Number(e.target.value)
                        )
                      }
                      className="border rounded-lg px-2 py-1"
                    >
                      <option value={2}>2 days</option>
                      <option value={3}>3 days</option>
                      <option value={4}>4 days</option>
                      <option value={5}>5 days</option>
                      <option value={6}>6 days</option>
                      <option value={7}>7 days</option>
                    </select>

                  </div>

                  <button
                    onClick={() => handleStartFollowup(lead._id)}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg"
                  >
                    Start Follow-ups
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <button
        onClick={() => setIsAIAssistOpen(true)}
        className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-full"
      >
        AI
      </button>

      <AIMessageBox
        isOpen={isAIAssistOpen}
        onClose={() => setIsAIAssistOpen(false)}
      />
    </div>
  );
};

export default Dashboard;