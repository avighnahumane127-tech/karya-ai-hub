import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import {
  BeforeAfter,
  EvidenceChain,
  InteractiveHeroDemo,
  UseCaseSwitcher,
  VerificationPanel,
} from "@/components/landing-visuals";
import { PublicFooter, PublicNav } from "@/components/public-layout";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const title = "Karya AI — AI that understands your work from request to completion";
const description =
  "Karya AI understands messy assignments, briefs, emails, and files — then finds what is missing, plans what needs to happen, and verifies whether the finished work actually meets the request.";

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

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({
  children,
  muted,
  className,
}: {
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-hairline", muted && "bg-muted/30")}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20", className)}>
        {children}
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="label-caps mb-3">{children}</p>;
}

// ── Landing ────────────────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          {/* Text */}
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="rise label-caps inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1"
              style={{ animationDelay: "40ms" }}
            >
              AI work intelligence
            </p>
            <h1
              className="rise mt-5 text-[2.4rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
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
              Karya AI understands messy assignments, briefs, emails, and files — then finds what
              is missing, plans what needs to happen, and verifies whether the finished work
              actually meets the request.
            </p>
            <div
              className="rise mt-7 flex flex-wrap justify-center gap-2.5"
              style={{ animationDelay: "340ms" }}
            >
              <Button asChild size="lg">
                <Link to="/home">
                  Try Karya AI
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </div>

          {/* Product demo */}
          <div className="rise mt-12" style={{ animationDelay: "460ms" }}>
            <InteractiveHeroDemo />
          </div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM ───────────────────────────────────────────────────── */}
      <Section muted>
        <Reveal>
          <div className="max-w-2xl">
            <SectionLabel>The problem</SectionLabel>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Work fails because the assignment wasn't clear enough to begin with.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Messy instructions create missing requirements, unclear expectations, blocked work,
              and rework. Karya AI catches this before the work starts — and checks the result
              when it finishes.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <BeforeAfter />
        </Reveal>
      </Section>

      {/* ── 3. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionLabel>How Karya AI works</SectionLabel>
          <h2 className="text-2xl tracking-tight sm:text-3xl">Four stages, one connected system.</h2>
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                label: "Understand",
                desc: "Extracts what you're being asked to produce — deliverables, requirements, deadlines, stakeholders — from any input format.",
                color: "bg-info-soft text-info",
              },
              {
                num: "02",
                label: "Prepare",
                desc: "Identifies what's missing, ambiguous, or conflicting before the work starts.",
                color: "bg-warn-soft text-warn",
              },
              {
                num: "03",
                label: "Plan",
                desc: "Builds an ordered plan with dependencies, expected outputs, and evidence requirements.",
                color: "bg-ready-soft text-ready",
              },
              {
                num: "04",
                label: "Verify",
                desc: "Compares the finished work against the original request, requirement by requirement.",
                color: "bg-blocked-soft text-blocked",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-hairline bg-surface p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{step.num}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", step.color)}>
                    {step.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200} className="mt-4 text-center">
          <Link
            to="/how-it-works"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            See the full workflow →
          </Link>
        </Reveal>
      </Section>

      {/* ── 4. KEY CAPABILITIES ──────────────────────────────────────────────── */}
      <Section muted>
        <Reveal>
          <SectionLabel>Capabilities</SectionLabel>
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            Everything needed to go from unclear to verified.
          </h2>
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Missing information",
                desc: "Identifies what's not there before work starts.",
              },
              {
                title: "Ambiguity detection",
                desc: "Flags requirements that could be interpreted more than one way.",
              },
              {
                title: "Dependency mapping",
                desc: "Finds what must happen before what else can happen.",
              },
              {
                title: "Evidence mapping",
                desc: "Links each requirement to the content that satisfies it.",
              },
              {
                title: "Work planning",
                desc: "Builds an ordered execution plan from the understanding.",
              },
              {
                title: "Final verification",
                desc: "Checks whether the completed work actually meets the original request.",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                className="rounded-xl border border-hairline bg-surface p-5 space-y-1.5"
              >
                <p className="text-sm font-medium">{cap.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{cap.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={200} className="mt-4 text-center">
          <Link
            to="/product"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            See all capabilities →
          </Link>
        </Reveal>
      </Section>

      {/* ── 5. VERIFICATION ──────────────────────────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionLabel>Verification</SectionLabel>
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            "Done" is not a checkbox. It is a claim that needs evidence.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Karya AI compares finished work against the original request, requirement by
            requirement.
          </p>
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
        <Reveal delay={240} className="mt-4 text-center">
          <Link
            to="/verification"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            How verification works →
          </Link>
        </Reveal>
      </Section>

      {/* ── 6. USE CASES ─────────────────────────────────────────────────────── */}
      <Section muted>
        <Reveal>
          <SectionLabel>Use cases</SectionLabel>
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            Any work that arrives unclear.
          </h2>
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <UseCaseSwitcher />
        </Reveal>
        <Reveal delay={200} className="mt-4 text-center">
          <Link
            to="/use-cases"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            See detailed examples →
          </Link>
        </Reveal>
      </Section>

      {/* ── 7. FINAL CTA ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center md:px-8 md:py-28">
          <Reveal>
            <h2 className="text-3xl tracking-tight sm:text-4xl">
              Turn unclear work into clear, verifiable work.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
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
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
