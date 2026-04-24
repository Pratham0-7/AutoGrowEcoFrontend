import { useState, useEffect, useMemo, useCallback } from "react";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";

const API = import.meta.env.VITE_API_BASE_URL;

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

const CH_COLOR = {
  email: { bg: "#123B45", color: "#9FE6F2" },
  sms: { bg: "#20333A", color: "#B9CBD0" },
  both: { bg: "#0E4E5C", color: "#B8F3FF" },
};
const CH_LABEL = { email: "Email", sms: "SMS", both: "Both" };

const BASIC_VARIABLE_FIELDS = [
  {
    key: "your_name",
    label: "Your Name",
    placeholder: "e.g. Pratham",
    helper: "Used for {{your_name}} in the sequence.",
  },
  {
    key: "product_service",
    label: "Your Product / Service",
    placeholder: "e.g. Automated Growth Ecosystem (AGE)",
    helper: "Used for {{product_service}}.",
  },
  {
    key: "help_with",
    label: "What do you help with?",
    placeholder: "e.g. automating follow-ups so no lead goes cold",
    helper: "Used for {{help_with}}.",
  },
  {
    key: "main_problem",
    label: "Main Problem You Solve",
    placeholder: "e.g. missed follow-ups and cold leads",
    helper: "Used for {{main_problem}}.",
  },
  {
    key: "call_to_action",
    label: "Call To Action",
    placeholder: "e.g. Open to a quick 15-minute call this week?",
    helper: "Used for {{call_to_action}}.",
  },
  {
    key: "industry",
    label: "Industry (Optional)",
    placeholder: "e.g. Real estate",
    helper: "Optional industry context.",
  },
];

const ADVANCED_VARIABLE_FIELDS = [
  {
    key: "common_pain_point",
    label: "Common Industry Pain",
    placeholder: "e.g. Teams do not have time to follow up with every lead properly",
  },
  { key: "timeframe", label: "Result Timeframe", placeholder: "e.g. 30 days" },
  {
    key: "result",
    label: "Proof of Result",
    placeholder: "e.g. More replies and more booked calls",
  },
  {
    key: "industry_pain_point",
    label: "Industry-Specific Pain",
    placeholder: "e.g. Ad spend gets wasted when leads are not followed up on time",
  },
  {
    key: "industry_insight",
    label: "Industry Insight (full)",
    placeholder: "e.g. A lot of businesses lose good leads because follow-up slows down after the first message",
  },
  {
    key: "industry_insight_short",
    label: "Industry Insight (SMS)",
    placeholder: "e.g. Good leads go cold when follow-up stops early",
  },
  {
    key: "positive_outcome",
    label: "Positive Outcome",
    placeholder: "e.g. Close more leads with less manual work",
  },
  {
    key: "negative_outcome",
    label: "Negative Outcome",
    placeholder: "e.g. Leads lose interest or go to a competitor",
  },
  {
    key: "common_objection",
    label: "Common Objection",
    placeholder: "e.g. We do not want another complicated tool",
  },
  {
    key: "objection_response",
    label: "Objection Response",
    placeholder: "e.g. AGE is built to make follow-up simpler, not add more work",
  },
  {
    key: "common_objection_short",
    label: "Objection (SMS short)",
    placeholder: "e.g. Too complicated",
  },
];

const VARIABLE_FIELDS = [...BASIC_VARIABLE_FIELDS, ...ADVANCED_VARIABLE_FIELDS];

const emptyVars = () =>
  Object.fromEntries(VARIABLE_FIELDS.map((f) => [f.key, ""]));

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (value._id) return String(value._id);
  }
  return String(value);
};

const StatusMsg = ({ s }) => {
  if (!s) return null;
  const map = {
    success: {
      bg: "rgba(34,197,94,.12)",
      border: "rgba(34,197,94,.24)",
      color: "#7DE3A0",
      icon: "✓",
    },
    error: {
      bg: "rgba(239,68,68,.12)",
      border: "rgba(239,68,68,.24)",
      color: "#FCA5A5",
      icon: "✗",
    },
    loading: {
      bg: THEME.panelAlt,
      border: THEME.border,
      color: THEME.muted,
      icon: "⟳",
    },
  };
  const c = map[s.type] || map.loading;
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: "11px 16px",
        fontSize: 12,
        color: c.color,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{c.icon}</span>
      {s.msg}
    </div>
  );
};

const Label = ({ children }) => (
  <label
    style={{
      fontSize: 10,
      fontWeight: 700,
      color: THEME.muted,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      display: "block",
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

const FieldHint = ({ children }) => (
  <p style={{ fontSize: 10, color: THEME.muted, margin: "5px 0 0", lineHeight: 1.45 }}>
    {children}
  </p>
);

const StepStatusPill = ({ status, count }) => {
  const map = {
    done: {
      bg: "rgba(34,197,94,.12)",
      color: "#7DE3A0",
      border: "rgba(34,197,94,.24)",
      label: "Done",
      icon: ICONS.check,
    },
    active: {
      bg: "rgba(26,138,158,.12)",
      color: "#9FE6F2",
      border: "rgba(26,138,158,.22)",
      label: "In progress",
      icon: ICONS.clock,
    },
    queued: {
      bg: "rgba(107,142,149,.10)",
      color: "#A6BDC3",
      border: "rgba(107,142,149,.18)",
      label: "Queued",
      icon: ICONS.chevronRight,
    },
  };
  const meta = map[status] || map.queued;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        borderRadius: 100,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
      }}
    >
      <Icon d={meta.icon} size={10} />
      {meta.label}
      {typeof count === "number" && count > 0 && <span>{count}</span>}
    </span>
  );
};

