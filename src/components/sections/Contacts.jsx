import { useState } from "react";
import Icon from "../shared/Icon";
import { ICONS } from "../shared/icons";
import { SendBadge, ReplyBadge } from "../shared/Badges";
import { formatDate, avatarColor, getInitial } from "../shared/helpers";

const LEADS_PER_PAGE = 12;

const Contacts = ({
  leads,
  leadSchedules,
  updateLeadSchedule,
  onSelectLead,
  onStartFollowup,
  onMarkIndividual,
  onGoToImport,
  currentPage,
  setCurrentPage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSendStatus, setFilterSendStatus] = useState("all");
  const [filterReplyStatus, setFilterReplyStatus] = useState("all");

  const filtered = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      [l.name, l.email, l.phone].some((v) => v?.toLowerCase().includes(q));
    const matchSend =
      filterSendStatus === "all" ||
      (filterSendStatus === "not sent"
        ? !l.send_status || l.send_status === "not sent"
        : l.send_status === filterSendStatus);
    const matchReply =
      filterReplyStatus === "all" || l.response_status === filterReplyStatus;
    return matchSearch && matchSend && matchReply;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / LEADS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE,
  );

  const clearFilters = () => {
    setFilterSendStatus("all");
    setFilterReplyStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        background: "#0D1117",
        border: "1px solid #1E293B",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #1E293B",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#F1F5F9",
              margin: 0,
            }}
          >
            All Contacts
          </h2>
          <span
            style={{
              background: "#1E1B4B",
              color: "#818CF8",
              border: "1px solid #312E81",
              borderRadius: 100,
              padding: "2px 9px",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {filtered.length}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#374151",
              }}
            >
              <Icon d={ICONS.search} size={13} />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search…"
              className="crm-input"
              style={{
                borderRadius: 9,
                padding: "7px 12px 7px 32px",
                fontSize: 12,
                width: 200,
              }}
            />
          </div>
          <select
            value={filterSendStatus}
            onChange={(e) => {
              setFilterSendStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="crm-input"
            style={{ borderRadius: 9, padding: "7px 12px", fontSize: 12 }}
          >
            <option value="all">All Send Status</option>
            <option value="not sent">Not Sent</option>
            <option value="email sent">Email Sent</option>
            <option value="sms sent">SMS Sent</option>
            <option value="both sent">Both Sent</option>
          </select>
          <select
            value={filterReplyStatus}
            onChange={(e) => {
              setFilterReplyStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="crm-input"
            style={{ borderRadius: 9, padding: "7px 12px", fontSize: 12 }}
          >
            <option value="all">All Replies</option>
            <option value="pending">Pending</option>
            <option value="yes">Interested</option>
            <option value="no">Declined</option>
            <option value="no reply">No Reply</option>
          </select>
          {(filterSendStatus !== "all" ||
            filterReplyStatus !== "all" ||
            searchQuery) && (
            <button onClick={clearFilters} className="crm-btn-sm crm-btn-ghost">
              <Icon d={ICONS.x} size={11} /> Clear
            </button>
          )}
          <button
            onClick={onGoToImport}
            className="crm-btn-primary"
            style={{ padding: "7px 14px", fontSize: 12 }}
          >
            <Icon d={ICONS.plus} size={12} /> Import
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <p
            style={{
              fontSize: 14,
              color: "#4B5563",
              fontWeight: 500,
              margin: "0 0 4px",
            }}
          >
            No contacts yet
          </p>
          <p style={{ fontSize: 12, color: "#374151", margin: "0 0 16px" }}>
            Upload a CSV / Excel file or connect Google Sheets
          </p>
          <button onClick={onGoToImport} className="crm-btn-primary">
            Import Contacts
          </button>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#070D16" }}>
                  {[
                    "#",
                    "Contact",
                    "Channel",
                    "Reply Status",
                    "Follow-ups",
                    "Last Sent",
                    "Next",
                    "Schedule",
                    "",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#374151",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #1E293B",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead, idx) => (
                  <tr
                    key={lead._id}
                    className="lead-row"
                    onClick={() => onSelectLead(lead)}
                    style={{
                      borderBottom: "1px solid #0A0F1C",
                      opacity: lead.is_individual_followup ? 0.45 : 1,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    >
                      {String(
                        (currentPage - 1) * LEADS_PER_PAGE + idx + 1,
                      ).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: avatarColor(lead.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 800,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {getInitial(lead.name)}
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span style={{ fontWeight: 700, color: "#E2E8F0" }}>
                              {lead.name || "—"}
                            </span>
                            {lead.is_individual_followup && (
                              <span
                                style={{
                                  fontSize: 8,
                                  fontWeight: 700,
                                  color: "#A78BFA",
                                  background: "#1E1B4B",
                                  border: "1px solid #4C1D95",
                                  borderRadius: 3,
                                  padding: "1px 4px",
                                }}
                              >
                                IND
                              </span>
                            )}
                            {lead.source === "google_sheets" && (
                              <span
                                style={{
                                  fontSize: 8,
                                  fontWeight: 700,
                                  color: "#4ADE80",
                                  background: "#052E16",
                                  borderRadius: 3,
                                  padding: "1px 4px",
                                }}
                              >
                                GS
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#374151",
                              marginTop: 1,
                            }}
                          >
                            {lead.email || lead.phone || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <SendBadge status={lead.send_status} />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <ReplyBadge status={lead.response_status} />
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span
                        style={{
                          background: "#1E1B4B",
                          color: "#818CF8",
                          border: "1px solid #312E81",
                          borderRadius: 8,
                          padding: "3px 10px",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {lead.followup_count || 0}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#4B5563",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(lead.last_followup_sent_at)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#4B5563",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.next_followup_at ? (
                        <span style={{ color: "#FCD34D" }}>
                          {formatDate(lead.next_followup_at)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td
                      style={{ padding: "12px 16px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: "flex", gap: 6 }}>
                        <select
                          value={leadSchedules[lead._id]?.channel || "email"}
                          onChange={(e) =>
                            updateLeadSchedule(
                              lead._id,
                              "channel",
                              e.target.value,
                            )
                          }
                          className="crm-input"
                          style={{
                            borderRadius: 7,
                            padding: "5px 8px",
                            fontSize: 11,
                            minWidth: 72,
                          }}
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="both">Both</option>
                        </select>
                        <select
                          value={leadSchedules[lead._id]?.interval_days || 2}
                          onChange={(e) =>
                            updateLeadSchedule(
                              lead._id,
                              "interval_days",
                              Number(e.target.value),
                            )
                          }
                          className="crm-input"
                          style={{
                            borderRadius: 7,
                            padding: "5px 8px",
                            fontSize: 11,
                            minWidth: 62,
                          }}
                        >
                          {[2, 3, 4, 5, 6, 7].map((d) => (
                            <option key={d} value={d}>
                              {d}d
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td
                      style={{ padding: "12px 16px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onStartFollowup(lead._id)}
                        className="crm-btn-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #6D28D9, #4F46E5)",
                          color: "white",
                          border: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Follow-up ▶
                      </button>
                    </td>
                    <td
                      style={{ padding: "12px 12px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.is_individual_followup ? (
                        <button
                          title="In Individual pool"
                          style={{
                            background: "#1C1505",
                            border: "1px solid #D9770644",
                            color: "#FCD34D",
                            borderRadius: 8,
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon d={ICONS.star} size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onMarkIndividual(lead._id, true)}
                          title="Add to Individual"
                          style={{
                            background: "#0D1117",
                            border: "1px solid #1E293B",
                            color: "#4B5563",
                            borderRadius: 8,
                            width: 30,
                            height: 30,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all .15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#FCD34D";
                            e.currentTarget.style.color = "#FCD34D";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#1E293B";
                            e.currentTarget.style.color = "#4B5563";
                          }}
                        >
                          <Icon d={ICONS.plus} size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #1E293B",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 11, color: "#374151" }}>
                {(currentPage - 1) * LEADS_PER_PAGE + 1}–
                {Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <div
                  className="page-btn"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage((p) => p - 1)
                  }
                >
                  <Icon d={ICONS.chevronLeft} size={13} />
                </div>
                {Array.from(
                  { length: Math.min(totalPages, 7) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <div
                    key={p}
                    className={`page-btn${currentPage === p ? " active-pg" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </div>
                ))}
                {totalPages > 7 && (
                  <span style={{ color: "#374151", fontSize: 12 }}>…</span>
                )}
                <div
                  className="page-btn"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage((p) => p + 1)
                  }
                >
                  <Icon d={ICONS.chevronRight} size={13} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Contacts;
