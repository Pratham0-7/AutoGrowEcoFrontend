export const SendBadge = ({ status }) => {
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

export const ReplyBadge = ({ status }) => {
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