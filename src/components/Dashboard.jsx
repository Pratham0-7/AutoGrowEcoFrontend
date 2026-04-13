import { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import AIMessageBox from "./AIMessageBox";
import "./style.css";
import { useLeads } from "./hooks/useLeads";
import Icon from "./shared/Icon";
import { ICONS } from "./shared/icons";
import LeadDetailPanel from "./panels/LeadDetailPanel";
import Overview   from "./sections/Overview";
import Contacts   from "./sections/Contacts";
import Individual from "./sections/Individual";
import Pipeline   from "./sections/Pipeline";
import Campaign   from "./sections/Campaign";
import Import     from "./sections/Import";
import Sequences  from "./sections/Sequences";

const NAV_ITEMS = [
  { key: "overview",   label: "Overview",   icon: ICONS.home     },
  { key: "contacts",   label: "Contacts",   icon: ICONS.users    },
  { key: "individual", label: "Individual", icon: ICONS.star     },
  { key: "pipeline",   label: "Pipeline",   icon: ICONS.pipeline },
  { key: "campaign",   label: "Campaigns",  icon: ICONS.mail     },
  { key: "sequences",  label: "Sequences",  icon: ICONS.zap      },
  { key: "import",     label: "Import",     icon: ICONS.upload   },
];

const SECTION_SUBTITLE = (total, indCount, filtered, convRate) => ({
  overview:   `${total} total leads · ${convRate}% conversion`,
  contacts:   `${filtered} of ${total} contacts`,
  individual: `${indCount} personal-touch sequences`,
  pipeline:   "Visual deal stages",
  campaign:   "Email & SMS outreach",
  sequences:  "12-step · 75-day automated follow-up",
  import:     "Import leads from CSV or Google Sheets",
});

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const company_id   = localStorage.getItem("company_id");
  const user_id      = localStorage.getItem("user_id");
  const company_name = localStorage.getItem("company_name");
  const name = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || "User";

  const [activeSection, setActiveSection]     = useState("overview");
  const [selectedLead, setSelectedLead]       = useState(null);
  const [isAIAssistOpen, setIsAIAssistOpen]   = useState(false);
  const [emailSubject, setEmailSubject]       = useState("Follow-up from AGE");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [currentPage, setCurrentPage]         = useState(1);

  const isReady = isLoaded && isSignedIn && !!company_id && !!user_id;
  const { leads, leadSchedules, fetchLeads, updateLeadSchedule, markIndividual, handleStartFollowup } = useLeads(company_id, user_id, isReady);

  const individualLeads = leads.filter((l) => l.is_individual_followup);
  const interestedLeads = leads.filter((l) => l.response_status === "yes");
  const totalLeads      = leads.length;
  const convRate        = totalLeads ? Math.round((interestedLeads.length / totalLeads) * 100) : 0;

  const startFollowup = (leadId) =>
    handleStartFollowup(leadId, emailSubject, messageTemplate, () => setSelectedLead(null));

  const navigate = (section) => { setActiveSection(section); setCurrentPage(1); };

  if (!isLoaded) return (
    <div style={{ background: "#070D16", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#374151", fontSize: 13 }}>Loading…</span>
    </div>
  );
  if (!isSignedIn) return null;

  const subtitles = SECTION_SUBTITLE(totalLeads, individualLeads.length, leads.length, convRate);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#070D16", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: "#0A0F1C", borderRight: "1px solid #1E293B", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 9, color: "white", letterSpacing: 1.2, flexShrink: 0 }}>AGE</div>
            <div>
              <p style={{ fontSize: 9, color: "#374151", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>CRM</p>
              <p style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 700, margin: 0, lineHeight: 1.2, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company_name || "Workspace"}</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 2, padding: "0 12px", margin: "0 0 8px" }}>MAIN MENU</p>
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <div key={key} onClick={() => navigate(key)}
              className={`sidebar-item${activeSection === key ? " active" : ""}`}>
              <Icon d={icon} size={15} />
              <span>{label}</span>
              {key === "contacts"   && totalLeads > 0              && <span className="sidebar-badge">{totalLeads - individualLeads.length}</span>}
              {key === "individual" && individualLeads.length > 0  && <span className="sidebar-badge" style={{ background: "#1C1505", color: "#FCD34D" }}>{individualLeads.length}</span>}
              {key === "pipeline"   && interestedLeads.length > 0  && <span className="sidebar-badge" style={{ background: "#052E16", color: "#4ADE80" }}>{interestedLeads.length}</span>}
            </div>
          ))}

          <div style={{ height: 1, background: "#1E293B", margin: "16px 0 14px" }} />
          <p style={{ fontSize: 9, fontWeight: 700, color: "#1E293B", textTransform: "uppercase", letterSpacing: 2, padding: "0 12px", margin: "0 0 8px" }}>AI</p>
          <div onClick={() => setIsAIAssistOpen(true)} className="sidebar-item">
            <Icon d={ICONS.ai} size={15} />
            <span>AI Assistant</span>
          </div>
        </nav>

        <div style={{ padding: "12px 16px", borderTop: "1px solid #1E293B" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UserButton />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#CBD5E1", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
              <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>Workspace Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

        <header style={{ background: "#070D16", borderBottom: "1px solid #1E293B", padding: "0 28px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30, flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
              {NAV_ITEMS.find((n) => n.key === activeSection)?.label}
            </h1>
            <p style={{ fontSize: 10, color: "#374151", margin: 0 }}>{subtitles[activeSection]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#052E16", border: "1px solid #16A34A33", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, color: "#4ADE80" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              Live
            </div>
            <button onClick={() => setIsAIAssistOpen(true)}
              style={{ background: "#0D1117", border: "1px solid #1E293B", color: "#A78BFA", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
              <Icon d={ICONS.ai} size={13} /> AI
            </button>
          </div>
        </header>

        <main style={{ padding: 24, flex: 1 }}>
          {activeSection === "overview"   && <Overview   leads={leads} onSelectLead={setSelectedLead} onNavigate={navigate} />}
          {activeSection === "contacts"   && <Contacts   leads={leads} leadSchedules={leadSchedules} updateLeadSchedule={updateLeadSchedule} onSelectLead={setSelectedLead} onStartFollowup={startFollowup} onMarkIndividual={markIndividual} onGoToImport={() => navigate("import")} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
          {activeSection === "individual" && <Individual leads={individualLeads} leadSchedules={leadSchedules} updateLeadSchedule={updateLeadSchedule} onSelectLead={setSelectedLead} onStartFollowup={startFollowup} onRemove={(id) => markIndividual(id, false)} onGoToContacts={() => navigate("contacts")} />}
          {activeSection === "pipeline"   && <Pipeline   leads={leads} onSelectLead={setSelectedLead} />}
          {activeSection === "campaign"   && <Campaign   leads={leads} individualLeads={individualLeads} emailSubject={emailSubject} setEmailSubject={setEmailSubject} messageTemplate={messageTemplate} setMessageTemplate={setMessageTemplate} companyId={company_id} fetchLeads={fetchLeads} onViewIndividual={() => navigate("individual")} onOpenAI={() => setIsAIAssistOpen(true)} />}
          {activeSection === "sequences"  && <Sequences  leads={leads} companyId={company_id} fetchLeads={fetchLeads} />}
          {activeSection === "import"     && <Import     companyId={company_id} userId={user_id} fetchLeads={fetchLeads} />}
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

      <button onClick={() => setIsAIAssistOpen(true)}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40, width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #4F46E5)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px #6D28D944", transition: "transform .15s" }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
        <Icon d={ICONS.ai} size={20} />
      </button>

      <AIMessageBox isOpen={isAIAssistOpen} onClose={() => setIsAIAssistOpen(false)} />
    </div>
  );
};

export default Dashboard;