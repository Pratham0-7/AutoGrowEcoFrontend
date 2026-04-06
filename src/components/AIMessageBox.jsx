import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const ICONS = {
  ai: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  close: "M6 18L18 6M6 6l12 12",
  copy: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184",
  check: "M4.5 12.75l6 6 9-13.5",
  spin: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z",
};

const AIMessageBox = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("generate");
  const [businessType, setBusinessType] = useState("real estate");
  const [tone, setTone] = useState("professional and friendly");
  const [goal, setGoal] = useState("follow up with a lead");
  const [extraContext, setExtraContext] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/generate_message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_type: businessType, tone, goal, extra_context: extraContext }),
      });
      const data = await res.json();
      if (res.ok) setOutputMessage(data.message);
      else alert(data.error || "Failed to generate message");
    } catch (e) { console.error(e); alert("Failed to generate message"); }
    finally { setLoading(false); }
  };

  const handleImprove = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/improve_message`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, tone, goal }),
      });
      const data = await res.json();
      if (res.ok) setOutputMessage(data.message);
      else alert(data.error || "Failed to improve message");
    } catch (e) { console.error(e); alert("Failed to improve message"); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!outputMessage) return;
    navigator.clipboard.writeText(outputMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .ai-drawer { font-family: 'DM Sans', system-ui, sans-serif; }
        .ai-input { background: #0F172A !important; border: 1px solid #1E293B !important; color: #E2E8F0 !important; transition: border-color .2s, box-shadow .2s; font-family: inherit; }
        .ai-input::placeholder { color: #374151 !important; }
        .ai-input:focus { outline: none; border-color: #6D28D9 !important; box-shadow: 0 0 0 3px #6D28D920 !important; }
        .ai-drawer::-webkit-scrollbar { width: 4px; }
        .ai-drawer::-webkit-scrollbar-track { background: #0F172A; }
        .ai-drawer::-webkit-scrollbar-thumb { background: #312E81; border-radius: 2px; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40, background: "#00000088", backdropFilter: "blur(4px)" }} />

      {/* Drawer */}
      <div className="ai-drawer" style={{ position: "fixed", right: 0, top: 0, zIndex: 50, height: "100%", width: "100%", maxWidth: 480, background: "#0B1120", borderLeft: "1px solid #1E293B", boxShadow: "-16px 0 64px #00000066", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#030712", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <Icon d={ICONS.ai} size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", margin: 0 }}>AI Assistant</h2>
              <p style={{ fontSize: 12, color: "#4B5563", margin: 0 }}>Write better outreach messages</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#1E293B", border: "none", color: "#6B7280", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon d={ICONS.close} size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }} className="ai-drawer">

          {/* Mode toggle */}
          <div style={{ display: "inline-flex", background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {["generate", "improve"].map((m) => (
              <button key={m} onClick={() => setMode(m)}
                style={{ background: mode === m ? "linear-gradient(135deg, #6D28D9, #4F46E5)" : "transparent", color: mode === m ? "white" : "#6B7280", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", transition: "all .15s" }}>
                {m === "generate" ? "✦ Generate" : "⟳ Improve"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Shared fields */}
            {[
              { label: "Business Type", val: businessType, set: setBusinessType, ph: "e.g. real estate, SaaS, consulting" },
              { label: "Tone", val: tone, set: setTone, ph: "e.g. professional and friendly" },
              { label: "Goal", val: goal, set: setGoal, ph: "e.g. follow up with a lead" },
            ].map(({ label, val, set, ph }) => (
              <div key={label}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{label}</label>
                <input type="text" value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                  className="ai-input"
                  style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13 }} />
              </div>
            ))}

            {mode === "generate" && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Extra Context</label>
                <textarea value={extraContext} onChange={(e) => setExtraContext(e.target.value)}
                  placeholder="City, offer, property type, product detail..."
                  className="ai-input"
                  style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13, minHeight: 100, resize: "vertical" }} />
              </div>
            )}

            {mode === "improve" && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Existing Message</label>
                <textarea value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Paste your existing message here..."
                  className="ai-input"
                  style={{ width: "100%", borderRadius: 10, padding: "11px 14px", fontSize: 13, minHeight: 120, resize: "vertical" }} />
              </div>
            )}

            {/* Action button */}
            <button onClick={mode === "generate" ? handleGenerate : handleImprove} disabled={loading}
              style={{ background: loading ? "#1E1B4B" : "linear-gradient(135deg, #7C3AED, #4F46E5)", border: loading ? "1px solid #312E81" : "none", color: loading ? "#6B7280" : "white", borderRadius: 12, padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .2s" }}>
              {loading ? (
                <>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
                    <circle cx="12" cy="12" r="10" stroke="#312E81" strokeWidth="4" />
                    <path d={ICONS.spin} fill="#7C3AED" />
                  </svg>
                  Working on it...
                </>
              ) : mode === "generate" ? "✦ Generate Message" : "⟳ Improve Message"}
            </button>

            {/* Output */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: 1 }}>Output</label>
                {outputMessage && (
                  <button onClick={handleCopy}
                    style={{ background: copied ? "#052E16" : "#1E293B", color: copied ? "#4ADE80" : "#94A3B8", border: `1px solid ${copied ? "#16A34A44" : "#334155"}`, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}>
                    <Icon d={copied ? ICONS.check : ICONS.copy} size={12} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
              <textarea value={outputMessage} onChange={(e) => setOutputMessage(e.target.value)}
                placeholder="AI output will appear here..."
                style={{ width: "100%", borderRadius: 10, padding: "14px", fontSize: 13, minHeight: 180, resize: "vertical", background: "#0F172A", border: "1px solid #312E81", color: "#E2E8F0", outline: "none", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color .2s" }}
                onFocus={(e) => e.target.style.borderColor = "#6D28D9"}
                onBlur={(e) => e.target.style.borderColor = "#312E81"} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AIMessageBox;
