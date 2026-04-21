import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function authHeaders(pin) {
  return { "Content-Type": "application/json", "X-Admin-Pin": pin };
}

// ─── sub-components ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-bold text-slate-900">{value ?? "—"}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function NotifBell({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
    >
      <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [pin, setPin] = useState(() => sessionStorage.getItem("admin_pin") || "");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [authing, setAuthing] = useState(false);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Notifications
  const [notifications, setNotifications] = useState([]);   // recent new signups
  const [notifOpen, setNotifOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const lastCheckedAt = useRef(new Date().toISOString());
  const notifPanelRef = useRef(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null); // { user_id, name, email }
  const [deleting, setDeleting] = useState(false);

  // Approve
  const [approvingId, setApprovingId] = useState(null);

  // Tabs
  const [activeTab, setActiveTab] = useState("users");

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const approveUser = async (user_id) => {
    setApprovingId(user_id);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/approve_user/${user_id}`, {
        method: "POST",
        headers: authHeaders(pin),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u.user_id === user_id ? { ...u, approved: true } : u)
        );
      } else {
        alert(data.error || "Approval failed");
      }
    } catch (e) {
      alert("Approval failed: " + e.message);
    } finally {
      setApprovingId(null);
    }
  };

  // Search / filter
  const [search, setSearch] = useState("");

  // ── auth ────────────────────────────────────────────────────────────────

  const verifyPin = async (e) => {
    e.preventDefault();
    setAuthing(true);
    setPinError("");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ping`, {
        headers: authHeaders(pinInput),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_pin", pinInput);
        setPin(pinInput);
      } else {
        setPinError("Incorrect PIN. Try again.");
      }
    } catch {
      setPinError("Could not reach server.");
    } finally {
      setAuthing(false);
    }
  };

  // ── data fetching ────────────────────────────────────────────────────────

  const fetchAll = async (currentPin) => {
    if (!currentPin) return;
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers: authHeaders(currentPin) }),
        fetch(`${API_BASE_URL}/admin/users`, { headers: authHeaders(currentPin) }),
      ]);

      if (statsRes.status === 401 || usersRes.status === 401) {
        setPin("");
        sessionStorage.removeItem("admin_pin");
        setError("Session expired. Please re-enter PIN.");
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      if (statsRes.ok) setStats(statsData);
      if (usersRes.ok) setUsers(usersData.users || []);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new registrations
  const checkNotifications = async (currentPin) => {
    if (!currentPin) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/notifications/check?since=${lastCheckedAt.current}`,
        { headers: authHeaders(currentPin) }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.count > 0) {
        setNotifications((prev) => [...data.new_users, ...prev].slice(0, 50));
        setUnseenCount((prev) => prev + data.count);
        // Update the users list as well so the table stays fresh
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.user_id));
          const fresh = data.new_users.filter((u) => !existingIds.has(u.user_id));
          return [...fresh, ...prev];
        });
      }
      lastCheckedAt.current = new Date().toISOString();
    } catch {
      // silent — notification polling failures shouldn't disrupt the UI
    }
  };

  const fetchBookings = async (currentPin) => {
    if (!currentPin) return;
    setBookingsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, { headers: authHeaders(currentPin) });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // silent
    } finally {
      setBookingsLoading(false);
    }
  };

  // On pin acquired, load data
  useEffect(() => {
    if (!pin) return;
    fetchAll(pin);
    fetchBookings(pin);
  }, [pin]);

  // Poll every 30 s
  useEffect(() => {
    if (!pin) return;
    const id = setInterval(() => checkNotifications(pin), 30_000);
    return () => clearInterval(id);
  }, [pin]);

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── delete handler ───────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/delete_user/${deleteTarget.user_id}`, {
        method: "DELETE",
        headers: authHeaders(pin),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.user_id !== deleteTarget.user_id));
        setStats((prev) => prev ? { ...prev, total_users: Math.max(0, prev.total_users - 1), total_companies: Math.max(0, prev.total_companies - (data.company_deleted || 0)) } : prev);
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── filtered list ────────────────────────────────────────────────────────

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.company_name || "").toLowerCase().includes(q)
    );
  });

  // ── PIN gate ─────────────────────────────────────────────────────────────

  if (!pin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">AGE</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Admin Access</h1>
          <p className="mt-1 text-sm text-slate-400">Enter your admin PIN to continue.</p>

          <form onSubmit={verifyPin} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Admin PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
            />
            {pinError && <p className="text-xs text-red-400">{pinError}</p>}
            <button
              type="submit"
              disabled={authing || !pinInput}
              className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
            >
              {authing ? "Verifying…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── main dashboard ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">AGE</span>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900">Admin</h1>
            </div>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
              <button
                onClick={() => setActiveTab("users")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${activeTab === "users" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Registrations
              </button>
              <button
                onClick={() => { setActiveTab("bookings"); fetchBookings(pin); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${activeTab === "bookings" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Bookings {bookings.length > 0 && <span className="ml-1 rounded-full bg-[#0F5E6E] px-1.5 py-0.5 text-[10px] font-bold text-white">{bookings.length}</span>}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAll(pin)}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifPanelRef}>
              <NotifBell
                count={unseenCount}
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setUnseenCount(0);
                }}
              />

              {notifOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">New Registrations</p>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400">
                      No new signups since you opened this page.
                    </p>
                  ) : (
                    <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
                      {notifications.map((n) => (
                        <li key={n.user_id} className="flex items-start gap-3 px-4 py-3">
                          <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            {(n.name || n.email || "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {n.name || "—"}
                            </p>
                            <p className="truncate text-xs text-slate-500">{n.email}</p>
                            <p className="text-xs text-slate-400">{fmtDate(n.created_at)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                sessionStorage.removeItem("admin_pin");
                setPin("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total Users" value={stats.total_users} />
            <StatCard label="Companies" value={stats.total_companies} />
            <StatCard label="Onboarded" value={stats.onboarding_completed} />
            <StatCard label="New Today" value={stats.new_today} />
            <StatCard label="This Week" value={stats.new_this_week} />
          </div>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === "bookings" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
              <button
                onClick={() => fetchBookings(pin)}
                disabled={bookingsLoading}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                {bookingsLoading ? "Loading…" : "Refresh"}
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {bookingsLoading && bookings.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
              ) : bookings.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">No demo bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-left">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Name</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Company</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Date</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Time</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Message</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Calendar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((b) => (
                        <tr key={b._id} className="transition hover:bg-slate-50">
                          <td className="px-5 py-3 font-medium text-slate-800">{b.name || "—"}</td>
                          <td className="px-5 py-3 text-slate-600">{b.email}</td>
                          <td className="px-5 py-3 text-slate-600">{b.company || <span className="text-slate-400">—</span>}</td>
                          <td className="whitespace-nowrap px-5 py-3 font-medium text-[#0F5E6E]">{b.date}</td>
                          <td className="px-5 py-3 text-slate-700">{b.time} IST</td>
                          <td className="max-w-xs px-5 py-3 text-slate-500 truncate">{b.message || <span className="text-slate-300">—</span>}</td>
                          <td className="px-5 py-3">
                            <a
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`AGE Demo with ${b.name}${b.company ? ` (${b.company})` : ""}`)}&dates=${b.date.replace(/-/g, "")}T${b.time.replace(":", "")}00/${b.date.replace(/-/g, "")}T${String(parseInt(b.time) + (b.time.endsWith("30") ? 0 : 0)).padStart(2,"0")}${b.time.slice(2)}00&ctz=Asia%2FKolkata`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-[#0F5E6E]/30 px-2.5 py-1 text-xs font-medium text-[#0F5E6E] transition hover:bg-[#0F5E6E]/10"
                            >
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5z" />
                              </svg>
                              Add
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === "users" && <>

        {/* Search */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          <p className="text-sm text-slate-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading && users.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Email</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Company</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Plan</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Leads</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">SMS</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Approval</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Onboarding</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Registered</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.user_id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {u.name || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{u.email}</td>
                      <td className="px-5 py-3 text-slate-600">
                        {u.company_name || <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          u.plan === "pro"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {u.plan || "free"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-700">{u.lead_count}</td>
                      <td className="px-5 py-3">
                        {u.msg91_configured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Set up
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Not set</span>
                        )}
                      </td>
                      {/* Approval status + approve button */}
                      <td className="px-5 py-3">
                        {u.approved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => approveUser(u.user_id)}
                            disabled={approvingId === u.user_id}
                            title="Approve this user"
                            className="rounded-lg border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {approvingId === u.user_id ? "…" : "Approve"}
                          </button>
                        )}
                      </td>

                      {/* Onboarding status */}
                      <td className="px-5 py-3">
                        {u.onboarding_completed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Done
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                        {fmtDate(u.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setDeleteTarget({ user_id: u.user_id, name: u.name, email: u.email })}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        </> /* end users tab */}

      </main>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Delete account?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete <strong>{deleteTarget.name || deleteTarget.email}</strong> and all their data — company, leads, messages, and campaigns. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
