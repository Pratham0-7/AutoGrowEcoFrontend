import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AIMessageBox = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("generate");
  const [businessType, setBusinessType] = useState("real estate");
  const [tone, setTone] = useState("professional and friendly");
  const [goal, setGoal] = useState("follow up with a lead");
  const [extraContext, setExtraContext] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/generate_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_type: businessType,
          tone,
          goal,
          extra_context: extraContext,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOutputMessage(data.message);
      } else {
        alert(data.error || "Failed to generate message");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate message");
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/improve_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          tone,
          goal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOutputMessage(data.message);
      } else {
        alert(data.error || "Failed to improve message");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to improve message");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-xl border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-medium text-blue-600">AI Assistant</p>
              <h2 className="text-xl font-semibold text-slate-900">
                Write better outreach
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="mb-5 inline-flex rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => setMode("generate")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  mode === "generate"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Generate
              </button>

              <button
                onClick={() => setMode("improve")}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  mode === "improve"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Improve
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Business Type
                </label>
                <input
                  type="text"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="Business type"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Tone"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Goal"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {mode === "generate" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Extra Context
                  </label>
                  <textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    placeholder="Extra context like city, offer, property type..."
                    className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              )}

              {mode === "improve" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Existing Message
                  </label>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Paste your existing message here"
                    className="min-h-[140px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              )}

              <button
                onClick={mode === "generate" ? handleGenerate : handleImprove}
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Working..."
                  : mode === "generate"
                  ? "Generate Message"
                  : "Improve Message"}
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Output
                </label>
                <textarea
                  value={outputMessage}
                  onChange={(e) => setOutputMessage(e.target.value)}
                  placeholder="AI output will appear here"
                  className="min-h-[220px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIMessageBox;