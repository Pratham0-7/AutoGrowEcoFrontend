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
    if (status === "email sent") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === "sms sent") return "bg-violet-50 text-violet-700 border border-violet-200";
    if (status === "both sent") return "bg-slate-900 text-white border border-slate-900";
    return "bg-slate-100 text-slate-500 border border-slate-200";
  };

  const getResponseStatusStyle = (status) => {
    if (status === "yes") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "no") return "bg-rose-50 text-rose-700 border border-rose-200";
    return "bg-amber-50 text-amber-700 border border-amber-200";
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
              updated[lead._id] = { channel: "email", interval_days: 2 };
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

    const handleFocus = () => fetchLeads();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isLoaded, isSignedIn, company_id, user_id]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) { alert("Please select a file"); return; }
    if (!company_id || !user_id) { alert("Missing login details. Please log in again."); return; }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", company_id);
    formData.append("user_id", user_id);

    try {
      const res = await fetch(`${API_BASE_URL}/upload_leads`, { method: "POST", body: formData });
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
    if (!company_id) { alert("Missing company details. Please log in again."); return; }
    if (!messageTemplate.trim()) { alert("Please generate or enter a message first."); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/send_bulk/${company_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        if (data.failed?.length) console.log("Failed sends:", data.failed);
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
      [leadId]: { ...prev[leadId], [field]: value },
    }));
  };

  const handleStartFollowup = async (leadId) => {
    const leadConfig = leadSchedules[leadId] || {};

    if (!messageTemplate.trim()) { alert("Please enter message template"); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/start_followup/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          message: messageTemplate,
          channel: leadConfig.channel || "email",
          interval_days: Number(leadConfig.interval_days || 2),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Follow-ups started");
        fetchLeads();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start follow-up");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  // Stat computations
  const totalLeads = leads.length;
  const sentLeads = leads.filter((l) => l.send_status && l.send_status !== "not sent").length;
  const yesLeads = leads.filter((l) => l.response_status === "yes").length;
  const pendingLeads = leads.filter(
    (l) => !l.response_status || l.response_status === "pending" || l.response_status === "no reply"
  ).length;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm text-slate-600 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white text-xs font-bold tracking-tight shrink-0">
                AGE
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-slate-400 font-medium">Salesperson</p>
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {company_name || "Your Workspace"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">Live</span>
              </div>
              <span className="hidden sm:block text-sm text-slate-500">Hi, <span className="font-semibold text-slate-900">{name}</span></span>
              <div className="rounded-full ring-2 ring-slate-100">
                <UserButton />
              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* Stat cards — only visible once leads exist */}
        {leads.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Total Leads</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{totalLeads}</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">Sent</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{sentLeads}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Replied Yes</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{yesLeads}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{pendingLeads}</p>
            </div>
          </div>
        )}

        {/* Upload Leads */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Upload Leads</h2>
              <p className="text-xs text-slate-400">CSV or Excel files</p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleUpload} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 file:shadow-sm hover:file:bg-slate-50 transition"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Upload
              </button>
            </form>

            {duplicateWarnings.length > 0 && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold text-amber-800">Duplicate Leads Found</h3>
                <p className="mt-0.5 text-xs text-amber-600">These were already uploaded earlier.</p>
                <div className="mt-3 space-y-2">
                  {duplicateWarnings.map((duplicate, index) => (
                    <div key={index} className="rounded-lg border border-amber-100 bg-white p-3">
                      <div className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-700">
                        <p><span className="font-semibold">Name:</span> {duplicate.name || "-"}</p>
                        <p><span className="font-semibold">Email:</span> {duplicate.email || "-"}</p>
                        <p><span className="font-semibold">Phone:</span> {duplicate.phone || "-"}</p>
                        <p className="font-medium text-amber-700">Uploaded by: {duplicate.already_uploaded_by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Setup */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
              <svg className="h-4 w-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Campaign Setup</h2>
              <p className="text-xs text-slate-400">Message, subject, and timing</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Message Template
              </label>
              <textarea
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Write your message here. Use {{name}} to personalize."
                className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-col gap-4 pt-1 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:max-w-xs">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Follow-up Gap
                </label>
                <select
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                >
                  {[2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>{d} days</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  onClick={() => handleBulkSend("email")}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Send Email to All
                </button>
                <button
                  onClick={() => handleBulkSend("sms")}
                  className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
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

        {/* Leads Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Your Leads</h2>
                <p className="text-xs text-slate-400">Track delivery, replies, and follow-up progress</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Yes
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span> Pending
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> No
              </div>
            </div>
          </div>

          <div className="p-6">
            {leads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <p className="text-sm font-medium text-slate-400">No leads uploaded yet</p>
                <p className="mt-1 text-xs text-slate-300">Upload a CSV or Excel file above to get started</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto rounded-xl border border-slate-200 lg:block">
                  <table className="w-full min-w-275 text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="whitespace-nowrap px-5 py-3.5">Name</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Email</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Phone</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Sent Via</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Reply</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Follow-ups</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Last Follow-up</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Next Follow-up</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Channel</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Gap</th>
                        <th className="whitespace-nowrap px-5 py-3.5">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {leads.map((lead) => (
                        <tr key={lead._id} className="transition-colors hover:bg-slate-50">
                          <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                            {lead.name || "-"}
                          </td>
                          <td className="px-5 py-4 text-slate-500">{lead.email || "-"}</td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-500">{lead.phone || "-"}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getSendStatusStyle(lead.send_status)}`}>
                              {lead.send_status || "not sent"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getResponseStatusStyle(lead.response_status)}`}>
                              {lead.response_status || "pending"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                            {lead.followup_count || 0}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                            {formatDate(lead.last_followup_sent_at)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                            {formatDate(lead.next_followup_at)}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={leadSchedules[lead._id]?.channel || "email"}
                              onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                              className="min-w-25 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                            >
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                              <option value="both">Both</option>
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={leadSchedules[lead._id]?.interval_days || 2}
                              onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                              className="min-w-25 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none transition focus:border-violet-400 focus:ring-1 focus:ring-violet-100"
                            >
                              {[2, 3, 4, 5, 6, 7].map((d) => (
                                <option key={d} value={d}>{d} days</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => handleStartFollowup(lead._id)}
                              className="inline-flex whitespace-nowrap items-center justify-center rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                            >
                              Start Follow-ups
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="grid gap-3 lg:hidden">
                  {leads.map((lead) => (
                    <div key={lead._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{lead.name || "-"}</h3>
                          <p className="mt-0.5 text-xs text-slate-500">{lead.email || "-"}</p>
                          <p className="text-xs text-slate-500">{lead.phone || "-"}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getSendStatusStyle(lead.send_status)}`}>
                            {lead.send_status || "not sent"}
                          </span>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getResponseStatusStyle(lead.response_status)}`}>
                            {lead.response_status || "pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <p className="text-xs text-slate-400">Follow-ups</p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-900">{lead.followup_count || 0}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <p className="text-xs text-slate-400">Last</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-900">{formatDate(lead.last_followup_sent_at)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <p className="text-xs text-slate-400">Next</p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-900">{formatDate(lead.next_followup_at)}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={leadSchedules[lead._id]?.channel || "email"}
                            onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none"
                          >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="both">Both</option>
                          </select>
                          <select
                            value={leadSchedules[lead._id]?.interval_days || 2}
                            onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none"
                          >
                            {[2, 3, 4, 5, 6, 7].map((d) => (
                              <option key={d} value={d}>{d} days</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleStartFollowup(lead._id)}
                          className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                        >
                          Start Follow-ups
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

      {/* AI floating button */}
      <button
        onClick={() => setIsAIAssistOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        aria-label="Open AI Assistant"
        title="Open AI Assistant"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </button>

      <AIMessageBox isOpen={isAIAssistOpen} onClose={() => setIsAIAssistOpen(false)} />
    </div>
  );
};

export default Dashboard;