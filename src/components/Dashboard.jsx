import React, { useEffect, useState } from "react";
import AIMessageBox from "./AIMessageBox";
import { useUser, UserButton } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── Icon ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const ICONS = {
  home:         "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users:        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  pipeline:     "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
  mail:         "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  upload:       "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  ai:           "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  search:       "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  filter:       "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  plus:         "M12 4v16m8-8H4",
  chevronLeft:  "M15 19l-7-7 7-7",
  chevronRight: "M9 5l7 7-7 7",
  link:         "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  check:        "M5 13l4 4L19 7",
  clock:        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0",
  edit:         "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  x:            "M6 18L18 6M6 6l12 12",
  bell:         "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  trendUp:      "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  trendDown:    "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
  zap:          "M13 10V3L4 14h7v7l9-11h-7z",
  phone:        "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  calendar:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  arrowRight:   "M14 5l7 7m0 0l-7 7m7-7H3",
  activity:     "M22 12h-4l-3 9L9 3l-3 9H2",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const sortLeads = (arr) => {
  const order = { yes: 1, pending: 2, "no reply": 2, no: 3 };
  return [...arr].sort((a, b) => (order[a.response_status] || 99) - (order[b.response_status] || 99));
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatRelative = (d) => {
  if (!d) return null;
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

const AVATAR_COLORS = [
  "#7C3AED","#6366F1","#0EA5E9","#10B981","#F59E0B","#EF4444","#EC4899","#14B8A6",
];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ─── Badges ───────────────────────────────────────────────────────────────────
const SendBadge = ({ status }) => {
  const map = {
    "email sent": { label: "Email", bg: "#1E3A5F", color: "#60A5FA", border: "#2563EB33" },
    "sms sent":   { label: "SMS",   bg: "#2D1B69", color: "#A78BFA", border: "#7C3AED33" },
    "both sent":  { label: "Both",  bg: "#0F172A", color: "#E2E8F0", border: "#334155"   },
  };
  const s = map[status] || { label: "Not Sent", bg: "#1E293B", color: "#64748B", border: "#334155" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: "inline-flex", alignItems: "center", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const ReplyBadge = ({ status }) => {
  const map = {
    yes: { label: "Interested", bg: "#052E16", color: "#4ADE80", border: "#16A34A44", dot: "#22C55E" },
    no:  { label: "Declined",   bg: "#2D0A0A", color: "#F87171", border: "#DC262644", dot: "#EF4444" },
  };
  const s = map[status] || { label: "Pending", bg: "#1C1505", color: "#FCD34D", border: "#D9770644", dot: "#F59E0B" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ background: s.dot, width: 5, height: 5, borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, accent, icon, sub, trend, trendUp }) => (
  <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
    <div style={{ background: accent, opacity: 0.07, filter: "blur(40px)", position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", pointerEvents: "none" }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 30, fontWeight: 800, color: "#F1F5F9", margin: "8px 0 4px", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{sub}</p>}
      </div>
      <div style={{ background: accent + "18", color: accent, width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} size={17} />
      </div>
    </div>
    {trend !== undefined && (
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1E293B22", display: "flex", alignItems: "center", gap: 5 }}>
        <Icon d={trendUp ? ICONS.trendUp : ICONS.trendDown} size={11} />
        <span style={{ fontSize: 11, color: trendUp ? "#4ADE80" : "#F87171" }}>{trend}</span>
      </div>
    )}
  </div>
);

// ─── Google Sheet Card ────────────────────────────────────────────────────────
const GoogleSheetCard = ({ companyId, userId, apiBase }) => {
  const [sheetUrl, setSheetUrl]     = useState("");
  const [inputUrl, setInputUrl]     = useState("");
  const [status, setStatus]         = useState(null);
  const [syncing, setSyncing]       = useState(false);
  const [connected, setConnected]   = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

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

  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => handleSync(true), 20 * 60 * 1000);
    return () => clearInterval(iv);
  }, [connected]);

  const handleConnect = async () => {
    if (!inputUrl.trim()) { setStatus({ type: "error", msg: "Please paste a Google Sheet URL" }); return; }
    setSyncing(true); setStatus(null);
    try {
      const res = await fetch(`${apiBase}/connect_gsheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId, user_id: userId, sheet_url: inputUrl.trim(), access_token: null }),
      });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setConnected(true); setSheetUrl(inputUrl.trim()); setLastSynced(now);
        localStorage.setItem(`gsheet_${companyId}`, JSON.stringify({ url: inputUrl.trim(), lastSynced: now }));
        setStatus({ type: "success", msg: data.message });
      } else setStatus({ type: "error", msg: data.error || "Connection failed" });
    } catch { setStatus({ type: "error", msg: "Could not reach server" }); }
    finally { setSyncing(false); }
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
        localStorage.setItem(`gsheet_${companyId}`, JSON.stringify({ url: sheetUrl, lastSynced: now }));
        if (!silent) setStatus({ type: "success", msg: data.message });
      } else { if (!silent) setStatus({ type: "error", msg: data.error || "Sync failed" }); }
    } catch { if (!silent) setStatus({ type: "error", msg: "Could not reach server" }); }
    finally { setSyncing(false); }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(`gsheet_${companyId}`);
    setConnected(false); setSheetUrl(""); setInputUrl(""); setLastSynced(null); setStatus(null);
  };

  const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "never";

  return (
    <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#0D2A1A", border: "1px solid #14532D44", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Google Sheets</p>
            <p style={{ fontSize: 11, color: "#4B5563", margin: 0 }}>
              {connected ? `Auto-syncs every 20 min · Last: ${fmtTime(lastSynced)}` : "Connect a public sheet to sync leads automatically"}
            </p>
          </div>
        </div>
        {connected && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleSync(false)} disabled={syncing} className="crm-btn-sm crm-btn-green">
              <span style={{ display: "inline-block", animation: syncing ? "spin 1s linear infinite" : "none" }}>↻</span>
              {syncing ? "Syncing…" : "Sync Now"}
            </button>
            <button onClick={handleDisconnect} className="crm-btn-sm crm-btn-ghost">Disconnect</button>
          </div>
        )}
      </div>
      <div style={{ padding: 20 }}>
        {!connected ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#0F2027", border: "1px solid #1E3A5F", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#60A5FA", lineHeight: 1.7 }}>
              <b style={{ color: "#93C5FD" }}>Before connecting:</b> Share your Google Sheet as <b style={{ color: "#93C5FD" }}>"Anyone with the link → Viewer"</b>. Columns must be named <b style={{ color: "#93C5FD" }}>name</b>, <b style={{ color: "#93C5FD" }}>email</b>, and <b style={{ color: "#93C5FD" }}>phone</b>.
            </div>
            <input value={inputUrl} onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              className="crm-input" style={{ borderRadius: 10, padding: "10px 14px", fontSize: 13, width: "100%" }} />
            <button onClick={handleConnect} disabled={syncing} className="crm-btn-primary" style={{ alignSelf: "flex-start" }}>
              {syncing ? "Connecting…" : "Connect Sheet"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#4ADE80", fontSize: 16 }}>✓</span>
            <div>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 2px" }}>Connected sheet</p>
              <a href={sheetUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#60A5FA", textDecoration: "none", wordBreak: "break-all" }}>{sheetUrl}</a>
            </div>
          </div>
        )}
        {status && (
          <div style={{ marginTop: 12, background: status.type === "success" ? "#052E16" : "#2D0A0A", border: `1px solid ${status.type === "success" ? "#16A34A44" : "#DC262644"}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: status.type === "success" ? "#4ADE80" : "#F87171", display: "flex", alignItems: "center", gap: 8 }}>
            <span>{status.type === "success" ? "✓" : "✗"}</span>{status.msg}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Lead Detail Panel ────────────────────────────────────────────────────────
const LeadDetailPanel = ({ lead, onClose, leadSchedules, updateLeadSchedule, handleStartFollowup, messageTemplate }) => {
  if (!lead) return null;
  const cfg = leadSchedules[lead._id] || {};
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: "#0D1117", borderLeft: "1px solid #1E293B", zIndex: 51, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0D1117", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>
              {getInitial(lead.name)}
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>{lead.name || "—"}</h3>
              <p style={{ fontSize: 11, color: "#4B5563", margin: 0 }}>Contact Details</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #1E293B", color: "#6B7280", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICONS.x} size={13} />
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

          {/* Status row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <SendBadge status={lead.send_status} />
            <ReplyBadge status={lead.response_status} />
            {lead.is_individual_followup && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", background: "#1E1B4B", border: "1px solid #4C1D95", borderRadius: 100, padding: "2px 8px", letterSpacing: 0.5 }}>INDIVIDUAL</span>
            )}
            {lead.source === "google_sheets" && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#4ADE80", background: "#052E16", border: "1px solid #16A34A44", borderRadius: 100, padding: "2px 8px", letterSpacing: 0.5 }}>SHEETS</span>
            )}
          </div>

          {/* Contact info */}
          <div style={{ background: "#0A0F1C", border: "1px solid #1E293B", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 12px" }}>Contact Info</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#6366F1", flexShrink: 0, width: 20 }}><Icon d={ICONS.mail} size={13} /></div>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{lead.email || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#6366F1", flexShrink: 0, width: 20 }}><Icon d={ICONS.phone} size={13} /></div>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{lead.phone || "—"}</span>
              </div>
            </div>
          </div>

          {/* Activity stats */}
          <div style={{ background: "#0A0F1C", border: "1px solid #1E293B", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 12px" }}>Activity</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <p style={{ fontSize: 10, color: "#374151", margin: "0 0 4px" }}>Follow-ups Sent</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#818CF8", margin: 0 }}>{lead.followup_count || 0}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#374151", margin: "0 0 4px" }}>Last Contact</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", margin: 0 }}>{formatDate(lead.last_followup_sent_at)}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#374151", margin: "0 0 4px" }}>Next Follow-up</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#FCD34D", margin: 0 }}>{formatDate(lead.next_followup_at)}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#374151", margin: "0 0 4px" }}>Campaign ID</p>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", margin: 0, wordBreak: "break-all" }}>{lead.campaign_id ? lead.campaign_id.slice(-8) + "…" : "—"}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: "#0A0F1C", border: "1px solid #1E293B", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 12px" }}>Follow-up Schedule</p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "#4B5563", display: "block", marginBottom: 6 }}>Channel</label>
                <select value={cfg.channel || "email"}
                  onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                  className="crm-input" style={{ width: "100%", borderRadius: 8, padding: "8px 10px", fontSize: 12 }}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, color: "#4B5563", display: "block", marginBottom: 6 }}>Interval</label>
                <select value={cfg.interval_days || 2}
                  onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                  className="crm-input" style={{ width: "100%", borderRadius: 8, padding: "8px 10px", fontSize: 12 }}>
                  {[2, 3, 4, 5, 6, 7].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
            </div>
          </div>

          {!messageTemplate?.trim() && (
            <div style={{ background: "#1C1505", border: "1px solid #D9770644", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#FCD34D" }}>
              ⚠ Set a message in <b>Campaigns</b> before starting follow-up.
            </div>
          )}

          {/* CTA */}
          <button onClick={() => { handleStartFollowup(lead._id); }}
            className="crm-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Start Follow-up Sequence
            <Icon d={ICONS.arrowRight} size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Pipeline Card & Column ───────────────────────────────────────────────────
const PipelineCard = ({ lead, onClick }) => (
  <div onClick={() => onClick(lead)} className="pipeline-card"
    style={{ background: "#070D16", border: "1px solid #1E293B", borderRadius: 10, padding: 12, cursor: "pointer", marginBottom: 8, transition: "border-color .15s" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
        {getInitial(lead.name)}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#E2E8F0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name || "—"}</p>
        <p style={{ fontSize: 10, color: "#4B5563", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email || lead.phone || "—"}</p>
      </div>
    </div>
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      <SendBadge status={lead.send_status} />
      {lead.followup_count > 0 && (
        <span style={{ background: "#1E1B4B", color: "#818CF8", border: "1px solid #312E81", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>
          {lead.followup_count} follow-ups
        </span>
      )}
    </div>
  </div>
);

const PipelineColumn = ({ title, color, bg, leads, onLeadClick }) => (
  <div style={{ background: "#0A0F1C", border: "1px solid #1E293B", borderRadius: 14, padding: "14px", minWidth: 220, flex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#CBD5E1" }}>{title}</span>
      <span style={{ background: bg, color: color, borderRadius: 100, padding: "1px 8px", fontSize: 10, fontWeight: 700, marginLeft: "auto" }}>
        {leads.length}
      </span>
    </div>
    <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
      {leads.length === 0
        ? <div style={{ textAlign: "center", padding: "28px 12px", color: "#374151", fontSize: 11 }}>No leads here</div>
        : leads.map((l) => <PipelineCard key={l._id} lead={l} onClick={onLeadClick} />)
      }
    </div>
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [file, setFile]                           = useState(null);
  const [leads, setLeads]                         = useState([]);
  const [intervalDays, setIntervalDays]           = useState(2);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [emailSubject, setEmailSubject]           = useState("Follow-up from AGE");
  const [messageTemplate, setMessageTemplate]     = useState("");
  const [isAIAssistOpen, setIsAIAssistOpen]       = useState(false);
  const [leadSchedules, setLeadSchedules]         = useState({});
  const [searchQuery, setSearchQuery]             = useState("");
  const [currentPage, setCurrentPage]             = useState(1);
  const [activeSection, setActiveSection]         = useState("overview");
  const [selectedLead, setSelectedLead]           = useState(null);
  const [filterSendStatus, setFilterSendStatus]   = useState("all");
  const [filterReplyStatus, setFilterReplyStatus] = useState("all");
  const [uploadStatus, setUploadStatus]           = useState(null);
  const [bulkStatus, setBulkStatus]               = useState(null);
  const LEADS_PER_PAGE = 12;

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
            updated[l._id] = { channel: l.pref_channel || "email", interval_days: l.pref_interval_days || 2 };
          });
          return updated;
        });
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !company_id || !user_id) return;
    let mounted = true;
    const load = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/get_leads/${company_id}`);
        const data = await res.json();
        if (res.ok && mounted) {
          const sorted = sortLeads(data);
          setLeads(sorted);
          setLeadSchedules((prev) => {
            const updated = { ...prev };
            sorted.forEach((l) => {
              updated[l._id] = { channel: l.pref_channel || "email", interval_days: l.pref_interval_days || 2 };
            });
            return updated;
          });
        }
      } catch (e) { console.error(e); }
    };
    void load();
    const iv = setInterval(load, 5000);
    window.addEventListener("focus", load);
    return () => { mounted = false; clearInterval(iv); window.removeEventListener("focus", load); };
  }, [isLoaded, isSignedIn, company_id, user_id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setUploadStatus({ type: "error", msg: "Please select a file" }); return; }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", company_id);
    formData.append("user_id", user_id);
    setUploadStatus({ type: "loading", msg: "Uploading…" });
    try {
      const res  = await fetch(`${API_BASE_URL}/upload_leads`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ type: "success", msg: data.message });
        setDuplicateWarnings(data.duplicates || []);
        setFile(null);
        fetchLeads();
      } else setUploadStatus({ type: "error", msg: data.error });
    } catch { setUploadStatus({ type: "error", msg: "Upload failed" }); }
  };

  const handleBulkSend = async (type) => {
    if (!messageTemplate.trim()) { setBulkStatus({ type: "error", msg: "Please enter a message template first." }); return; }
    setBulkStatus({ type: "loading", msg: "Sending…" });
    try {
      const res = await fetch(`${API_BASE_URL}/send_bulk/${company_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, interval_days: Number(intervalDays), subject: emailSubject, message: messageTemplate }),
      });
      const data = await res.json();
      if (res.ok) { setBulkStatus({ type: "success", msg: data.message }); fetchLeads(); }
      else setBulkStatus({ type: "error", msg: data.error });
    } catch { setBulkStatus({ type: "error", msg: "Send failed" }); }
  };

  const handleStartFollowup = async (leadId) => {
    const cfg = leadSchedules[leadId] || {};
    if (!messageTemplate.trim()) { alert("Please enter a message template in Campaigns first."); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/start_followup/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: emailSubject, message: messageTemplate, channel: cfg.channel || "email", interval_days: Number(cfg.interval_days || 2) }),
      });
      const data = await res.json();
      if (res.ok) { alert("Follow-ups started"); fetchLeads(); setSelectedLead(null); }
      else alert(data.error);
    } catch { alert("Failed to start follow-up"); }
  };

  const updateLeadSchedule = (id, field, value) => {
    const updated = { ...leadSchedules[id], [field]: value };
    setLeadSchedules((prev) => ({ ...prev, [id]: updated }));
    fetch(`${API_BASE_URL}/lead_schedule/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: updated.channel, interval_days: updated.interval_days }),
    }).catch(console.error);
  };

  // ── Computed ──
  const filtered = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || [l.name, l.email, l.phone].some((v) => v?.toLowerCase().includes(q));
    const matchSend   = filterSendStatus === "all"  || (filterSendStatus === "not sent" ? (!l.send_status || l.send_status === "not sent") : l.send_status === filterSendStatus);
    const matchReply  = filterReplyStatus === "all" || l.response_status === filterReplyStatus;
    return matchSearch && matchSend && matchReply;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / LEADS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE);

  const totalLeads   = leads.length;
  const sentLeads    = leads.filter((l) => l.send_status && l.send_status !== "not sent").length;
  const yesLeads     = leads.filter((l) => l.response_status === "yes").length;
  const pendingLeads = leads.filter((l) => !l.response_status || l.response_status === "pending" || l.response_status === "no reply").length;
  const convRate     = totalLeads ? Math.round((yesLeads / totalLeads) * 100) : 0;

  const pipeline = {
    new:       leads.filter((l) => !l.send_status || l.send_status === "not sent"),
    contacted: leads.filter((l) => l.send_status && l.send_status !== "not sent" && l.response_status !== "yes" && l.response_status !== "no"),
    interested: leads.filter((l) => l.response_status === "yes"),
    declined:   leads.filter((l) => l.response_status === "no"),
  };

  // Recent activity: leads with any send or followup activity, sorted by most recent
  const recentActivity = [...leads]
    .filter((l) => l.last_followup_sent_at || (l.send_status && l.send_status !== "not sent"))
    .sort((a, b) => new Date(b.last_followup_sent_at || 0) - new Date(a.last_followup_sent_at || 0))
    .slice(0, 8);

  const navItems = [
    { key: "overview",  label: "Overview",  icon: ICONS.home },
    { key: "contacts",  label: "Contacts",  icon: ICONS.users },
    { key: "pipeline",  label: "Pipeline",  icon: ICONS.pipeline },
    { key: "campaign",  label: "Campaigns", icon: ICONS.mail },
    { key: "import",    label: "Import",    icon: ICONS.upload },
  ];

  const sectionSubtitle = {
    overview:  `${totalLeads} total leads · ${convRate}% conversion`,
    contacts:  `${filtered.length} of ${totalLeads} contacts`,
    pipeline:  "Visual deal stages",
    campaign:  "Email & SMS outreach",
    import:    "Import leads from CSV or Google Sheets",
  };

  if (!isLoaded) return (
    <div style={{ background: "#070D16", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#374151", fontSize: 13 }}>Loading…</span>
    </div>
  );
  if (!isSignedIn) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070D16", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #070D16; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 3px; }
        .crm-input { background: #070D16 !important; border: 1px solid #1E293B !important; color: #E2E8F0 !important; transition: border-color .2s, box-shadow .2s; }
        .crm-input::placeholder { color: #374151 !important; }
        .crm-input:focus { outline: none; border-color: #6D28D9 !important; box-shadow: 0 0 0 3px #6D28D91A !important; }
        .crm-input option { background: #0A0F1C; }
        .crm-btn-primary { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #6D28D9, #4F46E5); color: white; border: none; border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity .15s, transform .1s; font-family: inherit; }
        .crm-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .crm-btn-sm { display: inline-flex; align-items: center; gap: 5px; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; font-family: inherit; }
        .crm-btn-green { background: linear-gradient(135deg, #065F46, #047857); color: white; border: none; }
        .crm-btn-ghost { background: #0D1117; color: #64748B; border: 1px solid #1E293B; }
        .crm-btn-ghost:hover { color: #E2E8F0; border-color: #334155; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; cursor: pointer; color: #4B5563; font-size: 13px; font-weight: 500; transition: all .15s; margin-bottom: 2px; }
        .sidebar-item:hover { color: #CBD5E1; background: #0D1117; }
        .sidebar-item.active { color: #A78BFA; background: #1E1B4B; }
        .sidebar-badge { margin-left: auto; background: #1E1B4B; color: #818CF8; border-radius: 100px; padding: 1px 7px; font-size: 10px; font-weight: 700; }
        .lead-row { transition: background .1s; cursor: pointer; }
        .lead-row:hover { background: #0A0F1C !important; }
        .pipeline-card:hover { border-color: #334155 !important; }
        .page-btn { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid transparent; color: #4B5563; transition: all .1s; }
        .page-btn:hover:not(.active-pg) { background: #0D1117; color: #E2E8F0; }
        .page-btn.active-pg { background: #6D28D9; color: white; border-color: #6D28D9; }
        .funnel-bar { border-radius: 4px; height: 6px; transition: width .4s; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside style={{ width: 220, background: "#0A0F1C", borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Logo */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 9, color: "white", letterSpacing: 1.2, flexShrink: 0 }}>AGE</div>
            <div>
              <p style={{ fontSize: 9, color: "#374151", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>CRM</p>
              <p style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 700, margin: 0, lineHeight: 1.2, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company_name || "Workspace"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 2, padding: "0 12px", margin: "0 0 8px" }}>MAIN MENU</p>
          {navItems.map(({ key, label, icon }) => (
            <div key={key} onClick={() => { setActiveSection(key); setCurrentPage(1); }}
              className={`sidebar-item${activeSection === key ? " active" : ""}`}>
              <Icon d={icon} size={15} />
              <span>{label}</span>
              {key === "contacts" && totalLeads > 0 && <span className="sidebar-badge">{totalLeads}</span>}
              {key === "pipeline" && pipeline.interested.length > 0 && <span className="sidebar-badge" style={{ background: "#052E16", color: "#4ADE80" }}>{pipeline.interested.length}</span>}
            </div>
          ))}

          <div style={{ height: 1, background: "#1E293B", margin: "16px 0 14px" }} />
          <p style={{ fontSize: 9, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 2, padding: "0 12px", margin: "0 0 8px" }}>AI</p>
          <div onClick={() => setIsAIAssistOpen(true)} className="sidebar-item">
            <Icon d={ICONS.ai} size={15} />
            <span>AI Assistant</span>
          </div>
        </nav>

        {/* User */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserButton />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
              <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>Workspace Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <header style={{ background: "#070D16", borderBottom: "1px solid #1E293B", padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30, flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
              {navItems.find((n) => n.key === activeSection)?.label}
            </h1>
            <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{sectionSubtitle[activeSection]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#052E16", border: "1px solid #16A34A33", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#4ADE80" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              Live
            </div>
            <button onClick={() => setIsAIAssistOpen(true)}
              style={{ background: "#0D1117", border: "1px solid #1E293B", color: "#A78BFA", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
              <Icon d={ICONS.ai} size={13} /> AI
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ padding: 24, flex: 1 }}>

          {/* ══ OVERVIEW ══ */}
          {activeSection === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                <StatCard label="Total Contacts" value={totalLeads}   accent="#818CF8" icon={ICONS.users}    sub={`${pipeline.new.length} not yet contacted`} />
                <StatCard label="Contacted"       value={sentLeads}    accent="#60A5FA" icon={ICONS.mail}     sub={`${Math.round(sentLeads / (totalLeads || 1) * 100)}% of contacts`} trend={`${Math.round(sentLeads / (totalLeads || 1) * 100)}% reach rate`} trendUp={sentLeads > 0} />
                <StatCard label="Interested"      value={yesLeads}     accent="#4ADE80" icon={ICONS.check}    sub="Replied yes" trend={`${convRate}% conversion`} trendUp={convRate > 0} />
                <StatCard label="Pending"         value={pendingLeads} accent="#FCD34D" icon={ICONS.clock}    sub="Need follow-up" />
                <StatCard label="Declined"        value={pipeline.declined.length} accent="#F87171" icon={ICONS.x} sub="Replied no" />
              </div>

              {/* Pipeline funnel + Activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Funnel */}
                <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Conversion Funnel</h3>
                    <span style={{ fontSize: 11, color: "#374151" }}>{convRate}% overall</span>
                  </div>
                  {[
                    { label: "Total Leads",  value: totalLeads,   color: "#818CF8", pct: 100 },
                    { label: "Contacted",    value: sentLeads,    color: "#60A5FA", pct: totalLeads ? Math.round(sentLeads / totalLeads * 100) : 0 },
                    { label: "Interested",   value: yesLeads,     color: "#4ADE80", pct: totalLeads ? Math.round(yesLeads / totalLeads * 100) : 0 },
                  ].map(({ label, value, color, pct }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color }}>{value} <span style={{ color: "#374151", fontWeight: 400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ background: "#1E293B", borderRadius: 4, height: 6 }}>
                        <div className="funnel-bar" style={{ background: color, width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ borderTop: "1px solid #1E293B", marginTop: 16, paddingTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "New",       val: pipeline.new.length,       color: "#64748B" },
                      { label: "In Progress", val: pipeline.contacted.length, color: "#60A5FA" },
                      { label: "Won",       val: pipeline.interested.length, color: "#4ADE80" },
                      { label: "Lost",      val: pipeline.declined.length,   color: "#F87171" },
                    ].map(({ label, val, color }) => (
                      <div key={label} style={{ textAlign: "center", flex: 1 }}>
                        <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0 }}>{val}</p>
                        <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Recent Activity</h3>
                    <button onClick={() => setActiveSection("contacts")}
                      style={{ background: "transparent", border: "none", color: "#6D28D9", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", padding: 0 }}>
                      View all <Icon d={ICONS.arrowRight} size={11} />
                    </button>
                  </div>
                  {recentActivity.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: "#374151", fontSize: 12 }}>
                      No activity yet. Start a campaign to see updates here.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {recentActivity.map((l) => (
                        <div key={l._id} onClick={() => setSelectedLead(l)} className="lead-row"
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#0A0F1C", cursor: "pointer" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: avatarColor(l.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
                            {getInitial(l.name)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</p>
                            <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{l.followup_count || 0} follow-ups sent</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                            <ReplyBadge status={l.response_status} />
                            {formatRelative(l.last_followup_sent_at) && (
                              <span style={{ fontSize: 9, color: "#374151" }}>{formatRelative(l.last_followup_sent_at)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { icon: ICONS.plus,     label: "Import Leads",     sub: "Upload CSV or connect Sheets", key: "import",   color: "#60A5FA" },
                  { icon: ICONS.mail,     label: "Create Campaign",  sub: "Send to all contacts",         key: "campaign", color: "#A78BFA" },
                  { icon: ICONS.pipeline, label: "View Pipeline",    sub: "See deal stages",              key: "pipeline", color: "#4ADE80" },
                  { icon: ICONS.users,    label: "Manage Contacts",  sub: `${totalLeads} total`,          key: "contacts", color: "#FCD34D" },
                ].map(({ icon, label, sub, key, color }) => (
                  <div key={key} onClick={() => setActiveSection(key)}
                    style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color .15s" }}
                    className="pipeline-card">
                    <div style={{ background: color + "18", color, width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon d={icon} size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ CONTACTS ══ */}
          {activeSection === "contacts" && (
            <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>

              {/* Toolbar */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E293B", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>All Contacts</h2>
                  <span style={{ background: "#1E1B4B", color: "#818CF8", border: "1px solid #312E81", borderRadius: 100, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{filtered.length}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {/* Search */}
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#374151" }}>
                      <Icon d={ICONS.search} size={13} />
                    </span>
                    <input value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search…" className="crm-input"
                      style={{ borderRadius: 9, padding: "7px 12px 7px 32px", fontSize: 12, width: 200 }} />
                  </div>
                  {/* Send status filter */}
                  <select value={filterSendStatus}
                    onChange={(e) => { setFilterSendStatus(e.target.value); setCurrentPage(1); }}
                    className="crm-input" style={{ borderRadius: 9, padding: "7px 12px", fontSize: 12 }}>
                    <option value="all">All Send Status</option>
                    <option value="not sent">Not Sent</option>
                    <option value="email sent">Email Sent</option>
                    <option value="sms sent">SMS Sent</option>
                    <option value="both sent">Both Sent</option>
                  </select>
                  {/* Reply filter */}
                  <select value={filterReplyStatus}
                    onChange={(e) => { setFilterReplyStatus(e.target.value); setCurrentPage(1); }}
                    className="crm-input" style={{ borderRadius: 9, padding: "7px 12px", fontSize: 12 }}>
                    <option value="all">All Replies</option>
                    <option value="pending">Pending</option>
                    <option value="yes">Interested</option>
                    <option value="no">Declined</option>
                    <option value="no reply">No Reply</option>
                  </select>
                  {(filterSendStatus !== "all" || filterReplyStatus !== "all" || searchQuery) && (
                    <button onClick={() => { setFilterSendStatus("all"); setFilterReplyStatus("all"); setSearchQuery(""); setCurrentPage(1); }}
                      className="crm-btn-sm crm-btn-ghost">
                      <Icon d={ICONS.x} size={11} /> Clear
                    </button>
                  )}
                  <button onClick={() => setActiveSection("import")} className="crm-btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}>
                    <Icon d={ICONS.plus} size={12} /> Import
                  </button>
                </div>
              </div>

              {leads.length === 0 ? (
                <div style={{ padding: "64px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                  <p style={{ fontSize: 14, color: "#4B5563", fontWeight: 500, margin: "0 0 4px" }}>No contacts yet</p>
                  <p style={{ fontSize: 12, color: "#374151", margin: "0 0 16px" }}>Upload a CSV / Excel file or connect Google Sheets</p>
                  <button onClick={() => setActiveSection("import")} className="crm-btn-primary">Import Contacts</button>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#070D16" }}>
                          {["#", "Contact", "Channel", "Reply Status", "Follow-ups", "Last Sent", "Next", "Schedule", ""].map((h) => (
                            <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", borderBottom: "1px solid #1E293B" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((lead, idx) => (
                          <tr key={lead._id} className="lead-row" onClick={() => setSelectedLead(lead)}
                            style={{ borderBottom: "1px solid #0A0F1C" }}>
                            <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600, fontSize: 11 }}>
                              {String((currentPage - 1) * LEADS_PER_PAGE + idx + 1).padStart(2, "0")}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
                                  {getInitial(lead.name)}
                                </div>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <span style={{ fontWeight: 700, color: "#E2E8F0" }}>{lead.name || "—"}</span>
                                    {lead.is_individual_followup && <span style={{ fontSize: 8, fontWeight: 700, color: "#A78BFA", background: "#1E1B4B", border: "1px solid #4C1D95", borderRadius: 3, padding: "1px 4px" }}>IND</span>}
                                    {lead.source === "google_sheets" && <span style={{ fontSize: 8, fontWeight: 700, color: "#4ADE80", background: "#052E16", borderRadius: 3, padding: "1px 4px" }}>GS</span>}
                                  </div>
                                  <div style={{ fontSize: 11, color: "#374151", marginTop: 1 }}>{lead.email || lead.phone || "—"}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}><SendBadge status={lead.send_status} /></td>
                            <td style={{ padding: "12px 16px" }}><ReplyBadge status={lead.response_status} /></td>
                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                              <span style={{ background: "#1E1B4B", color: "#818CF8", border: "1px solid #312E81", borderRadius: 8, padding: "3px 10px", fontWeight: 700, fontSize: 12 }}>
                                {lead.followup_count || 0}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#4B5563", fontSize: 11, whiteSpace: "nowrap" }}>{formatDate(lead.last_followup_sent_at)}</td>
                            <td style={{ padding: "12px 16px", color: "#4B5563", fontSize: 11, whiteSpace: "nowrap" }}>
                              {lead.next_followup_at ? <span style={{ color: "#FCD34D" }}>{formatDate(lead.next_followup_at)}</span> : "—"}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                                <select value={leadSchedules[lead._id]?.channel || "email"}
                                  onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                                  className="crm-input" style={{ borderRadius: 7, padding: "5px 8px", fontSize: 11, minWidth: 72 }}>
                                  <option value="email">Email</option>
                                  <option value="sms">SMS</option>
                                  <option value="both">Both</option>
                                </select>
                                <select value={leadSchedules[lead._id]?.interval_days || 2}
                                  onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                                  className="crm-input" style={{ borderRadius: 7, padding: "5px 8px", fontSize: 11, minWidth: 62 }}>
                                  {[2, 3, 4, 5, 6, 7].map((d) => <option key={d} value={d}>{d}d</option>)}
                                </select>
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => handleStartFollowup(lead._id)} className="crm-btn-sm"
                                style={{ background: "linear-gradient(135deg, #6D28D9, #4F46E5)", color: "white", border: "none", whiteSpace: "nowrap" }}>
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
                    <div style={{ padding: "12px 20px", borderTop: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#374151" }}>
                        {(currentPage - 1) * LEADS_PER_PAGE + 1}–{Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} of {filtered.length}
                      </span>
                      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <div className="page-btn" onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}>
                          <Icon d={ICONS.chevronLeft} size={13} />
                        </div>
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                          <div key={p} className={`page-btn${currentPage === p ? " active-pg" : ""}`} onClick={() => setCurrentPage(p)}>{p}</div>
                        ))}
                        {totalPages > 7 && <span style={{ color: "#374151", fontSize: 12 }}>…</span>}
                        <div className="page-btn" onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}>
                          <Icon d={ICONS.chevronRight} size={13} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ PIPELINE ══ */}
          {activeSection === "pipeline" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                <PipelineColumn title="New"        color="#64748B" bg="#1E293B"   leads={pipeline.new}        onLeadClick={setSelectedLead} />
                <PipelineColumn title="Contacted"  color="#60A5FA" bg="#1E3A5F"   leads={pipeline.contacted}  onLeadClick={setSelectedLead} />
                <PipelineColumn title="Interested" color="#4ADE80" bg="#052E16"   leads={pipeline.interested} onLeadClick={setSelectedLead} />
                <PipelineColumn title="Declined"   color="#F87171" bg="#2D0A0A"   leads={pipeline.declined}   onLeadClick={setSelectedLead} />
              </div>
              <p style={{ fontSize: 11, color: "#374151", margin: 0, textAlign: "center" }}>
                Click any card to view contact details and start a follow-up
              </p>
            </div>
          )}

          {/* ══ CAMPAIGN ══ */}
          {activeSection === "campaign" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: "#2D1B69", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", flexShrink: 0 }}>
                    <Icon d={ICONS.mail} size={15} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Campaign Setup</h2>
                    <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>Compose and send bulk outreach</p>
                  </div>
                  <button onClick={() => setIsAIAssistOpen(true)} className="crm-btn-sm crm-btn-ghost" style={{ marginLeft: "auto" }}>
                    <Icon d={ICONS.ai} size={12} /> AI Assist
                  </button>
                </div>
                <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 7 }}>Email Subject</label>
                    <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Subject line…" className="crm-input"
                      style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 7 }}>Message Template</label>
                    <textarea value={messageTemplate} onChange={(e) => setMessageTemplate(e.target.value)}
                      placeholder="Write your message. Use {{name}} for personalization." className="crm-input"
                      style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13, minHeight: 160, resize: "vertical" }} />
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1.2, display: "block", marginBottom: 7 }}>Follow-up Interval</label>
                      <select value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))}
                        className="crm-input" style={{ borderRadius: 10, padding: "10px 14px", fontSize: 13, minWidth: 140 }}>
                        {[2, 3, 4, 5, 6, 7].map((d) => <option key={d} value={d}>{d} days</option>)}
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[
                        { type: "email", label: "Email All",     bg: "linear-gradient(135deg, #1D4ED8, #1E40AF)" },
                        { type: "sms",   label: "SMS All",       bg: "linear-gradient(135deg, #6D28D9, #4C1D95)" },
                        { type: "both",  label: "Both Channels", bg: "#0D1117", border: "1px solid #334155" },
                      ].map(({ type, label, bg, border }) => (
                        <button key={type} onClick={() => handleBulkSend(type)}
                          style={{ background: bg, color: "white", border: border || "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity .15s" }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {bulkStatus && (
                    <div style={{ background: bulkStatus.type === "success" ? "#052E16" : bulkStatus.type === "loading" ? "#0A0F1C" : "#2D0A0A", border: `1px solid ${bulkStatus.type === "success" ? "#16A34A44" : bulkStatus.type === "loading" ? "#1E293B" : "#DC262644"}`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: bulkStatus.type === "success" ? "#4ADE80" : bulkStatus.type === "loading" ? "#94A3B8" : "#F87171", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{bulkStatus.type === "success" ? "✓" : bulkStatus.type === "loading" ? "⟳" : "✗"}</span>
                      {bulkStatus.msg}
                    </div>
                  )}
                </div>
              </div>

              {/* Campaign stats */}
              {totalLeads > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { label: "Will Receive Email", value: leads.filter(l => !l.send_status || l.send_status === "not sent").length, color: "#60A5FA" },
                    { label: "Already Sent",        value: sentLeads,  color: "#818CF8" },
                    { label: "Interested Replies",  value: yesLeads,   color: "#4ADE80" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 12, padding: "14px 18px" }}>
                      <p style={{ fontSize: 10, color: "#374151", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
                      <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ IMPORT ══ */}
          {activeSection === "import" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* File upload */}
              <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: "#1E3A5F", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", flexShrink: 0 }}>
                    <Icon d={ICONS.upload} size={15} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Upload File</h2>
                    <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>CSV or Excel — columns: name, email, phone</p>
                  </div>
                </div>
                <div style={{ padding: 22 }}>
                  <form onSubmit={handleUpload} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])}
                      className="crm-input" style={{ flex: 1, minWidth: 200, borderRadius: 10, padding: "9px 13px", fontSize: 12 }} />
                    <button type="submit" className="crm-btn-primary">Upload Leads</button>
                  </form>

                  {uploadStatus && (
                    <div style={{ marginTop: 14, background: uploadStatus.type === "success" ? "#052E16" : uploadStatus.type === "loading" ? "#0A0F1C" : "#2D0A0A", border: `1px solid ${uploadStatus.type === "success" ? "#16A34A44" : uploadStatus.type === "loading" ? "#1E293B" : "#DC262644"}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: uploadStatus.type === "success" ? "#4ADE80" : uploadStatus.type === "loading" ? "#94A3B8" : "#F87171", display: "flex", gap: 8 }}>
                      <span>{uploadStatus.type === "success" ? "✓" : uploadStatus.type === "loading" ? "⟳" : "✗"}</span>
                      {uploadStatus.msg}
                    </div>
                  )}

                  {duplicateWarnings.length > 0 && (
                    <div style={{ marginTop: 16, background: "#1C1505", border: "1px solid #D9770644", borderRadius: 12, padding: 16 }}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, color: "#FCD34D", margin: "0 0 4px" }}>⚠ {duplicateWarnings.length} Duplicate{duplicateWarnings.length > 1 ? "s" : ""} Found</h3>
                      <p style={{ fontSize: 11, color: "#78350F", margin: "0 0 10px" }}>These contacts already exist.</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {duplicateWarnings.map((d, i) => (
                          <div key={i} style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 8, padding: 10, fontSize: 11, color: "#94A3B8", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                            <span><b style={{ color: "#CBD5E1" }}>Name:</b> {d.name || "—"}</span>
                            <span><b style={{ color: "#CBD5E1" }}>Email:</b> {d.email || "—"}</span>
                            <span><b style={{ color: "#CBD5E1" }}>Phone:</b> {d.phone || "—"}</span>
                            <span style={{ color: "#FCD34D" }}>By: {d.already_uploaded_by}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Google Sheets */}
              <GoogleSheetCard companyId={company_id} userId={user_id} apiBase={API_BASE_URL} />
            </div>
          )}

        </main>
      </div>

      {/* ── Lead Detail Panel ── */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          leadSchedules={leadSchedules}
          updateLeadSchedule={updateLeadSchedule}
          handleStartFollowup={handleStartFollowup}
          messageTemplate={messageTemplate}
        />
      )}

      {/* ── AI Floating Button (fallback) ── */}
      <button onClick={() => setIsAIAssistOpen(true)}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px #6D28D944", transition: "transform .15s" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
        <Icon d={ICONS.ai} size={20} />
      </button>

      <AIMessageBox isOpen={isAIAssistOpen} onClose={() => setIsAIAssistOpen(false)} />
    </div>
  );
};

export default Dashboard;
