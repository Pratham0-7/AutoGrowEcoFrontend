import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import { SendBadge, ReplyBadge } from "../shared/Badges";
import { formatDate, avatarColor, getInitial } from "../shared/helpers";

const LeadDetailPanel = ({ lead, onClose, leadSchedules, updateLeadSchedule, handleStartFollowup, messageTemplate }) => {
  if (!lead) return null;
  const cfg = leadSchedules[lead._id] || {};

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 400, background: "#0D1117", borderLeft: "1px solid #1E293B", zIndex: 51, overflowY: "auto", display: "flex", flexDirection: "column" }}>

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

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <SendBadge status={lead.send_status} />
            <ReplyBadge status={lead.response_status} />
            {lead.is_individual_followup && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", background: "#1E1B4B", border: "1px solid #4C1D95", borderRadius: 100, padding: "2px 8px" }}>INDIVIDUAL</span>
            )}
            {lead.source === "google_sheets" && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#4ADE80", background: "#052E16", border: "1px solid #16A34A44", borderRadius: 100, padding: "2px 8px" }}>SHEETS</span>
            )}
          </div>

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
                <p style={{ fontSize: 11, fontWeight: 600, color: "#64748B", margin: 0, wordBreak: "break-all" }}>
                  {lead.campaign_id ? lead.campaign_id.slice(-8) + "…" : "—"}
                </p>
              </div>
            </div>
          </div>

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
                  {[2,3,4,5,6,7].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
              </div>
            </div>
          </div>

          {!messageTemplate?.trim() && (
            <div style={{ background: "#1C1505", border: "1px solid #D9770644", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#FCD34D" }}>
              ⚠ Set a message in <b>Campaigns</b> before starting follow-up.
            </div>
          )}

          <button onClick={() => handleStartFollowup(lead._id)}
            className="crm-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Start Follow-up Sequence
            <Icon d={ICONS.arrowRight} size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPanel;