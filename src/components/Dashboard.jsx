import { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import AIMessageBox from "./AIMessageBox";
import "./style.css";
import { useLeads } from "./hooks/useLeads";
import Icon from "./shared/Icon";
import { ICONS } from "./shared/icons";
import LeadDetailPanel from "./panels/LeadDetailPanel";
import Overview from "./sections/Overview";
import Contacts from "./sections/Contacts";
import Individual from "./sections/Individual";
import Pipeline from "./sections/Pipeline";
import Campaign from "./sections/Campaign";
import Import from "./sections/Import";
import Sequences from "./sections/Sequences";

const THEME = {
  page: "#0D1F24",
  panel: "#142830",
  panelAlt: "#10232A",
  border: "#1E3D47",
  text: "#FFFFFF",
  muted: "#6B8E95",
  teal: "#1A8A9E",
  tealSoft: "#123B45",
  coral: "#E8563A",
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
};

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: ICONS.home },
  { key: "contacts", label: "Contacts", icon: ICONS.users },
  { key: "individual", label: "Individual", icon: ICONS.star },
  { key: "pipeline", label: "Pipeline", icon: ICONS.pipeline },
  { key: "campaign", label: "One Time Send", icon: ICONS.mail },
  { key: "sequences", label: "Sequences", icon: ICONS.zap },
  { key: "import", label: "Import", icon: ICONS.upload },
];

