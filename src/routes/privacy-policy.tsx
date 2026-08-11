import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicFooter, PublicNav } from "@/components/public-layout";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Karya AI" },
      { name: "description", content: "Privacy Policy for Karya AI." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav backTo="/" />

      <main className="mx-auto w-full max-w-2xl px-5 py-14 md:px-8 md:py-20">
        {/* Title block */}
        <div className="mb-10 border-b border-hairline pb-10">
          <h1 className="text-3xl tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <strong>Last updated:</strong> [Date]
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This Privacy Policy explains how Karya AI collects, uses, stores, and protects
            information when you use Karya AI and its related services.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            By using Karya AI, you acknowledge the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-10 rounded-xl border border-hairline bg-muted/30 p-5">
          <p className="label-caps mb-3">Contents</p>
          <ol className="space-y-1.5">
            {[
              [1, "Information We Collect"],
              [2, "How We Use Information"],
              [3, "AI Processing"],
              [4, "How We Share Information"],
              [5, "Third-Party Service Providers"],
              [6, "File Processing and Storage"],
              [7, "Data Retention"],
              [8, "Data Security"],
              [9, "Your Privacy Rights"],
              [10, "Cookies and Similar Technologies"],
              [11, "Children's Privacy"],
              [12, "International Data Transfers"],
              [13, "Changes to This Privacy Policy"],
              [14, "Contact Us"],
            ].map(([num, label]) => (
              <li key={num} className="flex gap-2 text-sm">
                <span className="font-mono text-muted-foreground/50">{num}.</span>
                <a
                  href={`#section-${num}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Body */}
        <div className="legal-body space-y-10 text-sm leading-relaxed">

          <section id="section-1">
            <h2>1. Information We Collect</h2>
            <p>
              Depending on how you use Karya AI, we may collect the following categories of
              information.
            </p>
            <h3>Account Information</h3>
            <p>If you create an account, we may collect information such as:</p>
            <ul>
              <li>Username or name</li>
              <li>Login credentials</li>
              <li>Account settings</li>
              <li>Other information required to provide the account</li>
            </ul>
            <h3>Content You Provide</h3>
            <p>Karya AI may process information that you voluntarily provide, including:</p>
            <ul>
              <li>Work instructions</li>
              <li>Assignments</li>
              <li>Briefs</li>
              <li>Emails or messages</li>
              <li>PDFs and DOCX files</li>
              <li>Images</li>
              <li>ZIP files or folders</li>
              <li>Requirements</li>
              <li>Questions</li>
              <li>Decisions</li>
              <li>Evidence</li>
              <li>Completed work</li>
              <li>Handoff information</li>
              <li>Other content you choose to provide</li>
            </ul>
            <p>
              Some of this information may contain confidential or sensitive information belonging
              to you, your employer, your clients, or other parties.
            </p>
            <p>
              You are responsible for ensuring that you have the necessary permission to provide
              such information to Karya AI.
            </p>
            <h3>Technical Information</h3>
            <p>
              When you access Karya AI, we may collect technical information necessary to operate
              and secure the service, such as:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Operating system</li>
              <li>Usage information</li>
              <li>Log information</li>
              <li>Diagnostic information</li>
            </ul>
            <p className="notice">
              [The exact categories of automatically collected information should be confirmed
              based on the actual implementation.]
            </p>
          </section>

          <section id="section-2">
            <h2>2. How We Use Information</h2>
            <p>We may use information to:</p>
            <ul>
              <li>Provide and operate Karya AI.</li>
              <li>Process the content you provide.</li>
              <li>Analyze work requests and supporting materials.</li>
              <li>
                Generate work plans, questions, readiness assessments, and other requested outputs.
              </li>
              <li>Verify work against requirements.</li>
              <li>Generate handoff information.</li>
              <li>Maintain and secure user accounts.</li>
              <li>Detect, prevent, and investigate misuse or security issues.</li>
              <li>Improve the reliability and functionality of the service.</li>
              <li>Communicate with users about the service.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
            <p>
              We will not use information for purposes that are inconsistent with this Privacy
              Policy without appropriate notice or another lawful basis where required.
            </p>
          </section>

          <section id="section-3">
            <h2>3. AI Processing</h2>
            <p>
              Karya AI uses artificial intelligence to analyze information provided by users and
              generate outputs.
            </p>
            <p>Depending on the feature being used, the AI may process:</p>
            <ul>
              <li>Instructions</li>
              <li>Documents</li>
              <li>Files</li>
              <li>Requirements</li>
              <li>Questions</li>
              <li>Evidence</li>
              <li>Other content submitted by the user</li>
            </ul>
            <p>AI-generated results may be inaccurate or incomplete.</p>
            <p className="notice">
              [The exact AI providers, processing locations, and whether submitted content may be
              used for model training must be confirmed based on the actual implementation.]
            </p>
            <p className="notice">
              Do not claim that user content is never used for model training unless this has been
              technically and contractually confirmed.
            </p>
          </section>

          <section id="section-4">
            <h2>4. How We Share Information</h2>
            <p>We may share information when reasonably necessary to:</p>
            <ul>
              <li>Provide and operate Karya AI.</li>
              <li>Use service providers that support the platform.</li>
              <li>Maintain security and prevent abuse.</li>
              <li>Comply with legal obligations.</li>
              <li>Protect the rights, safety, and property of Karya AI, users, or others.</li>
              <li>
                Complete a business transaction such as a merger, acquisition, financing, or sale
                of assets, where applicable.
              </li>
            </ul>
            <p>
              We do not sell personal information merely because it is processed through Karya AI.
            </p>
            <p className="notice">
              [Any additional data-sharing practices should be confirmed before publication.]
            </p>
          </section>

          <section id="section-5">
            <h2>5. Third-Party Service Providers</h2>
            <p>Karya AI may rely on third-party providers for services such as:</p>
            <ul>
              <li>Hosting</li>
              <li>Authentication</li>
              <li>Database infrastructure</li>
              <li>AI processing</li>
              <li>File processing</li>
              <li>Analytics</li>
              <li>Email</li>
              <li>Security</li>
              <li>Other technical services</li>
            </ul>
            <p>
              Third-party providers may process information on Karya AI's behalf where necessary
              to provide their services.
            </p>
            <p className="notice">
              [The actual third-party providers and their applicable privacy policies should be
              listed before publication.]
            </p>
          </section>

          <section id="section-6">
            <h2>6. File Processing and Storage</h2>
            <p>Karya AI may process files and other content that you provide to the service.</p>
            <p>
              Depending on the feature and implementation, files may be temporarily processed,
              stored, or retained so that Karya AI can provide the requested functionality.
            </p>
            <p className="notice">
              [Actual file-storage architecture and retention periods must be confirmed before
              publication.]
            </p>
            <p>
              If the service supports deletion controls, those controls will be described in the
              applicable product settings or documentation.
            </p>
            <p>
              Do not assume that deleting a file from the user interface immediately removes every
              copy from backups, logs, or third-party systems.
            </p>
          </section>

          <section id="section-7">
            <h2>7. Data Retention</h2>
            <p>
              We retain information only for as long as reasonably necessary for the purposes
              described in this Privacy Policy, unless a longer period is required or permitted
              by law.
            </p>
            <p>The specific retention period may depend on:</p>
            <ul>
              <li>The type of information</li>
              <li>The purpose for which it was collected</li>
              <li>Account status</li>
              <li>Legal requirements</li>
              <li>Security requirements</li>
              <li>Technical requirements</li>
            </ul>
            <p className="notice">
              [Specific retention periods should be finalized based on the actual implementation.]
            </p>
          </section>

          <section id="section-8">
            <h2>8. Data Security</h2>
            <p>
              We take reasonable measures designed to protect information from unauthorized
              access, loss, misuse, alteration, or disclosure.
            </p>
            <p>However, no online service can guarantee absolute security.</p>
            <p className="notice">
              [Specific security measures and certifications should only be listed if they have
              been implemented and verified.]
            </p>
          </section>

          <section id="section-9">
            <h2>9. Your Privacy Rights</h2>
            <p>
              Depending on where you live, you may have rights regarding your personal
              information, which may include the right to:
            </p>
            <ul>
              <li>Request access to personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of information.</li>
              <li>Request restriction of certain processing.</li>
              <li>Object to certain processing.</li>
              <li>Request a copy of certain information.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p>
              These rights may be subject to applicable legal exceptions and limitations.
            </p>
            <p>To make a privacy request, contact us using the information provided below.</p>
          </section>

          <section id="section-10">
            <h2>10. Cookies and Similar Technologies</h2>
            <p>
              Karya AI may use cookies or similar technologies where necessary to operate the
              service, maintain sessions, remember preferences, understand usage, or improve the
              service.
            </p>
            <p className="notice">
              [The actual cookies, analytics tools, and tracking technologies used by Karya AI
              must be confirmed before publication.]
            </p>
            <p>Where required by law, applicable consent mechanisms will be provided.</p>
          </section>

          <section id="section-11">
            <h2>11. Children's Privacy</h2>
            <p>
              Karya AI is not intended for individuals who are not legally permitted to use the
              service.
            </p>
            <p className="notice">
              [The minimum age and children's privacy requirements must be finalized based on the
              actual target users and applicable law.]
            </p>
            <p>
              We do not knowingly collect personal information from children in violation of
              applicable law.
            </p>
            <p>
              If you believe that a child has provided personal information to Karya AI in
              circumstances where it should not have been collected, contact us so that we can
              investigate and take appropriate action.
            </p>
          </section>

          <section id="section-12">
            <h2>12. International Data Transfers</h2>
            <p>
              Depending on where Karya AI and its service providers operate, information may be
              processed or stored in countries other than the country in which you live.
            </p>
            <p className="notice">
              [Actual countries, transfer mechanisms, and applicable legal requirements must be
              confirmed before publication.]
            </p>
            <p>
              Where required, appropriate safeguards will be used for international transfers.
            </p>
          </section>

          <section id="section-13">
            <h2>13. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time as Karya AI develops or our
              data practices change.
            </p>
            <p>
              When we make changes, we will update the <strong>Last updated</strong> date.
            </p>
            <p>
              Where required by applicable law, we may provide additional notice of material
              changes.
            </p>
            <p>
              Your continued use of Karya AI after an updated Privacy Policy becomes effective
              means you acknowledge the revised policy.
            </p>
          </section>

          <section id="section-14">
            <h2>14. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your
              personal information, contact us at:
            </p>
            <p>
              <strong>[Karya AI privacy/contact email]</strong>
            </p>
          </section>

          {/* Closing */}
          <div className="border-t border-hairline pt-8 text-xs text-muted-foreground">
            <p className="font-medium">Karya AI</p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link to="/terms-of-use" className="hover:text-foreground">Terms of Use</Link>
              <span>·</span>
              <Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
