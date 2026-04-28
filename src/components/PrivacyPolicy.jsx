import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const TEAL = "#0F5E6E";
const DARK = "#1A2E35";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-xl font-bold" style={{ color: TEAL }}>
      {title}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-[#3D5560]">
      {children}
    </div>
  </section>
);

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative bg-[#1A2E35]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5E6E] text-xs font-bold text-white">
              AGE
            </div>
            <span className="text-sm font-semibold text-white">Automated Growth Ecosystem</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/60">
            <button onClick={() => navigate("/")} className="transition hover:text-white">Home</button>
            <button onClick={() => navigate("/pricing")} className="transition hover:text-white">Pricing</button>
            <button onClick={() => navigate("/schedule")} className="transition hover:text-white">Book a Demo</button>
            <button onClick={() => navigate("/privacy")} className="transition hover:text-white">Privacy Policy</button>
            <button onClick={() => navigate("/terms")} className="transition hover:text-white">Terms</button>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Automated Growth Ecosystem. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const PrivacyPolicy = () => {
  const effectiveDate = "April 28, 2026";

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1A2E35]">
      <Navbar variant="light" />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
            style={{ background: `${TEAL}12`, color: TEAL }}
          >
            Legal
          </div>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight" style={{ color: DARK }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-[#6B8E95]">
            Effective date: <strong>{effectiveDate}</strong>
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#3D5560]">
            Automated Growth Ecosystem ("AGE", "we", "us", or "our") operates a CRM and outreach platform at{" "}
            <span className="font-medium" style={{ color: TEAL }}>ageautomation.in</span>. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our platform. Please read it carefully. By accessing or using AGE, you agree to the practices described here.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3D5560]">
            Our role depends on the data involved. For your account information, AGE is the <strong className="text-[#1A2E35]">data fiduciary</strong>. For the lead and contact data you upload, you are the data fiduciary and AGE acts as a <strong className="text-[#1A2E35]">data processor</strong> on your behalf, processing that data only on your instructions.
          </p>
        </div>

        <div
          className="mb-10 rounded-2xl border p-5 text-sm"
          style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
        >
          <p className="font-semibold" style={{ color: TEAL }}>Summary (not a substitute for the full policy)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[#3D5560]">
            <li>We collect account info, lead data you upload, message content, and platform usage data.</li>
            <li>We use it to run the platform, send SMS, email, and WhatsApp outreach on your behalf, and improve the product.</li>
            <li>We do not sell your data or your leads' data.</li>
            <li>You remain the data fiduciary for your leads — we only process them on your instructions.</li>
            <li>We do not train AI models on your data. The "improve message" feature uses OpenRouter for inference only.</li>
            <li>You can request deletion of your account and data at any time via our Grievance Officer.</li>
          </ul>
        </div>

        <Section title="1. Information We Collect">
          <p><strong className="text-[#1A2E35]">Account information.</strong> When you sign up, we collect your name, email address, company name, billing details, and onboarding information including any DLT principal entity registration details, WhatsApp Business Account credentials, and SMTP configuration you choose to provide.</p>
          <p><strong className="text-[#1A2E35]">Lead and contact data.</strong> You may upload or import contact lists (names, email addresses, phone numbers, company details, custom CRM fields) into the platform. You remain the data fiduciary for this data; AGE processes it solely to provide the service on your instructions.</p>
          <p><strong className="text-[#1A2E35]">Communication content.</strong> SMS message bodies, WhatsApp message templates and bodies, email content, conversation replies, and AI-improved drafts created through the platform are stored to power delivery, history, and analytics features.</p>
          <p><strong className="text-[#1A2E35]">Usage and log data.</strong> We automatically collect information about how you interact with AGE — pages visited, features used, timestamps, IP addresses, browser type, and device identifiers — for security, debugging, and analytics.</p>
          <p><strong className="text-[#1A2E35]">Authentication data.</strong> We use Clerk for sign-in. Clerk handles password management, session tokens, and identity verification under its own privacy policy. We receive only the profile information needed to identify your account.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Provide and operate the platform</strong> — storing leads, scheduling follow-ups, sending SMS, email, and WhatsApp messages on your instruction, and powering the AI message improvement feature.</li>
            <li><strong className="text-[#1A2E35]">Authenticate and secure your account</strong> — verifying identity, detecting fraud, and enforcing our Terms of Service.</li>
            <li><strong className="text-[#1A2E35]">Improve the product</strong> — analysing aggregated, anonymised usage patterns to identify bugs and prioritise features.</li>
            <li><strong className="text-[#1A2E35]">Communicate with you</strong> — sending service announcements, onboarding guidance, billing notices, and support responses.</li>
            <li><strong className="text-[#1A2E35]">Comply with legal obligations</strong> — retaining records as required by applicable law, including the DPDP Act, 2023 and tax regulations.</li>
          </ul>
          <p>We do <strong className="text-[#1A2E35]">not</strong> use your lead data for our own marketing, sell it to third parties, or train AI models on it.</p>
        </Section>

        <Section title="3. Sharing of Information & Sub-Processors">
          <p>We do not sell, rent, or trade your personal data or your leads' data. We share information only with the sub-processors listed below, each contractually bound to process data only on our instructions:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Amazon Web Services (AWS)</strong> — cloud hosting, database, and email delivery infrastructure.</li>
            <li><strong className="text-[#1A2E35]">MSG91</strong> — SMS delivery (India).</li>
            <li><strong className="text-[#1A2E35]">Meta Platforms (WhatsApp Cloud API)</strong> — WhatsApp message delivery.</li>
            <li><strong className="text-[#1A2E35]">OpenRouter</strong> — AI inference for the message improvement feature.</li>
            <li><strong className="text-[#1A2E35]">Clerk</strong> — authentication and identity management.</li>
            <li><strong className="text-[#1A2E35]">[Payment processor — e.g., Razorpay]</strong> — payment and billing processing.</li>
          </ul>
          <p>We may also disclose information when:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Legally required</strong> — by law, court order, or to protect the safety of users or the public.</li>
            <li><strong className="text-[#1A2E35]">Business transfer</strong> — in the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you before your data is subject to a different privacy policy.</li>
          </ul>
          <p>Our sub-processor list may change over time. We will update this page when it does.</p>
        </Section>

        <Section title="4. Outreach Channels: SMS, Email, and WhatsApp">
          <p>AGE enables you to send messages across SMS, email, and WhatsApp. Across all channels, you are responsible for having a lawful basis (consent, legitimate interest, or other lawful basis under the DPDP Act, GDPR, CAN-SPAM, TRAI rules, and any other applicable law) to contact your leads. AGE acts as a data processor for these communications; you remain the data fiduciary for your contacts.</p>

          <p><strong className="text-[#1A2E35]">SMS (via MSG91 in India).</strong> SMS sent through AGE is delivered under your own DLT (Distributed Ledger Technology) principal entity registration, not under AGE's. You are responsible for completing DLT registration, getting your message templates approved, collecting valid opt-in from leads under TRAI rules, and honouring STOP requests. AGE provides the technical sending infrastructure and the audit trail.</p>

          <p><strong className="text-[#1A2E35]">Email (via AWS).</strong> Emails are sent through your configured sender identity. You are responsible for ensuring you have a lawful basis to email each recipient. All marketing emails sent through AGE include an unsubscribe mechanism, and unsubscribes are automatically suppressed for future sends.</p>

          <p><strong className="text-[#1A2E35]">WhatsApp (via Meta Cloud API).</strong> WhatsApp messages are sent under your own WhatsApp Business Account, using templates you have submitted to Meta for approval. You are responsible for collecting valid opt-in from recipients, complying with Meta's commerce and messaging policies, and maintaining your WABA quality rating. AGE does not control Meta's template approval, account suspension, or rate-limiting decisions.</p>

          <p>Message logs (delivery status, timestamps, template names, replies) are stored in your account for audit and analytics. We do not read the content of messages you send except to display them in your inbox and to debug specific support requests you raise with us.</p>
        </Section>

        <Section title="5. AI Processing">
          <p>AGE includes an optional "improve message" feature that uses AI to refine the wording of messages you draft. When you use this feature:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your draft message text is sent to <strong className="text-[#1A2E35]">OpenRouter</strong>, which routes it to an underlying language model for inference.</li>
            <li>An improved version is returned for your review. You choose whether to use, edit, or discard the suggestion.</li>
            <li><strong className="text-[#1A2E35]">What is sent:</strong> the message draft text and any context you explicitly include in the prompt.</li>
            <li><strong className="text-[#1A2E35]">What is not sent:</strong> lead contact details, full conversation history, account credentials, or other data you have not included in the draft.</li>
          </ul>
          <p>AGE does not train any AI models on your data, your leads' data, or your message content. OpenRouter and the underlying model providers process this data subject to their own terms of service.</p>
        </Section>

        <Section title="6. Data Security">
          <p>We implement reasonable technical and organisational security measures, including:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>TLS 1.2+ encryption for data in transit and encryption at rest for databases and backups.</li>
            <li>Role-based access controls limiting access to customer data to personnel who need it to perform their job.</li>
            <li>API credentials (WhatsApp tokens, SMTP passwords, DLT keys) stored encrypted in our database.</li>
            <li>Hosting on AWS infrastructure with industry-standard security certifications.</li>
            <li>Regular dependency updates, logging, and access monitoring.</li>
          </ul>
          <p>No method of transmission or electronic storage is 100% secure. If you believe your account has been compromised, contact us immediately. In the event of a personal data breach affecting your data, we will notify you and the Data Protection Board of India as required under the DPDP Act.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>We retain different categories of data for different periods:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Account data</strong> — for the duration of your account, plus 90 days after cancellation.</li>
            <li><strong className="text-[#1A2E35]">Lead and contact data</strong> — for the duration of your subscription. Deleted within 30 days of account deletion or written request.</li>
            <li><strong className="text-[#1A2E35]">Message content and logs</strong> — for the duration of your subscription, then deleted with your account data.</li>
            <li><strong className="text-[#1A2E35]">Encrypted backups</strong> — retained for up to 30 days and then overwritten.</li>
            <li><strong className="text-[#1A2E35]">Billing and tax records</strong> — retained for up to 8 years to comply with Indian tax law.</li>
            <li><strong className="text-[#1A2E35]">Security and access logs</strong> — retained for up to 12 months.</li>
            <li><strong className="text-[#1A2E35]">Anonymised aggregated analytics</strong> — may be retained indefinitely.</li>
          </ul>
          <p>You may request early deletion at any time by contacting our Grievance Officer.</p>
        </Section>

        <Section title="8. Your Rights as a Data Principal">
          <p>Under India's Digital Personal Data Protection Act, 2023, and equivalent rights in other jurisdictions, you have the right to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Access</strong> a summary of personal data we process about you and the processing activities.</li>
            <li><strong className="text-[#1A2E35]">Correct or update</strong> inaccurate or incomplete data.</li>
            <li><strong className="text-[#1A2E35]">Erase</strong> your data when no longer needed for the purpose collected.</li>
            <li><strong className="text-[#1A2E35]">Port</strong> your lead data in a machine-readable format (CSV export available in-app).</li>
            <li><strong className="text-[#1A2E35]">Withdraw consent</strong> where processing is based on consent.</li>
            <li><strong className="text-[#1A2E35]">Nominate</strong> another individual to exercise your rights in the event of your death or incapacity.</li>
            <li><strong className="text-[#1A2E35]">Grievance redressal</strong> — raise complaints about how your data is handled (see Section 9).</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:privacy@ageautomation.in" className="font-medium underline" style={{ color: TEAL }}>privacy@ageautomation.in</a>. We will respond within the timelines required by law.</p>
          <p>If you are a lead whose data was uploaded by one of our customers, your data fiduciary is that customer, not AGE. We will help you reach them; the customer's identity is included in the message you received.</p>
        </Section>

        <Section title="9. Grievance Officer">
          <p>In accordance with the DPDP Act, 2023, we have appointed a Grievance Officer to address concerns about how your personal data is handled.</p>
          <div
            className="mt-4 rounded-xl border p-5 text-sm"
            style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
          >
            <p className="font-bold" style={{ color: DARK }}>Grievance Officer</p>
            <p className="mt-1 text-[#3D5560]">Name: Pratham Pandey (Founder)</p>
            <p className="text-[#3D5560]">Email: <a href="mailto:grievance@ageautomation.in" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a></p>
          </div>
          <p>We will acknowledge complaints within 7 days and aim to resolve them within 30 days. If you are not satisfied with our response, you may approach the Data Protection Board of India.</p>
        </Section>

        <Section title="10. Cookies & Tracking">
          <p>AGE uses minimal cookies required for session management and authentication (via Clerk). We do not use advertising trackers or sell behavioural data.</p>
          <p>You can configure your browser to refuse cookies, but some features of the platform may not function correctly without them.</p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>AGE is a business-to-business platform and is not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, contact us and we will delete it promptly.</p>
        </Section>

        <Section title="12. International Transfers">
          <p>Some of our sub-processors operate outside India:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>AWS may process data in regions including Mumbai (ap-south-1) and others.</li>
            <li>OpenRouter processes AI inference requests in the United States.</li>
            <li>Meta processes WhatsApp messages on its global infrastructure.</li>
            <li>Clerk processes authentication data on its US-based infrastructure.</li>
          </ul>
          <p>The DPDP Act permits transfers of personal data outside India unless restricted by the Government of India. We rely on contractual data protection commitments with our sub-processors to protect your data internationally.</p>
        </Section>

        <Section title="13. Service Disclaimer">
          <p>AGE is an automation platform for running follow-up sequences across multiple channels (SMS, email, and WhatsApp). We help you stay in front of your leads with consistent, multi-touch outreach so prospects don't fall through the cracks.</p>
          <p><strong className="text-[#1A2E35]">What AGE provides:</strong></p>
          <ul className="list-disc space-y-2 pl-5">
            <li>A platform to design, schedule, and run automated follow-up sequences.</li>
            <li>Message delivery through our infrastructure partners (AWS, MSG91, Meta).</li>
            <li>Tracking of delivery, replies, and engagement.</li>
            <li>Tools to manage and respond to lead conversations.</li>
          </ul>
          <p><strong className="text-[#1A2E35]">What AGE does not guarantee:</strong></p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Conversions, sales, deals closed, or any specific business outcome.</li>
            <li>Revenue increase, ROI, or growth in your sales pipeline.</li>
            <li>The quality, accuracy, or buying intent of leads you upload.</li>
            <li>Reply rates, open rates, or engagement levels from leads.</li>
            <li>That every message will be delivered — delivery depends on carrier networks, recipient device status, spam filters, DLT and template approval timing, ISP reputation, WhatsApp account health, and other factors outside our control.</li>
          </ul>
          <p>AGE is a tool that automates outreach. Results depend on the quality of your leads, the relevance of your messaging, your offer, your sales process, how quickly your team responds to replies, and many other factors specific to your business. You are responsible for the content of your messages, the leads you contact, your DLT and consent compliance, and how you handle responses.</p>
          <p>The Service is provided "as is" and "as available" without warranties of any kind beyond those required by applicable law. To the maximum extent permitted by law, AGE is not liable for any business losses, lost profits, missed deals, or consequential damages arising from your use of the Service.</p>
        </Section>

        <Section title="14. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. When we do, we will revise the "Effective date" at the top of this page and, for material changes, notify you by email or a prominent in-app notice at least 14 days before the change takes effect.</p>
          <p>Continued use of AGE after the effective date constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="15. Contact Us">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact:</p>
          <div
            className="mt-4 rounded-xl border p-5 text-sm"
            style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
          >
            <p className="font-bold" style={{ color: DARK }}>Automated Growth Ecosystem</p>
            <p className="mt-1 text-[#3D5560]">General privacy: <a href="mailto:privacy@ageautomation.in" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a></p>
            <p className="text-[#3D5560]">Grievance Officer: <a href="mailto:grievance@ageautomation.in" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a></p>
            <p className="text-[#3D5560]">Website: ageautomation.in</p>
          </div>
          <p>This Privacy Policy is governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts at Bhopal, Madhya Pradesh.</p>
        </Section>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-[#6B8E95]">
          This document was last updated on <strong>{effectiveDate}</strong>. Earlier versions are available upon request.
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
