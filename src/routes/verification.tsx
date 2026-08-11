import { createFileRoute } from "@tanstack/react-router";

import {
  EvidenceChain,
  RequirementTable,
  SourceBackedDemo,
  VerificationPanel,
} from "@/components/landing-visuals";
import { PublicFooter, PublicNav } from "@/components/public-layout";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Karya AI" },
      {
        name: "description",
        content:
          'Karya AI compares finished work against the original request, requirement by requirement. "Done" is not a checkbox — it is a claim that needs evidence.',
      },
    ],
  }),
  component: VerificationPage,
});

function VerificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Header */}
      <div className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Verification</p>
            <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              "Done" is not a checkbox.
              <br />
              <span className="text-muted-foreground">It is a claim that needs evidence.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Karya AI compares finished work against the original request, requirement by
              requirement — and shows what's satisfied, what's missing, and what conflicts.
            </p>
          </Reveal>
        </div>
      </div>

      {/* The chain */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <Reveal>
            <p className="label-caps mb-3">The chain Karya AI maintains</p>
            <div className="flex flex-wrap items-center gap-2">
              {["Request", "Deliverable", "Requirement", "Evidence", "Verification"].map(
                (label, i, arr) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm">
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground/50">→</span>
                    )}
                  </div>
                ),
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every requirement has a deliverable. Every deliverable has evidence. Every piece of
              evidence is checked against the original request. This chain is what makes
              verification meaningful.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Requirement tracking */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Requirement tracking</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Every requirement is tied to something real.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Karya AI traces each requirement to evidence — and shows the status and source of
              every finding.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <RequirementTable />
          </Reveal>
        </div>
      </section>

      {/* Evidence chains */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Evidence mapping</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Requirement → Evidence → Status.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Each requirement is checked against the content that either satisfies it, is
              missing, or conflicts with it.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Reveal>
              <EvidenceChain
                requirement="Compare all three suppliers"
                evidence={["Proposal A", "Proposal B", "Proposal C"]}
                status="Complete"
              />
            </Reveal>
            <Reveal delay={100}>
              <EvidenceChain
                requirement="Include vendor references"
                evidence={["No references found in any proposal"]}
                status="Missing"
              />
            </Reveal>
            <Reveal delay={200}>
              <EvidenceChain
                requirement="Submit by Friday"
                evidence={["Brief says Friday 5pm", "Email says Monday morning"]}
                status="Conflict"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Verification panel */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Completion check</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Upload the result. Karya AI checks it.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Every requirement from the original request is tested against the finished work. You
              see exactly what passed, what didn't, and why.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <VerificationPanel />
          </Reveal>
        </div>
      </section>

      {/* Source-backed */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Source-backed</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Every result traces back to the source.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Karya AI does not simply say a requirement passed or failed. It shows the document,
              page, or message that produced the finding.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <SourceBackedDemo />
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
