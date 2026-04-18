import { SendBadge } from "../shared/Badges";
import { avatarColor, getInitial } from "../shared/helpers";

const PipelineCard = ({ lead, onClick }) => (
  <div onClick={() => onClick(lead)} className="pipeline-card"
    style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 10, padding: 12, cursor: "pointer", marginBottom: 8 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarColor(lead.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
        {getInitial(lead.name)}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name || "—"}</p>
        <p style={{ fontSize: 10, color: "#6B8E95", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.email || lead.phone || "—"}</p>
      </div>
    </div>
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      <SendBadge status={lead.send_status} />
      {lead.followup_count > 0 && (
        <span style={{ background: "#123B45", color: "#9FE6F2", border: "1px solid #1A8A9E44", borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>
          {lead.followup_count} follow-ups
        </span>
      )}
    </div>
  </div>
);

const PipelineColumn = ({ title, color, bg, leads, onLeadClick }) => (
  <div className="pipeline-col" style={{ background: "#0D1F24", border: "1px solid #1E3D47", borderRadius: 14, padding: 14, minWidth: 220, flex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF" }}>{title}</span>
      <span style={{ background: bg, color, borderRadius: 100, padding: "1px 8px", fontSize: 10, fontWeight: 700, marginLeft: "auto" }}>{leads.length}</span>
    </div>
    <div className="pipeline-col-inner" style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto" }}>
      {leads.length === 0
        ? <div style={{ textAlign: "center", padding: "28px 12px", color: "#6B8E95", fontSize: 11 }}>No leads here</div>
        : leads.map((l) => <PipelineCard key={l._id} lead={l} onClick={onLeadClick} />)
      }
    </div>
  </div>
);

const Pipeline = ({ leads, onSelectLead }) => {
  const pipeline = {
    new:        leads.filter((l) => !l.send_status || l.send_status === "not sent"),
    contacted:  leads.filter((l) => l.send_status && l.send_status !== "not sent" && l.response_status !== "yes" && l.response_status !== "no"),
    interested: leads.filter((l) => l.response_status === "yes"),
    declined:   leads.filter((l) => l.response_status === "no"),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="pipeline-cols" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
        <PipelineColumn title="New"        color="#6B8E95" bg="#1E3D47"  leads={pipeline.new}        onLeadClick={onSelectLead} />
        <PipelineColumn title="Contacted"  color="#60A5FA" bg="#1E3A5F"  leads={pipeline.contacted}  onLeadClick={onSelectLead} />
        <PipelineColumn title="Interested" color="#22C55E" bg="#0D3D20"  leads={pipeline.interested} onLeadClick={onSelectLead} />
        <PipelineColumn title="Declined"   color="#EF4444" bg="#2D0A0A"  leads={pipeline.declined}   onLeadClick={onSelectLead} />
      </div>
      <p style={{ fontSize: 11, color: "#6B8E95", margin: 0, textAlign: "center" }}>
        Click any card to view contact details and start a follow-up
      </p>
    </div>
  );
};

export default Pipeline;
