import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

import mark from "@/assets/karya-mark.png";
import {
  AIChatDemo,
  AmbiguityDemo,
  BeforeAfter,
  ComparisonSection,
  CoreWorkflow,
  DependencyGraph,
  EvidenceChain,
  FeatureArchitecture,
  HandoffTransform,
  IntegrationsSection,
  InteractiveHeroDemo,
  MissingInfoDemo,
  MultiFormatInput,
  PrivacySection,
  ReadinessStates,
  RequirementTable,
  SourceBackedDemo,
  UseCaseSwitcher,
  VerificationPanel,
  WorkspaceSection,
} from "@/components/landing-visuals";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const title = "Karya AI — AI that understands your work from request to completion";
const description =
  "Give Karya AI an assignment, brief, email, document, image, folder, or other work instruction. It understands what you're being asked to produce, finds what's missing or unclear, builds the path forward, and verifies whether the finished work actually satisfies the original request.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

// ── Nav ────────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={mark} alt="" width={22} height={22} className="h-5 w-5 shrink-0" />
          <span className="truncate text-sm font-medium tracking-tight">Karya AI</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#understand" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#verify" className="transition-colors hover:text-foreground">
            Verification
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#usecases" className="transition-colors hover:text-foreground">
            Use cases
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/home">Try Karya AI</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-hairline px-5 py-3 text-sm md:hidden">
          <a href="#understand" onClick={() => setOpen(false)} className="block py-1.5">
            How it works
          </a>
          <a href="#verify" onClick={() => setOpen(false)} className="block py-1.5">
            Verification
          </a>
          <a href="#features" onClick={() => setOpen(false)} className="block py-1.5">
            Features
          </a>
          <a href="#usecases" onClick={() => setOpen(false)} className="block py-1.5">
            Use cases
          </a>
          <Link to="/login" onClick={() => setOpen(false)} className="block py-1.5">
            Log in
          </Link>
        </div>
      ) : null}
    </header>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function SectionHeading({
  eyebrow,
  title: heading,
  text,
  center,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="label-caps">{eyebrow}</p>
      <h2 className="mt-3 text-2xl tracking-tight sm:text-3xl">{heading}</h2>
      {text ? (
        <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground", center && "mx-auto")}>
          {text}
        </p>
      ) : null}
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="rise label-caps inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1"
              style={{ animationDelay: "40ms" }}
            >
              AI work intelligence
            </p>
            <h1
              className="rise mt-6 text-[2.4rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "140ms" }}
            >
              AI that understands your work
              <br />
              <span className="text-muted-foreground">from request to completion.</span>
            </h1>
            <p
              className="rise mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground"
              style={{ animationDelay: "240ms" }}
            >
              Give Karya AI an assignment, brief, email, document, image, folder, or other work
              instruction. It understands what you're being asked to produce, finds what's missing
              or unclear, builds the path forward, and verifies whether the finished work actually
              satisfies the original request.
            </p>
            <div
              className="rise mt-4 flex flex-wrap justify-center gap-2"
              style={{ animationDelay: "300ms" }}
            >
              {["Understand", "Prepare", "Plan", "Verify", "Handoff"].map((phase, i, arr) => (
                <span key={phase} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{phase}</span>
                  {i < arr.length - 1 && <span className="text-muted-foreground/40">·</span>}
                </span>
              ))}
            </div>
            <div
              className="rise mt-8 flex flex-wrap justify-center gap-2.5"
              style={{ animationDelay: "380ms" }}
            >
              <Button asChild size="lg">
                <Link to="/home">
                  Try Karya AI
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>

          {/* Interactive product demo */}
          <div className="rise mt-14" style={{ animationDelay: "500ms" }}>
            <InteractiveHeroDemo />
          </div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM ───────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="label-caps">The problem</p>
              <h2 className="mt-3 text-2xl tracking-tight sm:text-3xl lg:text-4xl">
                Work doesn't fail because people can't do it.
                <br />
                <span className="text-muted-foreground">
                  It fails because the work wasn't clear enough to begin with.
                </span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Most assignments arrive incomplete. Requirements are missing. Files aren't attached.
                Deadlines conflict. What "done" means is never written down. Karya AI catches all of
                this before the work starts — and verifies the result when it finishes.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* ── 3. 01 UNDERSTAND ─────────────────────────────────────────────────── */}
      <section id="understand" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="01 — Understand"
              title="Karya AI figures out what was actually requested."
              text="Give it any work instruction in any format. It extracts the objective, deliverables, requirements, deadline, stakeholders, and inputs — and shows exactly where each finding came from."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <MultiFormatInput />
          </Reveal>
        </div>
      </section>

      {/* ── 4. 02 PREPARE ────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="02 — Prepare"
              title="Is the work actually ready to begin?"
              text="Karya AI identifies missing information, ambiguities, risks, conflicting versions, and outdated files — and tells you exactly what needs to be resolved before execution starts."
            />
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

      {/* ── 5. 03 PLAN ───────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="03 — Plan"
              title="Understand what must happen and in what order."
              text="Karya AI converts understanding into an executable structure: ordered steps, dependencies, expected outputs, and the evidence required to prove each step is complete."
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <CoreWorkflow />
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <Reveal delay={120}>
              <EvidenceChain
                requirement="Compare all three suppliers"
                evidence={["Proposal A", "Proposal B", "Proposal C"]}
                status="Complete"
              />
            </Reveal>
            <Reveal delay={180}>
              <DependencyGraph />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. 04 MANAGE UNCERTAINTY ─────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="04 — Manage uncertainty"
              title="Karya AI does not silently guess."
              text="When something is unclear or missing, Karya AI generates precise questions, drafts clarification messages, and logs every decision — so nothing is assumed without a record."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <AIChatDemo />
          </Reveal>
        </div>
      </section>

      {/* ── 7. REQUIREMENT → EVIDENCE ────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Requirement tracking"
              title="Every requirement is tied to something real."
              text="Karya AI doesn't mark work complete because it looks finished. It traces each requirement to evidence — and shows the status and source of every finding."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <RequirementTable />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
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

      {/* ── 8. SOURCE-BACKED AI ───────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Source-backed AI"
              title="Karya AI shows where it got the information."
              text="Every finding, requirement, and gap is linked to the source document, page, or message that produced it — so you can verify or challenge any conclusion."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <SourceBackedDemo />
          </Reveal>
        </div>
      </section>

      {/* ── 9. 05 VERIFY ─────────────────────────────────────────────────────── */}
      <section id="verify" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="05 — Verify"
              title='"Done" is not a checkbox. It is a claim that needs evidence.'
              text="Upload the completed result. Karya AI compares it against the original request, requirement by requirement — and shows what's satisfied, what's missing, and what conflicts."
            />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <VerificationPanel />
          </Reveal>
        </div>
      </section>

      {/* ── 10. 06 HANDOFF ───────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="06 — Handoff"
              title="25 files become one clear packet."
              text="When work is done, Karya AI generates a structured handoff: what was completed, what remains open, which files are authoritative, and what happens next."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <HandoffTransform />
          </Reveal>
        </div>
      </section>

      {/* ── 11. FEATURE ARCHITECTURE ─────────────────────────────────────────── */}
      <section id="features" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Six capabilities organized around real work."
              text="Everything Karya AI does maps to one of six stages. No disconnected features — one system that follows the work from start to finish."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <FeatureArchitecture />
          </Reveal>
        </div>
      </section>

      {/* ── 12. NOT A TASK MANAGER ───────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="A different category"
              title="Not a task manager. Not a document analyzer. Not a chatbot."
              text="Karya AI is an AI system for understanding, preparing, planning, verifying, and handing off real-world work."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ComparisonSection />
          </Reveal>
        </div>
      </section>

      {/* ── 13. USE CASES ────────────────────────────────────────────────────── */}
      <section id="usecases" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Where it fits"
              title="Any work that arrives unclear."
              text="Switch between work types to see how Karya AI adapts to different contexts."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <UseCaseSwitcher />
          </Reveal>
        </div>
      </section>

      {/* ── 14. WORKSPACE ────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Workspace"
              title="Organized around readiness, not checkboxes."
              text="My Work shows what needs attention. Templates encode reusable workflows. Work History preserves the full evolution of every work item."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <WorkspaceSection />
          </Reveal>
        </div>
      </section>

      {/* ── 15. CORE CHAIN CALLOUT ───────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-surface px-8 py-10 md:px-12">
              <p className="label-caps text-center">The chain Karya AI maintains</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {["Request", "Deliverable", "Requirement", "Evidence", "Verification"].map(
                  (label, i, arr) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="rounded-md border border-hairline bg-muted/40 px-3 py-1.5 text-sm">
                        {label}
                      </span>
                      {i < arr.length - 1 && (
                        <span className="text-muted-foreground/50">→</span>
                      )}
                    </div>
                  ),
                )}
              </div>
              <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                Every requirement has a deliverable. Every deliverable has evidence. Every piece of
                evidence is verified against the original request. This chain is the core of how
                Karya AI works.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 16. PRIVACY ──────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Privacy"
              title="Your files, your control."
              text="Karya AI processes files to extract structure and evidence. It does not claim ownership of your work or use it to train models."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <PrivacySection />
          </Reveal>
        </div>
      </section>

      {/* ── 17. INTEGRATIONS ─────────────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Integrations"
              title="Connecting to where work lives."
              text="Work arrives from email, drives, and messaging tools. Karya AI is building integrations to meet it there — without requiring you to manually copy everything in."
            />
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <IntegrationsSection />
          </Reveal>
        </div>
      </section>

      {/* ── 18. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <h2 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Understand the work.
              <br />
              Execute with clarity.
              <br />
              <span className="text-muted-foreground">Verify the result.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Give Karya AI the work. It figures out what's required, what's missing, and whether
              the finished result actually satisfies the original request.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <Button asChild size="lg">
                <Link to="/home">
                  Try Karya AI
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <img src={mark} alt="" width={18} height={18} className="h-4 w-4 shrink-0" />
            <span className="truncate text-sm">Karya AI</span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#verify" className="hover:text-foreground">
              Verification
            </a>
            <a href="#usecases" className="hover:text-foreground">
              Use cases
            </a>
            <a href="mailto:hello@karya.ai" className="hover:text-foreground">
              Contact
            </a>
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
