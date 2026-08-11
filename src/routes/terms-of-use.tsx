import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicFooter, PublicNav } from "@/components/public-layout";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Karya AI" },
      { name: "description", content: "Terms of Use for Karya AI." },
    ],
  }),
  component: TermsOfUse,
});

function TermsOfUse() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav backTo="/" />

      <main className="mx-auto w-full max-w-2xl px-5 py-14 md:px-8 md:py-20">
        {/* Title block */}
        <div className="mb-10 border-b border-hairline pb-10">
          <h1 className="text-3xl tracking-tight sm:text-4xl">Terms of Use</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            <strong>Last updated:</strong> [Date]
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            These Terms of Use govern your access to and use of Karya AI and its related
            services. By accessing or using Karya AI, you agree to these Terms. If you do not
            agree with them, do not use the service.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="mb-10 rounded-xl border border-hairline bg-muted/30 p-5">
          <p className="label-caps mb-3">Contents</p>
          <ol className="space-y-1.5">
            {[
              [1, "About Karya AI"],
              [2, "Eligibility"],
              [3, "Accounts"],
              [4, "Your Content"],
              [5, "AI-Generated Results"],
              [6, "Professional Advice"],
              [7, "Acceptable Use"],
              [8, "Intellectual Property"],
              [9, "Third-Party Services"],
              [10, "Availability"],
              [11, "Suspension and Termination"],
              [12, "Disclaimers"],
              [13, "Limitation of Liability"],
              [14, "Indemnification"],
              [15, "Governing Law"],
              [16, "Changes to These Terms"],
              [17, "Contact"],
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
            <h2>1. About Karya AI</h2>
            <p>
              Karya AI is an AI-powered platform that helps users understand, plan, organize,
              verify, and hand off work.
            </p>
            <p>
              Karya AI may analyze information provided by users to help identify requirements,
              deliverables, missing information, ambiguities, dependencies, assumptions, risks,
              questions, evidence, and completion criteria.
            </p>
            <p>
              Karya AI provides assistance and analysis. It does not perform the underlying work
              on the user's behalf and does not replace the user's judgment or responsibility.
            </p>
          </section>

          <section id="section-2">
            <h2>2. Eligibility</h2>
            <p>
              You must be legally capable of entering into a binding agreement to use Karya AI.
            </p>
            <p className="notice">
              <strong>[Minimum age requirement to be finalized.]</strong>
            </p>
            <p>
              If you use Karya AI on behalf of an organization, you represent that you have
              authority to accept these Terms on its behalf.
            </p>
          </section>

          <section id="section-3">
            <h2>3. Accounts</h2>
            <p>Some features require an account.</p>
            <p>You are responsible for:</p>
            <ul>
              <li>Providing accurate account information.</li>
              <li>Keeping your account credentials secure.</li>
              <li>Maintaining the confidentiality of your account.</li>
              <li>Activities performed through your account.</li>
            </ul>
            <p>
              You must notify us if you believe your account has been accessed without
              authorization.
            </p>
          </section>

          <section id="section-4">
            <h2>4. Your Content</h2>
            <p>
              You may provide Karya AI with information such as work instructions, documents,
              files, images, messages, requirements, evidence, and completed work.
            </p>
            <p>You retain the rights you already have in your content.</p>
            <p>
              You grant Karya AI the permissions reasonably necessary to process your content to
              provide and operate the service.
            </p>
            <p>
              You are responsible for ensuring that you have the necessary rights and permissions
              to upload or otherwise provide content to Karya AI, including content belonging to
              an employer, client, customer, or other third party.
            </p>
            <p>You should not provide content that you are not authorized to share.</p>
          </section>

          <section id="section-5">
            <h2>5. AI-Generated Results</h2>
            <p>Karya AI uses artificial intelligence, which can make mistakes.</p>
            <p>Its outputs may include incorrect or incomplete:</p>
            <ul>
              <li>Interpretations</li>
              <li>Requirements</li>
              <li>Work plans</li>
              <li>Questions</li>
              <li>Readiness assessments</li>
              <li>Risk assessments</li>
              <li>Assumptions</li>
              <li>Verification results</li>
              <li>Handoffs</li>
              <li>Other analysis</li>
            </ul>
            <p>
              A result marked <strong>Ready</strong>, <strong>Verified</strong>, or similar does
              not guarantee that the underlying work is actually correct or complete.
            </p>
            <p>
              You are responsible for reviewing Karya AI's outputs and making your own decisions
              before relying on them.
            </p>
            <p className="notice">
              [Terms governing ownership or permitted use of AI-generated output to be finalized.]
            </p>
          </section>

          <section id="section-6">
            <h2>6. Professional Advice</h2>
            <p>Karya AI is a work-organization and verification tool.</p>
            <p>
              It is not a substitute for qualified professional advice, including legal, medical,
              financial, compliance, or other regulated professional advice.
            </p>
            <p>
              You should consult an appropriately qualified professional where such advice is
              required.
            </p>
          </section>

          <section id="section-7">
            <h2>7. Acceptable Use</h2>
            <p>You agree to use Karya AI lawfully and responsibly.</p>
            <p>You must not:</p>
            <ul>
              <li>Use the service for unlawful purposes.</li>
              <li>Upload content that you do not have permission to provide.</li>
              <li>
                Attempt to gain unauthorized access to the service or another user's account.
              </li>
              <li>Attempt to bypass or compromise security measures.</li>
              <li>Interfere with the operation or availability of the service.</li>
              <li>
                Reverse engineer, decompile, or attempt to extract source code except where
                applicable law permits it.
              </li>
              <li>Abuse the service through unauthorized automated or excessive use.</li>
              <li>Use the service in a way that infringes the rights of others.</li>
            </ul>
            <p>We may take appropriate action where misuse of the service is detected.</p>
          </section>

          <section id="section-8">
            <h2>8. Intellectual Property</h2>
            <p>
              Karya AI, including its software, interface, branding, design, and related
              materials, is owned by Karya AI or its licensors and is protected by applicable
              intellectual property laws.
            </p>
            <p>
              Except for the limited right to use Karya AI as permitted by these Terms, these
              Terms do not grant you ownership of or other rights to Karya AI's intellectual
              property.
            </p>
            <p className="notice">[AI-generated output ownership terms to be finalized.]</p>
          </section>

          <section id="section-9">
            <h2>9. Third-Party Services</h2>
            <p>Karya AI may use third-party services to provide certain functionality.</p>
            <p>
              Your use of third-party services may also be subject to the terms and policies of
              those providers.
            </p>
            <p className="notice">
              [Current third-party services and applicable providers to be finalized.]
            </p>
          </section>

          <section id="section-10">
            <h2>10. Availability</h2>
            <p>
              We aim to provide a reliable service, but Karya AI may occasionally be unavailable
              because of maintenance, technical problems, updates, outages, or circumstances
              outside our control.
            </p>
            <p>
              We do not guarantee that the service will always be uninterrupted, error-free, or
              available.
            </p>
          </section>

          <section id="section-11">
            <h2>11. Suspension and Termination</h2>
            <p>
              You may stop using Karya AI or close your account at any time, subject to any
              applicable obligations.
            </p>
            <p>We may suspend or terminate access where:</p>
            <ul>
              <li>You violate these Terms.</li>
              <li>Your use creates a security or operational risk.</li>
              <li>We are required to do so by law.</li>
              <li>Your use materially harms the service, other users, or third parties.</li>
            </ul>
            <p>Where appropriate, we may provide notice before taking action.</p>
          </section>

          <section id="section-12">
            <h2>12. Disclaimers</h2>
            <p>
              To the maximum extent permitted by applicable law, Karya AI is provided on an{" "}
              <strong>"as is"</strong> and <strong>"as available"</strong> basis.
            </p>
            <p>We do not guarantee that:</p>
            <ul>
              <li>AI-generated results will always be accurate.</li>
              <li>The service will identify every missing requirement or risk.</li>
              <li>Every ambiguity will be detected.</li>
              <li>Every dependency will be correctly identified.</li>
              <li>A verification result will guarantee that work is correct.</li>
              <li>The service will always be available or error-free.</li>
            </ul>
            <p>You remain responsible for reviewing important information and decisions.</p>
          </section>

          <section id="section-13">
            <h2>13. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Karya AI and its affiliates
              will not be liable for indirect, incidental, special, consequential, or punitive
              damages, or for loss of profits, data, business opportunities, or goodwill arising
              from or related to your use of the service.
            </p>
            <p className="notice">
              [Specific liability limitations, exclusions, exceptions, and
              jurisdiction-dependent provisions require legal review before publication.]
            </p>
          </section>

          <section id="section-14">
            <h2>14. Indemnification</h2>
            <p>
              To the extent permitted by applicable law, you agree to indemnify and hold Karya
              AI harmless from claims, damages, losses, liabilities, and reasonable expenses
              arising from:
            </p>
            <ul>
              <li>Your misuse of Karya AI.</li>
              <li>Your violation of these Terms.</li>
              <li>Your violation of another person's rights.</li>
              <li>
                Content you provide to Karya AI without having the necessary rights or
                permissions.
              </li>
            </ul>
            <p className="notice">
              [Final indemnification language should be reviewed by qualified legal counsel.]
            </p>
          </section>

          <section id="section-15">
            <h2>15. Governing Law</h2>
            <p className="notice">
              [Governing law and jurisdiction to be finalized based on the applicable legal
              entity and jurisdiction.]
            </p>
          </section>

          <section id="section-16">
            <h2>16. Changes to These Terms</h2>
            <p>We may update these Terms from time to time as Karya AI develops.</p>
            <p>
              When we make changes, we will update the <strong>Last updated</strong> date.
            </p>
            <p>
              Where required by applicable law, we may provide additional notice of material
              changes.
            </p>
            <p>
              Your continued use of Karya AI after the updated Terms become effective means you
              accept the revised Terms.
            </p>
          </section>

          <section id="section-17">
            <h2>17. Contact</h2>
            <p>If you have questions about these Terms, contact us at:</p>
            <p>
              <strong>[Karya AI contact email]</strong>
            </p>
          </section>

          {/* Closing */}
          <div className="border-t border-hairline pt-8 text-xs text-muted-foreground">
            <p className="font-medium">Karya AI</p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms-of-use" className="hover:text-foreground">Terms of Use</Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
