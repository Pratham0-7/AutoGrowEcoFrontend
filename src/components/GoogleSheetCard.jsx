import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GoogleSheetCard = ({ companyId, userId }) => {
  const [sheetUrl, setSheetUrl]     = useState("");
  const [inputUrl, setInputUrl]     = useState("");
  const [status, setStatus]         = useState(null);
  const [syncing, setSyncing]       = useState(false);
  const [connected, setConnected]   = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`gsheet_${companyId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConnected(true);
        setSheetUrl(parsed.url || "");
        setInputUrl(parsed.url || "");
        setLastSynced(parsed.lastSynced || null);
      } catch (_) {}
    }
  }, [companyId]);

  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => handleSync(true), 20 * 60 * 1000);
    return () => clearInterval(iv);
  }, [connected]);

  const handleConnect = async () => {
    if (!inputUrl.trim()) { setStatus({ type: "error", msg: "Please paste a Google Sheet URL" }); return; }
    setSyncing(true); setStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/connect_gsheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: companyId, user_id: userId, sheet_url: inputUrl.trim(), access_token: null }),
      });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setConnected(true); setSheetUrl(inputUrl.trim()); setLastSynced(now);
        localStorage.setItem(`gsheet_${companyId}`, JSON.stringify({ url: inputUrl.trim(), lastSynced: now }));
        setStatus({ type: "success", msg: data.message });
      } else setStatus({ type: "error", msg: data.error || "Connection failed" });
    } catch { setStatus({ type: "error", msg: "Could not reach server" }); }
    finally { setSyncing(false); }
  };

  const handleSync = async (silent = false) => {
    setSyncing(true);
    if (!silent) setStatus(null);
    try {
      const res  = await fetch(`${API_BASE_URL}/sync_gsheet/${companyId}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toISOString();
        setLastSynced(now);
        localStorage.setItem(`gsheet_${companyId}`, JSON.stringify({ url: sheetUrl, lastSynced: now }));
        if (!silent) setStatus({ type: "success", msg: data.message });
      } else { if (!silent) setStatus({ type: "error", msg: data.error || "Sync failed" }); }
    } catch { if (!silent) setStatus({ type: "error", msg: "Could not reach server" }); }
    finally { setSyncing(false); }
  };

  const handleDisconnect = () => {
    localStorage.removeItem(`gsheet_${companyId}`);
    setConnected(false); setSheetUrl(""); setInputUrl(""); setLastSynced(null); setStatus(null);
  };

  const fmtTime = (iso) => iso
    ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "never";

  return (
    <div style={{ background: "#0D1117", border: "1px solid #1E293B", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#0D2A1A", border: "1px solid #14532D44", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>Google Sheets</p>
            <p style={{ fontSize: 11, color: "#4B5563", margin: 0 }}>
              {connected ? `Auto-syncs every 20 min · Last: ${fmtTime(lastSynced)}` : "Connect a public sheet to sync leads automatically"}
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
              <b style={{ color: "#93C5FD" }}>Before connecting:</b> Share your Google Sheet as{" "}
              <b style={{ color: "#93C5FD" }}>"Anyone with the link → Viewer"</b>. Columns must be named{" "}
              <b style={{ color: "#93C5FD" }}>name</b>, <b style={{ color: "#93C5FD" }}>email</b>, and{" "}
              <b style={{ color: "#93C5FD" }}>phone</b>.
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
            <span style={{ color: "#4ADE80", fontSize: 16 }}>✓</span>
            <div>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 2px" }}>Connected sheet</p>
              <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#60A5FA", textDecoration: "none", wordBreak: "break-all" }}>
                {sheetUrl}
              </a>
            </div>
          </div>
        )}

        {status && (
          <div style={{
            marginTop: 12,
            background: status.type === "success" ? "#052E16" : "#2D0A0A",
            border: `1px solid ${status.type === "success" ? "#16A34A44" : "#DC262644"}`,
            borderRadius: 10, padding: "10px 14px", fontSize: 12,
            color: status.type === "success" ? "#4ADE80" : "#F87171",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>{status.type === "success" ? "✓" : "✗"}</span>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleSheetCard;