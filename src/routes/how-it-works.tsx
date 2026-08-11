import { createFileRoute } from "@tanstack/react-router";

import {
  AmbiguityDemo,
  CoreWorkflow,
  DependencyGraph,
  HandoffTransform,
  MissingInfoDemo,
  ReadinessStates,
} from "@/components/landing-visuals";
import { PublicFooter, PublicNav } from "@/components/public-layout";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Karya AI" },
      {
        name: "description",
        content:
          "Understand → Prepare → Plan → Verify → Handoff. How Karya AI follows a piece of work from messy request to verified result.",
      },
    ],
  }),
  component: HowItWorks,
});

const phases = [
  {
    num: "01",
    label: "Understand",
    color: "text-info",
    bg: "bg-info-soft",
    headline: "Figure out what was actually requested.",
    body: "Karya AI reads the request — whatever form it arrives in — and extracts the objective, deliverables, requirements, deadline, and stakeholders. It shows exactly where each finding came from.",
  },
  {
    num: "02",
    label: "Prepare",
    color: "text-warn",
    bg: "bg-warn-soft",
    headline: "Is the work actually ready to begin?",
    body: "Before execution starts, Karya AI checks whether anything is missing, ambiguous, conflicting, or outdated. It tells you what needs to be resolved — and why.",
  },
  {
    num: "03",
    label: "Plan",
    color: "text-ready",
    bg: "bg-ready-soft",
    headline: "Build the path forward.",
    body: "Karya AI converts understanding into an ordered plan: steps, dependencies, expected outputs, and the evidence required to prove each step is complete.",
  },
  {
    num: "04",
    label: "Verify",
    color: "text-blocked",
    bg: "bg-blocked-soft",
    headline: "Did the finished work actually meet the request?",
    body: 'Upload the completed result. Karya AI compares it against the original request, requirement by requirement — and shows what\'s satisfied, what\'s missing, and what conflicts. "Done" is not a feeling — it is a claim with evidence.',
  },
  {
    num: "05",
    label: "Handoff",
    color: "text-muted-foreground",
    bg: "bg-muted",
    headline: "25 files become one clear packet.",
    body: "When work is complete, Karya AI produces a structured handoff: what was done, what remains open, which files are authoritative, and what happens next.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Header */}
      <div className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">How it works</p>
            <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Understand → Prepare → Plan
              <br />
              <span className="text-muted-foreground">→ Verify → Handoff.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Five stages that follow the lifecycle of real work — from the moment a request
              arrives to the moment the result is handed over.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Phase overview */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-16">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {phases.map((p) => (
              <Reveal key={p.num}>
                <div className="rounded-xl border border-hairline bg-surface p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{p.num}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", p.bg, p.color)}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-snug">{p.headline}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 01 Understand */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-muted-foreground">01</span>
              <span className="rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-medium text-info">
                Understand
              </span>
            </div>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Karya AI figures out what was actually requested.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Give it a request in any format. It extracts objective, deliverables, requirements,
              deadline, and stakeholders — and traces each finding back to its source.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <CoreWorkflow />
          </Reveal>
        </div>
      </section>

      {/* 02 Prepare */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-muted-foreground">02</span>
              <span className="rounded-full bg-warn-soft px-2.5 py-0.5 text-xs font-medium text-warn">
                Prepare
              </span>
            </div>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Is the work actually ready to begin?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Karya AI performs a readiness check before execution starts. It surfaces missing
              information, ambiguities, and conflicts — so you resolve them before they become
              blockers.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <ReadinessStates />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Reveal delay={120}>
              <MissingInfoDemo />
            </Reveal>
            <Reveal delay={180}>
              <AmbiguityDemo />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 Plan */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-muted-foreground">03</span>
              <span className="rounded-full bg-ready-soft px-2.5 py-0.5 text-xs font-medium text-ready">
                Plan
              </span>
            </div>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Understand what must happen and in what order.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Karya AI converts understanding into an executable structure: ordered steps,
              dependencies, and the evidence required to prove each step complete.
            </p>
          </Reveal>
          <Reveal delay={140} className="mt-10 max-w-lg">
            <DependencyGraph />
          </Reveal>
        </div>
      </section>

      {/* 05 Handoff */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-muted-foreground">05</span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Handoff
              </span>
            </div>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              25 files become one clear packet.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              When work is complete, Karya AI generates a structured handoff: what was done, what
              remains open, which files are authoritative, and what happens next.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <HandoffTransform />
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
