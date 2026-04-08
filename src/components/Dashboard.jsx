import React, { useEffect, useState } from "react";
import AIMessageBox from "./AIMessageBox";
import { useUser, UserButton } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const ICONS = {
  upload: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  ai: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  check: "M5 13l4 4L19 7",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0",
  filter: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  plus: "M12 4v16m8-8H4",
  chevronLeft: "M15 19l-7-7 7-7",
  chevronRight: "M9 5l7 7-7 7",
  link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const sortLeads = (arr) => {
  const order = { yes: 1, pending: 2, "no reply": 2, no: 3 };
  return [...arr].sort((a, b) => (order[a.response_status] || 99) - (order[b.response_status] || 99));
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

const AVATAR_COLORS = [
  "#7C3AED","#6366F1","#0EA5E9","#10B981","#F59E0B","#EF4444","#EC4899","#14B8A6",
];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ─── badge helpers ────────────────────────────────────────────────────────────
const SendBadge = ({ status }) => {
  const map = {
    "email sent": { label: "Email", bg: "#1E3A5F", color: "#60A5FA", border: "#2563EB33" },
    "sms sent":   { label: "SMS",   bg: "#2D1B69", color: "#A78BFA", border: "#7C3AED33" },
    "both sent":  { label: "Both",  bg: "#0F172A", color: "#E2E8F0", border: "#334155"   },
  };
  const s = map[status] || { label: "Not Sent", bg: "#1E293B", color: "#64748B", border: "#334155" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">
      {s.label}
    </span>
  );
};

const ReplyBadge = ({ status }) => {
  const map = {
    yes: { label: "Yes", bg: "#052E16", color: "#4ADE80", border: "#16A34A44", dot: "#22C55E" },
    no:  { label: "No",  bg: "#2D0A0A", color: "#F87171", border: "#DC262644", dot: "#EF4444" },
  };
  const s = map[status] || { label: "Pending", bg: "#1C1505", color: "#FCD34D", border: "#D9770644", dot: "#F59E0B" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold">
      <span style={{ background: s.dot }} className="h-1.5 w-1.5 rounded-full" />
      {s.label}
    </span>
  );
};

// ─── stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent, icon, trend }) => (
  <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", border: "1px solid #312E81" }}
    className="rounded-2xl p-5 relative overflow-hidden">
    <div style={{ background: accent, opacity: 0.08, filter: "blur(32px)" }}
      className="absolute -top-4 -right-4 h-24 w-24 rounded-full pointer-events-none" />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>{label}</p>
        <p className="mt-2 text-4xl font-black" style={{ color: "#F1F5F9", fontVariantNumeric: "tabular-nums" }}>{value}</p>
        {trend && <p className="mt-1 text-xs" style={{ color: accent }}>{trend}</p>}
      </div>
      <div style={{ background: accent + "22", color: accent }}
        className="flex h-10 w-10 items-center justify-center rounded-xl">
        <Icon d={icon} size={18} />
      </div>
    </div>
  </div>
);

// ─── Google Sheet Card ────────────────────────────────────────────────────────
const GoogleSheetCard = ({ companyId, userId, apiBase }) => {
  const [sheetUrl, setSheetUrl]     = useState("");
  const [inputUrl, setInputUrl]     = useState("");
  const [status, setStatus]         = useState(null); // { type: "success"|"error", msg }
  const [syncing, setSyncing]       = useState(false);
  const [connected, setConnected]   = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`gsheet_${companyId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConnected(true);
        setSheetUrl(parsed.url || "");
        setInputUrl(parsed.url || "");
        setLastSynced(parsed.lastSynced || null);
      } catch (_) {}
    }
  }, [companyId]);

  // Auto-sync every 20 minutes when connected
  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => handleSync(true), 20 * 60 * 1000);
    return () => clearInterval(iv);
  }, [connected]);

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setStatus({ type: "error", msg: "Please paste a Google Sheet URL" });
      return;
    }
    setSyncing(true);
    setStatus(null);
    try {
      const res = await fetch(`${apiBase}/connect_gsheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          user_id: userId,
          sheet_url: inputUrl.trim(),
          access_token: null, // public sheets only
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setConnected(true);
        setSheetUrl(inputUrl.trim());
        setLastSynced(now);
        localStorage.setItem(
          `gsheet_${companyId}`,
          JSON.stringify({ url: inputUrl.trim(), lastSynced: now })
        );
        setStatus({ type: "success", msg: data.message });
      } else {
        setStatus({ type: "error", msg: data.error || "Connection failed" });
      }
    } catch (e) {
      setStatus({ type: "error", msg: "Could not reach server" });
    } finally {
      setSyncing(false);
    }
  };

  const handleSync = async (silent = false) => {
    setSyncing(true);
    if (!silent) setStatus(null);
    try {
      const res = await fetch(`${apiBase}/sync_gsheet/${companyId}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setLastSynced(now);
        localStorage.setItem(
          `gsheet_${companyId}`,
          JSON.stringify({ url: sheetUrl, lastSynced: now })
        );
        if (!silent) setStatus({ type: "success", msg: data.message });
      } else {
        if (!silent) setStatus({ type: "error", msg: data.error || "Sync failed" });
      }
    } catch (e) {
      if (!silent) setStatus({ type: "error", msg: "Could not reach server" });
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(`gsheet_${companyId}`);
    setConnected(false);
    setSheetUrl("");
    setInputUrl("");
    setLastSynced(null);
    setStatus(null);
  };

  const formatLastSynced = (iso) => {
    if (!iso) return "never";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 20, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#0D2A1A", border: "1px solid #14532D44", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            📊
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Google Sheets</h2>
            <p style={{ fontSize: 12, color: "#4B5563", margin: 0 }}>
              {connected
                ? `Auto-syncs every 20 min · Last synced: ${formatLastSynced(lastSynced)}`
                : "Connect a public sheet to import & sync leads automatically"}
            </p>
          </div>
        </div>

        {/* Connected state actions */}
        {connected && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleSync(false)}
              disabled={syncing}
              className="action-btn"
              style={{
                background: syncing ? "#1E293B" : "linear-gradient(135deg, #065F46, #047857)",
                color: syncing ? "#4B5563" : "white",
                border: "none", borderRadius: 10,
                padding: "8px 16px", fontSize: 13, fontWeight: 700,
                cursor: syncing ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              <span style={{ display: "inline-block", animation: syncing ? "spin 1s linear infinite" : "none" }}>↻</span>
              {syncing ? "Syncing…" : "Sync Now"}
            </button>
            <button
              onClick={handleDisconnect}
              className="action-btn"
              style={{ background: "#1E293B", color: "#94A3B8", border: "1px solid #334155", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {!connected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Instructions */}
            <div style={{ background: "#0F2027", border: "1px solid #1E3A5F", borderRadius: 12, padding: "12px 16px", fontSize: 12, color: "#60A5FA", lineHeight: 1.7 }}>
              <b style={{ color: "#93C5FD" }}>Before connecting:</b> Open your Google Sheet → Share → Change to{" "}
              <b style={{ color: "#93C5FD" }}>"Anyone with the link → Viewer"</b>.
              Your sheet must have columns named <b style={{ color: "#93C5FD" }}>name</b>,{" "}
              <b style={{ color: "#93C5FD" }}>email</b>, and <b style={{ color: "#93C5FD" }}>phone</b>.
            </div>

            <input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="age-input"
              style={{ width: "100%", borderRadius: 12, padding: "12px 16px", fontSize: 13 }}
            />

            <button
              onClick={handleConnect}
              disabled={syncing}
              className="action-btn"
              style={{
                alignSelf: "flex-start",
                background: syncing ? "#1E293B" : "linear-gradient(135deg, #166534, #15803D)",
                color: syncing ? "#4B5563" : "white",
                border: "none", borderRadius: 12,
                padding: "11px 24px", fontSize: 14, fontWeight: 700,
                cursor: syncing ? "not-allowed" : "pointer",
              }}>
              {syncing ? "Connecting…" : "Connect Sheet"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#4ADE80", fontSize: 18 }}>✓</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>Connected sheet</span>
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#60A5FA", textDecoration: "none", wordBreak: "break-all" }}>
                {sheetUrl}
              </a>
            </div>
          </div>
        )}

        {/* Status message */}
        {status && (
          <div style={{
            marginTop: 14,
            background: status.type === "success" ? "#052E16" : "#2D0A0A",
            border: `1px solid ${status.type === "success" ? "#16A34A44" : "#DC262644"}`,
            borderRadius: 10, padding: "12px 16px", fontSize: 13,
            color: status.type === "success" ? "#4ADE80" : "#F87171",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>{status.type === "success" ? "✓" : "✗"}</span>
            {status.msg}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── main dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [file, setFile]                       = useState(null);
  const [leads, setLeads]                     = useState([]);
  const [intervalDays, setIntervalDays]       = useState(2);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [emailSubject, setEmailSubject]       = useState("Follow-up from AGE");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [isAIAssistOpen, setIsAIAssistOpen]   = useState(false);
  const [leadSchedules, setLeadSchedules]     = useState({});
  const [searchQuery, setSearchQuery]         = useState("");
  const [currentPage, setCurrentPage]         = useState(1);
  const [activeSection, setActiveSection]     = useState("leads");
  const LEADS_PER_PAGE = 10;

  const company_id   = localStorage.getItem("company_id");
  const user_id      = localStorage.getItem("user_id");
  const company_name = localStorage.getItem("company_name");
  const name = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || "User";

  const fetchLeads = async () => {
    try {
      const res  = await fetch(`${API_BASE_URL}/get_leads/${company_id}`);
      const data = await res.json();
      if (res.ok) {
        const sorted = sortLeads(data);
        setLeads(sorted);
        setLeadSchedules((prev) => {
          const updated = { ...prev };
          sorted.forEach((l) => {
            updated[l._id] = {
              channel:       l.pref_channel       || "email",
              interval_days: l.pref_interval_days || 2,
            };
          });
          return updated;
        });
      } else alert(data.error);
    } catch (e) { console.error(e); alert("Failed to fetch leads"); }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !company_id || !user_id) return;
    fetchLeads();
    const iv = setInterval(fetchLeads, 3000);
    const onFocus = () => fetchLeads();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [isLoaded, isSignedIn, company_id, user_id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { alert("Please select a file"); return; }
    if (!company_id || !user_id) { alert("Missing login details."); return; }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", company_id);
    formData.append("user_id", user_id);
    try {
      const res  = await fetch(`${API_BASE_URL}/upload_leads`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setDuplicateWarnings(data.duplicates || []);
        setFile(null);
        fetchLeads();
      } else alert(data.error);
    } catch (e) { console.error(e); alert("Upload failed"); }
  };

  const handleBulkSend = async (type) => {
    if (!company_id) { alert("Missing company details."); return; }
    if (!messageTemplate.trim()) { alert("Please generate or enter a message first."); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/send_bulk/${company_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, interval_days: Number(intervalDays), subject: emailSubject, message: messageTemplate }),
      });
      const data = await res.json();
      if (res.ok) { alert(data.message); fetchLeads(); }
      else alert(data.error);
    } catch (e) { console.error(e); alert("Bulk send failed"); }
  };

  const handleStartFollowup = async (leadId) => {
    const cfg = leadSchedules[leadId] || {};
    if (!messageTemplate.trim()) { alert("Please enter message template"); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/start_followup/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:       emailSubject,
          message:       messageTemplate,
          channel:       cfg.channel       || "email",
          interval_days: Number(cfg.interval_days || 2),
        }),
      });
      const data = await res.json();
      if (res.ok) { alert("Follow-ups started"); fetchLeads(); }
      else alert(data.error);
    } catch (e) { console.error(e); alert("Failed to start follow-up"); }
  };

  const updateLeadSchedule = (id, field, value) => {
    const updated = { ...leadSchedules[id], [field]: value };
    setLeadSchedules((prev) => ({ ...prev, [id]: updated }));
    fetch(`${API_BASE_URL}/lead_schedule/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: updated.channel, interval_days: updated.interval_days }),
    }).catch((e) => console.error("Failed to save lead schedule:", e));
  };

  // filtered + paginated
  const filtered = leads.filter((l) =>
    !searchQuery || [l.name, l.email, l.phone].some((v) => v?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / LEADS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE);

  const totalLeads   = leads.length;
  const sentLeads    = leads.filter((l) => l.send_status && l.send_status !== "not sent").length;
  const yesLeads     = leads.filter((l) => l.response_status === "yes").length;
  const pendingLeads = leads.filter((l) => !l.response_status || l.response_status === "pending" || l.response_status === "no reply").length;

  if (!isLoaded) return (
    <div style={{ background: "#030712" }} className="flex min-h-screen items-center justify-center">
      <div className="text-sm" style={{ color: "#6B7280" }}>Loading...</div>
    </div>
  );
  if (!isSignedIn) return null;

  return (
    <div style={{ background: "#030712", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #312E81; border-radius: 3px; }
        .age-input { background: #0F172A !important; border: 1px solid #1E293B !important; color: #E2E8F0 !important; transition: border-color .2s, box-shadow .2s; }
        .age-input::placeholder { color: #4B5563 !important; }
        .age-input:focus { outline: none; border-color: #6D28D9 !important; box-shadow: 0 0 0 3px #6D28D920 !important; }
        .age-input option { background: #0F172A; }
        .lead-row:hover { background: #0F172A !important; }
        .nav-item { color: #6B7280; transition: color .2s; cursor: pointer; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; }
        .nav-item:hover { color: #E2E8F0; background: #1E293B; }
        .nav-item.active { color: #A78BFA; background: #1E1B4B; }
        .action-btn { transition: all .15s; }
        .action-btn:hover { transform: translateY(-1px); }
        .page-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .15s; border: 1px solid transparent; }
        .page-btn:hover:not(.active-page) { background: #1E293B; color: #E2E8F0; }
        .page-btn.active-page { background: #6D28D9; color: white; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: "#030712", borderBottom: "1px solid #1E293B", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

            {/* Logo + workspace */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: "white", letterSpacing: 1, flexShrink: 0 }}>
                AGE
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 10, color: "#4B5563", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Workspace</span>
                <span style={{ fontSize: 14, color: "#E2E8F0", fontWeight: 700, lineHeight: 1.2 }}>{company_name || "Your Workspace"}</span>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[
                { key: "leads",    label: "Lead List" },
                { key: "campaign", label: "Campaign"  },
                { key: "upload",   label: "Upload"    },
              ].map(({ key, label }) => (
                <div key={key} onClick={() => setActiveSection(key)}
                  className={`nav-item${activeSection === key ? " active" : ""}`}>
                  {label}
                </div>
              ))}
            </nav>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#052E16", border: "1px solid #16A34A44", borderRadius: 100, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#4ADE80" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s infinite", display: "inline-block" }} />
                Live
              </div>
              <span style={{ fontSize: 13, color: "#6B7280" }}>Hi, <span style={{ color: "#E2E8F0", fontWeight: 600 }}>{name}</span></span>
              <div style={{ borderRadius: "50%" }}><UserButton /></div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* ── STAT CARDS ── */}
        {leads.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            <StatCard label="Total Leads"  value={totalLeads}   accent="#818CF8" icon={ICONS.users} trend={`${filtered.length} matching`} />
            <StatCard label="Sent"         value={sentLeads}    accent="#60A5FA" icon={ICONS.mail}  trend={`${Math.round(sentLeads / totalLeads * 100) || 0}% of leads`} />
            <StatCard label="Replied Yes"  value={yesLeads}     accent="#4ADE80" icon={ICONS.check} trend={`${Math.round(yesLeads / totalLeads * 100) || 0}% conversion`} />
            <StatCard label="Pending"      value={pendingLeads} accent="#FCD34D" icon={ICONS.clock} trend={`${pendingLeads} need follow-up`} />
          </div>
        )}

        {/* ══ UPLOAD SECTION ══ */}
        {activeSection === "upload" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* File upload card */}
            <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "#1E3A5F", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}>
                  <Icon d={ICONS.upload} size={16} />
                </div>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Upload File</h2>
                  <p style={{ fontSize: 12, color: "#4B5563", margin: 0 }}>CSV or Excel files accepted</p>
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <form onSubmit={handleUpload} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])}
                    className="age-input"
                    style={{ flex: 1, minWidth: 240, borderRadius: 12, padding: "10px 14px", fontSize: 13 }} />
                  <button type="submit" className="action-btn"
                    style={{ background: "linear-gradient(135deg, #6D28D9, #4F46E5)", color: "white", border: "none", borderRadius: 12, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Upload Leads
                  </button>
                </form>

                {duplicateWarnings.length > 0 && (
                  <div style={{ marginTop: 20, background: "#1C1505", border: "1px solid #D9770644", borderRadius: 12, padding: 16 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#FCD34D", margin: "0 0 4px" }}>⚠ Duplicate Leads Found</h3>
                    <p style={{ fontSize: 12, color: "#92400E", margin: "0 0 12px" }}>These were already uploaded.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {duplicateWarnings.map((d, i) => (
                        <div key={i} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8, padding: 12, fontSize: 12, color: "#94A3B8", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                          <span><b style={{ color: "#CBD5E1" }}>Name:</b> {d.name || "—"}</span>
                          <span><b style={{ color: "#CBD5E1" }}>Email:</b> {d.email || "—"}</span>
                          <span><b style={{ color: "#CBD5E1" }}>Phone:</b> {d.phone || "—"}</span>
                          <span style={{ color: "#FCD34D" }}>Uploaded by: {d.already_uploaded_by}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Sheets card */}
            <GoogleSheetCard companyId={company_id} userId={user_id} apiBase={API_BASE_URL} />
          </div>
        )}

        {/* ══ CAMPAIGN SECTION ══ */}
        {activeSection === "campaign" && (
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: "#2D1B69", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>
                <Icon d={ICONS.mail} size={16} />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Campaign Setup</h2>
                <p style={{ fontSize: 12, color: "#4B5563", margin: 0 }}>Message, subject, and timing</p>
              </div>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Email Subject</label>
                <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject line" className="age-input"
                  style={{ width: "100%", borderRadius: 12, padding: "12px 16px", fontSize: 14 }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Message Template</label>
                <textarea value={messageTemplate} onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Write your message. Use {{name}} to personalize." className="age-input"
                  style={{ width: "100%", borderRadius: 12, padding: "12px 16px", fontSize: 14, minHeight: 160, resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ minWidth: 180 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Follow-up Gap</label>
                  <select value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))}
                    className="age-input"
                    style={{ width: "100%", borderRadius: 12, padding: "12px 16px", fontSize: 14 }}>
                    {[2,3,4,5,6,7].map((d) => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { type: "email", label: "Email All",     bg: "linear-gradient(135deg, #1D4ED8, #1E40AF)" },
                    { type: "sms",   label: "SMS All",       bg: "linear-gradient(135deg, #6D28D9, #4C1D95)" },
                    { type: "both",  label: "Both Channels", bg: "linear-gradient(135deg, #0F172A, #1E293B)", border: "1px solid #334155" },
                  ].map(({ type, label, bg, border }) => (
                    <button key={type} onClick={() => handleBulkSend(type)} className="action-btn"
                      style={{ background: bg, color: "white", border: border || "none", borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ LEADS TABLE ══ */}
        {activeSection === "leads" && (
          <div style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 20, overflow: "hidden" }}>

            {/* Table header bar */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>
                  Lead List
                  <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 600, color: "#7C3AED", background: "#1E1B4B", border: "1px solid #312E81", borderRadius: 100, padding: "2px 10px" }}>
                    {filtered.length} results
                  </span>
                </h2>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4B5563" }}>
                    <Icon d={ICONS.search} size={14} />
                  </span>
                  <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search leads..." className="age-input"
                    style={{ borderRadius: 10, padding: "8px 14px 8px 36px", fontSize: 13, width: 220 }} />
                </div>
                <button style={{ background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <Icon d={ICONS.filter} size={13} /> Filter
                </button>
                <button
                  onClick={() => setActiveSection("upload")}
                  style={{ background: "linear-gradient(135deg, #6D28D9, #4F46E5)", border: "none", color: "white", borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                  <Icon d={ICONS.plus} size={13} /> Import
                </button>
              </div>
            </div>

            {leads.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 14, color: "#4B5563", fontWeight: 500 }}>No leads uploaded yet</p>
                <p style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>Upload a CSV / Excel file or connect a Google Sheet</p>
                <button onClick={() => setActiveSection("upload")} className="action-btn"
                  style={{ marginTop: 16, background: "linear-gradient(135deg, #6D28D9, #4F46E5)", border: "none", color: "white", borderRadius: 12, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Upload Leads
                </button>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#030712" }}>
                        {["SL","Name","Contact","Sent Via","Reply","Follow-ups","Last Sent","Next","Channel","Gap","Action"].map((h) => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", borderBottom: "1px solid #1E293B" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((lead, idx) => (
                        <tr key={lead._id} className="lead-row" style={{ borderBottom: "1px solid #0F172A" }}>
                          <td style={{ padding: "14px 16px", color: "#4B5563", fontWeight: 600, fontSize: 12 }}>
                            {String((currentPage - 1) * LEADS_PER_PAGE + idx + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white", flexShrink: 0 }}>
                                {getInitial(lead.name)}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span style={{ fontWeight: 700, color: "#E2E8F0", whiteSpace: "nowrap" }}>{lead.name || "—"}</span>
                                <div style={{ display: "flex", gap: 4 }}>
                                  {lead.is_individual_followup && (
                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#A78BFA", background: "#1E1B4B", border: "1px solid #4C1D95", borderRadius: 4, padding: "1px 5px", letterSpacing: 0.5 }}>INDIVIDUAL</span>
                                  )}
                                  {lead.source === "google_sheets" && (
                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#4ADE80", background: "#052E16", border: "1px solid #16A34A44", borderRadius: 4, padding: "1px 5px", letterSpacing: 0.5 }}>SHEET</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                              <span style={{ color: "#94A3B8", fontSize: 12 }}>📞 {lead.phone || "—"}</span>
                              <span style={{ color: "#94A3B8", fontSize: 12 }}>✉ {lead.email || "—"}</span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}><SendBadge status={lead.send_status} /></td>
                          <td style={{ padding: "14px 16px" }}><ReplyBadge status={lead.response_status} /></td>
                          <td style={{ padding: "14px 16px", color: "#94A3B8", textAlign: "center" }}>
                            <span style={{ background: "#1E1B4B", color: "#818CF8", border: "1px solid #312E81", borderRadius: 8, padding: "3px 10px", fontWeight: 700, fontSize: 13 }}>
                              {lead.followup_count || 0}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(lead.last_followup_sent_at)}</td>
                          <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>{formatDate(lead.next_followup_at)}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <select value={leadSchedules[lead._id]?.channel || "email"}
                              onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                              className="age-input"
                              style={{ borderRadius: 8, padding: "6px 10px", fontSize: 12, minWidth: 80 }}>
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                              <option value="both">Both</option>
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <select value={leadSchedules[lead._id]?.interval_days || 2}
                              onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                              className="age-input"
                              style={{ borderRadius: 8, padding: "6px 10px", fontSize: 12, minWidth: 80 }}>
                              {[2,3,4,5,6,7].map((d) => <option key={d} value={d}>{d}d</option>)}
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <button onClick={() => handleStartFollowup(lead._id)} className="action-btn"
                              style={{ background: "linear-gradient(135deg, #6D28D9, #4F46E5)", border: "none", color: "white", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                              Follow-up ▶
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ padding: "16px 24px", borderTop: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "#4B5563" }}>
                      Showing {(currentPage - 1) * LEADS_PER_PAGE + 1}–{Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div className="page-btn" style={{ color: currentPage === 1 ? "#374151" : "#94A3B8" }}
                        onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}>
                        <Icon d={ICONS.chevronLeft} size={14} />
                      </div>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const p = i + 1;
                        return (
                          <div key={p} className={`page-btn${currentPage === p ? " active-page" : ""}`}
                            style={{ color: currentPage === p ? "white" : "#6B7280" }}
                            onClick={() => setCurrentPage(p)}>
                            {p}
                          </div>
                        );
                      })}
                      {totalPages > 7 && <span style={{ color: "#4B5563", fontSize: 12 }}>...</span>}
                      <div className="page-btn" style={{ color: currentPage === totalPages ? "#374151" : "#94A3B8" }}
                        onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}>
                        <Icon d={ICONS.chevronRight} size={14} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── AI Floating Button ── */}
      <button onClick={() => setIsAIAssistOpen(true)} aria-label="Open AI Assistant"
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px #6D28D944" }}
        className="action-btn">
        <Icon d={ICONS.ai} size={22} />
      </button>

      <AIMessageBox isOpen={isAIAssistOpen} onClose={() => setIsAIAssistOpen(false)} />
    </div>
  );
};

export default Dashboard;
