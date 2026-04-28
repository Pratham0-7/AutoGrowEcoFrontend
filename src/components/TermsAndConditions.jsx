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

const TermsAndConditions = () => {
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
            Terms & Conditions
          </h1>
          <p className="text-sm text-[#6B8E95]">
            Effective date: <strong>{effectiveDate}</strong>
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#3D5560]">
            These Terms & Conditions ("Terms") form a binding agreement between you (the "Customer", "you", or "your") and Automated Growth Ecosystem ("AGE", "we", "us", or "our") governing your access to and use of the AGE platform and all associated services available at{" "}
            <span className="font-medium" style={{ color: TEAL }}>ageautomation.in</span>.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-[#3D5560]">
            By creating an account, clicking "Get Started", or using any part of the Service, you confirm that you have read, understood, and agree to be bound by these Terms and our{" "}
            <button onClick={() => window.location.href = "/privacy"} className="font-medium underline" style={{ color: TEAL }}>Privacy Policy</button>.
            If you are agreeing on behalf of a company or organisation, you represent that you have authority to bind that entity.
          </p>
        </div>

        {/* Summary box */}
        <div
          className="mb-10 rounded-2xl border p-5 text-sm"
          style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
        >
          <p className="font-semibold" style={{ color: TEAL }}>Key points (not a substitute for the full Terms)</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[#3D5560]">
            <li>AGE is a CRM and multi-channel outreach tool. It automates follow-ups it does not guarantee conversions, revenue, or business outcomes.</li>
            <li>You are responsible for the legality of your contacts, your message content, and compliance with DLT, TRAI, WhatsApp, and CAN-SPAM rules.</li>
            <li>Subscriptions are billed monthly in USD with a minimum commitment of 3 months (Solo, Team) or 6 months (Agency).</li>
            <li>Refunds are not provided for partial periods, unused features, or cancellations during the minimum commitment.</li>
            <li>We may suspend or terminate accounts that violate these Terms, abuse the platform, or send spam.</li>
            <li>Our liability is limited to the amount you paid us in the three months before any claim.</li>
            <li>These Terms are governed by Indian law, and disputes are resolved in the courts at Bhopal, Madhya Pradesh.</li>
          </ul>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the Service in any way, including browsing the website, creating an account, uploading data, sending messages, or using any feature you agree to these Terms in full. If you do not agree, you must not use the Service.</p>
          <p>These Terms supersede all prior agreements between you and AGE relating to the Service and, together with the Privacy Policy and any applicable Order Form, constitute the entire agreement between the parties.</p>
        </Section>

        <Section title="2. Eligibility">
          <p>You may use the Service only if:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>You are at least 18 years old and have the legal capacity to enter into contracts.</li>
            <li>You are using the Service for lawful business purposes, not for personal, household, or consumer use.</li>
            <li>Your use is not prohibited by the laws of your jurisdiction.</li>
            <li>You have not been previously suspended or removed from the Service by AGE.</li>
          </ul>
          <p>The Service is intended for business-to-business use by sales teams, founders, and growth teams managing outreach to prospective or existing business contacts.</p>
        </Section>

        <Section title="3. Account Registration & Security">
          <p>To use the Service you must create an account via Clerk, our authentication provider. You agree to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide accurate, current, and complete information during registration and keep it up to date.</li>
            <li>Maintain the confidentiality of your login credentials and API keys configured in the platform (WhatsApp tokens, MSG91 keys, SMTP passwords).</li>
            <li>Promptly notify us at <a href="mailto:prathambuilds123@gmail.com" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a> if you suspect unauthorised access.</li>
            <li>Accept responsibility for all activities that occur under your account.</li>
          </ul>
          <p>AGE reserves the right to refuse registration or cancel accounts at its discretion, including where we suspect fraudulent activity or policy violations.</p>
        </Section>

        <Section title="4. Description of the Service">
          <p>AGE is a CRM and multi-channel outreach platform that enables you to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Import and manage a database of sales leads and contacts.</li>
            <li>Design and run automated follow-up sequences across SMS (via MSG91), email, and WhatsApp (via Meta Cloud API, available as an add-on).</li>
            <li>Track delivery status, replies, engagement, and pipeline stage.</li>
            <li>Use AI assistance (via OpenRouter) to refine message drafts.</li>
            <li>Manage inbound conversation replies in a shared team inbox.</li>
          </ul>
          <p><strong className="text-[#1A2E35]">Onboarding.</strong> All plans include a 10-day onboarding period during which AGE assists with DLT registration support, channel configuration, and initial sequence setup. Onboarding tasks beyond reasonable scope or volume may be quoted as separate professional services.</p>
          <p><strong className="text-[#1A2E35]">What AGE does not guarantee.</strong> The Service is an automation and delivery tool. AGE makes no representation that use of the Service will result in increased sales, conversions, revenue, or any specific business outcome. Results depend on many factors entirely outside our control, including the quality of your leads, your offer, your pricing, market conditions, and how your team handles replies.</p>
          <p>The Service is provided "as is" and "as available". We may modify, suspend, or discontinue features at any time with reasonable notice.</p>
        </Section>

        <Section title="5. Subscription, Billing & Payment">
          <p><strong className="text-[#1A2E35]">Subscription plans.</strong> Access to the Service is offered on a subscription basis as described on our <button onClick={() => window.location.href = "/pricing"} className="font-medium underline" style={{ color: TEAL }}>Pricing page</button>. Plans, features, and pricing are subject to change with 30 days' notice to existing subscribers.</p>

          <p><strong className="text-[#1A2E35]">Billing cycle.</strong> Subscriptions are billed in advance on a monthly basis. All fees are quoted and charged in <strong className="text-[#1A2E35]">US Dollars (USD)</strong> unless otherwise stated, and are exclusive of applicable taxes (including GST for Indian customers).</p>

          <p><strong className="text-[#1A2E35]">Minimum commitment.</strong> Each subscription plan carries a minimum commitment period that begins on the date of your first paid invoice:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong className="text-[#1A2E35]">Solo plan:</strong> 3 months</li>
            <li><strong className="text-[#1A2E35]">Team plan:</strong> 3 months</li>
            <li><strong className="text-[#1A2E35]">Agency plan:</strong> 6 months</li>
          </ul>
          <p>By subscribing, you commit to paying the full subscription fee for the duration of the minimum commitment period, regardless of whether you continue to actively use the Service. After the minimum commitment period, your subscription automatically continues on a rolling month-to-month basis at the then-current rate until cancelled in accordance with Section 14.</p>

          <p><strong className="text-[#1A2E35]">Add-ons.</strong> Certain features (including but not limited to WhatsApp messaging) are available as paid add-ons in addition to your base plan. Add-on charges are billed alongside your subscription on the same cycle. Add-ons may be cancelled at the end of any monthly billing period without affecting your base subscription, subject to the minimum commitment of the base plan.</p>

          <p><strong className="text-[#1A2E35]">Payment.</strong> Payment is processed by our payment processor. By subscribing, you authorise us to charge your payment method on a recurring basis until you cancel. You are responsible for keeping your payment method current.</p>

          <p><strong className="text-[#1A2E35]">Late payment.</strong> If a payment fails, we will attempt to retry. Access to the Service may be suspended until outstanding amounts are settled. Continued non-payment may result in termination of your account and outstanding fees becoming immediately due.</p>

          <p><strong className="text-[#1A2E35]">Refund policy.</strong> All subscription fees are non-refundable except as required by law. We do not issue refunds or credits for: (a) partial subscription periods, (b) unused features, (c) periods during which the Service was available but not used, or (d) cancellations during the minimum commitment period. If a sustained technical issue caused by AGE prevents your use of the Service, contact us and we will assess the situation in good faith and may issue a service credit at our discretion.</p>

          <p><strong className="text-[#1A2E35]">Cancellation.</strong> You may submit a cancellation request at any time through your account settings or by emailing <a href="mailto:prathambuilds123@gmail.com" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a>. If you cancel <em>during</em> your minimum commitment period, your access continues until the end of the minimum period and you remain liable for the remaining monthly fees of that period. If you cancel <em>after</em> your minimum commitment period, cancellation takes effect at the end of your current monthly billing cycle and you retain access until that date. No prorated refunds are issued in either case.</p>

          <p><strong className="text-[#1A2E35]">Third-party costs.</strong> Message delivery costs (MSG91 SMS credits, Meta WhatsApp conversation charges, SMTP costs) are not included in AGE's subscription fee and are billed separately by the respective provider under your own account with them.</p>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree to use the Service only for lawful business purposes and only in a manner consistent with these Terms. You must not:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Send spam, unsolicited bulk messages, or messages to contacts who have not opted in where consent is required under applicable law.</li>
            <li>Use the Service to send messages promoting illegal products or services, adult content, hate speech, harassment, phishing, or malware.</li>
            <li>Violate TRAI regulations on commercial communications, DLT header and template requirements, Meta's WhatsApp Business Policy, or CAN-SPAM / PECR rules applicable to your recipients.</li>
            <li>Import contact lists obtained through scraping, purchase, or other methods that violate applicable data protection laws.</li>
            <li>Attempt to reverse-engineer, decompile, or extract source code from the Service.</li>
            <li>Access the Service by automated means (bots, scrapers) not approved by AGE in writing.</li>
            <li>Use the Service in a way that imposes an unreasonable load on our infrastructure or disrupts other customers.</li>
            <li>Resell, sublicense, or white-label the Service without our written consent.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation.</li>
          </ul>
          <p>AGE reserves the right to investigate suspected violations, suspend access during investigation, and terminate accounts where violations are confirmed. We will report unlawful activity to relevant authorities where required.</p>
        </Section>

        <Section title="7. Your Content & Data">
          <p><strong className="text-[#1A2E35]">Ownership.</strong> You retain all ownership rights to the lead data, message content, and other materials you upload to or create in the Service ("Your Content").</p>
          <p><strong className="text-[#1A2E35]">Licence to AGE.</strong> By uploading Your Content, you grant AGE a limited, non-exclusive, royalty-free licence to store, process, and transmit Your Content solely as necessary to provide the Service and as described in our Privacy Policy. This licence ends when you delete the content or close your account, subject to our data retention obligations.</p>
          <p><strong className="text-[#1A2E35]">Your responsibilities.</strong> You are solely responsible for Your Content and confirm that:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>You have all rights, consents, and permissions necessary to upload and process the personal data of your contacts.</li>
            <li>Your Content does not infringe the intellectual property, privacy, or other rights of any third party.</li>
            <li>Your use of the Service in connection with Your Content complies with all applicable laws.</li>
          </ul>
          <p>AGE is not responsible for the accuracy, legality, or appropriateness of Your Content. We are a data processor for your contact data; you are the data fiduciary.</p>
        </Section>

        <Section title="8. Outreach Channel Compliance">
          <p>AGE provides infrastructure to send messages across SMS, email, and WhatsApp. You are solely responsible for ensuring your outreach complies with all applicable laws and platform policies. Specific requirements include:</p>

          <p><strong className="text-[#1A2E35]">SMS (India — TRAI / DLT).</strong> You must be registered as a Principal Entity on the DLT platform, have approved message headers and templates, and comply with TRAI's Telecom Commercial Communications Customer Preference Regulations. Sending to contacts on the National Do Not Call (NDNC) registry without their prior written consent is prohibited. AGE sends SMS using your DLT credentials. AGE is not your DLT registrant.</p>

          <p><strong className="text-[#1A2E35]">WhatsApp (Meta Cloud API).</strong> You must operate and maintain your own WhatsApp Business Account (WABA) in good standing. All templates must be submitted to and approved by Meta before use. You must obtain valid opt-in from recipients in accordance with Meta's WhatsApp Business Policy. AGE is not responsible for Meta's decisions on template approval, account suspension, messaging rate limits, or quality rating.</p>

          <p><strong className="text-[#1A2E35]">Email.</strong> You must have a lawful basis to email each recipient under applicable law (DPDP Act, GDPR, CAN-SPAM, CASL, or equivalent). All marketing emails must include a valid physical address and a functional unsubscribe mechanism. AGE automatically suppresses future emails to contacts who unsubscribe.</p>

          <p>Violations of channel-specific rules that result in your MSG91, WhatsApp, or SMTP provider account being suspended are your responsibility. AGE will not issue refunds for periods during which you cannot send messages due to your own account being suspended by a third-party provider.</p>
        </Section>

        <Section title="9. Intellectual Property">
          <p><strong className="text-[#1A2E35]">AGE's IP.</strong> All rights, title, and interest in the Service including the software, platform design, algorithms, AI models, documentation, trademarks, and brand belong exclusively to AGE. These Terms do not grant you any ownership right in the Service.</p>
          <p><strong className="text-[#1A2E35]">Feedback.</strong> If you provide us with suggestions, ideas, or feedback about the Service ("Feedback"), you grant AGE a perpetual, irrevocable, royalty-free licence to use and incorporate that Feedback into the Service without any obligation to you.</p>
          <p><strong className="text-[#1A2E35]">Restrictions.</strong> You may not copy, modify, create derivative works of, or distribute the Service or any part of it without our prior written consent.</p>
        </Section>

        <Section title="10. Third-Party Services & Integrations">
          <p>The Service integrates with third-party platforms including MSG91, Meta (WhatsApp Cloud API), AWS, OpenRouter, and Clerk. Your use of these integrations is also subject to the terms and policies of those providers. AGE is not responsible for:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Downtime, errors, or policy changes by third-party providers.</li>
            <li>Decisions by Meta, MSG91, or email providers to block, filter, or reject your messages.</li>
            <li>Data handling by third-party providers beyond what is described in our Privacy Policy and our contracts with them.</li>
          </ul>
          <p>Links to third-party websites on our platform are provided for convenience only and do not constitute endorsement by AGE.</p>
        </Section>

        <Section title="11. Disclaimers">
          <p>To the maximum extent permitted by applicable law:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>The Service is provided <strong className="text-[#1A2E35]">"as is" and "as available"</strong> without any warranty, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
            <li>AGE does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.</li>
            <li>AGE does not warrant that using the Service will result in any business outcome, including increased sales, leads, revenue, or conversion rates.</li>
            <li>Message delivery depends on factors outside AGE's control (carrier networks, spam filters, recipient device status, third-party API availability, DLT approval status) and cannot be guaranteed 100%.</li>
          </ul>
        </Section>

        <Section title="12. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, AGE's total aggregate liability to you for any claims arising out of or relating to these Terms or the Service, whether in contract, tort (including negligence), statute, or otherwise shall not exceed the <strong className="text-[#1A2E35]">total fees paid by you to AGE in the three (3) months immediately preceding the event giving rise to the claim</strong>.</p>
          <p>In no event shall AGE be liable for any:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Indirect, incidental, special, consequential, or punitive damages.</li>
            <li>Loss of profits, revenue, data, business, or goodwill.</li>
            <li>Damages resulting from your inability to send messages due to third-party provider decisions, DLT non-compliance, or your own account suspension.</li>
            <li>Damages resulting from unauthorised access to your account due to your failure to maintain credential security.</li>
          </ul>
          <p>Some jurisdictions do not allow certain exclusions or limitations of liability. In such cases, our liability will be limited to the fullest extent permitted by law.</p>
        </Section>

        <Section title="13. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless AGE, its officers, directors, employees, contractors, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or relating to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your use of the Service or any feature thereof.</li>
            <li>Your Content, including any claim that Your Content infringes the rights of a third party.</li>
            <li>Your violation of these Terms or any applicable law or regulation.</li>
            <li>Messages you send through the Service, including claims of spam, harassment, or unsolicited contact.</li>
            <li>Your violation of the rights of any third party, including your contacts' data protection and privacy rights.</li>
          </ul>
        </Section>

        <Section title="14. Suspension & Termination">
          <p><strong className="text-[#1A2E35]">By you.</strong> You may cancel your subscription at any time, subject to the minimum commitment terms in Section 5. If you cancel during the minimum commitment period, your access continues until the end of that period and remaining fees stay payable. If you cancel after the minimum period, cancellation takes effect at the end of the current monthly billing cycle.</p>
          <p><strong className="text-[#1A2E35]">By AGE.</strong> We may suspend your access to the Service immediately and without prior notice if:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>You violate these Terms, including the Acceptable Use policy.</li>
            <li>Your account is used to send spam, abusive, or unlawful content.</li>
            <li>Your account triggers abuse complaints, carrier blocks, or regulatory reports.</li>
            <li>You fail to pay subscription fees after a grace period.</li>
          </ul>
          <p>We may terminate these Terms and your account with 30 days' written notice for any reason not listed above. Where AGE terminates without cause during your minimum commitment period, we will refund a pro-rata portion of any prepaid fees for the remaining minimum period.</p>
          <p><strong className="text-[#1A2E35]">Effect of termination.</strong> Upon termination: your right to access the Service ends; we will delete your account data within 30 days (subject to legal retention obligations); clauses that by nature survive termination (including IP, liability, indemnification, and governing law) will continue to apply.</p>
        </Section>

        <Section title="15. Governing Law & Dispute Resolution">
          <p>These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.</p>
          <p><strong className="text-[#1A2E35]">Informal resolution first.</strong> Before commencing formal proceedings, you agree to contact us at <a href="mailto:prathambuilds123@gmail.com" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a> and give us 30 days to resolve the dispute informally.</p>
          <p><strong className="text-[#1A2E35]">Jurisdiction.</strong> If the dispute cannot be resolved informally, both parties submit to the exclusive jurisdiction of the courts at <strong className="text-[#1A2E35]">Bhopal, Madhya Pradesh, India</strong>.</p>
          <p><strong className="text-[#1A2E35]">Consumer rights.</strong> Nothing in these Terms limits any rights you may have under the Consumer Protection Act, 2019 or other mandatory consumer protection laws.</p>
        </Section>

        <Section title="16. Changes to These Terms">
          <p>We may update these Terms from time to time. We will notify you of material changes by email or by a prominent notice in the platform at least <strong className="text-[#1A2E35]">14 days</strong> before the changes take effect.</p>
          <p>If you continue using the Service after the effective date of revised Terms, you accept the new Terms. If you do not agree to the revised Terms, you must cancel your subscription before the effective date.</p>
        </Section>

        <Section title="17. General">
          <p><strong className="text-[#1A2E35]">Entire agreement.</strong> These Terms, together with the Privacy Policy and any applicable Order Form, constitute the entire agreement between you and AGE regarding the Service and supersede all prior agreements.</p>
          <p><strong className="text-[#1A2E35]">Severability.</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
          <p><strong className="text-[#1A2E35]">No waiver.</strong> Failure by AGE to enforce any provision of these Terms is not a waiver of our right to enforce it in the future.</p>
          <p><strong className="text-[#1A2E35]">Assignment.</strong> You may not assign or transfer these Terms without AGE's prior written consent. AGE may assign these Terms in connection with a merger, acquisition, or sale of all or substantially all of our assets.</p>
          <p><strong className="text-[#1A2E35]">Force majeure.</strong> AGE is not liable for delays or failures in performance caused by circumstances beyond our reasonable control, including internet outages, third-party provider failures, government actions, or natural disasters.</p>
          <p><strong className="text-[#1A2E35]">Language.</strong> These Terms are written in English. In the event of any conflict between an English version and a translated version, the English version prevails.</p>
        </Section>

        <Section title="18. Contact">
          <p>For questions about these Terms, billing disputes, or legal notices, contact:</p>
          <div
            className="mt-4 rounded-xl border p-5 text-sm"
            style={{ borderColor: `${TEAL}30`, background: `${TEAL}08` }}
          >
            <p className="font-bold" style={{ color: DARK }}>Automated Growth Ecosystem</p>
            <p className="mt-1 text-[#3D5560]">Email: <a href="mailto:prathambuilds123@gmail.com" className="font-medium underline" style={{ color: TEAL }}>prathambuilds123@gmail.com</a></p>
            <p className="text-[#3D5560]">Website: <span style={{ color: TEAL }}>ageautomation.in</span></p>
            <p className="text-[#3D5560]">Jurisdiction: Bhopal, Madhya Pradesh, India</p>
          </div>
        </Section>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-[#6B8E95]">
          This document was last updated on <strong>{effectiveDate}</strong>. Earlier versions are available upon request.
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
