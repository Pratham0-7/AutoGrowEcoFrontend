import StatCard from "../shared/StatCard";
import { ReplyBadge } from "../shared/Badges";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import { formatRelative, avatarColor, getInitial } from "../shared/helpers";

const THEME = {
  panel: "#142830",
  panelAlt: "#10232A",
  border: "#1E3D47",
  text: "#FFFFFF",
  muted: "#6B8E95",
  teal: "#1A8A9E",
  coral: "#E8563A",
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
};

const Overview = ({ leads, onSelectLead, onNavigate }) => {
  const totalLeads = leads.length;

  const sentLeads = leads.filter(
    (l) => l.send_status && l.send_status !== "not sent"
  ).length;

  const yesLeads = leads.filter((l) => l.response_status === "yes").length;

  const pendingLeads = leads.filter(
    (l) =>
      !l.response_status ||
      l.response_status === "pending" ||
      l.response_status === "no reply"
  ).length;

  const convRate = totalLeads ? Math.round((yesLeads / totalLeads) * 100) : 0;

  const pipeline = {
    new: leads.filter((l) => !l.send_status || l.send_status === "not sent"),
    contacted: leads.filter(
      (l) =>
        l.send_status &&
        l.send_status !== "not sent" &&
        l.response_status !== "yes" &&
        l.response_status !== "no"
    ),
    interested: leads.filter((l) => l.response_status === "yes"),
    declined: leads.filter((l) => l.response_status === "no"),
  };

  const pipelineChart = [
    {
      label: "New",
      value: pipeline.new.length,
      color: THEME.muted,
    },
    {
      label: "In Progress",
      value: pipeline.contacted.length,
      color: "#58D2E6",
    },
    {
      label: "Won",
      value: pipeline.interested.length,
      color: THEME.green,
    },
    {
      label: "Lost",
      value: pipeline.declined.length,
      color: THEME.coral,
    },
  ];

  const chartMax = Math.max(...pipelineChart.map((item) => item.value), 1);

  const recentActivity = [...leads]
    .filter(
      (l) =>
        l.last_followup_sent_at ||
        (l.send_status && l.send_status !== "not sent")
    )
    .sort(
      (a, b) =>
        new Date(b.last_followup_sent_at || 0) -
        new Date(a.last_followup_sent_at || 0)
    )
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}
      >
        <StatCard
          label="Total Contacts"
          value={totalLeads}
          accent={THEME.teal}
          icon={ICONS.users}
          sub={`${pipeline.new.length} not yet contacted`}
        />

        <StatCard
          label="Contacted"
          value={sentLeads}
          accent={THEME.teal}
          icon={ICONS.mail}
          sub={`${Math.round((sentLeads / (totalLeads || 1)) * 100)}% of contacts`}
          trend={`${Math.round((sentLeads / (totalLeads || 1)) * 100)}% reach rate`}
          trendUp={sentLeads > 0}
        />

        <StatCard
          label="Interested"
          value={yesLeads}
          accent={THEME.green}
          icon={ICONS.check}
          sub="Replied yes"
          trend={`${convRate}% conversion`}
          trendUp={convRate > 0}
        />

        <StatCard
          label="Pending"
          value={pendingLeads}
          accent={THEME.yellow}
          icon={ICONS.clock}
          sub="Need follow-up"
        />

        <StatCard
          label="Declined"
          value={pipeline.declined.length}
          accent={THEME.coral}
          icon={ICONS.x}
          sub="Replied no"
        />
      </div>

      <div className="overview-grid-2" style={{ gap: 14 }}>
        {/* Conversion Funnel */}
        <div
          style={{
            background: THEME.panel,
            border: `1px solid ${THEME.border}`,
            borderRadius: 16,
            padding: 20,
            minHeight: 420,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: THEME.text,
                margin: 0,
              }}
            >
              Conversion Funnel
            </h3>

            <span style={{ fontSize: 11, color: THEME.muted }}>
              {convRate}% overall
            </span>
          </div>

          {[
            {
              label: "Total Leads",
              value: totalLeads,
              color: THEME.teal,
              pct: 100,
            },
            {
              label: "Contacted",
              value: sentLeads,
              color: "#58D2E6",
              pct: totalLeads ? Math.round((sentLeads / totalLeads) * 100) : 0,
            },
            {
              label: "Interested",
              value: yesLeads,
              color: THEME.green,
              pct: totalLeads ? Math.round((yesLeads / totalLeads) * 100) : 0,
            },
          ].map(({ label, value, color, pct }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 11, color: THEME.muted }}>
                  {label}
                </span>

                <span style={{ fontSize: 11, fontWeight: 700, color }}>
                  {value}{" "}
                  <span style={{ color: THEME.muted, fontWeight: 400 }}>
                    ({pct}%)
                  </span>
                </span>
              </div>

              <div
                style={{
                  background: THEME.panelAlt,
                  borderRadius: 4,
                  height: 6,
                  border: `1px solid ${THEME.border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: color,
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: 4,
                    transition: "width 0.35s ease",
                  }}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop: `1px solid ${THEME.border}`,
              marginTop: 16,
              paddingTop: 16,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {pipelineChart.map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  flex: 1,
                  minWidth: 70,
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color,
                    margin: 0,
                  }}
                >
                  {value}
                </p>

                <p
                  style={{
                    fontSize: 10,
                    color: THEME.muted,
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Dynamic graph */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: `1px solid ${THEME.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                gap: 12,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: THEME.text,
                    margin: 0,
                  }}
                >
                  Pipeline Breakdown
                </p>

                <p
                  style={{
                    fontSize: 10,
                    color: THEME.muted,
                    margin: "3px 0 0",
                  }}
                >
                  Live distribution of lead status
                </p>
              </div>

              <span
                style={{
                  fontSize: 10,
                  color: THEME.muted,
                  border: `1px solid ${THEME.border}`,
                  background: THEME.panelAlt,
                  padding: "4px 8px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                Updates live
              </span>
            </div>

            <div
              style={{
                height: 180,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
                alignItems: "end",
                padding: "14px 12px 8px",
                background: THEME.panelAlt,
                border: `1px solid ${THEME.border}`,
                borderRadius: 14,
              }}
            >
              {pipelineChart.map(({ label, value, color }) => {
                const height =
                  value === 0 ? 4 : Math.max((value / chartMax) * 100, 8);

                return (
                  <div
                    key={label}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color,
                      }}
                    >
                      {value}
                    </span>

                    <div
                      title={`${label}: ${value}`}
                      style={{
                        width: "100%",
                        maxWidth: 44,
                        height: `${height}%`,
                        minHeight: 6,
                        background: color,
                        borderRadius: "10px 10px 4px 4px",
                        boxShadow: `0 0 18px ${color}35`,
                        transition: "height 0.35s ease",
                      }}
                    />

                    <span
                      style={{
                        fontSize: 9,
                        color: THEME.muted,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: THEME.panel,
            border: `1px solid ${THEME.border}`,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: THEME.text,
                margin: 0,
              }}
            >
              Recent Activity
            </h3>

            <button
              onClick={() => onNavigate("contacts")}
              style={{
                background: "transparent",
                border: "none",
                color: THEME.teal,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              View all <Icon d={ICONS.arrowRight} size={11} />
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: THEME.muted,
                fontSize: 12,
              }}
            >
              No activity yet. Start a campaign to see updates here.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentActivity.map((l) => (
                <div
                  key={l._id}
                  onClick={() => onSelectLead(l)}
                  className="lead-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: THEME.panelAlt,
                    border: `1px solid ${THEME.border}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: avatarColor(l.name),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {getInitial(l.name)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: THEME.text,
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.name}
                    </p>

                    <p
                      style={{
                        fontSize: 10,
                        color: THEME.muted,
                        margin: 0,
                      }}
                    >
                      {l.followup_count || 0} follow-ups sent
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 3,
                      flexShrink: 0,
                    }}
                  >
                    <ReplyBadge status={l.response_status} />

                    {formatRelative(l.last_followup_sent_at) && (
                      <span style={{ fontSize: 9, color: THEME.muted }}>
                        {formatRelative(l.last_followup_sent_at)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {[
          {
            icon: ICONS.plus,
            label: "Import Leads",
            sub: "Upload CSV or connect Sheets",
            key: "import",
            color: "#58D2E6",
          },
          {
            icon: ICONS.mail,
            label: "Create Campaign",
            sub: "Send to all contacts",
            key: "campaign",
            color: THEME.coral,
          },
          {
            icon: ICONS.pipeline,
            label: "View Pipeline",
            sub: "See deal stages",
            key: "pipeline",
            color: THEME.green,
          },
          {
            icon: ICONS.users,
            label: "Manage Contacts",
            sub: `${totalLeads} total`,
            key: "contacts",
            color: THEME.yellow,
          },
        ].map(({ icon, label, sub, key, color }) => (
          <div
            key={key}
            onClick={() => onNavigate(key)}
            style={{
              background: THEME.panel,
              border: `1px solid ${THEME.border}`,
              borderRadius: 14,
              padding: "16px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
            className="pipeline-card"
          >
            <div
              style={{
                background: `${color}18`,
                color,
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon d={icon} size={16} />
            </div>

            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: THEME.text,
                  margin: 0,
                }}
              >
                {label}
              </p>

              <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;