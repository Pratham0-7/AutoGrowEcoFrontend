import ImportPanel from "../shared/ImportPanel";

const Import = ({ companyId, userId, fetchLeads }) => (
  <ImportPanel companyId={companyId} userId={userId} fetchLeads={fetchLeads} />
);

export default Import;
