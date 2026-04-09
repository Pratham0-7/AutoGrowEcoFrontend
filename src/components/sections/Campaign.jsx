import { useState } from "react";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Campaign = ({ leads, individualLeads, emailSubject, setEmailSubject, messageTemplate, setMessageTemplate, companyId, fetchLeads, onViewIndividual, onOpenAI }) => {
  const [intervalDays, setIntervalDays] = useState(2);
  const [bulkStatus, setBulkStatus]     = useState(null);

  const sentLeads = leads.filter((l) => l.send_status && l.send_status !== "not sent").length;
  const yesLeads  = leads.filter((l) => l.response_status === "yes").length;

  const handleBulkSend = async (type) => {
    if (!messageTemplate.trim()) { setBulkStatus({ type: "error", msg: "Please enter a message template first." }); return; }
    setBulkStatus({ type: "loading", msg: "Sending…" });
    try {
      const res = await fetch(`${API_BASE_URL}/send_bulk/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, interval_days: Number(intervalDays), subject: emailSubject, message: messageTemplate }),
      });
      const data = await res.json();
      if (res.ok) { setBulkStatus({ type: "success", msg: data.message }); fetchLeads(); }
      else setBulkStatus({ type: "error", msg: data.error });
    } catch { setBulkStatus({ type: "error", msg: "Send failed" }); }
  };

  return (
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
          <button onClick={onOpenAI} className="crm-btn-sm crm-btn-ghost" style={{ marginLeft: "auto" }}>
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
                {[2,3,4,5,6,7].map((d) => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { type: "email", label: "Email All",     bg: "linear-gradient(135deg, #1D4ED8, #1E40AF)" },
                { type: "sms",   label: "SMS All",       bg: "linear-gradient(135deg, #6D28D9, #4C1D95)" },
                { type: "both",  label: "Both Channels", bg: "#0D1117", border: "1px solid #334155" },
              ].map(({ type, label, bg, border }) => (
                <button key={type} onClick={() => handleBulkSend(type)}
                  style={{ background: bg, color: "white", border: border || "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {bulkStatus && (
            <div style={{
              background: bulkStatus.type === "success" ? "#052E16" : bulkStatus.type === "loading" ? "#0A0F1C" : "#2D0A0A",
              border: `1px solid ${bulkStatus.type === "success" ? "#16A34A44" : bulkStatus.type === "loading" ? "#1E293B" : "#DC262644"}`,
              borderRadius: 10, padding: "12px 16px", fontSize: 12,
              color: bulkStatus.type === "success" ? "#4ADE80" : bulkStatus.type === "loading" ? "#94A3B8" : "#F87171",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>{bulkStatus.type === "success" ? "✓" : bulkStatus.type === "loading" ? "⟳" : "✗"}</span>
              {bulkStatus.msg}
            </div>
          )}
        </div>
      </div>

      {individualLeads.length > 0 && (
        <div style={{ background: "#1C1505", border: "1px solid #D9770633", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={ICONS.star} size={14} />
          <p style={{ fontSize: 12, color: "#92400E", margin: 0 }}>
            <span style={{ color: "#FCD34D", fontWeight: 700 }}>{individualLeads.length} individual lead{individualLeads.length > 1 ? "s" : ""}</span> will be automatically skipped.
          </p>
          <button onClick={onViewIndividual}
            style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#FCD34D", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", padding: 0 }}>
            View <Icon d={ICONS.arrowRight} size={10} />
          </button>
        </div>
      )}

      {leads.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Will Receive (Bulk)", value: leads.filter(l => (!l.send_status || l.send_status === "not sent") && !l.is_individual_followup).length, color: "#60A5FA" },
            { label: "Already Sent",        value: sentLeads, color: "#818CF8" },
            { label: "Interested Replies",  value: yesLeads,  color: "#4ADE80" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 12, padding: "14px 18px" }}>
              <p style={{ fontSize: 10, color: "#374151", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0 }}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaign;