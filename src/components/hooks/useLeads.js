import { useState, useEffect } from "react";
import { sortLeads } from "../shared/helpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useLeads = (companyId, userId, isReady) => {
  const [leads, setLeads]                 = useState([]);
  const [leadSchedules, setLeadSchedules] = useState({});

  const fetchLeads = async () => {
    if (!companyId) return;
    try {
      const res  = await fetch(`${API_BASE_URL}/get_leads/${companyId}`);
      const data = await res.json();
      if (res.ok) {
        const sorted = sortLeads(data);
        setLeads(sorted);
        setLeadSchedules((prev) => {
          const updated = { ...prev };
          sorted.forEach((l) => {
            updated[l._id] = {
              channel:       l.pref_channel       || "email",
              interval_days: l.pref_interval_days || 2,
            };
          });
          return updated;
        });
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!isReady) return;
    let mounted = true;
    const load = async () => { if (mounted) await fetchLeads(); };
    void load();
    const iv = setInterval(load, 5000);
    window.addEventListener("focus", load);
    return () => {
      mounted = false;
      clearInterval(iv);
      window.removeEventListener("focus", load);
    };
  }, [isReady, companyId, userId]);

  const updateLeadSchedule = (id, field, value) => {
    const updated = { ...leadSchedules[id], [field]: value };
    setLeadSchedules((prev) => ({ ...prev, [id]: updated }));
    fetch(`${API_BASE_URL}/lead_schedule/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: updated.channel, interval_days: updated.interval_days }),
    }).catch(console.error);
  };

  const markIndividual = async (leadId, value) => {
    try {
      await fetch(`${API_BASE_URL}/mark_individual/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ individual: value }),
      });
      fetchLeads();
    } catch (e) { console.error(e); }
  };

  const handleStartFollowup = async (leadId, emailSubject, messageTemplate, onSuccess) => {
    const cfg = leadSchedules[leadId] || {};
    if (!messageTemplate?.trim()) {
      alert("Please enter a message template in Campaigns first.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/start_followup/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:       emailSubject,
          message:       messageTemplate,
          channel:       cfg.channel       || "email",
          interval_days: Number(cfg.interval_days || 2),
        }),
      });
      const data = await res.json();
      if (res.ok) { onSuccess?.(); fetchLeads(); }
      else alert(data.error);
    } catch { alert("Failed to start follow-up"); }
  };

  return { leads, leadSchedules, fetchLeads, updateLeadSchedule, markIndividual, handleStartFollowup };
};