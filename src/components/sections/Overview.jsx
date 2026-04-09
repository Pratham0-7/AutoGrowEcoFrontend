import StatCard from "../shared/StatCard";
import { ReplyBadge } from "../shared/Badges";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import { formatRelative, avatarColor, getInitial } from "../shared/helpers";

const Overview = ({ leads, onSelectLead, onNavigate }) => {
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

  const recentActivity = [...leads]
    .filter((l) => l.last_followup_sent_at || (l.send_status && l.send_status !== "not sent"))
    .sort((a, b) => new Date(b.last_followup_sent_at || 0) - new Date(a.last_followup_sent_at || 0))
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <StatCard label="Total Contacts" value={totalLeads}   accent="#818CF8" icon={ICONS.users}  sub={`${pipeline.new.length} not yet contacted`} />
        <StatCard label="Contacted"      value={sentLeads}    accent="#60A5FA" icon={ICONS.mail}   sub={`${Math.round(sentLeads / (totalLeads || 1) * 100)}% of contacts`} trend={`${Math.round(sentLeads / (totalLeads || 1) * 100)}% reach rate`} trendUp={sentLeads > 0} />
        <StatCard label="Interested"     value={yesLeads}     accent="#4ADE80" icon={ICONS.check}  sub="Replied yes" trend={`${convRate}% conversion`} trendUp={convRate > 0} />
        <StatCard label="Pending"        value={pendingLeads} accent="#FCD34D" icon={ICONS.clock}  sub="Need follow-up" />
        <StatCard label="Declined"       value={pipeline.declined.length} accent="#F87171" icon={ICONS.x} sub="Replied no" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Conversion Funnel</h3>
            <span style={{ fontSize: 11, color: "#374151" }}>{convRate}% overall</span>
          </div>
          {[
            { label: "Total Leads", value: totalLeads, color: "#818CF8", pct: 100 },
            { label: "Contacted",   value: sentLeads,  color: "#60A5FA", pct: totalLeads ? Math.round(sentLeads / totalLeads * 100) : 0 },
            { label: "Interested",  value: yesLeads,   color: "#4ADE80", pct: totalLeads ? Math.round(yesLeads / totalLeads * 100) : 0 },
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
              { label: "New",         val: pipeline.new.length,        color: "#64748B" },
              { label: "In Progress", val: pipeline.contacted.length,  color: "#60A5FA" },
              { label: "Won",         val: pipeline.interested.length, color: "#4ADE80" },
              { label: "Lost",        val: pipeline.declined.length,   color: "#F87171" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color, margin: 0 }}>{val}</p>
                <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Recent Activity</h3>
            <button onClick={() => onNavigate("contacts")}
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
                <div key={l._id} onClick={() => onSelectLead(l)} className="lead-row"
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { icon: ICONS.plus,     label: "Import Leads",    sub: "Upload CSV or connect Sheets", key: "import",   color: "#60A5FA" },
          { icon: ICONS.mail,     label: "Create Campaign", sub: "Send to all contacts",         key: "campaign", color: "#A78BFA" },
          { icon: ICONS.pipeline, label: "View Pipeline",   sub: "See deal stages",              key: "pipeline", color: "#4ADE80" },
          { icon: ICONS.users,    label: "Manage Contacts", sub: `${totalLeads} total`,          key: "contacts", color: "#FCD34D" },
        ].map(({ icon, label, sub, key, color }) => (
          <div key={key} onClick={() => onNavigate(key)}
            style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 14, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}
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
  );
};

export default Overview;