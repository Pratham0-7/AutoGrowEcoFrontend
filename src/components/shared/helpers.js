export const sortLeads = (arr) => {
  const order = { yes: 1, pending: 2, "no reply": 2, no: 3 };
  return [...arr].sort((a, b) => (order[a.response_status] || 99) - (order[b.response_status] || 99));
};

export const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatRelative = (d) => {
  if (!d) return null;
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

export const AVATAR_COLORS = [
  "#7C3AED","#6366F1","#0EA5E9","#10B981","#F59E0B","#EF4444","#EC4899","#14B8A6",
];

export const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];