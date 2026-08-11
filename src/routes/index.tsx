import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

import mark from "@/assets/karya-mark.png";
import {
  AmbiguityDemo,
  AssumptionRegister,
  BeforeAfter,
  ComparisonSection,
  CoreWorkflow,
  DependencyGraph,
  EvidenceChain,
  FeatureArchitecture,
  HandoffTransform,
  HeroDemo,
  MissingInfoDemo,
  MultiFormatInput,
  ReadinessStates,
  UseCaseSwitcher,
  VerificationPanel,
} from "@/components/landing-visuals";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const title = "Karya AI — Know what the work requires before you start";
const description =
  "Karya AI turns messy assignments, briefs, documents and instructions into a clear work plan, and finds what is missing, ambiguous or unverified before the work is finished.";

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
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#verify" className="transition-colors hover:text-foreground">
            Verification
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
          <a href="#how" onClick={() => setOpen(false)} className="block py-1.5">
            How it works
          </a>
          <a href="#features" onClick={() => setOpen(false)} className="block py-1.5">
            Features
          </a>
          <a href="#verify" onClick={() => setOpen(false)} className="block py-1.5">
            Verification
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

// ── Section helpers ────────────────────────────────────────────────────────────

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
          {/* Headline block */}
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="rise label-caps inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1"
              style={{ animationDelay: "40ms" }}
            >
              Work preflight · AI-powered
            </p>
            <h1
              className="rise mt-6 text-[2.4rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "140ms" }}
            >
              Know what the work requires
              <br />
              <span className="text-muted-foreground">before you start.</span>
            </h1>
            <p
              className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
              style={{ animationDelay: "240ms" }}
            >
              Karya AI turns messy assignments, briefs, documents and instructions into a clear work
              plan — finding missing information, ambiguities, dependencies, and what must be
              verified before the work is finished.
            </p>
            <div
              className="rise mt-8 flex flex-wrap justify-center gap-2.5"
              style={{ animationDelay: "340ms" }}
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

          {/* Hero product demo */}
          <div className="rise mt-14" style={{ animationDelay: "480ms" }}>
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* ── 2. WHAT WORKREADY DOES ───────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="label-caps">The core problem</p>
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

      {/* ── 3. CORE WORKFLOW ─────────────────────────────────────────────────── */}
      <section id="how" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="The workflow"
              title="From messy request to clean handoff."
              text="Karya AI sits between receiving work and calling it finished — catching everything that would otherwise be discovered too late."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <CoreWorkflow />
          </Reveal>
        </div>
      </section>

      {/* ── 4. REQUIREMENT → EVIDENCE ────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Requirement to evidence"
              title="Every requirement is tied to something real."
              text="Karya AI doesn't mark work complete because it looks finished. It looks for the evidence behind each requirement — and explains what's missing when it isn't there."
            />
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

      {/* ── 5. AMBIGUITY DETECTOR ────────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Ambiguity detection"
              title="Vague instructions become precise questions."
              text="Karya AI identifies every point of ambiguity in the work instructions and generates clear, specific questions that resolve them — before the work begins."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <AmbiguityDemo />
          </Reveal>
        </div>
      </section>

      {/* ── 6. MISSING INFORMATION ───────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Missing information"
              title="Find what's missing before it blocks you."
              text="Karya AI compares what you have against what the work actually requires — and generates a precise request for everything that's absent."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <MissingInfoDemo />
          </Reveal>
        </div>
      </section>

      {/* ── 7. DEPENDENCY PLANNING ───────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Dependency planning"
              title="Understand what must happen before what."
              text="Karya AI builds an ordered plan that accounts for dependencies. When a required input is missing, you see exactly which downstream steps become blocked — before you've wasted time on them."
            />
          </Reveal>
          <Reveal delay={140}>
            <DependencyGraph />
          </Reveal>
        </div>
      </section>

      {/* ── 8. READINESS STATES ──────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Readiness"
              title="No arbitrary percentage. A reason."
              text="Karya AI doesn't invent a score. It states which state the work is in and explains exactly why — so you know what to resolve, not just that something is wrong."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ReadinessStates />
          </Reveal>
        </div>
      </section>

      {/* ── 9. ASSUMPTION REGISTER ───────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Assumptions"
              title="Invisible assumptions become visible risks."
              text="Every piece of work contains hidden assumptions — 'final' means v3, the budget hasn't changed, the client approved verbally. Karya AI surfaces them before they become problems."
            />
          </Reveal>
          <Reveal delay={140}>
            <AssumptionRegister />
          </Reveal>
        </div>
      </section>

      {/* ── 10. FINAL VERIFICATION ───────────────────────────────────────────── */}
      <section id="verify" className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Final verification"
              title="Don't just finish the work. Know it's finished correctly."
              text="Upload the completed result. Karya AI compares it against the original request, requirement by requirement — and shows exactly what's satisfied, what's missing, and what conflicts."
            />
          </Reveal>
          <Reveal delay={140} className="mt-10">
            <VerificationPanel />
          </Reveal>
        </div>
      </section>

      {/* ── 11. HANDOFF ──────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Handoff"
              title="25 files become one clear packet."
              text="When work is done, Karya AI generates a structured handoff: what was completed, what remains open, which files are authoritative, and what the next action is."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <HandoffTransform />
          </Reveal>
        </div>
      </section>

      {/* ── 12. NOT A TASK MANAGER ───────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="A different category"
              title="Not another task manager."
              text="Task managers tell you what to do. Karya AI tells you what the work actually requires — before you start, and whether it's actually finished."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ComparisonSection />
          </Reveal>
        </div>
      </section>

      {/* ── 13. FEATURE ARCHITECTURE ─────────────────────────────────────────── */}
      <section id="features" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Organized around the actual workflow."
              text="Every capability maps to a stage of work — from understanding the request to generating the handoff."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <FeatureArchitecture />
          </Reveal>
        </div>
      </section>

      {/* ── 14. MULTI-FORMAT INPUT ───────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Any format"
              title="One place for messy work, regardless of where it came from."
              text="Paste text, upload a PDF, drop in a DOCX, forward an email, attach an image, or describe the work in plain language. Karya AI works with whatever you have."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <MultiFormatInput />
          </Reveal>
        </div>
      </section>

      {/* ── 15. USE CASES ────────────────────────────────────────────────────── */}
      <section id="usecases" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Where it fits"
              title="Any work that arrives unclear."
              text="Switch between scenarios to see how Karya AI adapts to the type of work."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <UseCaseSwitcher />
          </Reveal>
        </div>
      </section>

      {/* ── 16. CHAIN CALLOUT ────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <div className="rounded-2xl border border-hairline bg-muted/30 px-8 py-10 md:px-12">
              <p className="label-caps text-center">The chain Karya AI maintains</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
                {[
                  "Request",
                  "Deliverable",
                  "Requirement",
                  "Evidence",
                  "Verification",
                ].map((label, i, arr) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm">
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
                This chain is the core concept. Karya AI ensures every requirement has a deliverable,
                every deliverable has evidence, and every piece of evidence is verified against the
                original request.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 17. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <h2 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Start with clarity.
              <br />
              Finish with confidence.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Give Karya AI the work. Find out what it requires before you begin — and know whether
              it's truly finished when you're done.
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
              Product
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
