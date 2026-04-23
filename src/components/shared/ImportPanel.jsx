import { useState, useEffect } from "react";
import Icon from "./Icon";
import { ICONS } from "./icons";

const API = import.meta.env.VITE_API_BASE_URL;

const StatusBox = ({ status }) => {
  if (!status) return null;
  const colors = {
    success: { bg: "#0D3D20", border: "#22C55E44", text: "#22C55E", icon: "✓" },
    error:   { bg: "#2D0A0A", border: "#DC262644", text: "#EF4444", icon: "✗" },
    loading: { bg: "#142830", border: "#1E3D47",   text: "#6B8E95", icon: "⟳" },
  };
  const c = colors[status.type] || colors.error;
  return (
    <div style={{ marginTop: 12, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: c.text, display: "flex", gap: 8 }}>
      <span>{c.icon}</span>{status.msg}
    </div>
  );
};

// campaignId — when provided, scopes everything to that sequence
const ImportPanel = ({ companyId, userId: userIdProp, campaignId = null, fetchLeads = () => {} }) => {
  const userId = userIdProp || localStorage.getItem("user_id");

  // ── CSV state ──────────────────────────────────────────────────────────────
  const [file, setFile]                         = useState(null);
  const [csvStatus, setCsvStatus]               = useState(null);
  const [duplicates, setDuplicates]             = useState([]);
  const [sequences, setSequences]               = useState([]);
  const [selectedSeqId, setSelectedSeqId]       = useState(campaignId || "");

  // ── Google Sheets state ───────────────────────────────────────────────────
  const lsKey = campaignId ? `gsheet_campaign_${campaignId}` : `gsheet_${companyId}`;
  const [inputUrl, setInputUrl]   = useState("");
  const [sheetUrl, setSheetUrl]   = useState("");
  const [connected, setConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncing, setSyncing]     = useState(false);
  const [sheetStatus, setSheetStatus] = useState(null);

  // load sequences dropdown (only when not scoped to a campaign)
  useEffect(() => {
    if (campaignId || !companyId) return;
    fetch(`${API}/campaigns/sequence/${companyId}`)
      .then((r) => r.json())
      .then((d) => setSequences(d.sequences || []))
      .catch(() => {});
  }, [companyId, campaignId]);

  // restore saved sheet from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(lsKey);
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      setConnected(true);
      setSheetUrl(p.url || "");
      setInputUrl(p.url || "");
      setLastSynced(p.lastSynced || null);
    } catch (_) {}
  }, [lsKey]);

  // auto-sync every 20 min when connected
  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => handleSync(true), 20 * 60 * 1000);
    return () => clearInterval(iv);
  }, [connected]);

  // ── CSV handlers ───────────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setCsvStatus({ type: "error", msg: "Please select a file" }); return; }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("company_id", companyId);
    fd.append("user_id", userId);
    const enrollId = campaignId || selectedSeqId;
    if (enrollId) fd.append("campaign_id", enrollId);
    setCsvStatus({ type: "loading", msg: "Uploading…" });
    try {
      const res  = await fetch(`${API}/upload_leads`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        const seqName = campaignId ? null : sequences.find((s) => s._id === selectedSeqId)?.name;
        const note    = seqName ? ` · enrolled in "${seqName}"` : campaignId ? " · enrolled in this sequence" : "";
        setCsvStatus({ type: "success", msg: data.message + note });
        setDuplicates(data.duplicates || []);
        setFile(null);
        fetchLeads();
      } else {
        setCsvStatus({ type: "error", msg: data.error });
      }
    } catch {
      setCsvStatus({ type: "error", msg: "Upload failed" });
    }
  };

  // ── Google Sheets handlers ─────────────────────────────────────────────────
  const handleConnect = async () => {
    if (!inputUrl.trim()) { setSheetStatus({ type: "error", msg: "Please paste a Google Sheet URL" }); return; }
    setSyncing(true); setSheetStatus(null);
    try {
      const body = { company_id: companyId, user_id: userId, sheet_url: inputUrl.trim(), access_token: null };
      if (campaignId) body.campaign_id = campaignId;
      const res  = await fetch(`${API}/connect_gsheet`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setConnected(true); setSheetUrl(inputUrl.trim()); setLastSynced(now);
        localStorage.setItem(lsKey, JSON.stringify({ url: inputUrl.trim(), lastSynced: now }));
        setSheetStatus({ type: "success", msg: data.message });
        fetchLeads();
      } else {
        setSheetStatus({ type: "error", msg: data.error || "Connection failed" });
      }
    } catch {
      setSheetStatus({ type: "error", msg: "Could not reach server" });
    } finally { setSyncing(false); }
  };

  const handleSync = async (silent = false) => {
    setSyncing(true);
    if (!silent) setSheetStatus(null);
    try {
      const url = campaignId
        ? `${API}/sync_gsheet_campaign/${campaignId}`
        : `${API}/sync_gsheet/${companyId}`;
      const res  = await fetch(url, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setLastSynced(now);
        localStorage.setItem(lsKey, JSON.stringify({ url: sheetUrl, lastSynced: now }));
        if (!silent) { setSheetStatus({ type: "success", msg: data.message }); fetchLeads(); }
      } else {
        if (!silent) setSheetStatus({ type: "error", msg: data.error || "Sync failed" });
      }
    } catch {
      if (!silent) setSheetStatus({ type: "error", msg: "Could not reach server" });
    } finally { setSyncing(false); }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(lsKey);
    setConnected(false); setSheetUrl(""); setInputUrl(""); setLastSynced(null); setSheetStatus(null);
  };

  const fmtTime = (iso) => iso
    ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "never";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── CSV Upload ─────────────────────────────────────────────────────── */}
      <div style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E3D47", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#1E3A5F", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", flexShrink: 0 }}>
            <Icon d={ICONS.upload} size={15} />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Upload File</h2>
            <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>CSV or Excel — columns: name, email, phone</p>
          </div>
        </div>
        <div style={{ padding: 22 }}>
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="file" accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="crm-input"
                style={{ flex: 1, minWidth: 200, borderRadius: 10, padding: "9px 13px", fontSize: 12 }}
              />
              <button type="submit" className="crm-btn-primary">Upload Leads</button>
            </div>

            {/* sequence selector — only when not scoped to a campaign */}
            {!campaignId && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 11, color: "#6B8E95", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Auto-enroll in sequence
                </label>
                <select
                  value={selectedSeqId}
                  onChange={(e) => setSelectedSeqId(e.target.value)}
                  className="crm-input"
                  style={{ flex: 1, borderRadius: 8, padding: "8px 10px", fontSize: 12 }}
                >
                  <option value="">— None (import only) —</option>
                  {sequences.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {(campaignId || selectedSeqId) && (
              <p style={{ fontSize: 11, color: "#9FE6F2", margin: 0 }}>
                New leads will start at Step 1 immediately. Existing leads in the sequence are unaffected.
              </p>
            )}
          </form>

          <StatusBox status={csvStatus} />

          {duplicates.length > 0 && (
            <div style={{ marginTop: 16, background: "#1C1505", border: "1px solid #D9770644", borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#FCD34D", margin: "0 0 4px" }}>
                ⚠ {duplicates.length} Duplicate{duplicates.length > 1 ? "s" : ""} Found
              </h3>
              <p style={{ fontSize: 11, color: "#78350F", margin: "0 0 10px" }}>These contacts already exist.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {duplicates.map((d, i) => (
                  <div key={i} style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 8, padding: 10, fontSize: 11, color: "#6B8E95", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                    <span><b style={{ color: "#FFFFFF" }}>Name:</b> {d.name || "—"}</span>
                    <span><b style={{ color: "#FFFFFF" }}>Email:</b> {d.email || "—"}</span>
                    <span><b style={{ color: "#FFFFFF" }}>Phone:</b> {d.phone || "—"}</span>
                    <span style={{ color: "#FCD34D" }}>By: {d.already_uploaded_by}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Google Sheets ──────────────────────────────────────────────────── */}
      <div style={{ background: "#142830", border: "1px solid #1E3D47", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E3D47", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: "#0D2A1A", border: "1px solid #14532D44", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Google Sheets</p>
              <p style={{ fontSize: 11, color: "#6B8E95", margin: 0 }}>
                {connected
                  ? `Auto-syncs every 20 min · Last: ${fmtTime(lastSynced)}`
                  : "Connect a public sheet to sync leads automatically"}
              </p>
            </div>
          </div>
          {connected && (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleSync(false)} disabled={syncing} className="crm-btn-sm crm-btn-green">
                <span style={{ display: "inline-block", animation: syncing ? "spin 1s linear infinite" : "none" }}>↻</span>
                {syncing ? "Syncing…" : "Sync Now"}
              </button>
              <button onClick={handleDisconnect} className="crm-btn-sm crm-btn-ghost">Disconnect</button>
            </div>
          )}
        </div>

        <div style={{ padding: 20 }}>
          {!connected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#0F2027", border: "1px solid #1E3A5F", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#60A5FA", lineHeight: 1.7 }}>
                <b style={{ color: "#93C5FD" }}>Before connecting:</b> Share your sheet as{" "}
                <b style={{ color: "#93C5FD" }}>"Anyone with the link → Viewer"</b>. Columns must be{" "}
                <b style={{ color: "#93C5FD" }}>name</b>, <b style={{ color: "#93C5FD" }}>email</b>, <b style={{ color: "#93C5FD" }}>phone</b>.
              </div>
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/…"
                className="crm-input"
                style={{ borderRadius: 10, padding: "10px 14px", fontSize: 13, width: "100%" }}
              />
              <button onClick={handleConnect} disabled={syncing} className="crm-btn-primary" style={{ alignSelf: "flex-start" }}>
                {syncing ? "Connecting…" : "Connect Sheet"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#22C55E", fontSize: 16 }}>✓</span>
              <div>
                <p style={{ fontSize: 12, color: "#6B8E95", margin: "0 0 2px" }}>Connected sheet</p>
                <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#60A5FA", textDecoration: "none", wordBreak: "break-all" }}>
                  {sheetUrl}
                </a>
              </div>
            </div>
          )}
          <StatusBox status={sheetStatus} />
        </div>
      </div>
    </div>
  );
};

export default ImportPanel;
