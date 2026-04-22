import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getAvailableDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; dates.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) dates.push(d);
  }

  return dates;
}

function formatDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateDisplay(d) {
  return `${DAY_LABELS[d.getDay()]}, ${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
}

export default function ScheduleDemo() {
  const navigate = useNavigate();
  const dates = useMemo(() => getAvailableDates(), []);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [calendarReady, setCalendarReady] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    title: "Demo call for AGE",
  });

  const dateScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function handleDateScroll() {
    const el = dateScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [gcalLink, setGcalLink] = useState("");
  const [eventCreated, setEventCreated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    const key = formatDateKey(selectedDate);
    setSlotsLoading(true);
    setSlots([]);
    setSelectedTime(null);
    setCalendarReady(true);
    setAvailabilityError("");

    fetch(`${API_BASE_URL}/bookings/availability?date=${key}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return {
            ok: false,
            data,
          };
        }

        return {
          ok: true,
          data,
        };
      })
      .then(({ ok, data }) => {
        if (!ok) {
          setSlots([]);
          setCalendarReady(false);
          setAvailabilityError(data.error || "Scheduling is temporarily unavailable.");
          return;
        }

        setSlots(data.slots || []);
        setCalendarReady(Boolean(data.calendar_ready));
        setAvailabilityError("");
      })
      .catch(() => {
        setSlots([]);
        setCalendarReady(false);
        setAvailabilityError("Could not load availability. Please try again.");
      })
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time.");
      return;
    }

    if (!calendarReady) {
      setError("Scheduling is temporarily unavailable.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: formatDateKey(selectedDate),
          time: selectedTime,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setGcalLink(data.gcal_link || "");
        setEventCreated(Boolean(data.event_created));
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1A2E35] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#0F5E6E]/40 bg-[#0F5E6E]/30">
            <svg className="h-8 w-8 text-[#2D8FA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-[#2D8FA2]">
            Automated Growth Ecosystem
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">You're booked!</h1>

          <p className="mt-3 text-sm leading-relaxed text-white/60">
            <span className="font-semibold text-white">{form.title}</span>
            <br />
            {formatDateDisplay(selectedDate)} · {selectedTime} IST
          </p>

          {eventCreated ? (
            <p className="mt-3 text-xs text-[#2D8FA2]">
              A calendar invite has been sent to {form.email}.
            </p>
          ) : (
            <p className="mt-3 text-xs text-white/40">
              Confirmation sent to {form.email}.
            </p>
          )}

          {gcalLink && (
            <a
              href={gcalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-[#E8563A] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E8563A]/25 transition hover:bg-[#d14b30]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z" />
              </svg>
              View in Google Calendar
            </a>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-4 block w-full rounded-xl border border-white/10 py-3 text-sm text-white/40 transition hover:text-white/70"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A2E35] px-4 py-12">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-10 text-center">
          <button onClick={() => navigate("/")} className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5E6E] text-xs font-bold text-white">
              AGE
            </div>
            <span className="text-sm font-semibold text-white/60">Automated Growth Ecosystem</span>
          </button>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">Book a Demo</h1>
          <p className="mt-3 text-sm text-white/50">30-minute call · Pick a slot that works for you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              1 · Pick a Date
            </p>

            <div className="relative">
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => dateScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                  className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1A2E35] text-white/60 shadow-md hover:text-white transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <div
                ref={dateScrollRef}
                onScroll={handleDateScroll}
                className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
                style={{ scrollbarWidth: "none" }}
              >
              {dates.map((d) => {
                const key = formatDateKey(d);
                const selected = selectedDate && formatDateKey(selectedDate) === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`shrink-0 flex flex-col items-center rounded-xl px-3.5 py-2.5 text-xs transition ${
                      selected
                        ? "bg-[#0F5E6E] text-white shadow-lg shadow-[#0F5E6E]/30"
                        : "border border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="font-semibold">{DAY_LABELS[d.getDay()]}</span>
                    <span className={`mt-0.5 text-[11px] ${selected ? "text-white/70" : "text-white/35"}`}>
                      {MONTH_LABELS[d.getMonth()]} {d.getDate()}
                    </span>
                  </button>
                );
              })}
              </div>

              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => dateScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                  className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1A2E35] text-white/60 shadow-md hover:text-white transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div
            className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-opacity ${
              !selectedDate ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              2 · Pick a Time <span className="normal-case font-normal text-white/25">(IST)</span>
            </p>

            {slotsLoading ? (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Checking availability…
              </div>
            ) : !calendarReady ? (
              <p className="text-sm text-red-400">
                {availabilityError || "Scheduling is temporarily unavailable."}
              </p>
            ) : selectedDate && slots.length === 0 ? (
              <p className="text-sm text-white/40">No available slots on this day. Try another date.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`rounded-xl py-2.5 text-xs font-medium transition ${
                      selectedTime === t
                        ? "bg-[#0F5E6E] text-white shadow-lg shadow-[#0F5E6E]/30"
                        : "border border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              3 · Your Details
            </p>

            <div>
              <label className="mb-1.5 block text-xs text-white/50">
                Meeting title
                <span className="ml-2 font-normal text-white/25">(you can change this)</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border border-[#0F5E6E]/40 bg-[#0F5E6E]/10 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#0F5E6E]/60 focus:ring-2 focus:ring-[#0F5E6E]/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-white/50">Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Pratham Pandey"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#0F5E6E]/60 focus:ring-2 focus:ring-[#0F5E6E]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-white/50">Email *</label>
                <input
                  required
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#0F5E6E]/60 focus:ring-2 focus:ring-[#0F5E6E]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Company</label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#0F5E6E]/60 focus:ring-2 focus:ring-[#0F5E6E]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs text-white/50">Anything you'd like us to know?</label>
                <textarea
                  rows={3}
                  placeholder="Team size, current tools, what you're hoping to see…"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#0F5E6E]/60 focus:ring-2 focus:ring-[#0F5E6E]/20"
                />
              </div>
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="flex items-center gap-2.5 rounded-xl border border-[#0F5E6E]/30 bg-[#0F5E6E]/10 px-4 py-3 text-sm text-white/70">
              <svg className="h-4 w-4 shrink-0 text-[#2D8FA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateDisplay(selectedDate)} · {selectedTime} IST · 30 min
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedDate || !selectedTime || !calendarReady}
            className="w-full rounded-xl bg-[#E8563A] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E8563A]/25 transition hover:bg-[#d14b30] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Booking…" : "Confirm Demo"}
          </button>
        </form>
      </div>
    </div>
  );
}