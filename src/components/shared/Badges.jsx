export const SendBadge = ({ status }) => {
  const map = {
    "email sent": { label: "Email", bg: "#1E3A5F", color: "#60A5FA", border: "#2563EB33" },
    "sms sent":   { label: "SMS",   bg: "#123B45", color: "#9FE6F2", border: "#1A8A9E44" },
    "both sent":  { label: "Both",  bg: "#142830", color: "#FFFFFF", border: "#1E3D47"   },
  };
  const s = map[status] || { label: "Not Sent", bg: "#1E3D47", color: "#6B8E95", border: "#1E3D47" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: "inline-flex", alignItems: "center", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

export const ReplyBadge = ({ status }) => {
  const map = {
    yes: { label: "Interested", bg: "#0D3D20", color: "#22C55E", border: "#22C55E44", dot: "#22C55E" },
    no:  { label: "Declined",   bg: "#2D0A0A", color: "#EF4444", border: "#EF444444", dot: "#EF4444" },
  };
  const s = map[status] || { label: "Pending", bg: "#1C1505", color: "#FCD34D", border: "#D9770644", dot: "#F59E0B" };
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, display: "inline-flex", alignItems: "center", gap: 5, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ background: s.dot, width: 5, height: 5, borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
      {s.label}
    </span>
  );
};