const SimpleField = ({ field, value, onChange }) => (
  <div>
    <Label>{field.label}</Label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className="crm-input"
      style={{ width: "100%", borderRadius: 8, padding: "11px 12px", fontSize: 12 }}
    />
    {field.helper && <FieldHint>{field.helper}</FieldHint>}
  </div>
);

const Sequences = ({ leads, companyId, fetchLeads }) => {
  const [view, setView] = useState("list");
  const [sequences, setSequences] = useState([]);
  const [seqLoading, setSeqLoading] = useState(true);
  const [selectedSeq, setSelectedSeq] = useState(null);
  const [steps, setSteps] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [editingStep, setEditingStep] = useState({});
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollSearch, setEnrollSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [killConfirm, setKillConfirm] = useState(false);
  const [approveStep, setApproveStep] = useState(1);
  const [approveMode, setApproveMode] = useState("recommended");
  const [customGapDays, setCustomGapDays] = useState(1);
  const [status, setStatus] = useState(null);
  const [stepStatus, setStepStatus] = useState({});
  const [showAdvancedVars, setShowAdvancedVars] = useState(false);

  const [form, setForm] = useState({
    name: "",
    channel: "both",
    test_mode: false,
    variables: emptyVars(),
  });

  useEffect(() => {
    if (companyId) loadSequences();
  }, [companyId]);

  const loadSequences = async () => {
    setSeqLoading(true);
    try {
      const r = await fetch(`${API}/campaigns/sequence/${companyId}`);
      const d = await r.json();
      if (r.ok) setSequences(d.sequences || []);
    } catch {
      // silent
    }
    setSeqLoading(false);
  };

  const loadSteps = async (id) => {
    try {
      const r = await fetch(`${API}/campaigns/${id}/steps`);
      const d = await r.json();
      if (r.ok) setSteps(d.steps || []);
      else setSteps([]);
    } catch {
      setSteps([]);
    }
  };

  const openDetail = async (seq) => {
    setSelectedSeq(seq);
    setExpandedStep(null);
    setEditingStep({});
    setStatus(null);
    setApproveStep(1);
    setApproveMode("recommended");
    setCustomGapDays(1);
    await loadSteps(seq._id);
    setView("detail");
  };

  const goList = async () => {
    setView("list");
    setStatus(null);
    await loadSequences();
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setStatus({ type: "error", msg: "Campaign name is required" });
      return;
    }
    setStatus({ type: "loading", msg: "Creating sequence…" });
    try {
      const r = await fetch(`${API}/campaigns/sequence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId, ...form }),
      });
      const d = await r.json();
      if (r.ok) {
        setStatus({ type: "success", msg: "Sequence created with 12 default steps" });
        setForm({ name: "", channel: "both", test_mode: false, variables: emptyVars() });
        setShowAdvancedVars(false);
        await loadSequences();
        setTimeout(() => { setView("list"); setStatus(null); }, 1200);
      } else {
        setStatus({ type: "error", msg: d.error || "Create failed" });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error" });
    }
  };

  const toggleAutoRun = async (id, current, showStatus = false) => {
    try {
      const r = await fetch(`${API}/campaigns/${id}/auto-run`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_run: !current }),
      });
      const d = await r.json();
      if (r.ok) {
        setSequences((prev) =>
          prev.map((seq) => (seq._id === id ? { ...seq, auto_run: !current } : seq))
        );
        if (selectedSeq?._id === id) {
          setSelectedSeq((prev) => ({ ...prev, auto_run: !current }));
        }
        if (showStatus) {
          setStatus({
            type: "success",
            msg: !current
              ? "Auto-run enabled. Sequence will follow recommended timing automatically."
              : "Back to manual review mode.",
          });
          setTimeout(() => setStatus(null), 4000);
        }
      } else if (showStatus) {
        setStatus({ type: "error", msg: d.error || "Could not update auto-run" });
      }
    } catch {
      if (showStatus) setStatus({ type: "error", msg: "Network error" });
    }
  };

  const handleEnroll = async () => {
    if (!selectedIds.length) {
      setStatus({ type: "error", msg: "Select at least one lead" });
      return;
    }
    setStatus({ type: "loading", msg: "Enrolling leads…" });
    try {
      const r = await fetch(`${API}/campaigns/${selectedSeq._id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_ids: selectedIds }),
      });
      const d = await r.json();
      if (r.ok) {
        setStatus({
          type: "success",
          msg: `${d.enrolled} leads enrolled. Step 1 sends within 1 minute.`,
        });
        setEnrollOpen(false);
        setSelectedIds([]);
        if (typeof fetchLeads === "function") fetchLeads();
        await loadSequences();
        setTimeout(() => setStatus(null), 4000);
      } else {
        setStatus({ type: "error", msg: d.error || "Enroll failed" });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error" });
    }
  };

  const handleKill = async () => {
    setStatus({ type: "loading", msg: "Deleting sequence…" });
    try {
      const r = await fetch(`${API}/campaigns/${selectedSeq._id}`, { method: "DELETE" });
      const d = await r.json();
      if (r.ok) {
        setKillConfirm(false);
        if (typeof fetchLeads === "function") fetchLeads();
        await loadSequences();
        goList();
      } else {
        setStatus({ type: "error", msg: d.error || "Failed to delete sequence" });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error" });
    }
  };

  const handleApprove = async () => {
    if (approveMode === "custom" && Number(customGapDays) < 0) {
      setStatus({ type: "error", msg: "Custom gap must be 0 or more" });
      return;
    }
    setStatus({ type: "loading", msg: `Approving step ${approveStep}…` });
    try {
      const r = await fetch(`${API}/campaigns/${selectedSeq._id}/approve/${approveStep}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: approveMode,
          custom_gap_days: approveMode === "custom" ? Number(customGapDays) : undefined,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        let text = `Step ${approveStep} approved for ${d.approved} leads`;
        if (approveMode === "send_now") text += " — sending now.";
        if (approveMode === "recommended") text += " — staying on recommended timing.";
        if (approveMode === "custom") text += ` — scheduled after ${customGapDays} day(s).`;
        setStatus({ type: "success", msg: text });
        setTimeout(() => setStatus(null), 4000);
      } else {
        setStatus({ type: "error", msg: d.error || "Approve failed" });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error" });
    }
  };

  const handleSaveStep = async (stepNum) => {
    const updates = editingStep[stepNum] || {};
    if (!Object.keys(updates).length) { setExpandedStep(null); return; }
    setStepStatus((prev) => ({ ...prev, [stepNum]: { type: "loading", msg: "Saving…" } }));
    try {
      const r = await fetch(`${API}/campaigns/${selectedSeq._id}/steps/${stepNum}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const d = await r.json();
      if (r.ok) {
        setSteps((prev) =>
          prev.map((step) => (step.step_number === stepNum ? d.step : step))
        );
        setEditingStep((prev) => { const next = { ...prev }; delete next[stepNum]; return next; });
        setStepStatus((prev) => { const next = { ...prev }; delete next[stepNum]; return next; });
        setExpandedStep(null);
      } else {
        setStepStatus((prev) => ({ ...prev, [stepNum]: { type: "error", msg: d.error || "Save failed" } }));
      }
    } catch {
      setStepStatus((prev) => ({ ...prev, [stepNum]: { type: "error", msg: "Network error" } }));
    }
  };

  const stepsWithDays = useMemo(() =>
    steps.reduce((acc, step) => {
      const prev = acc.length ? acc[acc.length - 1]._dayOffset : 0;
      acc.push({ ...step, _dayOffset: prev + step.gap_days });
      return acc;
    }, []),
    [steps]
  );

  // FIX 1: Memoize selected sequence leads
  const selectedSequenceLeads = useMemo(() => {
    if (!selectedSeq?._id) return [];
    return leads.filter(
      (lead) => normalizeId(lead.campaign_id) === normalizeId(selectedSeq._id)
    );
  }, [leads, selectedSeq]);

  // FIX 2: Duplicate enroll guard — exclude leads already in this sequence
  const enrollableLeads = useMemo(() => {
    if (!selectedSeq?._id) return [];
    return leads.filter(
      (l) =>
        !l.is_individual_followup &&
        normalizeId(l.campaign_id) !== normalizeId(selectedSeq._id)
    );
  }, [leads, selectedSeq]);

  // FIX 3: Memoize step progress for all steps at once — avoids recomputing per render per step
  const stepProgressMap = useMemo(() => {
    const map = {};
    const relevant = selectedSequenceLeads;

    for (let stepNumber = 1; stepNumber <= 12; stepNumber++) {
      if (!relevant.length) {
        map[stepNumber] = { state: "queued", count: 0 };
        continue;
      }

      const passedCount = relevant.filter((lead) => {
        const currentStep = Number(lead.current_step || 1);
        const isComplete = !!lead.sequence_complete;
        const hasReplied = ["yes", "no"].includes(lead.response_status);
        return isComplete || hasReplied || currentStep > stepNumber;
      }).length;

      const activeCount = relevant.filter((lead) => {
        const currentStep = Number(lead.current_step || 1);
        const isComplete = !!lead.sequence_complete;
        const hasReplied = ["yes", "no"].includes(lead.response_status);
        return !isComplete && !hasReplied && currentStep === stepNumber;
      }).length;

      if (passedCount === relevant.length && relevant.length > 0) {
        map[stepNumber] = { state: "done", count: passedCount };
      } else if (activeCount > 0 || passedCount > 0) {
        map[stepNumber] = { state: "active", count: activeCount || passedCount };
      } else {
        map[stepNumber] = { state: "queued", count: relevant.length };
      }
    }

    return map;
  }, [selectedSequenceLeads]);

  const setVar = (key, val) =>
    setForm((prev) => ({ ...prev, variables: { ...prev.variables, [key]: val } }));

  const setEdit = (stepNum, key, val) =>
    setEditingStep((prev) => ({
      ...prev,
      [stepNum]: { ...(prev[stepNum] || {}), [key]: val },
    }));

  // ─── LIST VIEW ────────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: THEME.text, margin: 0 }}>
              Active Sequences
            </h2>
            <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
              12-step · 75-day automated follow-up
            </p>
          </div>
          <button
            onClick={() => { setView("create"); setStatus(null); }}
            style={{
              background: THEME.coral, color: "white", border: "none", borderRadius: 10,
              padding: "9px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
            }}
          >
            <Icon d={ICONS.plus} size={12} /> New Sequence
          </button>
        </div>

        {seqLoading ? (
          <p style={{ color: THEME.muted, fontSize: 13, textAlign: "center", padding: "48px 0" }}>
            Loading…
          </p>
        ) : sequences.length === 0 ? (
          <div style={{
            background: THEME.panel, border: `1px solid ${THEME.border}`,
            borderRadius: 16, padding: "52px 24px", textAlign: "center",
          }}>
            <div style={{
              background: THEME.tealSoft, borderRadius: 14, width: 54, height: 54,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", color: "#9FE6F2",
            }}>
              <Icon d={ICONS.zap} size={22} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: THEME.text, margin: "0 0 6px" }}>
              No sequences yet
            </p>
            <p style={{ fontSize: 12, color: THEME.muted, margin: "0 0 22px" }}>
              Create your first 12-step, 75-day automated follow-up sequence
            </p>
            <button
              onClick={() => { setView("create"); setStatus(null); }}
              style={{
                background: THEME.coral, color: "white", border: "none", borderRadius: 10,
                padding: "10px 22px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Create Sequence
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sequences.map((seq) => (
              <div key={seq._id} style={{
                background: THEME.panel, border: `1px solid ${THEME.border}`,
                borderRadius: 14, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{
                  background: THEME.tealSoft, borderRadius: 10, width: 38, height: 38,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#9FE6F2", flexShrink: 0,
                }}>
                  <Icon d={ICONS.zap} size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 700, color: THEME.text, margin: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {seq.name}
                    </p>
                    {seq.test_mode && (
                      <span style={{
                        fontSize: 9, fontWeight: 700,
                        background: "rgba(245,158,11,.14)", color: "#F5B74F",
                        borderRadius: 6, padding: "2px 7px", letterSpacing: 1,
                        textTransform: "uppercase", flexShrink: 0,
                      }}>TEST</span>
                    )}
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      background: CH_COLOR[seq.channel]?.bg, color: CH_COLOR[seq.channel]?.color,
                      borderRadius: 6, padding: "2px 7px", letterSpacing: 1,
                      textTransform: "uppercase", flexShrink: 0,
                    }}>
                      {CH_LABEL[seq.channel]}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                    {seq.lead_count} lead{seq.lead_count !== 1 ? "s" : ""} · 12 steps · 75 days
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleAutoRun(seq._id, seq.auto_run)}
                    title={seq.auto_run ? "Auto-run on — click to switch to manual" : "Manual mode — click to enable auto-run"}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: seq.auto_run ? THEME.tealSoft : THEME.panelAlt,
                      border: `1px solid ${THEME.border}`, borderRadius: 100,
                      padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 600,
                      color: seq.auto_run ? "#9FE6F2" : THEME.muted, fontFamily: "inherit",
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: seq.auto_run ? THEME.green : THEME.muted,
                      display: "inline-block",
                    }} />
                    {seq.auto_run ? "Auto" : "Manual"}
                  </button>
                  <button
                    onClick={() => openDetail(seq)}
                    style={{
                      background: THEME.panelAlt, border: `1px solid ${THEME.border}`,
                      borderRadius: 9, padding: "6px 14px", color: "#9FE6F2",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── CREATE VIEW ──────────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
        <button
          onClick={() => { setView("list"); setStatus(null); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "none", color: THEME.muted,
            fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "inherit", alignSelf: "flex-start",
          }}
        >
          <Icon d={ICONS.chevronLeft} size={14} /> Back
        </button>

        <div style={{
          background: THEME.panel, border: `1px solid ${THEME.border}`,
          borderRadius: 16, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${THEME.border}` }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: THEME.text, margin: 0 }}>
              New Sequence
            </h2>
            <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
              Keep it simple. Fill the basics and AGE handles the rest.
            </p>
          </div>

          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 190px", gap: 14 }}>
              <div>
                <Label>Sequence Name</Label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. AGE Outreach — Q2"
                  className="crm-input"
                  style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13 }}
                />
                <FieldHint>Name this so you can recognize it later.</FieldHint>
              </div>
              <div>
                <Label>Channel</Label>
                <select
                  value={form.channel}
                  onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value }))}
                  className="crm-input"
                  style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13 }}
                >
                  <option value="both">Both (Email + SMS)</option>
                  <option value="email">Email only</option>
                  <option value="sms">SMS only</option>
                </select>
                <FieldHint>Choose where this sequence should run.</FieldHint>
              </div>
            </div>

            <div style={{
              background: THEME.panelAlt, border: `1px solid ${THEME.border}`,
              borderRadius: 12, padding: "16px",
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: THEME.text, margin: "0 0 4px" }}>
                Basic personalization
              </p>
              <p style={{ fontSize: 11, color: THEME.muted, margin: "0 0 14px" }}>
                This is all most users should need to fill.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {BASIC_VARIABLE_FIELDS.map((field) => (
                  <SimpleField
                    key={field.key}
                    field={field}
                    value={form.variables[field.key]}
                    onChange={setVar}
                  />
                ))}
              </div>
            </div>

            <div style={{
              background: THEME.panelAlt, border: `1px solid ${THEME.border}`,
              borderRadius: 12, overflow: "hidden",
            }}>
              <button
                type="button"
                onClick={() => setShowAdvancedVars((prev) => !prev)}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  padding: "14px 16px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  color: THEME.text, fontFamily: "inherit",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: THEME.text, margin: 0 }}>
                    Advanced personalization
                  </p>
                  <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                    Optional. Only open this if you want more control.
                  </p>
                </div>
                <span style={{
                  display: "inline-flex",
                  transform: showAdvancedVars ? "rotate(90deg)" : "rotate(-90deg)",
                  transition: "transform .15s", color: THEME.muted, flexShrink: 0,
                }}>
                  <Icon d={ICONS.chevronRight} size={14} />
                </span>
              </button>

              {showAdvancedVars && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${THEME.border}` }}>
                  <p style={{ fontSize: 11, color: THEME.muted, margin: "12px 0 14px" }}>
                    These help make the sequence more specific, but they are not required.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {ADVANCED_VARIABLE_FIELDS.map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label style={{
                          fontSize: 10, color: THEME.muted, letterSpacing: 1,
                          display: "block", marginBottom: 5,
                        }}>
                          {label}
                        </label>
                        <input
                          type="text"
                          value={form.variables[key] || ""}
                          onChange={(e) => setVar(key, e.target.value)}
                          placeholder={placeholder}
                          className="crm-input"
                          style={{ width: "100%", borderRadius: 8, padding: "9px 12px", fontSize: 12 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: THEME.panelAlt, border: `1px solid ${THEME.border}`,
              borderRadius: 10, padding: "13px 16px",
            }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: THEME.text, margin: 0 }}>
                  Test Mode
                </p>
                <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                  All 12 steps fire 1 minute apart so you can test the full flow quickly
                </p>
              </div>
              <button
                onClick={() => setForm((prev) => ({ ...prev, test_mode: !prev.test_mode }))}
                style={{
                  width: 44, height: 26, borderRadius: 100,
                  background: form.test_mode ? THEME.teal : THEME.border,
                  border: "none", cursor: "pointer", position: "relative",
                  transition: "background .2s", flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: 4,
                  left: form.test_mode ? 22 : 4,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "white", transition: "left .2s", display: "block",
                }} />
              </button>
            </div>

            <StatusMsg s={status} />

            <button
              onClick={handleCreate}
              style={{
                background: THEME.coral, color: "white", border: "none",
                borderRadius: 10, padding: "12px 24px", fontSize: 13,
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start",
              }}
            >
              Create Sequence
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DETAIL VIEW ──────────────────────────────────────────────────────────────
  if (view === "detail" && selectedSeq) {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
          }}>
            <div>
              <button
                onClick={goList}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "transparent", border: "none", color: THEME.muted,
                  fontSize: 12, cursor: "pointer", padding: "0 0 8px", fontFamily: "inherit",
                }}
              >
                <Icon d={ICONS.chevronLeft} size={14} /> All Sequences
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: THEME.text, margin: 0 }}>
                  {selectedSeq.name}
                </h2>
                {selectedSeq.test_mode && (
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    background: "rgba(245,158,11,.14)", color: "#F5B74F",
                    borderRadius: 6, padding: "2px 7px", letterSpacing: 1, textTransform: "uppercase",
                  }}>TEST</span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  background: CH_COLOR[selectedSeq.channel]?.bg,
                  color: CH_COLOR[selectedSeq.channel]?.color,
                  borderRadius: 6, padding: "2px 7px", letterSpacing: 1, textTransform: "uppercase",
                }}>
                  {CH_LABEL[selectedSeq.channel]}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => toggleAutoRun(selectedSeq._id, selectedSeq.auto_run)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: selectedSeq.auto_run ? THEME.tealSoft : THEME.panelAlt,
                  border: `1px solid ${THEME.border}`, borderRadius: 100,
                  padding: "7px 14px", cursor: "pointer", fontSize: 11, fontWeight: 600,
                  color: selectedSeq.auto_run ? "#9FE6F2" : THEME.muted, fontFamily: "inherit",
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: selectedSeq.auto_run ? THEME.green : THEME.muted,
                  display: "inline-block",
                }} />
                {selectedSeq.auto_run ? "Auto-run on" : "Manual mode"}
              </button>

              <button
                onClick={() => { setEnrollOpen(true); setSelectedIds([]); setStatus(null); }}
                style={{
                  background: THEME.coral, color: "white", border: "none",
                  borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "inherit",
                }}
              >
                <Icon d={ICONS.userPlus} size={13} /> Enroll Leads
              </button>
              <button
                onClick={() => setKillConfirm(true)}
                title="Delete this sequence and unenroll all leads"
                style={{
                  background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)",
                  borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  color: "#F87171", fontFamily: "inherit",
                }}
              >
                <Icon d={ICONS.x} size={12} /> Kill
              </button>
            </div>
          </div>

          {/* FIX 4: Only show approve panel when manual mode AND leads are enrolled */}
          {!selectedSeq.auto_run && selectedSequenceLeads.length > 0 && (
            <div style={{
              background: THEME.panel, border: `1px solid ${THEME.border}`,
              borderRadius: 12, padding: "14px 18px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div style={{
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", gap: 12, flexWrap: "wrap",
              }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: THEME.text, margin: "0 0 2px" }}>
                    Manual review mode
                  </p>
                  <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                    AGE emails you after each stage. You can send now, keep recommended timing,
                    or set a custom gap. If you do nothing for 24 hours, it continues automatically.
                  </p>
                </div>
                <button
                  onClick={() => toggleAutoRun(selectedSeq._id, selectedSeq.auto_run, true)}
                  style={{
                    background: THEME.teal, border: "none", borderRadius: 8,
                    padding: "8px 14px", color: "white", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                  }}
                >
                  Approve All Remaining Stages
                </button>
              </div>

              {/* FIX 5: Responsive approve row — wraps on smaller widths */}
              <div style={{
                display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap",
              }}>
                <div style={{ minWidth: 120 }}>
                  <Label>Step</Label>
                  <select
                    value={approveStep}
                    onChange={(e) => setApproveStep(Number(e.target.value))}
                    className="crm-input"
                    style={{ borderRadius: 8, padding: "8px 12px", fontSize: 12, width: "100%" }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>Step {n}</option>
                    ))}
                  </select>
                </div>

                <div style={{ minWidth: 180, flex: 1 }}>
                  <Label>Approval Action</Label>
                  <select
                    value={approveMode}
                    onChange={(e) => setApproveMode(e.target.value)}
                    className="crm-input"
                    style={{ borderRadius: 8, padding: "8px 12px", fontSize: 12, width: "100%" }}
                  >
                    <option value="recommended">Send after recommended gap</option>
                    <option value="send_now">Send now</option>
                    <option value="custom">Send after custom gap</option>
                  </select>
                </div>

                <div style={{ minWidth: 100, opacity: approveMode === "custom" ? 1 : 0.4 }}>
                  <Label>Custom Days</Label>
                  <input
                    type="number"
                    min={0}
                    disabled={approveMode !== "custom"}
                    value={customGapDays}
                    onChange={(e) => setCustomGapDays(Number(e.target.value))}
                    className="crm-input"
                    style={{ borderRadius: 8, padding: "8px 12px", fontSize: 12, width: "100%" }}
                  />
                </div>

                <button
                  onClick={handleApprove}
                  style={{
                    background: THEME.coral, border: "none", borderRadius: 8,
                    padding: "8px 14px", color: "white", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", height: 36,
                  }}
                >
                  Approve Step
                </button>
              </div>
            </div>
          )}

          <StatusMsg s={status} />

          {/* FIX 6: Empty state for steps */}
          {steps.length === 0 ? (
            <div style={{
              background: THEME.panel, border: `1px solid ${THEME.border}`,
              borderRadius: 12, padding: "40px 24px", textAlign: "center",
            }}>
              <p style={{ fontSize: 13, color: THEME.muted, margin: 0 }}>
                Steps could not be loaded. Try going back and reopening this sequence.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stepsWithDays.map((step) => {
                const isOpen = expandedStep === step.step_number;
                const editing = editingStep[step.step_number] || {};
                const chc = CH_COLOR[step.channel] || CH_COLOR.both;
                const ss = stepStatus[step.step_number];
                // FIX 3: Use precomputed map instead of calling function per render
                const progress = stepProgressMap[step.step_number] || { state: "queued", count: 0 };

                return (
                  <div
                    key={step.step_number}
                    style={{
                      background: THEME.panel,
                      border: `1px solid ${isOpen ? THEME.teal : THEME.border}`,
                      borderRadius: 12, overflow: "hidden", transition: "border-color .15s",
                    }}
                  >
                    <div
                      style={{
                        padding: "13px 18px", display: "flex", alignItems: "center",
                        gap: 14, cursor: "pointer",
                      }}
                      onClick={() => setExpandedStep(isOpen ? null : step.step_number)}
                    >
                      <div style={{
                        background: progress.state === "done"
                          ? "rgba(34,197,94,.14)"
                          : progress.state === "active"
                          ? THEME.tealSoft
                          : THEME.panelAlt,
                        border: `1px solid ${progress.state === "done" ? "rgba(34,197,94,.24)" : THEME.border}`,
                        borderRadius: 8, width: 34, height: 34,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: progress.state === "done" ? "#7DE3A0"
                          : progress.state === "active" ? "#9FE6F2" : THEME.muted,
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>
                        {progress.state === "done"
                          ? <Icon d={ICONS.check} size={14} />
                          : step.step_number}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 7,
                          marginBottom: 3, flexWrap: "wrap",
                        }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, background: THEME.panelAlt,
                            color: THEME.muted, border: `1px solid ${THEME.border}`,
                            borderRadius: 6, padding: "2px 8px",
                          }}>
                            Day {step._dayOffset}
                          </span>
                          <span style={{
                            fontSize: 9, fontWeight: 700, background: chc.bg, color: chc.color,
                            borderRadius: 6, padding: "2px 7px", letterSpacing: 1,
                            textTransform: "uppercase",
                          }}>
                            {CH_LABEL[step.channel]}
                          </span>
                          {step.gap_label === "Custom" && (
                            <span style={{
                              fontSize: 9, fontWeight: 700,
                              background: "rgba(245,158,11,.14)", color: "#F5B74F",
                              borderRadius: 6, padding: "2px 7px",
                            }}>
                              Custom timing
                            </span>
                          )}
                          <StepStatusPill status={progress.state} count={progress.count} />
                        </div>
                        <p style={{
                          fontSize: 12, fontWeight: 600, color: THEME.text, margin: 0,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {step.subject}
                        </p>
                      </div>

                      <span style={{
                        display: "inline-flex",
                        transform: isOpen ? "rotate(90deg)" : "rotate(-90deg)",
                        transition: "transform .15s", color: THEME.muted, flexShrink: 0,
                      }}>
                        <Icon d={ICONS.chevronRight} size={13} />
                      </span>
                    </div>

                    {isOpen && (
                      <div style={{
                        padding: "16px 18px 18px", borderTop: `1px solid ${THEME.border}`,
                        display: "flex", flexDirection: "column", gap: 14,
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div>
                            <Label>Channel</Label>
                            <select
                              value={editing.channel ?? step.channel}
                              onChange={(e) => setEdit(step.step_number, "channel", e.target.value)}
                              className="crm-input"
                              style={{ width: "100%", borderRadius: 8, padding: "9px 12px", fontSize: 12 }}
                            >
                              <option value="both">Both (Email + SMS)</option>
                              <option value="email">Email only</option>
                              <option value="sms">SMS only</option>
                            </select>
                          </div>
                          <div>
                            <Label>Gap (days after previous step)</Label>
                            <input
                              type="number"
                              min={0}
                              value={editing.gap_days ?? step.gap_days}
                              onChange={(e) => setEdit(step.step_number, "gap_days", Number(e.target.value))}
                              className="crm-input"
                              style={{ width: "100%", borderRadius: 8, padding: "9px 12px", fontSize: 12 }}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Email Subject</Label>
                          <input
                            type="text"
                            value={editing.subject ?? step.subject}
                            onChange={(e) => setEdit(step.step_number, "subject", e.target.value)}
                            className="crm-input"
                            style={{ width: "100%", borderRadius: 8, padding: "9px 12px", fontSize: 12 }}
                          />
                        </div>

                        <div>
                          <Label>Email Message</Label>
                          <textarea
                            value={editing.message ?? step.message}
                            onChange={(e) => setEdit(step.step_number, "message", e.target.value)}
                            className="crm-input"
                            style={{
                              width: "100%", borderRadius: 8, padding: "9px 12px",
                              fontSize: 12, minHeight: 120, resize: "vertical",
                            }}
                          />
                        </div>

                        <div>
                          <Label>SMS Message</Label>
                          <textarea
                            value={editing.sms_message ?? step.sms_message}
                            onChange={(e) => setEdit(step.step_number, "sms_message", e.target.value)}
                            className="crm-input"
                            style={{
                              width: "100%", borderRadius: 8, padding: "9px 12px",
                              fontSize: 12, minHeight: 72, resize: "vertical",
                            }}
                          />
                        </div>

                        {ss && <StatusMsg s={ss} />}

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleSaveStep(step.step_number)}
                            style={{
                              background: THEME.coral, color: "white", border: "none",
                              borderRadius: 8, padding: "8px 18px", fontSize: 12,
                              fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            Save Step
                          </button>
                          <button
                            onClick={() => {
                              setExpandedStep(null);
                              setEditingStep((prev) => {
                                const next = { ...prev };
                                delete next[step.step_number];
                                return next;
                              });
                            }}
                            style={{
                              background: "transparent", border: `1px solid ${THEME.border}`,
                              borderRadius: 8, padding: "8px 14px", fontSize: 12,
                              color: THEME.muted, cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kill Confirm Modal */}
        {killConfirm && (
          <div
            style={{
              position: "fixed", inset: 0, background: "#000000BB",
              zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setKillConfirm(false); }}
          >
            <div style={{
              background: THEME.panel, border: "1px solid rgba(239,68,68,.3)",
              borderRadius: 16, width: "100%", maxWidth: 380, padding: 24,
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#F87171", margin: 0 }}>Kill sequence?</p>
              <p style={{ fontSize: 12, color: THEME.muted, margin: 0, lineHeight: 1.6 }}>
                This will permanently delete <strong style={{ color: THEME.text }}>{selectedSeq.name}</strong> and stop all pending emails.
                Leads will be unenrolled but their history is kept.
              </p>
              <StatusMsg s={status} />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setKillConfirm(false)}
                  style={{
                    flex: 1, background: THEME.panelAlt, border: `1px solid ${THEME.border}`,
                    borderRadius: 9, padding: "9px 0", fontSize: 12, fontWeight: 600,
                    color: THEME.muted, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleKill}
                  style={{
                    flex: 1, background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.3)",
                    borderRadius: 9, padding: "9px 0", fontSize: 12, fontWeight: 700,
                    color: "#F87171", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Yes, kill it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enroll Modal */}
        {enrollOpen && (
          <div
            style={{
              position: "fixed", inset: 0, background: "#000000BB",
              zIndex: 50, display: "flex", alignItems: "center",
              justifyContent: "center", padding: 24,
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setEnrollOpen(false); }}
          >
            <div style={{
              background: THEME.panel, border: `1px solid ${THEME.border}`,
              borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "80vh",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}>
              <div style={{
                padding: "16px 20px", borderBottom: `1px solid ${THEME.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: THEME.text, margin: 0 }}>
                    Enroll Leads
                  </p>
                  <p style={{ fontSize: 11, color: THEME.muted, margin: 0 }}>
                    {selectedIds.length} selected · {enrollableLeads.length} available
                  </p>
                </div>
                <button
                  onClick={() => setEnrollOpen(false)}
                  style={{ background: "transparent", border: "none", color: THEME.muted, cursor: "pointer", padding: 4 }}
                >
                  <Icon d={ICONS.x} size={16} />
                </button>
              </div>

              <div style={{ padding: "10px 20px", borderBottom: `1px solid ${THEME.border}` }}>
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={enrollSearch}
                  onChange={(e) => setEnrollSearch(e.target.value)}
                  className="crm-input"
                  style={{ width: "100%", borderRadius: 8, padding: "8px 12px", fontSize: 12, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ overflowY: "auto", flex: 1 }}>
                {enrollableLeads.length === 0 ? (
                  <p style={{ color: THEME.muted, fontSize: 12, padding: "24px 20px", textAlign: "center" }}>
                    No leads available to enroll. All leads are either already in this sequence or assigned to individual follow-up.
                  </p>
                ) : (
                  enrollableLeads.filter((lead) => {
                    const q = enrollSearch.toLowerCase();
                    return !q || [lead.name, lead.email].some((v) => v?.toLowerCase().includes(q));
                  }).map((lead) => {
                    const checked = selectedIds.includes(lead._id);
                    return (
                      <div
                        key={lead._id}
                        onClick={() =>
                          setSelectedIds((prev) =>
                            checked ? prev.filter((id) => id !== lead._id) : [...prev, lead._id]
                          )
                        }
                        style={{
                          padding: "12px 20px", display: "flex", alignItems: "center",
                          gap: 12, cursor: "pointer", borderBottom: `1px solid ${THEME.border}`,
                          background: checked ? "rgba(26,138,158,.10)" : "transparent",
                          transition: "background .1s",
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: 5,
                          border: `2px solid ${checked ? THEME.teal : THEME.border}`,
                          background: checked ? THEME.teal : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, transition: "all .15s",
                        }}>
                          {checked && <Icon d={ICONS.check} size={10} style={{ color: "white" }} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{
                            fontSize: 12, fontWeight: 600, color: THEME.text, margin: 0,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {lead.name || "—"}
                          </p>
                          <p style={{
                            fontSize: 11, color: THEME.muted, margin: 0,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {lead.email || lead.phone || "—"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{
                padding: "14px 20px", borderTop: `1px solid ${THEME.border}`,
                display: "flex", gap: 8, alignItems: "center",
              }}>
                <button
                  onClick={() => setSelectedIds(enrollableLeads.map((l) => l._id))}
                  style={{
                    background: "transparent", border: `1px solid ${THEME.border}`,
                    borderRadius: 8, padding: "7px 12px", color: THEME.muted,
                    fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Select all
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  style={{
                    background: "transparent", border: `1px solid ${THEME.border}`,
                    borderRadius: 8, padding: "7px 12px", color: THEME.muted,
                    fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={!selectedIds.length}
                  style={{
                    marginLeft: "auto",
                    background: selectedIds.length ? THEME.coral : THEME.border,
                    color: selectedIds.length ? "white" : THEME.muted,
                    border: "none", borderRadius: 8, padding: "8px 18px",
                    fontSize: 12, fontWeight: 700,
                    cursor: selectedIds.length ? "pointer" : "default",
                    fontFamily: "inherit", transition: "background .15s",
                  }}
                >
                  Enroll {selectedIds.length > 0 ? selectedIds.length : ""} Lead{selectedIds.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default Sequences;