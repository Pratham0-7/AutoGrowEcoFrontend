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

  const getSendStatusStyle = (status) => {
    if (status === "email sent") {
      return "bg-slate-100 text-slate-700 border border-slate-200";
    }
    if (status === "sms sent") {
      return "bg-slate-100 text-slate-700 border border-slate-200";
    }
    if (status === "both sent") {
      return "bg-slate-900 text-white border border-slate-900";
    }
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

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
                scheduled_for: "",
              };
            }
          });

          return updated;
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leads");
    }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!company_id || !user_id) return;

    fetchLeads();

    const interval = setInterval(() => {
      fetchLeads();
    }, 3000);

    const handleFocus = () => {
      fetchLeads();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLoaded, isSignedIn, company_id, user_id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (!company_id || !user_id) {
      alert("Missing login details. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", company_id);
    formData.append("user_id", user_id);

    try {
      const res = await fetch(`${API_BASE_URL}/upload_leads`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setDuplicateWarnings(data.duplicates || []);
        setFile(null);
        fetchLeads();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  const handleBulkSend = async (type) => {
    if (!company_id) {
      alert("Missing company details. Please log in again.");
      return;
    }

    if (!messageTemplate.trim()) {
      alert("Please generate or enter a message first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/send_bulk/${company_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          interval_days: Number(intervalDays),
          subject: emailSubject,
          message: messageTemplate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        if (data.failed?.length) {
          console.log("Failed sends:", data.failed);
        }
        fetchLeads();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Bulk send failed");
    }
  };

  const updateLeadSchedule = (leadId, field, value) => {
    setLeadSchedules((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }));
  };

  const handleSingleSchedule = async (leadId) => {
    const leadConfig = leadSchedules[leadId] || {};

    if (!messageTemplate.trim()) {
      alert("Please generate or enter a message first.");
      return;
    }

    if (!leadConfig.channel) {
      alert("Please select a channel.");
      return;
    }

    if (!leadConfig.scheduled_for) {
      alert("Please select date and time for this lead.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/schedule_single/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: emailSubject,
          message: messageTemplate,
          channel: leadConfig.channel,
          scheduled_for: leadConfig.scheduled_for,
          interval_days: Number(intervalDays),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        setLeadSchedules((prev) => ({
          ...prev,
          [leadId]: {
            ...prev[leadId],
            scheduled_for: "",
          },
        }));

        fetchLeads();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Single lead scheduling failed");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
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

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">AGE Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {name}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {company_name
                  ? `Manage leads, campaigns, and follow-ups for ${company_name}.`
                  : "Manage your leads, campaigns, and follow-ups in one place."}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Live lead tracking
              </div>
              <div className="rounded-full ring-4 ring-slate-100">
                <UserButton />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold sm:text-xl">Upload Leads</h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload CSV or Excel files to add new leads into your workspace.
              </p>
            </div>

            <form
              onSubmit={handleUpload}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Upload Leads
              </button>
            </form>

            {duplicateWarnings.length > 0 && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-base font-semibold text-amber-800">
                  Duplicate Leads Found
                </h3>
                <p className="mt-1 text-sm text-amber-700">
                  These leads were already uploaded earlier.
                </p>

                <div className="mt-4 space-y-3">
                  {duplicateWarnings.map((duplicate, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-amber-200 bg-white p-4"
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">
                            Name:
                          </span>{" "}
                          {duplicate.name || "-"}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">
                            Email:
                          </span>{" "}
                          {duplicate.email || "-"}
                        </p>
                        <p className="text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">
                            Phone:
                          </span>{" "}
                          {duplicate.phone || "-"}
                        </p>
                        <p className="text-sm font-medium text-amber-700">
                          Already uploaded by: {duplicate.already_uploaded_by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold sm:text-xl">Campaign Setup</h2>
              <p className="mt-1 text-sm text-slate-500">
                Set your subject, message, and follow-up timing before sending.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message Template
                </label>
                <textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Write or paste your message template here. Use {{name}} for personalization."
                  className="min-h-[180px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="w-full lg:max-w-xs">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Follow-up Gap
                  </label>
                  <select
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                    <option value={6}>6 days</option>
                    <option value={7}>7 days</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => handleBulkSend("email")}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Send Email to All
                  </button>

                  <button
                    onClick={() => handleBulkSend("sms")}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Send SMS to All
                  </button>

                  <button
                    onClick={() => handleBulkSend("both")}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Send Both
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">Your Leads</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track delivery, replies, and follow-up progress.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span>Yes</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-slate-400"></span>
                  <span>No Reply / Pending</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-rose-500"></span>
                  <span>No</span>
                </div>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                No leads uploaded yet.
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 lg:block">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-slate-600">
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Phone</th>
                        <th className="px-4 py-3 font-semibold">Sent Via</th>
                        <th className="px-4 py-3 font-semibold">Receiver Reply</th>
                        <th className="px-4 py-3 font-semibold">Follow-ups</th>
                        <th className="px-4 py-3 font-semibold">Last Follow-up</th>
                        <th className="px-4 py-3 font-semibold">Next Follow-up</th>
                        <th className="px-4 py-3 font-semibold">Channel</th>
                        <th className="px-4 py-3 font-semibold">Schedule At</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">
                            {lead.name || "-"}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {lead.email || "-"}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {lead.phone || "-"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSendStatusStyle(
                                lead.send_status
                              )}`}
                            >
                              {lead.send_status || "not sent"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getResponseStatusStyle(
                                lead.response_status
                              )}`}
                            >
                              {lead.response_status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {lead.followup_count || 0}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {formatDate(lead.last_followup_sent_at)}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {formatDate(lead.next_followup_at)}
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={leadSchedules[lead._id]?.channel || "email"}
                              onChange={(e) =>
                                updateLeadSchedule(lead._id, "channel", e.target.value)
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            >
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                              <option value="both">Both</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="datetime-local"
                              value={leadSchedules[lead._id]?.scheduled_for || ""}
                              onChange={(e) =>
                                updateLeadSchedule(
                                  lead._id,
                                  "scheduled_for",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleSingleSchedule(lead._id)}
                              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                              Schedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 lg:hidden">
                  {leads.map((lead) => (
                    <div
                      key={lead._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {lead.name || "-"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {lead.email || "-"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {lead.phone || "-"}
                          </p>
                        </div>

                        <div className="flex items-end gap-2 sm:flex-col">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSendStatusStyle(
                              lead.send_status
                            )}`}
                          >
                            {lead.send_status || "not sent"}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getResponseStatusStyle(
                              lead.response_status
                            )}`}
                          >
                            {lead.response_status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-slate-500">Follow-ups</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {lead.followup_count || 0}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-slate-500">Last Follow-up</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatDate(lead.last_followup_sent_at)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-slate-500">Next Follow-up</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatDate(lead.next_followup_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <select
                          value={leadSchedules[lead._id]?.channel || "email"}
                          onChange={(e) =>
                            updateLeadSchedule(lead._id, "channel", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="both">Both</option>
                        </select>

                        <input
                          type="datetime-local"
                          value={leadSchedules[lead._id]?.scheduled_for || ""}
                          onChange={(e) =>
                            updateLeadSchedule(
                              lead._id,
                              "scheduled_for",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />

                        <button
                          onClick={() => handleSingleSchedule(lead._id)}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Schedule for This Lead
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsAIAssistOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        aria-label="Open AI Assistant"
        title="Open AI Assistant"
      >
        <span className="text-sm font-semibold sm:text-base">AI</span>
      </button>

      <AIMessageBox
        isOpen={isAIAssistOpen}
        onClose={() => setIsAIAssistOpen(false)}
      />
    </div>
  );
};

export default Dashboard;