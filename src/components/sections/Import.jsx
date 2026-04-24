import { useState, useEffect } from "react";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import GoogleSheetCard from "../GoogleSheetCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Import = ({ companyId, userId, fetchLeads }) => {
  const [file, setFile]                           = useState(null);
  const [uploadStatus, setUploadStatus]           = useState(null);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [sequences, setSequences]                 = useState([]);
  const [selectedSeqId, setSelectedSeqId]         = useState("");

  useEffect(() => {
    if (!companyId) return;
    fetch(`${API_BASE_URL}/campaigns/sequence/${companyId}`)
      .then((r) => r.json())
      .then((d) => setSequences(d.sequences || []))
      .catch(() => {});
  }, [companyId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setUploadStatus({ type: "error", msg: "Please select a file" }); return; }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("company_id", companyId);
    formData.append("user_id", userId);
    if (selectedSeqId) formData.append("campaign_id", selectedSeqId);
    setUploadStatus({ type: "loading", msg: "Uploading…" });
    try {
      const res  = await fetch(`${API_BASE_URL}/upload_leads`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        const seqName = sequences.find((s) => s._id === selectedSeqId)?.name;
        const enrollMsg = seqName ? ` · enrolled in "${seqName}"` : "";
        setUploadStatus({ type: "success", msg: data.message + enrollMsg });
        setDuplicateWarnings(data.duplicates || []);
        setFile(null);
        fetchLeads();
      } else setUploadStatus({ type: "error", msg: data.error });
    } catch { setUploadStatus({ type: "error", msg: "Upload failed" }); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])}
                className="crm-input" style={{ flex: 1, minWidth: 200, borderRadius: 10, padding: "9px 13px", fontSize: 12 }} />
              <button type="submit" className="crm-btn-primary">Upload Leads</button>
            </div>

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
            {selectedSeqId && (
              <p style={{ fontSize: 11, color: "#9FE6F2", margin: 0 }}>
                New leads will start at Step 1 immediately. Existing leads in the sequence are unaffected.
              </p>
            )}
          </form>

          {uploadStatus && (
            <div style={{
              marginTop: 14,
              background: uploadStatus.type === "success" ? "#0D3D20" : uploadStatus.type === "loading" ? "#142830" : "#2D0A0A",
              border: `1px solid ${uploadStatus.type === "success" ? "#22C55E44" : uploadStatus.type === "loading" ? "#1E3D47" : "#DC262644"}`,
              borderRadius: 10, padding: "10px 14px", fontSize: 12,
              color: uploadStatus.type === "success" ? "#22C55E" : uploadStatus.type === "loading" ? "#6B8E95" : "#EF4444",
              display: "flex", gap: 8,
            }}>
              <span>{uploadStatus.type === "success" ? "✓" : uploadStatus.type === "loading" ? "⟳" : "✗"}</span>
              {uploadStatus.msg}
            </div>
          )}

          {duplicateWarnings.length > 0 && (
            <div style={{ marginTop: 16, background: "#1C1505", border: "1px solid #D9770644", borderRadius: 12, padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#FCD34D", margin: "0 0 4px" }}>⚠ {duplicateWarnings.length} Duplicate{duplicateWarnings.length > 1 ? "s" : ""} Found</h3>
              <p style={{ fontSize: 11, color: "#78350F", margin: "0 0 10px" }}>These contacts already exist.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {duplicateWarnings.map((d, i) => (
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

      <GoogleSheetCard companyId={companyId} userId={userId} />
    </div>
  );
};

export default Import;
