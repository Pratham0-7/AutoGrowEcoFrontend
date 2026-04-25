import { useState, useEffect, useCallback, useMemo } from "react";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WA_GREEN = "#25D366";
const WA_DARK = "#128C7E";
const WA_BG = "#0A2419";
const WA_BORDER = "#0F3D2A";

const WaLogo = ({ size = 20, color = WA_GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const StatusBanner = ({ status }) => {
  if (!status) return null;

  const colors = {
    success: { bg: "#0D3D20", border: "#22C55E44", text: "#22C55E", icon: "✓" },
    loading: { bg: "#142830", border: "#1E3D47", text: "#6B8E95", icon: "⟳" },
    error: { bg: "#2D0A0A", border: "#DC262644", text: "#EF4444", icon: "✗" },
  };

  const c = colors[status.type] || colors.error;

  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: c.text,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span>{c.icon}</span>
      {status.msg}
    </div>
  );
};

const Label = ({ children }) => (
  <label
    style={{
      fontSize: 10,
      fontWeight: 700,
      color: "#6B8E95",
      textTransform: "uppercase",
      letterSpacing: 1.1,
      display: "block",
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

const getLeadPhone = (lead) =>
  String(
    lead?.phone ||
    lead?.mobile ||
    lead?.phone_number ||
    lead?.contact_number ||
    lead?.whatsapp ||
    lead?.whatsapp_number ||
    ""
  ).trim();

const isInterestedLead = (lead) =>
  String(lead?.response_status || "").toLowerCase().trim() === "yes";

const STATUS_COLORS = {
  pending:   { bg: "#2A1F05", border: "#92400E44", text: "#F59E0B" },
  sent:      { bg: "#0D3D20", border: "#22C55E44", text: "#22C55E" },
  delivered: { bg: "#0A1E40", border: "#3B82F644", text: "#60A5FA" },
  read:      { bg: "#0A2419", border: "#25D36644", text: "#25D366" },
  failed:    { bg: "#2D0A0A", border: "#DC262644", text: "#EF4444" },
};

const MetaStatusBadge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  const icons = { pending: "⏳", sent: "✓", delivered: "✓✓", read: "✓✓", failed: "✗" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
    }}>
      {icons[status] || "?"} {status}
    </span>
  );
};

const CONV_STATUS_STYLES = {
  unread:   { color: "#25D366", label: "Needs Reply" },
  replied:  { color: "#60A5FA", label: "Replied" },
  no_reply: { color: "#6B8E95", label: "No Reply" },
};

const fmtTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / 86400000);
  const IST = { timeZone: "Asia/Kolkata" };
  if (diffDays === 0) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", ...IST });
  if (diffDays < 7)   return d.toLocaleDateString("en-IN", { weekday: "short", ...IST });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", ...IST });
};

