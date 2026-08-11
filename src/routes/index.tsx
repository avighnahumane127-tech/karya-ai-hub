import { Link, createFileRoute } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import mark from "@/assets/karya-mark.png";
import {
  EvidenceChain,
  FlowStep,
  Panel,
  ReadinessPreview,
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

const messy = [
  "Prepare the report.",
  "Update the website.",
  "Compare these suppliers.",
  "Finish the presentation.",
];

const discovers = [
  "Missing inputs",
  "Ambiguity",
  "Dependencies",
  "Conflicting instructions",
  "Required evidence",
  "Completion criteria",
];

const features = [
  {
    name: "Understand",
    text: "Extract objectives, deliverables, requirements, deadlines and stakeholders.",
  },
  { name: "Detect", text: "Find missing information, ambiguity, risks, conflicts and dependencies." },
  { name: "Plan", text: "Create an ordered execution plan based on prerequisites." },
  { name: "Track", text: "Connect requirements to evidence and decisions." },
  { name: "Verify", text: "Compare finished work against the original request." },
  {
    name: "Handoff",
    text: "Create a clean handoff with completed work, unresolved issues, files, risks and next steps.",
  },
];

const readinessStates = [
  { label: "Ready", tone: "bg-ready-soft text-ready" },
  { label: "Ready with warnings", tone: "bg-warn-soft text-warn" },
  { label: "Blocked", tone: "bg-blocked-soft text-blocked" },
  { label: "Needs clarification", tone: "bg-info-soft text-info" },
  { label: "Review required", tone: "bg-muted text-muted-foreground" },
];

const verificationFindings = [
  "Requirement satisfied",
  "Missing attachment",
  "Unsupported claim",
  "Conflicting number",
  "Unresolved assumption",
];

const useCases = [
  {
    name: "Office assignments",
    text: "Turn a two-line request into a defined deliverable before you start.",
  },
  { name: "Client projects", text: "Catch missing scope, inputs and approvals early." },
  { name: "Research", text: "Define the question, the sources and what counts as evidence." },
  { name: "Reports", text: "Know the required sections, audience and supporting numbers." },
  { name: "Presentations", text: "Tie every slide back to the decision it supports." },
  { name: "Websites", text: "Confirm pages in scope, assets needed and who signs off." },
  { name: "Data work", text: "Record method, assumptions and the dataset you actually had." },
  { name: "Handoffs", text: "Pass work on without losing context or open issues." },
];

const workflow = [
  { step: "1", name: "Give Karya AI the request", text: "Text, PDF, DOCX, folder, email." },
  { step: "2", name: "It understands it", text: "Requirements, deliverables, dependencies." },
  { step: "3", name: "Resolve what is unclear", text: "Questions, missing information, assumptions." },
  { step: "4", name: "Execute", text: "An ordered work plan." },
  { step: "5", name: "Verify", text: "Compare the output against the original request." },
  { step: "6", name: "Handoff", text: "Deliver a clean, understandable work packet." },
];

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
            <Menu className="h-4 w-4" />
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
          <Link to="/login" onClick={() => setOpen(false)} className="block py-1.5">
            Log in
          </Link>
        </div>
      ) : null}
    </header>
  );
}

