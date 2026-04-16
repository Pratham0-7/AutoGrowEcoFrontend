import Icon from "./Icon";
import { ICONS } from "./icons";

const StatCard = ({ label, value, accent, icon, sub, trend, trendUp }) => (
  <div style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
    <div style={{ background: accent, opacity: 0.07, filter: "blur(40px)", position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", pointerEvents: "none" }} />
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 30, fontWeight: 800, color: "#FFFFFF", margin: "8px 0 4px", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>{sub}</p>}
      </div>
      <div style={{ background: accent + "18", color: accent, width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon d={icon} size={17} />
      </div>
    </div>
    {trend !== undefined && (
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1E3D4722", display: "flex", alignItems: "center", gap: 5 }}>
        <Icon d={trendUp ? ICONS.trendUp : ICONS.trendDown} size={11} />
        <span style={{ fontSize: 11, color: trendUp ? "#22C55E" : "#EF4444" }}>{trend}</span>
      </div>
    )}
  </div>
);

export default StatCard;