const SECTION_SUBTITLE = (total, indCount, filtered, convRate) => ({
  overview: `${total} total leads · ${convRate}% conversion`,
  contacts: `${filtered} of ${total} contacts`,
  individual: `${indCount} personal-touch sequences`,
  pipeline: "Visual deal stages",
  campaign: "Email-first outreach",
  sequences: "12-step · 75-day automated follow-up",
  import: "Import leads from CSV or Google Sheets",
});

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const company_id = localStorage.getItem("company_id");
  const user_id = localStorage.getItem("user_id");
  const company_name = localStorage.getItem("company_name");
  const name =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";

  const [activeSection, setActiveSection] = useState("overview");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAIAssistOpen, setIsAIAssistOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Follow-up from AGE");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isReady = isLoaded && isSignedIn && !!company_id && !!user_id;
  const {
    leads,
    leadSchedules,
    fetchLeads,
    updateLeadSchedule,
    markIndividual,
    handleStartFollowup,
  } = useLeads(company_id, user_id, isReady);

  const individualLeads = leads.filter((l) => l.is_individual_followup);
  const interestedLeads = leads.filter((l) => l.response_status === "yes");
  const totalLeads = leads.length;
  const convRate = totalLeads
    ? Math.round((interestedLeads.length / totalLeads) * 100)
    : 0;

  const startFollowup = (leadId) =>
    handleStartFollowup(leadId, emailSubject, messageTemplate, () =>
      setSelectedLead(null)
    );

  const navigate = (section) => {
    setActiveSection(section);
    setCurrentPage(1);
  };

  if (!isLoaded)
    return (
      <div
        style={{
          background: THEME.page,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: THEME.muted, fontSize: 13 }}>Loading…</span>
      </div>
    );

  if (!isSignedIn) return null;

  const subtitles = SECTION_SUBTITLE(
    totalLeads,
    individualLeads.length,
    leads.length,
    convRate
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: THEME.page,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: THEME.text,
      }}
    >
      <aside
        style={{
          width: 220,
          background: THEME.panelAlt,
          borderRight: `1px solid ${THEME.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 16px",
            borderBottom: `1px solid ${THEME.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                background: THEME.teal,
                borderRadius: 10,
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 9,
                color: "white",
                letterSpacing: 1.2,
                flexShrink: 0,
              }}
            >
              AGE
            </div>
            <div>
              <p
                style={{
                  fontSize: 9,
                  color: THEME.muted,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                CRM
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: THEME.text,
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {company_name || "Workspace"}
              </p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: THEME.muted,
              textTransform: "uppercase",
              letterSpacing: 2,
              padding: "0 12px",
              margin: "0 0 8px",
            }}
          >
            MAIN MENU
          </p>

          {NAV_ITEMS.map(({ key, label, icon }) => {
            const active = activeSection === key;
            return (
              <div
                key={key}
                onClick={() => navigate(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  color: active ? THEME.text : THEME.muted,
                  background: active ? THEME.teal : "transparent",
                  fontWeight: active ? 700 : 500,
                  marginBottom: 4,
                  transition: "all .15s",
                }}
              >
                <Icon d={icon} size={15} />
                <span>{label}</span>

                {key === "contacts" && totalLeads > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: active ? "rgba(255,255,255,.16)" : THEME.tealSoft,
                      color: active ? "#fff" : "#9FE6F2",
                      borderRadius: 100,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {totalLeads - individualLeads.length}
                  </span>
                )}

                {key === "individual" && individualLeads.length > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "rgba(245,158,11,.14)",
                      color: "#F5B74F",
                      borderRadius: 100,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {individualLeads.length}
                  </span>
                )}

                {key === "pipeline" && interestedLeads.length > 0 && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "rgba(34,197,94,.14)",
                      color: "#7DE3A0",
                      borderRadius: 100,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {interestedLeads.length}
                  </span>
                )}
              </div>
            );
          })}

          <div
            style={{
              height: 1,
              background: THEME.border,
              margin: "16px 0 14px",
            }}
          />
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: THEME.muted,
              textTransform: "uppercase",
              letterSpacing: 2,
              padding: "0 12px",
              margin: "0 0 8px",
            }}
          >
            AI
          </p>

          <div
            onClick={() => setIsAIAssistOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              cursor: "pointer",
              color: THEME.muted,
            }}
          >
            <Icon d={ICONS.ai} size={15} />
            <span>AI Assistant</span>
          </div>
        </nav>

        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${THEME.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserButton />
            <div style={{ minWidth: 0 }}>
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
                {name}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: THEME.muted,
                  margin: 0,
                }}
              >
                Workspace Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            background: THEME.page,
            borderBottom: `1px solid ${THEME.border}`,
            padding: "0 28px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: THEME.text,
                margin: 0,
              }}
            >
              {NAV_ITEMS.find((n) => n.key === activeSection)?.label}
            </h1>
            <p
              style={{
                fontSize: 10,
                color: THEME.muted,
                margin: 0,
              }}
            >
              {subtitles[activeSection]}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: THEME.tealSoft,
                border: `1px solid ${THEME.border}`,
                borderRadius: 100,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
                color: "#A8F0FC",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: THEME.green,
                  display: "inline-block",
                  animation: "pulse-dot 2s infinite",
                }}
              />
              Live
            </div>

            <button
              onClick={() => setIsAIAssistOpen(true)}
              style={{
                background: THEME.panel,
                border: `1px solid ${THEME.border}`,
                color: "#9FE6F2",
                borderRadius: 10,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "inherit",
              }}
            >
              <Icon d={ICONS.ai} size={13} /> AI
            </button>
          </div>
        </header>

        <main style={{ padding: 24, flex: 1 }}>
          {activeSection === "overview" && (
            <Overview
              leads={leads}
              onSelectLead={setSelectedLead}
              onNavigate={navigate}
            />
          )}
          {activeSection === "contacts" && (
            <Contacts
              leads={leads}
              leadSchedules={leadSchedules}
              updateLeadSchedule={updateLeadSchedule}
              onSelectLead={setSelectedLead}
              onStartFollowup={startFollowup}
              onMarkIndividual={markIndividual}
              onGoToImport={() => navigate("import")}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {activeSection === "individual" && (
            <Individual
              leads={individualLeads}
              leadSchedules={leadSchedules}
              updateLeadSchedule={updateLeadSchedule}
              onSelectLead={setSelectedLead}
              onStartFollowup={startFollowup}
              onRemove={(id) => markIndividual(id, false)}
              onGoToContacts={() => navigate("contacts")}
            />
          )}
          {activeSection === "pipeline" && (
            <Pipeline leads={leads} onSelectLead={setSelectedLead} />
          )}
          {activeSection === "campaign" && (
            <Campaign
              leads={leads}
              individualLeads={individualLeads}
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              messageTemplate={messageTemplate}
              setMessageTemplate={setMessageTemplate}
              companyId={company_id}
              fetchLeads={fetchLeads}
              onViewIndividual={() => navigate("individual")}
              onOpenAI={() => setIsAIAssistOpen(true)}
            />
          )}
          {activeSection === "sequences" && (
            <Sequences leads={leads} companyId={company_id} fetchLeads={fetchLeads} />
          )}
          {activeSection === "import" && (
            <Import companyId={company_id} userId={user_id} fetchLeads={fetchLeads} />
          )}
        </main>
      </div>

      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          leadSchedules={leadSchedules}
          updateLeadSchedule={updateLeadSchedule}
          handleStartFollowup={startFollowup}
          messageTemplate={messageTemplate}
        />
      )}

      <button
        onClick={() => setIsAIAssistOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 40,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: THEME.coral,
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(232,86,58,.28)",
          transition: "transform .15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <Icon d={ICONS.ai} size={20} />
      </button>

      <AIMessageBox isOpen={isAIAssistOpen} onClose={() => setIsAIAssistOpen(false)} />
    </div>
  );
};

export default Dashboard;