function SectionHeading({
  eyebrow,
  title: heading,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="label-caps">{eyebrow}</p>
      <h2 className="mt-3 text-2xl tracking-tight sm:text-3xl">{heading}</h2>
      {text ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p> : null}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-60" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <p
              className="rise label-caps inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-2.5 py-1"
              style={{ animationDelay: "60ms" }}
            >
              Work preflight
            </p>
            <h1
              className="rise mt-6 text-[2.1rem] leading-[1.1] tracking-tight sm:text-5xl"
              style={{ animationDelay: "160ms" }}
            >
              Know what the work requires before you start.
            </h1>
            <p
              className="rise mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
              style={{ animationDelay: "260ms" }}
            >
              Karya AI turns messy assignments, briefs, documents and instructions into a clear work
              plan — while finding missing information, ambiguities, dependencies, and what needs to
              be verified before the work is finished.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-2.5" style={{ animationDelay: "360ms" }}>
              <Button asChild>
                <Link to="/home">Try Karya AI</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "460ms" }}>
            <ReadinessPreview />
          </div>
        </div>
      </section>

      {/* Flow */}
      <section id="how" className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Where it sits"
              title="Between receiving work and calling it finished."
            />
          </Reveal>
          <Reveal delay={120} className="mt-9 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div className="flex min-w-max items-center gap-3">
              {["Messy work", "Understand", "Check", "Plan", "Verify"].map((s, i, arr) => (
                <FlowStep key={s} label={s} last={i === arr.length - 1} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="The problem" title="Most work starts with too little." />
            <ul className="mt-7 space-y-2.5">
              {messy.map((m) => (
                <li
                  key={m}
                  className="rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-muted-foreground"
                >
                  “{m}”
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <p className="label-caps">What Karya AI finds</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {discovers.map((d) => (
                <div
                  key={d}
                  className="rounded-lg border border-hairline bg-surface px-4 py-3.5 text-sm"
                >
                  {d}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Six things it does with every piece of work."
            />
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.name} delay={i * 70}>
                <div className="border-t border-hairline pt-5">
                  <h3 className="text-sm font-medium">{f.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Requirement → evidence */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Requirement to evidence"
              title="Every requirement is tied to something real."
              text="Karya AI does not mark work complete because it looks finished. It looks for the evidence behind each requirement."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Reveal>
              <EvidenceChain
                requirement="Compare all three suppliers"
                evidence={["Proposal A", "Proposal B", "Proposal C"]}
                status="Complete"
              />
            </Reveal>
            <Reveal delay={120}>
              <EvidenceChain
                requirement="Include vendor references"
                evidence={["No references found"]}
                status="Missing"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Readiness */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Readiness"
              title="No arbitrary percentage. A reason."
              text="Karya AI does not invent a score. It states which state the work is in and explains exactly why."
            />
          </Reveal>
          <Reveal delay={120} className="mt-9 flex flex-wrap gap-2.5">
            {readinessStates.map((s) => (
              <span
                key={s.label}
                className={cn("rounded-full px-3 py-1 text-xs font-medium", s.tone)}
              >
                {s.label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Verification */}
      <section id="verify" className="border-b border-hairline bg-muted/30">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Final verification"
              title="Don't just finish the work. Know that it is finished correctly."
              text="The original request is compared against the completed work, requirement by requirement."
            />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {["Original request", "Completed work", "Verification"].map((s, i, arr) => (
                <FlowStep key={s} label={s} last={i === arr.length - 1} />
              ))}
            </div>
          </Reveal>
          <Reveal delay={140}>
            <Panel>
              <p className="label-caps">Example findings</p>
              <ul className="mt-4 divide-y divide-hairline">
                {verificationFindings.map((f) => (
                  <li key={f} className="py-2.5 text-sm">
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Illustration of the verification output.
              </p>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading eyebrow="Where it fits" title="Any work that arrives unclear." />
          </Reveal>
          <div className="mt-9 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u, i) => (
              <Reveal key={u.name} delay={i * 50}>
                <h3 className="text-sm font-medium">{u.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{u.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <Reveal>
            <SectionHeading eyebrow="The workflow" title="From request to handoff." />
          </Reveal>
          <ol className="mt-10 space-y-0 divide-y divide-hairline border-y border-hairline">
            {workflow.map((w, i) => (
              <Reveal as="li" key={w.step} delay={i * 60}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 py-5">
                  <span className="font-mono text-xs text-muted-foreground">{w.step}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-3xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <h2 className="text-3xl tracking-tight sm:text-4xl">
              Start with clarity. Finish with confidence.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Give Karya AI the work. Find out what it requires before you begin.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <Button asChild>
                <Link to="/home">Try Karya AI</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

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
              Privacy
            </a>
            <a href="#how" className="hover:text-foreground">
              Terms
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