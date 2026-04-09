import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import { SendBadge, ReplyBadge } from "../shared/Badges";
import { formatDate, avatarColor, getInitial } from "../shared/helpers";

const Individual = ({ leads, leadSchedules, updateLeadSchedule, onStartFollowup, onSelectLead, onRemove, onGoToContacts }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

    <div style={{ background: "#1C1505", border: "1px solid #D9770633", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
      <div style={{ color: "#FCD34D", flexShrink: 0, marginTop: 1 }}><Icon d={ICONS.star} size={15} /></div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#FCD34D", margin: "0 0 3px" }}>Individual follow-up sequences</p>
        <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.6 }}>
          These leads get a personal-touch sequence. They are <b style={{ color: "#FCD34D" }}>automatically excluded from bulk campaigns</b>.
        </p>
      </div>
    </div>

    <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 8 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>Individual Pool</h2>
        <span style={{ background: "#1C1505", color: "#FCD34D", border: "1px solid #D9770633", borderRadius: 100, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>
          {leads.length}
        </span>
        <p style={{ fontSize: 11, color: "#374151", margin: "0 0 0 auto" }}>
          Add from Contacts using the <span style={{ color: "#FCD34D" }}>★ +</span> button
        </p>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>★</div>
          <p style={{ fontSize: 14, color: "#4B5563", fontWeight: 500, margin: "0 0 4px" }}>No individual leads yet</p>
          <p style={{ fontSize: 12, color: "#374151", margin: "0 0 16px" }}>Go to Contacts and click the <b style={{ color: "#FCD34D" }}>+</b> on any row.</p>
          <button onClick={onGoToContacts} className="crm-btn-primary">Go to Contacts</button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#070D16" }}>
                {["Contact","Status","Follow-ups","Last Sent","Next","Channel","Gap","Action","Remove"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", borderBottom: "1px solid #1E293B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="lead-row" onClick={() => onSelectLead(lead)} style={{ borderBottom: "1px solid #0A0F1C" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
                        {getInitial(lead.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>{lead.name || "—"}</p>
                        <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{lead.email || lead.phone || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <SendBadge status={lead.send_status} />
                      <ReplyBadge status={lead.response_status} />
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ background: "#1E1B4B", color: "#818CF8", border: "1px solid #312E81", borderRadius: 8, padding: "3px 10px", fontWeight: 700 }}>{lead.followup_count || 0}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#4B5563", fontSize: 11, whiteSpace: "nowrap" }}>{formatDate(lead.last_followup_sent_at)}</td>
                  <td style={{ padding: "12px 16px", fontSize: 11, whiteSpace: "nowrap" }}>
                    {lead.next_followup_at
                      ? <span style={{ color: "#FCD34D" }}>{formatDate(lead.next_followup_at)}</span>
                      : <span style={{ color: "#374151" }}>Not started</span>}
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                    <select value={leadSchedules[lead._id]?.channel || "email"}
                      onChange={(e) => updateLeadSchedule(lead._id, "channel", e.target.value)}
                      className="crm-input" style={{ borderRadius: 7, padding: "5px 8px", fontSize: 11, minWidth: 72 }}>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="both">Both</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                    <select value={leadSchedules[lead._id]?.interval_days || 2}
                      onChange={(e) => updateLeadSchedule(lead._id, "interval_days", Number(e.target.value))}
                      className="crm-input" style={{ borderRadius: 7, padding: "5px 8px", fontSize: 11, minWidth: 62 }}>
                      {[2,3,4,5,6,7].map((d) => <option key={d} value={d}>{d}d</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onStartFollowup(lead._id)} className="crm-btn-sm"
                      style={{ background: "linear-gradient(135deg, #92400E, #B45309)", color: "white", border: "none", whiteSpace: "nowrap" }}>
                      {lead.next_followup_at ? "Re-start ▶" : "Start ▶"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onRemove(lead._id)}
                      style={{ background: "#0D1117", border: "1px solid #1E293B", color: "#4B5563", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.color = "#4B5563"; }}>
                      <Icon d={ICONS.minus} size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default Individual;