const ConvItem = ({ conv, selected, onClick }) => {
  const s = CONV_STATUS_STYLES[conv.status] || CONV_STATUS_STYLES.no_reply;
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        background: selected ? "#0A2419" : "transparent",
        borderBottom: "1px solid #1E3D4730",
        borderLeft: `3px solid ${selected ? WA_GREEN : "transparent"}`,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "#0A2419", border: "1px solid #25D36644",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: WA_GREEN,
        }}>
          {(conv.lead_name || "?")[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#E2F5E8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
              {conv.lead_name || conv.contact_phone}
            </p>
            <span style={{ fontSize: 10, color: "#6B8E95", flexShrink: 0 }}>{fmtTime(conv.last_at)}</span>
          </div>
          <p style={{ fontSize: 11, color: "#6B8E95", margin: "0 0 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {conv.last_direction === "outbound" ? "You: " : ""}{conv.last_body || "…"}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: s.color }}>{s.label}</span>
            {conv.assigned_to && (
              <span style={{ fontSize: 10, color: "#4A7080", marginLeft: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 70 }}>
                {conv.assigned_to}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ msg }) => {
  const isOut = msg.direction === "outbound";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isOut ? "flex-end" : "flex-start", marginBottom: 2 }}>
      <div style={{
        maxWidth: "72%",
        background: isOut ? "#0D3D20" : "#1A3040",
        border: `1px solid ${isOut ? "#22C55E33" : "#1E3D47"}`,
        borderRadius: isOut ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
        padding: "8px 12px",
      }}>
        {isOut && msg.template_name && (
          <p style={{ fontSize: 9, fontWeight: 700, color: WA_GREEN, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.8 }}>
            {msg.template_name}
          </p>
        )}
        <p style={{ fontSize: 12, color: isOut ? "#E2F5E8" : "#CBD5E1", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {msg.body_preview || (isOut ? "[template]" : "[message]")}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexDirection: isOut ? "row-reverse" : "row" }}>
        <span style={{ fontSize: 10, color: "#4A7080" }}>{fmtTime(msg.created_at)}</span>
        {isOut && <MetaStatusBadge status={msg.status} />}
        {!isOut && msg.from_name && (
          <span style={{ fontSize: 10, color: "#4A7080" }}>{msg.from_name}</span>
        )}
      </div>
    </div>
  );
};

const WhatsApp = ({ leads = [], companyId }) => {
  const userId = localStorage.getItem("user_id") || "";

  const [tab, setTab] = useState("send");
  const [configOpen, setConfigOpen] = useState(false);

  const [waConfig, setWaConfig] = useState({
    wa_number: "",
    wa_template_name: "",
  });
  const [configStatus, setConfigStatus] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const [leadSearch, setLeadSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualMessage, setManualMessage] = useState("");
  const [sendStatus, setSendStatus] = useState(null);

  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkStatus, setBulkStatus] = useState(null);

  const [messages, setMessages] = useState([]);
  const [msgTotal, setMsgTotal] = useState(0);
  const [msgPage, setMsgPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ── Meta Cloud state ────────────────────────────────────────────────────────
  const [metaConfigOpen, setMetaConfigOpen] = useState(false);
  const [metaConfig, setMetaConfig] = useState({ meta_phone_number_id: "", meta_access_token: "" });
  const [metaConfigStatus, setMetaConfigStatus] = useState(null);
  const [metaTemplates, setMetaTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVars, setTemplateVars] = useState({});
  const [metaLeadSearch, setMetaLeadSearch] = useState("");
  const [metaSelectedLeadId, setMetaSelectedLeadId] = useState("");
  const [metaManualPhone, setMetaManualPhone] = useState("");
  const [metaManualName, setMetaManualName] = useState("");
  const [metaSendStatus, setMetaSendStatus] = useState(null);
  const [metaMessages, setMetaMessages] = useState([]);
  const [metaMsgTotal, setMetaMsgTotal] = useState(0);
  const [metaMsgPage, setMetaMsgPage] = useState(1);
  const [loadingMetaHistory, setLoadingMetaHistory] = useState(false);

  // ── Inbox state ─────────────────────────────────────────────────────────────
  const [inboxConvs, setInboxConvs] = useState([]);
  const [inboxSearch, setInboxSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [inboxReplyText, setInboxReplyText] = useState("");
  const [inboxReplySending, setInboxReplySending] = useState(false);
  const [inboxReplyStatus, setInboxReplyStatus] = useState(null);
  const [inboxReplyTemplate, setInboxReplyTemplate] = useState(null);
  const [inboxReplyVars, setInboxReplyVars] = useState({});

  const interestedLeads = useMemo(
    () => leads.filter((lead) => isInterestedLead(lead)),
    [leads]
  );

  const leadsWithPhone = useMemo(
    () => leads.filter((lead) => getLeadPhone(lead)),
    [leads]
  );

  const searchableLeads = useMemo(() => {
    const q = leadSearch.toLowerCase().trim();

    const allSorted = [...leads].sort((a, b) => {
      const aYes = isInterestedLead(a) ? 1 : 0;
      const bYes = isInterestedLead(b) ? 1 : 0;
      if (aYes !== bYes) return bYes - aYes;
      return (a.name || "").localeCompare(b.name || "");
    });

    if (!q) return allSorted;

    return allSorted.filter((lead) => {
      const name = String(lead?.name || "").toLowerCase();
      const email = String(lead?.email || "").toLowerCase();
      const phone = getLeadPhone(lead).toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [leadSearch, leads]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead._id === selectedLeadId),
    [leads, selectedLeadId]
  );

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/config/${companyId}`);
      if (res.ok) {
        const d = await res.json();
        setWaConfig(d);
        setIsConfigured(!!d.wa_number);
      }
    } catch {}
  }, [companyId]);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/messages/${companyId}?page=${msgPage}&per_page=20`);
      if (res.ok) {
        const d = await res.json();
        setMessages(d.messages);
        setMsgTotal(d.total);
      }
    } catch {}
    setLoadingHistory(false);
  }, [companyId, msgPage]);

  // ── Meta Cloud derived values ───────────────────────────────────────────────
  const metaSelectedLead = useMemo(
    () => leads.find((l) => l._id === metaSelectedLeadId),
    [leads, metaSelectedLeadId]
  );

  const metaSearchableLeads = useMemo(() => {
    const q = metaLeadSearch.toLowerCase().trim();
    const sorted = [...leads].sort((a, b) => {
      const aYes = isInterestedLead(a) ? 1 : 0;
      const bYes = isInterestedLead(b) ? 1 : 0;
      if (aYes !== bYes) return bYes - aYes;
      return (a.name || "").localeCompare(b.name || "");
    });
    if (!q) return sorted;
    return sorted.filter((l) => {
      const name = String(l?.name || "").toLowerCase();
      const email = String(l?.email || "").toLowerCase();
      const phone = getLeadPhone(l).toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [metaLeadSearch, leads]);

  const bodyPreview = useMemo(() => {
    if (!selectedTemplate?.body) return "";
    let body = selectedTemplate.body;
    Object.entries(templateVars).forEach(([k, v]) => {
      body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v || `{{${k}}}`);
    });
    return body;
  }, [selectedTemplate, templateVars]);

  // ── Inbox derived values ────────────────────────────────────────────────────
  const filteredConvs = useMemo(() => {
    const q = inboxSearch.toLowerCase().trim();
    if (!q) return inboxConvs;
    return inboxConvs.filter((c) =>
      (c.lead_name || "").toLowerCase().includes(q) ||
      (c.contact_phone || "").includes(q)
    );
  }, [inboxConvs, inboxSearch]);

  const activeConv = useMemo(
    () => inboxConvs.find((c) => c.contact_phone === selectedConv) || null,
    [inboxConvs, selectedConv]
  );

  // ── Meta Cloud fetch functions ──────────────────────────────────────────────
  const fetchMetaConfig = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/config/${companyId}`);
      if (res.ok) {
        const d = await res.json();
        setMetaConfig({ meta_phone_number_id: d.meta_phone_number_id || "", meta_access_token: d.meta_access_token || "" });
      }
    } catch {}
  }, [companyId]);

  const fetchMetaTemplates = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/templates`);
      if (res.ok) {
        const d = await res.json();
        setMetaTemplates(d.templates || []);
      }
    } catch {}
  }, []);

  const fetchConversations = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoadingConvs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/conversations/${companyId}`);
      if (res.ok) {
        const d = await res.json();
        setInboxConvs(d.conversations || []);
      }
    } catch {}
    if (!silent) setLoadingConvs(false);
  }, [companyId]);

  const fetchThread = useCallback(async (phone, { silent = false } = {}) => {
    if (!phone) return;
    if (!silent) setLoadingThread(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/thread/${companyId}/${encodeURIComponent(phone)}`);
      if (res.ok) {
        const d = await res.json();
        setThreadMessages(d.messages || []);
      }
    } catch {}
    if (!silent) setLoadingThread(false);
  }, [companyId]);

  const fetchMetaMessages = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoadingMetaHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/messages/${companyId}?page=${metaMsgPage}&per_page=20`);
      if (res.ok) {
        const d = await res.json();
        setMetaMessages(d.messages);
        setMetaMsgTotal(d.total);
      }
    } catch {}
    if (!silent) setLoadingMetaHistory(false);
  }, [companyId, metaMsgPage]);

  useEffect(() => {
    fetchConfig();
    fetch(`${API_BASE_URL}/whatsapp/messages/${companyId}?page=1&per_page=1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setMsgTotal(d.total))
      .catch(() => {});
  }, [companyId, fetchConfig]);

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab, msgPage, fetchHistory]);

  useEffect(() => {
    if (tab !== "meta") return;
    fetchMetaConfig();
    fetchMetaTemplates();
    fetchMetaMessages();
    const id = setInterval(() => fetchMetaMessages({ silent: true }), 15000);
    return () => clearInterval(id);
  }, [tab, metaMsgPage, fetchMetaConfig, fetchMetaTemplates, fetchMetaMessages]);

  useEffect(() => {
    if (tab !== "inbox") return;
    fetchConversations();
    fetchMetaTemplates();
    const id = setInterval(() => fetchConversations({ silent: true }), 15000);
    return () => clearInterval(id);
  }, [tab, fetchConversations, fetchMetaTemplates]);

  useEffect(() => {
    if (!selectedConv || tab !== "inbox") return;
    fetchThread(selectedConv);
    setInboxReplyText("");
    setInboxReplyStatus(null);
    setInboxReplyTemplate(null);
    setInboxReplyVars({});
    const id = setInterval(() => fetchThread(selectedConv, { silent: true }), 10000);
    return () => clearInterval(id);
  }, [selectedConv, tab, fetchThread]);

  const handleSendText = async () => {
    if (!inboxReplyText.trim() || !selectedConv || !activeConv || inboxReplySending) return;
    setInboxReplySending(true);
    setInboxReplyStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/send_text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          lead_id:    activeConv.lead_id,
          phone:      selectedConv,
          message:    inboxReplyText.trim(),
          user_id:    userId,
          lead_name:  activeConv.lead_name,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setInboxReplyText("");
        setInboxReplyStatus({ ok: true, msg: "Sent!" });
        fetchThread(selectedConv, { silent: true });
        fetchConversations({ silent: true });
      } else {
        setInboxReplyStatus({ ok: false, msg: d.error || "Send failed" });
      }
    } catch {
      setInboxReplyStatus({ ok: false, msg: "Network error" });
    }
    setInboxReplySending(false);
  };

  const handleSendTemplateFromInbox = async () => {
    if (!inboxReplyTemplate || !selectedConv || !activeConv || inboxReplySending) return;
    setInboxReplySending(true);
    setInboxReplyStatus(null);
    try {
      let preview = inboxReplyTemplate.body || "";
      Object.entries(inboxReplyVars).forEach(([k, v]) => {
        preview = preview.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
      });
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/send_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id:     companyId,
          lead_id:        activeConv.lead_id,
          phone:          selectedConv,
          template_name:  inboxReplyTemplate.name,
          language_code:  inboxReplyTemplate.language || "en",
          variables_used: inboxReplyVars,
          body_preview:   preview,
          user_id:        userId,
          lead_name:      activeConv.lead_name,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setInboxReplyStatus({ ok: true, msg: "Template sent!" });
        setInboxReplyTemplate(null);
        setInboxReplyVars({});
        fetchThread(selectedConv, { silent: true });
        fetchConversations({ silent: true });
      } else {
        setInboxReplyStatus({ ok: false, msg: d.error || "Send failed" });
      }
    } catch {
      setInboxReplyStatus({ ok: false, msg: "Network error" });
    }
    setInboxReplySending(false);
  };

  const saveConfig = async () => {
    setConfigStatus({ type: "loading", msg: "Saving..." });
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/config/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waConfig),
      });
      const d = await res.json();

      if (res.ok) {
        setConfigStatus({ type: "success", msg: "Settings saved!" });
        setIsConfigured(!!waConfig.wa_number);
      } else {
        setConfigStatus({ type: "error", msg: d.error || "Save failed" });
      }
    } catch {
      setConfigStatus({ type: "error", msg: "Save failed" });
    }
  };

  const handleLeadPick = (lead) => {
    setSelectedLeadId(lead._id);
    setManualPhone(getLeadPhone(lead));
    setManualName(lead.name || "");
    setLeadSearch(`${lead.name || "Unknown"} · ${lead.email || getLeadPhone(lead)}`);
  };

  const clearLeadSelection = () => {
    setSelectedLeadId("");
    setManualPhone("");
    setManualName("");
    setLeadSearch("");
  };

  const handleManualSend = async () => {
    const phone = selectedLead ? getLeadPhone(selectedLead) : manualPhone;
    const name = selectedLead?.name || manualName;

    if (!phone || !manualMessage.trim()) {
      setSendStatus({ type: "error", msg: "Phone number and message are required." });
      return;
    }

    setSendStatus({ type: "loading", msg: "Sending..." });

    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/send_manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          phone,
          message: manualMessage,
          lead_id: selectedLead?._id || "",
          lead_name: name,
        }),
      });

      const d = await res.json();

      if (res.ok) {
        setSendStatus({ type: "success", msg: "WhatsApp sent!" });
        setManualMessage("");
        fetch(`${API_BASE_URL}/whatsapp/messages/${companyId}?page=1&per_page=1`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => data && setMsgTotal(data.total))
          .catch(() => {});
      } else {
        const providerMsg =
          d?.provider_response?.message ||
          d?.provider_response?.error ||
          d?.error ||
          "Unknown response";

        setSendStatus({ type: "error", msg: providerMsg });
      }
    } catch {
      setSendStatus({ type: "error", msg: "Send failed" });
    }
  };

  const handleBulkSend = async () => {
    if (!bulkMessage.trim()) {
      setBulkStatus({ type: "error", msg: "Please enter a message." });
      return;
    }

    setBulkStatus({ type: "loading", msg: `Sending to ${leadsWithPhone.length} leads...` });

    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/send_bulk/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: bulkMessage }),
      });

      const d = await res.json();

      if (res.ok) {
        setBulkStatus({ type: "success", msg: d.message });
        fetch(`${API_BASE_URL}/whatsapp/messages/${companyId}?page=1&per_page=1`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => data && setMsgTotal(data.total))
          .catch(() => {});
      } else {
        setBulkStatus({ type: "error", msg: d.error || "Send failed" });
      }
    } catch {
      setBulkStatus({ type: "error", msg: "Send failed" });
    }
  };

  // ── Meta Cloud handlers ─────────────────────────────────────────────────────
  const saveMetaConfig = async () => {
    setMetaConfigStatus({ type: "loading", msg: "Saving..." });
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/config/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaConfig),
      });
      const d = await res.json();
      if (res.ok) {
        setMetaConfigStatus({ type: "success", msg: "Meta config saved!" });
      } else {
        setMetaConfigStatus({ type: "error", msg: d.error || "Save failed" });
      }
    } catch {
      setMetaConfigStatus({ type: "error", msg: "Save failed" });
    }
  };

  const handleMetaLeadPick = (lead) => {
    setMetaSelectedLeadId(lead._id);
    setMetaManualPhone(getLeadPhone(lead));
    setMetaManualName(lead.name || "");
    setMetaLeadSearch(`${lead.name || "Unknown"} · ${lead.email || getLeadPhone(lead)}`);
  };

  const clearMetaLeadSelection = () => {
    setMetaSelectedLeadId("");
    setMetaManualPhone("");
    setMetaManualName("");
    setMetaLeadSearch("");
  };

  const handleMetaSend = async () => {
    const phone = metaSelectedLead ? getLeadPhone(metaSelectedLead) : metaManualPhone;
    const name = metaSelectedLead?.name || metaManualName;

    if (!phone) {
      setMetaSendStatus({ type: "error", msg: "Select a lead or enter a phone number." });
      return;
    }
    if (!selectedTemplate) {
      setMetaSendStatus({ type: "error", msg: "Select a template." });
      return;
    }

    setMetaSendStatus({ type: "loading", msg: "Sending via Meta Cloud API..." });

    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp/meta/send_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          lead_id: metaSelectedLead?._id || "",
          user_id: userId,
          phone,
          lead_name: name,
          template_name: selectedTemplate.name,
          language_code: selectedTemplate.language,
          variables_used: templateVars,
          body_preview: bodyPreview,
        }),
      });

      const d = await res.json();

      if (res.ok) {
        setMetaSendStatus({ type: "success", msg: `Sent! Meta ID: ${d.meta_message_id || "—"}` });
        setTemplateVars({});
        fetchMetaMessages();
      } else {
        const errMsg = d?.provider_response?.error?.message || d?.error || "Send failed";
        setMetaSendStatus({ type: "error", msg: errMsg });
      }
    } catch {
      setMetaSendStatus({ type: "error", msg: "Send failed" });
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: 10,
    padding: "10px 13px",
    fontSize: 12,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E3D47", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: WA_BG, border: `1px solid ${WA_BORDER}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <WaLogo size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>WhatsApp</h2>
            <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>
              WhatsApp Cloud API · {leadsWithPhone.length} leads with phone
            </p>
          </div>
          <button
            onClick={() => setConfigOpen((p) => !p)}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "1px solid #1E3D47",
              color: "#6B8E95",
              borderRadius: 8,
              padding: "5px 14px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Settings
          </button>
        </div>

        {configOpen && (
          <div style={{ padding: 20, borderBottom: "1px solid #1E3D47", background: "#0F2229", display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: 0 }}>
              WhatsApp Settings
            </p>

            <div>
              <Label>Integrated Number (From)</Label>
              <input
                type="text"
                value={waConfig.wa_number}
                onChange={(e) => setWaConfig((p) => ({ ...p, wa_number: e.target.value }))}
                placeholder="91XXXXXXXXXX"
                className="crm-input"
                style={inputStyle}
              />
            </div>

            <div>
              <Label>Template Name</Label>
              <input
                type="text"
                value={waConfig.wa_template_name}
                onChange={(e) => setWaConfig((p) => ({ ...p, wa_template_name: e.target.value }))}
                placeholder="e.g. age_outreach_v1"
                className="crm-input"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={saveConfig}
                style={{
                  background: WA_DARK,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Save Settings
              </button>

              {configStatus && <StatusBanner status={configStatus} />}
            </div>
          </div>
        )}

        <div style={{ display: "flex", borderBottom: "1px solid #1E3D47" }}>
          {[
            { key: "inbox",   label: "Inbox" },
            { key: "send",    label: "Send" },
            { key: "meta",    label: "Meta Cloud" },
            { key: "history", label: "History" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1,
                padding: "11px",
                fontSize: 12,
                fontWeight: tab === key ? 700 : 500,
                color: tab === key ? WA_GREEN : "#6B8E95",
                background: "transparent",
                border: "none",
                borderBottom: tab === key ? `2px solid ${WA_GREEN}` : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "inbox" && (
          <div style={{ display: "flex", height: 560, overflow: "hidden" }}>
            {/* ── Left: conversation list ──────────────────────────────────── */}
            <div style={{ width: 264, borderRight: "1px solid #1E3D47", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #1E3D47" }}>
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="crm-input"
                  style={{ width: "100%", background: "#0F2229", border: "1px solid #1E3D47", borderRadius: 8, padding: "7px 10px", fontSize: 11, color: "#E2F5E8", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                />
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {loadingConvs && filteredConvs.length === 0 ? (
                  <p style={{ color: "#6B8E95", fontSize: 12, textAlign: "center", padding: 24 }}>Loading…</p>
                ) : filteredConvs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 32 }}>
                    <WaLogo size={32} color="#1E3D47" />
                    <p style={{ color: "#6B8E95", fontSize: 11, marginTop: 10 }}>No conversations yet</p>
                  </div>
                ) : filteredConvs.map((conv) => (
                  <ConvItem
                    key={conv.contact_phone}
                    conv={conv}
                    selected={selectedConv === conv.contact_phone}
                    onClick={() => setSelectedConv(conv.contact_phone)}
                  />
                ))}
              </div>
            </div>

            {/* ── Right: thread ────────────────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              {!selectedConv ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <WaLogo size={40} color="#1E3D47" />
                  <p style={{ color: "#6B8E95", fontSize: 12, margin: 0 }}>Select a conversation to view the thread</p>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div style={{ padding: "11px 16px", borderBottom: "1px solid #1E3D47", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0A2419", border: "1px solid #25D36644", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: WA_GREEN, flexShrink: 0 }}>
                      {(activeConv?.lead_name || selectedConv)[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#E2F5E8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {activeConv?.lead_name || selectedConv}
                      </p>
                      <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>{selectedConv}</p>
                    </div>
                    {activeConv && (() => {
                      const s = CONV_STATUS_STYLES[activeConv.status] || CONV_STATUS_STYLES.no_reply;
                      return (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: s.color + "22", color: s.color, border: `1px solid ${s.color}44`, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {s.label}
                        </span>
                      );
                    })()}
                    {activeConv?.assigned_to && (
                      <span style={{ fontSize: 10, color: "#4A7080", marginLeft: 4 }}>👤 {activeConv.assigned_to}</span>
                    )}
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                    {loadingThread && threadMessages.length === 0 ? (
                      <p style={{ color: "#6B8E95", fontSize: 12, textAlign: "center", marginTop: 40 }}>Loading…</p>
                    ) : threadMessages.length === 0 ? (
                      <p style={{ color: "#6B8E95", fontSize: 12, textAlign: "center", marginTop: 40 }}>No messages in thread</p>
                    ) : threadMessages.map((msg) => (
                      <MessageBubble key={msg.id} msg={msg} />
                    ))}
                  </div>

                  {/* Thread footer — 24h window */}
                  <div style={{ padding: "12px 16px", borderTop: "1px solid #1E3D47", flexShrink: 0 }}>
                    {activeConv?.window_open ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: WA_GREEN, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: WA_GREEN }}>24h window open</span>
                          {activeConv.window_until && (
                            <span style={{ fontSize: 10, color: "#4A7080" }}>
                              · closes {new Date(activeConv.window_until).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            value={inboxReplyText}
                            onChange={(e) => setInboxReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
                            placeholder="Type a message…"
                            style={{ flex: 1, background: "#0F2229", border: "1px solid #1E3D47", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#E2F5E8", outline: "none", fontFamily: "inherit" }}
                          />
                          <button
                            onClick={handleSendText}
                            disabled={inboxReplySending || !inboxReplyText.trim()}
                            style={{ background: WA_GREEN, color: "#060E09", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: inboxReplySending || !inboxReplyText.trim() ? 0.5 : 1 }}
                          >
                            {inboxReplySending ? "…" : "Send"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B" }}>Template required</span>
                          <span style={{ fontSize: 10, color: "#4A7080" }}>· 24h window closed</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: inboxReplyTemplate?.variables?.length ? 8 : 0 }}>
                          <select
                            value={inboxReplyTemplate?.name || ""}
                            onChange={(e) => {
                              const t = metaTemplates.find((x) => x.name === e.target.value) || null;
                              setInboxReplyTemplate(t);
                              setInboxReplyVars({});
                            }}
                            style={{ flex: 1, background: "#0F2229", border: "1px solid #1E3D47", borderRadius: 8, padding: "7px 10px", fontSize: 11, color: "#E2F5E8", fontFamily: "inherit" }}
                          >
                            <option value="">Select template…</option>
                            {metaTemplates.map((t) => (
                              <option key={t.name} value={t.name}>{t.display_name || t.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={handleSendTemplateFromInbox}
                            disabled={inboxReplySending || !inboxReplyTemplate}
                            style={{ background: "#0D3D20", color: WA_GREEN, border: `1px solid ${WA_GREEN}55`, borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: inboxReplySending || !inboxReplyTemplate ? 0.5 : 1 }}
                          >
                            {inboxReplySending ? "…" : "Send"}
                          </button>
                        </div>
                        {inboxReplyTemplate?.variables?.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {inboxReplyTemplate.variables.map((v) => (
                              <input
                                key={v.index}
                                value={inboxReplyVars[v.index] || ""}
                                onChange={(e) => setInboxReplyVars((p) => ({ ...p, [v.index]: e.target.value }))}
                                placeholder={v.label || `Variable {{${v.index}}}`}
                                style={{ background: "#0F2229", border: "1px solid #1E3D47", borderRadius: 7, padding: "6px 10px", fontSize: 11, color: "#E2F5E8", outline: "none", fontFamily: "inherit" }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {inboxReplyStatus && (
                      <p style={{ fontSize: 11, color: inboxReplyStatus.ok ? WA_GREEN : "#EF4444", margin: "6px 0 0" }}>
                        {inboxReplyStatus.msg}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {tab === "send" && (
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 22 }}>
            {!isConfigured && (
              <div style={{ background: "#2A1A05", border: "1px solid #92400E44", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 14, marginTop: 1 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#FCD34D", margin: "0 0 3px" }}>WhatsApp not configured</p>
                  <p style={{ fontSize: 12, color: "#92400E", margin: 0 }}>
                    Click Settings above, enter your integrated number, and save.
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: 0 }}>
                Manual Send
              </p>

              <div>
                <Label>Search Lead</Label>
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search by name, email, or phone"
                  className="crm-input"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  border: "1px solid #1E3D47",
                  borderRadius: 10,
                  background: "#0F2229",
                }}
              >
                {searchableLeads.length === 0 ? (
                  <div style={{ padding: "12px", fontSize: 12, color: "#6B8E95" }}>
                    No matching leads found.
                  </div>
                ) : (
                  searchableLeads.map((lead) => (
                    <button
                      key={lead._id}
                      type="button"
                      onClick={() => handleLeadPick(lead)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: selectedLeadId === lead._id ? "#142830" : "transparent",
                        border: "none",
                        color: "#FFFFFF",
                        padding: "10px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #1E3D47",
                        fontFamily: "inherit",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {lead.name || "Unknown"}
                        {isInterestedLead(lead) && (
                          <span style={{ marginLeft: 8, color: "#22C55E", fontSize: 11 }}>
                            Interested
                          </span>
                        )}
                        {!getLeadPhone(lead) && (
                          <span style={{ marginLeft: 8, color: "#F59E0B", fontSize: 11 }}>
                            No phone
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B8E95" }}>
                        {lead.email || "No email"} {getLeadPhone(lead) ? `· ${getLeadPhone(lead)}` : ""}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {selectedLeadId && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={clearLeadSelection}
                    style={{
                      background: "transparent",
                      border: "1px solid #1E3D47",
                      color: "#6B8E95",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <Label>Contact Name</Label>
                  <input
                    type="text"
                    value={selectedLeadId ? (selectedLead?.name || "") : manualName}
                    onChange={(e) => {
                      if (!selectedLeadId) setManualName(e.target.value);
                    }}
                    placeholder="e.g. John Smith"
                    disabled={!!selectedLeadId}
                    className="crm-input"
                    style={{ ...inputStyle, opacity: selectedLeadId ? 0.6 : 1 }}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <input
                    type="text"
                    value={selectedLeadId ? (getLeadPhone(selectedLead) || "") : manualPhone}
                    onChange={(e) => {
                      if (!selectedLeadId) setManualPhone(e.target.value);
                    }}
                    placeholder="91XXXXXXXXXX"
                    disabled={!!selectedLeadId}
                    className="crm-input"
                    style={{ ...inputStyle, opacity: selectedLeadId ? 0.6 : 1 }}
                  />
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <textarea
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  placeholder="Type your WhatsApp message... Use {{name}} for personalization."
                  className="crm-input"
                  style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleManualSend}
                  style={{
                    background: WA_GREEN,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <WaLogo size={14} color="white" /> Send WhatsApp
                </button>

                <StatusBanner status={sendStatus} />
              </div>
            </div>

            <div style={{ height: 1, background: "#1E3D47" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: 0 }}>
                Bulk Send — {leadsWithPhone.length} leads with phone numbers
              </p>

              <div>
                <Label>Message Template</Label>
                <textarea
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Hi {{name}}, I wanted to reach out about..."
                  className="crm-input"
                  style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleBulkSend}
                  disabled={leadsWithPhone.length === 0}
                  style={{
                    background: WA_DARK,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: leadsWithPhone.length === 0 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    opacity: leadsWithPhone.length === 0 ? 0.5 : 1,
                  }}
                >
                  <WaLogo size={14} color="white" /> Send to All ({leadsWithPhone.length})
                </button>

                <StatusBanner status={bulkStatus} />
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div style={{ padding: 22 }}>
            {loadingHistory ? (
              <p style={{ color: "#6B8E95", fontSize: 12, margin: 0 }}>Loading...</p>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <WaLogo size={44} color="#1E3D47" />
                <p style={{ color: "#6B8E95", fontSize: 13, marginTop: 14 }}>No WhatsApp messages sent yet.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 70px", gap: 10, padding: "6px 12px", fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  <span>Lead / Message</span>
                  <span>Phone</span>
                  <span>Type</span>
                  <span>Status</span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 70px", gap: 10, padding: "10px 12px", background: "#0F2229", borderRadius: 10, marginBottom: 4, alignItems: "center" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.lead_name || "Unknown"}
                      </p>
                      <p style={{ fontSize: 11, color: "#6B8E95", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.message.length > 60 ? `${msg.message.slice(0, 60)}...` : msg.message}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: "#9FE6F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.phone}</span>
                    <span style={{ fontSize: 11, background: "#142830", borderRadius: 6, padding: "2px 8px", color: "#6B8E95", textAlign: "center" }}>{msg.message_type}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: msg.status === "sent" ? WA_GREEN : "#EF4444" }}>
                      {msg.status === "sent" ? "✓ Sent" : msg.status}
                    </span>
                  </div>
                ))}

                {msgTotal > 20 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 18 }}>
                    <button
                      onClick={() => setMsgPage((p) => Math.max(1, p - 1))}
                      disabled={msgPage === 1}
                      className="crm-btn-sm crm-btn-ghost"
                    >
                      <Icon d={ICONS.chevronLeft} size={12} /> Prev
                    </button>
                    <span style={{ color: "#6B8E95", fontSize: 12 }}>
                      Page {msgPage} of {Math.ceil(msgTotal / 20)}
                    </span>
                    <button
                      onClick={() => setMsgPage((p) => p + 1)}
                      disabled={msgPage * 20 >= msgTotal}
                      className="crm-btn-sm crm-btn-ghost"
                    >
                      Next <Icon d={ICONS.chevronRight} size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "meta" && (
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Meta Cloud Config */}
            <div>
              <button
                onClick={() => setMetaConfigOpen((p) => !p)}
                style={{ background: "transparent", border: "1px solid #1E3D47", color: "#6B8E95", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                {metaConfigOpen ? "Hide" : "Configure"} Meta Cloud Credentials
              </button>

              {metaConfigOpen && (
                <div style={{ marginTop: 14, background: "#0F2229", border: "1px solid #1E3D47", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: 0 }}>Meta Cloud API — per company credentials</p>
                  <div>
                    <Label>Phone Number ID</Label>
                    <input type="text" value={metaConfig.meta_phone_number_id} onChange={(e) => setMetaConfig((p) => ({ ...p, meta_phone_number_id: e.target.value }))} placeholder="From Meta App Dashboard" className="crm-input" style={inputStyle} />
                  </div>
                  <div>
                    <Label>Access Token</Label>
                    <input type="password" value={metaConfig.meta_access_token} onChange={(e) => setMetaConfig((p) => ({ ...p, meta_access_token: e.target.value }))} placeholder="Bearer token" className="crm-input" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={saveMetaConfig} style={{ background: WA_DARK, color: "white", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Save
                    </button>
                    {metaConfigStatus && <StatusBanner status={metaConfigStatus} />}
                  </div>
                </div>
              )}
            </div>

            <div style={{ height: 1, background: "#1E3D47" }} />

            {/* Send Template */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: 0 }}>
                Send Approved Template
              </p>

              {/* Lead picker */}
              <div>
                <Label>Search Lead</Label>
                <input type="text" value={metaLeadSearch} onChange={(e) => setMetaLeadSearch(e.target.value)} placeholder="Search by name, email, or phone" className="crm-input" style={inputStyle} />
              </div>

              <div style={{ maxHeight: 180, overflowY: "auto", border: "1px solid #1E3D47", borderRadius: 10, background: "#0F2229" }}>
                {metaSearchableLeads.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 12, color: "#6B8E95" }}>No leads found.</div>
                ) : (
                  metaSearchableLeads.map((lead) => (
                    <button key={lead._id} type="button" onClick={() => handleMetaLeadPick(lead)}
                      style={{ width: "100%", textAlign: "left", background: metaSelectedLeadId === lead._id ? "#142830" : "transparent", border: "none", color: "#FFFFFF", padding: "9px 12px", cursor: "pointer", borderBottom: "1px solid #1E3D47", fontFamily: "inherit" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {lead.name || "Unknown"}
                        {isInterestedLead(lead) && <span style={{ marginLeft: 8, color: "#22C55E", fontSize: 11 }}>Interested</span>}
                        {!getLeadPhone(lead) && <span style={{ marginLeft: 8, color: "#F59E0B", fontSize: 11 }}>No phone</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B8E95" }}>{lead.email || "No email"}{getLeadPhone(lead) ? ` · ${getLeadPhone(lead)}` : ""}</div>
                    </button>
                  ))
                )}
              </div>

              {metaSelectedLeadId && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" onClick={clearMetaLeadSelection}
                    style={{ background: "transparent", border: "1px solid #1E3D47", color: "#6B8E95", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Clear
                  </button>
                </div>
              )}

              {!metaSelectedLeadId && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <Label>Name</Label>
                    <input type="text" value={metaManualName} onChange={(e) => setMetaManualName(e.target.value)} placeholder="Lead name" className="crm-input" style={inputStyle} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <input type="text" value={metaManualPhone} onChange={(e) => setMetaManualPhone(e.target.value)} placeholder="91XXXXXXXXXX" className="crm-input" style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Template picker */}
              <div>
                <Label>Template</Label>
                <select
                  value={selectedTemplate?.name || ""}
                  onChange={(e) => {
                    const t = metaTemplates.find((x) => x.name === e.target.value) || null;
                    setSelectedTemplate(t);
                    setTemplateVars({});
                  }}
                  className="crm-input"
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">— Select template —</option>
                  {metaTemplates.map((t) => (
                    <option key={t.name} value={t.name}>{t.display_name}</option>
                  ))}
                </select>
              </div>

              {/* Variable fields */}
              {selectedTemplate?.variables?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Template Variables</p>
                  {selectedTemplate.variables.map((v) => (
                    <div key={v.index}>
                      <Label>{`{{${v.index}}} — ${v.label}`}</Label>
                      <input
                        type="text"
                        value={templateVars[v.index] || ""}
                        onChange={(e) => setTemplateVars((p) => ({ ...p, [v.index]: e.target.value }))}
                        placeholder={v.label}
                        className="crm-input"
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Preview */}
              {selectedTemplate && (
                <div>
                  <Label>Message Preview</Label>
                  <div style={{ background: "#0A2419", border: "1px solid #0F3D2A", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#E2F5E8", lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 48 }}>
                    {bodyPreview || <span style={{ color: "#6B8E95" }}>Fill variables above to see preview…</span>}
                  </div>
                  <p style={{ fontSize: 10, color: "#6B8E95", margin: "5px 0 0" }}>
                    Template: <strong style={{ color: "#9FE6F2" }}>{selectedTemplate.name}</strong> · Lang: {selectedTemplate.language}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleMetaSend}
                  style={{ background: WA_GREEN, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 }}
                >
                  <WaLogo size={14} color="white" /> Send via Meta Cloud
                </button>
                <StatusBanner status={metaSendStatus} />
              </div>
            </div>

            <div style={{ height: 1, background: "#1E3D47" }} />

            {/* Audit Log */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1.3, margin: "0 0 12px" }}>
                Sent Messages — Meta Cloud Audit Log
              </p>

              {loadingMetaHistory ? (
                <p style={{ color: "#6B8E95", fontSize: 12, margin: 0 }}>Loading…</p>
              ) : metaMessages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 20px" }}>
                  <WaLogo size={36} color="#1E3D47" />
                  <p style={{ color: "#6B8E95", fontSize: 12, marginTop: 12 }}>No Meta Cloud messages sent yet.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 110px", gap: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: "#6B8E95", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    <span>Lead / Preview</span>
                    <span>Template · Phone</span>
                    <span>Status</span>
                    <span>Sent At</span>
                  </div>

                  {metaMessages.map((msg) => (
                    <div key={msg.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px 110px", gap: 8, padding: "10px 10px", background: "#0F2229", borderRadius: 10, marginBottom: 4, alignItems: "start" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.lead_name || "Unknown"}
                        </p>
                        <p style={{ fontSize: 11, color: "#9FE6F2", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.body_preview || "—"}
                        </p>
                        {msg.meta_message_id && (
                          <p style={{ fontSize: 10, color: "#3E6570", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            ID: {msg.meta_message_id}
                          </p>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#E2F5E8", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {msg.template_name}
                        </p>
                        <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>{msg.to_phone}</p>
                      </div>
                      <MetaStatusBadge status={msg.status} />
                      <span style={{ fontSize: 10, color: "#6B8E95" }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "—"}
                      </span>
                    </div>
                  ))}

                  {metaMsgTotal > 20 && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 14 }}>
                      <button onClick={() => setMetaMsgPage((p) => Math.max(1, p - 1))} disabled={metaMsgPage === 1} className="crm-btn-sm crm-btn-ghost">
                        <Icon d={ICONS.chevronLeft} size={12} /> Prev
                      </button>
                      <span style={{ color: "#6B8E95", fontSize: 12 }}>Page {metaMsgPage} of {Math.ceil(metaMsgTotal / 20)}</span>
                      <button onClick={() => setMetaMsgPage((p) => p + 1)} disabled={metaMsgPage * 20 >= metaMsgTotal} className="crm-btn-sm crm-btn-ghost">
                        Next <Icon d={ICONS.chevronRight} size={12} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { label: "Interested Leads", value: interestedLeads.length, color: "#22C55E" },
          { label: "With Phone Number", value: leadsWithPhone.length, color: WA_GREEN },
          { label: "WhatsApp Sent", value: msgTotal, color: "#9FE6F2" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 12, padding: "14px 18px" }}>
            <p style={{ fontSize: 10, color: "#6B8E95", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsApp;