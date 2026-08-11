import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  FileText,
  Folder,
  HelpCircle,
  Lock,
  Mail,
  Minus,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Static product demonstrations. These are illustrations of the product, not user data. */

export function DemoTag() {
  return (
    <span className="label-caps absolute right-3 top-3 rounded bg-muted px-1.5 py-0.5 text-[10px]">
      Product example
    </span>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Interactive Hero Demonstration ────────────────────────────────────────────

type HeroPhase = "Understand" | "Prepare" | "Plan" | "Verify" | "Handoff";
const heroPhaseTabs: HeroPhase[] = ["Understand", "Prepare", "Plan", "Verify", "Handoff"];

function HeroPhaseContent({ phase }: { phase: HeroPhase }) {
  if (phase === "Understand") {
    return (
      <div className="space-y-4 text-sm">
        <Row label="Objective" value="Prepare a supplier recommendation for management." />
        <div>
          <p className="label-caps mb-2">Deliverables</p>
          {["Supplier comparison", "Recommendation", "Risk analysis", "Management summary"].map((d) => (
            <div key={d} className="flex items-center gap-2 py-0.5 text-xs">
              <Check className="h-3 w-3 shrink-0 text-ready" strokeWidth={2.2} />{d}
            </div>
          ))}
        </div>
        <div>
          <p className="label-caps mb-2">Requirements</p>
          {["Compare all suppliers", "Include delivery cost", "Provide evidence", "Submit by Friday"].map((r) => (
            <div key={r} className="flex items-center gap-2 py-0.5 text-xs text-muted-foreground">
              <Circle className="h-1.5 w-1.5 shrink-0 fill-current opacity-40" />{r}
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-xs">
          <Row label="Deadline" value="Friday" inline />
          <Row label="Stakeholders" value="Management team" inline />
        </div>
      </div>
    );
  }
  if (phase === "Prepare") {
    return (
      <div className="space-y-3 text-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-info-soft px-2.5 py-0.5 text-xs font-medium text-info">
          <HelpCircle className="h-3 w-3" strokeWidth={2} />
          Needs clarification · 3 issues
        </div>
        <div className="space-y-2">
          <p className="label-caps">Missing</p>
          {["Evaluation criteria", "Budget ceiling"].map((m) => (
            <div key={m} className="flex items-center gap-2 rounded-md bg-blocked-soft/50 px-2.5 py-1.5 text-xs text-blocked">
              <X className="h-3 w-3 shrink-0" strokeWidth={2.2} />{m}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="label-caps">Ambiguity</p>
          <div className="flex items-center gap-2 rounded-md bg-warn-soft/50 px-2.5 py-1.5 text-xs text-warn">
            <HelpCircle className="h-3 w-3 shrink-0" strokeWidth={2} />
            Price vs delivery priority
          </div>
        </div>
        <div className="space-y-2">
          <p className="label-caps">Dependency</p>
          <div className="text-xs text-muted-foreground">Evaluation criteria → supplier ranking</div>
        </div>
        <div className="space-y-2">
          <p className="label-caps">Assumption</p>
          <div className="text-xs text-muted-foreground">"Final" refers to Proposal-C-v2</div>
        </div>
      </div>
    );
  }
  if (phase === "Plan") {
    return (
      <div className="space-y-1.5 text-sm">
        <p className="label-caps mb-3">Execution plan</p>
        {[
          { n: "1", label: "Confirm evaluation criteria", status: "Blocked", cls: "text-blocked" },
          { n: "2", label: "Compare all 3 suppliers", status: "Waiting", cls: "text-warn" },
          { n: "3", label: "Write recommendation", status: "Not started", cls: "text-muted-foreground" },
          { n: "4", label: "Prepare management summary", status: "Not started", cls: "text-muted-foreground" },
          { n: "5", label: "Final review", status: "Not started", cls: "text-muted-foreground" },
        ].map((step, i, arr) => (
          <div key={step.n}>
            <div className="flex items-center justify-between rounded-md border border-hairline bg-surface px-3 py-2">
              <div className="flex items-center gap-2.5 text-xs">
                <span className="font-mono text-muted-foreground">{step.n}</span>
                <span>{step.label}</span>
              </div>
              <span className={cn("label-caps shrink-0", step.cls)}>{step.status}</span>
            </div>
            {i < arr.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.8} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (phase === "Verify") {
    return (
      <div className="space-y-2 text-sm">
        <p className="label-caps mb-3">Verification — supplier-recommendation.pptx</p>
        {[
          { icon: Check, label: "10 slides present", cls: "text-ready", bg: "bg-ready-soft/60" },
          { icon: Check, label: "All suppliers compared", cls: "text-ready", bg: "bg-ready-soft/60" },
          { icon: Check, label: "Recommendation included", cls: "text-ready", bg: "bg-ready-soft/60" },
          { icon: AlertTriangle, label: "Executive summary conflicts with table", cls: "text-warn", bg: "bg-warn-soft/60" },
          { icon: X, label: "Appendix missing", cls: "text-blocked", bg: "bg-blocked-soft/50" },
          { icon: X, label: "Delivery-cost evidence missing", cls: "text-blocked", bg: "bg-blocked-soft/50" },
        ].map(({ icon: Icon, label, cls, bg }) => (
          <div key={label} className={cn("flex items-center gap-2.5 rounded-md px-3 py-2 text-xs", bg)}>
            <Icon className={cn("h-3 w-3 shrink-0", cls)} strokeWidth={2.2} />
            {label}
          </div>
        ))}
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-warn-soft px-2.5 py-0.5 text-xs font-medium text-warn">Review required</span>
        </div>
      </div>
    );
  }
  // Handoff
  return (
    <div className="space-y-3 text-sm">
      <p className="label-caps mb-3 text-ready">Handoff packet</p>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed</p>
        {["Supplier comparison", "Recommendation", "Management presentation"].map((item) => (
          <div key={item} className="flex items-center gap-2 py-1 text-xs">
            <Check className="h-3 w-3 text-ready" strokeWidth={2.2} />{item}
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Open</p>
        <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
          <Minus className="h-3 w-3 text-warn" strokeWidth={2.2} />Delivery cost confirmation
        </div>
      </div>
      <div className="flex gap-6 text-xs text-muted-foreground">
        <div><p className="text-[10px] uppercase tracking-wider">Risks</p><p>1 unresolved assumption</p></div>
        <div><p className="text-[10px] uppercase tracking-wider">Files</p><p>3 authoritative</p></div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next action</p>
        <p className="mt-1 text-xs font-medium">Management review</p>
      </div>
    </div>
  );
}

function Row({
  label, value, inline,
}: {
  label: string; value: string; inline?: boolean;
}) {
  if (inline) {
    return (
      <div>
        <p className="label-caps">{label}</p>
        <p className="mt-0.5 text-xs">{value}</p>
      </div>
    );
  }
  return (
    <div>
      <p className="label-caps mb-1">{label}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{value}</p>
    </div>
  );
}

const phaseColors: Record<HeroPhase, string> = {
  Understand: "text-info",
  Prepare: "text-warn",
  Plan: "text-ready",
  Verify: "text-blocked",
  Handoff: "text-muted-foreground",
};

export function InteractiveHeroDemo() {
  const [phase, setPhase] = useState<HeroPhase>("Understand");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      {/* LEFT – inputs */}
      <Panel className="space-y-3 p-5">
        <DemoTag />
        <p className="label-caps">Incoming work</p>
        <p className="rounded-lg border border-hairline bg-muted/40 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground">
          "Review the three supplier proposals and prepare a recommendation for management by Friday."
        </p>
        <div className="space-y-1.5">
          {[
            { icon: Mail, name: "Assignment email" },
            { icon: FileText, name: "Proposal-A.pdf" },
            { icon: FileText, name: "Proposal-B.pdf" },
            { icon: FileText, name: "Proposal-C.pdf" },
            { icon: FileText, name: "Previous-notes.docx" },
          ].map(({ icon: Icon, name }) => (
            <div key={name} className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-2.5 py-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.7} />
              <span className="truncate text-xs">{name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-hairline bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
          Karya AI is processing…
        </div>
      </Panel>

      {/* RIGHT – tabbed output */}
      <Panel className="flex flex-col p-0 overflow-hidden">
        {/* Phase tabs */}
        <div className="flex border-b border-hairline">
          {heroPhaseTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setPhase(tab)}
              className={cn(
                "flex-1 px-2 py-3 text-[11px] font-medium transition-colors",
                phase === tab
                  ? cn("border-b-2 border-primary bg-surface", phaseColors[tab])
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-5">
          <HeroPhaseContent phase={phase} />
        </div>
      </Panel>
    </div>
  );
}

// Legacy HeroDemo kept for any existing references
export { InteractiveHeroDemo as HeroDemo };

// ── Before / After ─────────────────────────────────────────────────────────────

export function BeforeAfter() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Before */}
      <Panel className="space-y-4 border-blocked/20 bg-blocked-soft/20 p-6">
        <p className="label-caps text-blocked">Before Karya AI</p>
        <p className="rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-muted-foreground">
          "Prepare the report."
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "What report?",
            "For whom?",
            "Which data?",
            "Which format?",
            "What deadline?",
            'What does "done" mean?',
          ].map((q) => (
            <div
              key={q}
              className="flex items-start gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-2 text-xs text-muted-foreground"
            >
              <HelpCircle
                className="mt-0.5 h-3 w-3 shrink-0 text-blocked/60"
                strokeWidth={1.8}
              />
              {q}
            </div>
          ))}
        </div>
      </Panel>

      {/* After */}
      <Panel className="space-y-4 border-ready/20 bg-ready-soft/40 p-6">
        <p className="label-caps text-ready">With Karya AI</p>
        <div className="space-y-3 text-sm">
          {[
            {
              label: "Objective",
              value: "Prepare a management report comparing 3 suppliers.",
            },
            {
              label: "Inputs",
              value: "3 supplier proposals, budget information, evaluation criteria.",
            },
            {
              label: "Requirements",
              value: "Compare all suppliers · Explain recommendation · Include risks.",
            },
            {
              label: "Question",
              value: "What matters more: price or delivery time?",
            },
            {
              label: "Completion test",
              value: "Every supplier compared using the same criteria.",
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="label-caps mt-0.5 w-24 shrink-0">{label}</span>
              <span className="text-[13px] leading-relaxed">{value}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── Core Workflow ──────────────────────────────────────────────────────────────

const workflowSteps = [
  {
    num: "01",
    name: "Give Karya AI the request",
    desc: "Paste or upload any work instruction: assignment, brief, PDF, DOCX, email, image, or folder.",
    color: "text-foreground",
  },
  {
    num: "02",
    name: "Understand",
    desc: "Extracts the objective, deliverables, requirements, deadline, stakeholders, and inputs.",
    color: "text-info",
  },
  {
    num: "03",
    name: "Find what's missing",
    desc: "Detects missing files, information gaps, ambiguities, conflicting instructions, and dependencies.",
    color: "text-warn",
  },
  {
    num: "04",
    name: "Plan the work",
    desc: "Creates an ordered execution plan with dependencies, expected outputs, questions, and evidence requirements.",
    color: "text-ready",
  },
  {
    num: "05",
    name: "Execute",
    desc: "You do the actual work. Karya AI does not pretend to replace the worker.",
    color: "text-muted-foreground",
  },
  {
    num: "06",
    name: "Verify",
    desc: "Upload the result. Karya AI checks requirements, evidence, consistency, and missing deliverables.",
    color: "text-warn",
  },
  {
    num: "07",
    name: "Handoff",
    desc: "Generates a clear handoff: what was completed, what remains, authoritative files, and next steps.",
    color: "text-ready",
  },
];

export function CoreWorkflow() {
  return (
    <div className="space-y-0 divide-y divide-hairline border-y border-hairline">
      {workflowSteps.map((step, i) => (
        <div
          key={step.num}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 py-5 transition-colors hover:bg-muted/30"
        >
          <div className="w-10 pt-0.5">
            <span className={cn("font-mono text-xs font-medium", step.color)}>{step.num}</span>
          </div>
          <div>
            <p className="text-sm font-medium">{step.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Evidence Chain ────────────────────────────────────────────────────────────

export function EvidenceChain({
  requirement,
  evidence,
  status,
}: {
  requirement: string;
  evidence: string[];
  status: "Complete" | "Missing" | "Conflict";
}) {
  const statusConfig = {
    Complete: {
      icon: CheckCircle2,
      cls: "bg-ready-soft text-ready border-ready/20",
      label: "Complete",
    },
    Missing: {
      icon: XCircle,
      cls: "bg-blocked-soft text-blocked border-blocked/20",
      label: "Missing",
    },
    Conflict: {
      icon: AlertTriangle,
      cls: "bg-warn-soft text-warn border-warn/20",
      label: "Clarification needed",
    },
  }[status];

  const Icon = statusConfig.icon;

  return (
    <Panel>
      <p className="label-caps">Requirement</p>
      <p className="mt-2 text-sm font-medium">{requirement}</p>

      <div className="my-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-hairline" />
        <ArrowDown className="h-3 w-3 text-muted-foreground" strokeWidth={1.8} />
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <p className="label-caps">Evidence</p>
      <ul className="mt-2 space-y-1.5">
        {evidence.map((e) => (
          <li key={e} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="h-1.5 w-1.5 shrink-0 fill-current text-muted-foreground/40" />
            {e}
          </li>
        ))}
      </ul>

      <div className="my-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-hairline" />
        <ArrowDown className="h-3 w-3 text-muted-foreground" strokeWidth={1.8} />
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <p className="label-caps">Status</p>
      <span
        className={cn(
          "mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
          statusConfig.cls,
        )}
      >
        <Icon className="h-3 w-3" strokeWidth={2} />
        {statusConfig.label}
      </span>
    </Panel>
  );
}

// ── Readiness States ──────────────────────────────────────────────────────────

const readinessStates = [
  {
    label: "Ready",
    desc: "All required inputs and information are present. Work can begin.",
    tone: "bg-ready-soft text-ready border-ready/20",
    dot: "bg-ready",
  },
  {
    label: "Ready with warnings",
    desc: "Work can begin, but one or more assumptions exist that should be confirmed.",
    tone: "bg-warn-soft text-warn border-warn/20",
    dot: "bg-warn",
  },
  {
    label: "Blocked",
    desc: "A required input is missing. Work cannot proceed until it is resolved.",
    tone: "bg-blocked-soft text-blocked border-blocked/20",
    dot: "bg-blocked",
  },
  {
    label: "Needs clarification",
    desc: "Instructions are ambiguous or conflicting. A question must be answered first.",
    tone: "bg-info-soft text-info border-info/20",
    dot: "bg-info",
  },
  {
    label: "Review required",
    desc: "The output exists but has unresolved issues that need attention before handoff.",
    tone: "bg-muted text-muted-foreground border-hairline",
    dot: "bg-muted-foreground",
  },
];

export function ReadinessStates() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % readinessStates.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="space-y-2">
        {readinessStates.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActive(i)}
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-300",
              active === i ? s.tone : "border-hairline bg-surface text-muted-foreground hover:bg-muted/50",
            )}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  active === i ? s.dot : "bg-muted-foreground/30",
                )}
              />
              {s.label}
            </div>
          </button>
        ))}
      </div>
      <Panel className="flex flex-col justify-center">
        {/* active is always in-bounds: useState(0) and setActive uses modulo on readinessStates.length */}
        {(() => {
          const state = readinessStates[active]!;
          const textClass = state.tone.split(" ").find((c) => c.startsWith("text-")) ?? "text-foreground";
          return (
            <>
              <p className={cn("text-lg font-medium transition-all duration-300", textClass)}>
                {state.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{state.desc}</p>
            </>
          );
        })()}
        <p className="mt-4 text-xs text-muted-foreground">
          Karya AI explains <em>why</em> — not just a percentage.
        </p>
      </Panel>
    </div>
  );
}

// ── Ambiguity Detector ────────────────────────────────────────────────────────

const ambiguities = [
  { text: "Professional for whom?", offset: "top-2 left-2" },
  { text: "Which template?", offset: "top-2 right-4" },
  { text: "How many slides?", offset: "bottom-2 left-4" },
  { text: "What audience?", offset: "bottom-2 right-2" },
];

export function AmbiguityDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      {/* Vague instruction */}
      <div className="space-y-3">
        <p className="label-caps text-muted-foreground">Vague instruction</p>
        <div className="relative">
          <Panel className="border-warn/30 bg-warn-soft/30 p-5">
            <p className="text-sm font-medium">"Make the presentation professional."</p>
          </Panel>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ambiguities.map((a) => (
              <div
                key={a.text}
                className="flex items-center gap-1.5 rounded-md border border-warn/30 bg-warn-soft px-2.5 py-1.5 text-xs text-warn"
              >
                <HelpCircle className="h-3 w-3 shrink-0" strokeWidth={2} />
                {a.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <ArrowRight className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>

      {/* Precise question */}
      <div className="space-y-3">
        <p className="label-caps text-ready">Precise question generated</p>
        <Panel className="border-ready/30 bg-ready-soft/50 p-5">
          <p className="label-caps text-ready">Suggested question</p>
          <p className="mt-2 text-sm leading-relaxed">
            "Which audience will receive this presentation: executives, technical staff, or
            customers?"
          </p>
          <div className="mt-4 border-t border-hairline pt-3">
            <p className="label-caps">Why this matters</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              The slide count, depth, and terminology depend entirely on the answer.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ── Missing Information ───────────────────────────────────────────────────────

const providedFiles = [
  { icon: FileText, name: "Brief.pdf", size: "120 KB" },
  { icon: FileText, name: "Brand-guidelines.pdf", size: "2.4 MB" },
  { icon: FileText, name: "logo.png", size: "88 KB" },
  { icon: FileText, name: "homepage-copy.docx", size: "32 KB" },
];

const missingFiles = [
  "About page copy",
  "Services page copy",
  "Vector logo (.svg)",
  "Contact form destination",
  "Product photography",
];

export function MissingInfoDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="space-y-3 p-5">
        <p className="label-caps">Provided files</p>
        {providedFiles.map(({ icon: Icon, name, size }) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg border border-hairline bg-muted/30 px-3 py-2.5"
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{name}</p>
              <p className="text-[10px] text-muted-foreground">{size}</p>
            </div>
            <Check className="h-3.5 w-3.5 shrink-0 text-ready" strokeWidth={2.2} />
          </div>
        ))}
      </Panel>

      <Panel className="space-y-3 p-5">
        <p className="label-caps text-blocked">Missing — detected by Karya AI</p>
        {missingFiles.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg border border-blocked/20 bg-blocked-soft/40 px-3 py-2.5"
          >
            <X className="h-3.5 w-3.5 shrink-0 text-blocked" strokeWidth={2.2} />
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
        ))}
        <button className="mt-2 w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/50">
          Generate request message
        </button>
      </Panel>
    </div>
  );
}

// ── Dependency Graph ──────────────────────────────────────────────────────────

const depNodes = [
  { id: "photos", label: "Final product photos", status: "blocked" as const },
  { id: "approve", label: "Approve images", status: "blocked" as const },
  { id: "design", label: "Design product pages", status: "blocked" as const },
  { id: "mobile", label: "Mobile review", status: "blocked" as const },
  { id: "publish", label: "Publish website", status: "blocked" as const },
];

export function DependencyGraph() {
  return (
    <div className="mx-auto max-w-sm space-y-0">
      {depNodes.map((node, i) => (
        <div key={node.id}>
          <div
            className={cn(
              "rounded-lg border px-4 py-3 text-sm font-medium",
              node.status === "blocked"
                ? "border-blocked/30 bg-blocked-soft/50 text-blocked"
                : node.status === "ready" as string
                  ? "border-ready/30 bg-ready-soft/50 text-ready"
                  : "border-hairline bg-surface",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span>{node.label}</span>
              <span className="label-caps shrink-0 text-blocked">Blocked</span>
            </div>
          </div>
          {i < depNodes.length - 1 && (
            <div className="flex justify-center py-1.5">
              <ArrowDown className="h-4 w-4 text-blocked/50" strokeWidth={1.8} />
            </div>
          )}
        </div>
      ))}
      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        One missing dependency blocks everything downstream.
        <br />
        Karya AI makes this visible before work starts.
      </p>
    </div>
  );
}

// ── Verification Panel ────────────────────────────────────────────────────────

const verificationItems = [
  { icon: Check, label: "10 slides present", tone: "text-ready", bg: "bg-ready-soft" },
  { icon: Check, label: "All suppliers compared", tone: "text-ready", bg: "bg-ready-soft" },
  { icon: Check, label: "Recommendation included", tone: "text-ready", bg: "bg-ready-soft" },
  {
    icon: AlertTriangle,
    label: "Executive summary conflicts with table",
    tone: "text-warn",
    bg: "bg-warn-soft",
  },
  { icon: X, label: "Required appendix missing", tone: "text-blocked", bg: "bg-blocked-soft" },
  {
    icon: X,
    label: "Delivery-cost evidence missing",
    tone: "text-blocked",
    bg: "bg-blocked-soft",
  },
];

export function VerificationPanel() {
  return (
    <Panel className="p-6">
      <DemoTag />
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="label-caps">Original request</p>
          <p className="mt-2 text-sm leading-relaxed">
            Create a 10-slide supplier recommendation presentation.
          </p>
        </div>
        <div>
          <p className="label-caps">Submitted file</p>
          <div className="mt-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.7} />
            <span className="text-sm">supplier-recommendation.pptx</span>
          </div>
        </div>
        <div>
          <p className="label-caps">Verification result</p>
          <p className="mt-2 text-sm">4 of 6 requirements satisfied</p>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-hairline pt-5">
        {verificationItems.map(({ icon: Icon, label, tone, bg }) => (
          <div
            key={label}
            className={cn("flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm", bg)}
          >
            <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone)} strokeWidth={2.2} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="w-full rounded-lg border border-warn/30 bg-warn-soft px-4 py-2.5 text-sm font-medium text-warn transition-colors hover:bg-warn-soft/80">
          Review before submission
        </button>
      </div>
    </Panel>
  );
}

// ── Handoff Transform ─────────────────────────────────────────────────────────

const messyFiles = [
  "final2.pdf",
  "final-final.pptx",
  "notes.txt",
  "old-logo.png",
  "comments.docx",
  "screenshot_001.png",
  "screenshot_002.png",
  "draft_v3.docx",
  "...",
];

export function HandoffTransform() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Before */}
      <Panel className="border-muted p-5">
        <p className="label-caps text-muted-foreground">Before — 25 files, unclear state</p>
        <div className="mt-4 space-y-1.5">
          {messyFiles.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 rounded border border-hairline bg-muted/30 px-2.5 py-1.5"
            >
              <FileText className="h-3 w-3 shrink-0 text-muted-foreground/50" strokeWidth={1.7} />
              <span className="text-xs text-muted-foreground">{f}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* After */}
      <Panel className="border-ready/20 bg-ready-soft/20 p-5">
        <p className="label-caps text-ready">Karya AI Handoff</p>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed</p>
            <div className="mt-2 space-y-1.5">
              {["Supplier comparison", "Recommendation", "Management presentation"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs">
                  <Check className="h-3 w-3 text-ready" strokeWidth={2.2} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Open</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Minus className="h-3 w-3 text-warn" strokeWidth={2.2} />
              Delivery cost confirmation
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Authoritative files
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.7} />3 files
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Risks</p>
            <div className="mt-1.5 text-xs text-muted-foreground">1 unresolved assumption</div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Next action
            </p>
            <div className="mt-1.5 text-xs font-medium">Management review</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

// ── Feature Architecture ──────────────────────────────────────────────────────

const featureGroups = [
  {
    num: "01",
    phase: "Understand",
    color: "text-info",
    bg: "bg-info-soft",
    features: [
      "AI Work Chat",
      "Multi-format input",
      "Objective extraction",
      "Deliverable extraction",
      "Requirement extraction",
      "Deadline detection",
      "Stakeholder detection",
      "Source-backed findings",
    ],
  },
  {
    num: "02",
    phase: "Prepare",
    color: "text-warn",
    bg: "bg-warn-soft",
    features: [
      "Readiness check",
      "Missing information detection",
      "Ambiguity detection",
      "Risk detection",
      "Assumption register",
      "Version conflict detection",
      "Outdated file detection",
      "Authoritative file detection",
    ],
  },
  {
    num: "03",
    phase: "Plan",
    color: "text-ready",
    bg: "bg-ready-soft",
    features: [
      "Ordered work plan",
      "Dependency detection",
      "Dependency graph",
      "Expected outputs",
      "Evidence requirements",
      "AI recommendations",
      "Scope / change tracking",
    ],
  },
  {
    num: "04",
    phase: "Uncertainty",
    color: "text-warn",
    bg: "bg-warn-soft",
    features: [
      "Question generator",
      "Clarification message generator",
      "Ask Boss / Ask Client mode",
      "Decision log",
      "Requirement changes",
      "Source-backed AI",
    ],
  },
  {
    num: "05",
    phase: "Verify",
    color: "text-blocked",
    bg: "bg-blocked-soft",
    features: [
      "Requirement verification",
      "Evidence mapping",
      "Completion test",
      "Missing deliverable detection",
      "Unsupported claim detection",
      "Number consistency checking",
      "Source-backed verification",
    ],
  },
  {
    num: "06",
    phase: "Handoff",
    color: "text-muted-foreground",
    bg: "bg-muted",
    features: [
      "Handoff packet",
      "Completed work summary",
      "Remaining issues",
      "Authoritative files",
      "Open decisions",
      "Requirement history",
      "Decision history",
    ],
  },
];

export function FeatureArchitecture() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {featureGroups.map((group) => (
        <div key={group.phase} className="space-y-3 rounded-xl border border-hairline p-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{group.num}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                group.bg,
                group.color,
              )}
            >
              {group.phase}
            </span>
          </div>
          <ul className="space-y-1.5">
            {group.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── Comparison Section ────────────────────────────────────────────────────────

export function ComparisonSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="border-muted p-6">
        <p className="label-caps text-muted-foreground">Traditional task tools ask</p>
        <p className="mt-4 text-2xl font-medium tracking-tight text-muted-foreground">
          "What do I need to do?"
        </p>
        <p className="mt-3 text-sm text-muted-foreground/70">
          A checklist of tasks — with no clarity on what each task actually requires.
        </p>
      </Panel>

      <Panel className="border-primary/20 bg-surface p-6">
        <p className="label-caps">Karya AI asks</p>
        <div className="mt-4 space-y-2.5">
          {[
            "What exactly am I supposed to produce?",
            "Do I have everything I need?",
            "What is unclear?",
            "What needs to happen first?",
            "What proves this is complete?",
          ].map((q) => (
            <div key={q} className="flex items-start gap-2.5 text-sm">
              <Check
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ready"
                strokeWidth={2.2}
              />
              {q}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ── Use Case Switcher ─────────────────────────────────────────────────────────

const useCaseData = [
  {
    tab: "Office",
    input: "A two-line assignment from your manager",
    finds: ["Missing deadline", "Undefined format", "No audience specified"],
    result: "Clear deliverable before you start",
  },
  {
    tab: "Client Work",
    input: "Client brief + uploaded assets",
    finds: ["Missing logo (SVG required)", "Conflicting brand colors", "Unclear mobile requirements"],
    result: "Scoped project with questions ready to send",
  },
  {
    tab: "Research",
    input: "Research question + source documents",
    finds: ["Undefined evidence standard", "Missing dataset", "Ambiguous scope"],
    result: "Defined question and evidence criteria",
  },
  {
    tab: "Reports",
    input: "Report brief + reference data",
    finds: ["Required sections not listed", "Audience not specified", "Approval process unclear"],
    result: "Structured outline with completion criteria",
  },
  {
    tab: "Websites",
    input: "Website brief + assets",
    finds: ["Missing copy for 3 pages", "No CMS specified", "Sign-off process undefined"],
    result: "Asset checklist and scope confirmation",
  },
  {
    tab: "Handoffs",
    input: "Work in progress + context notes",
    finds: ["Unresolved decisions", "Missing files", "Open questions"],
    result: "Clean handoff packet with next steps",
  },
];

export function UseCaseSwitcher() {
  const [active, setActive] = useState(0);
  // active is always in-bounds: useState(0) and setActive uses valid indices from map
  const current = useCaseData[active]!;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {useCaseData.map((uc, i) => (
          <button
            key={uc.tab}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
              active === i
                ? "border-primary/30 bg-primary text-primary-foreground"
                : "border-hairline bg-surface text-muted-foreground hover:bg-muted/50",
            )}
          >
            {uc.tab}
          </button>
        ))}
      </div>

      {/* Demo */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-4">
          <p className="label-caps">Input</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.input}</p>
        </Panel>
        <Panel className="border-warn/20 bg-warn-soft/20 p-4">
          <p className="label-caps text-warn">Karya AI finds</p>
          <ul className="mt-3 space-y-2">
            {current.finds.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs leading-relaxed">
                <X className="mt-0.5 h-3 w-3 shrink-0 text-blocked" strokeWidth={2.2} />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="border-ready/20 bg-ready-soft/20 p-4">
          <p className="label-caps text-ready">Result</p>
          <p className="mt-2 text-sm leading-relaxed">{current.result}</p>
        </Panel>
      </div>
    </div>
  );
}

// ── Multi-Format Input ────────────────────────────────────────────────────────

const inputTypes = [
  { icon: FileText, label: "PDF" },
  { icon: FileText, label: "DOCX" },
  { icon: Mail, label: "Email" },
  { icon: FileText, label: "Brief" },
  { icon: FileText, label: "Image" },
  { icon: Folder, label: "Folder" },
  { icon: FileText, label: "Message" },
  { icon: FileText, label: "Spreadsheet" },
];

export function MultiFormatInput() {
  return (
    <div className="relative flex flex-wrap justify-center gap-3">
      {inputTypes.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2.5 shadow-sm"
        >
          <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.7} />
          <span className="text-xs font-medium">{label}</span>
        </div>
      ))}
      <div className="mt-2 flex w-full items-center justify-center gap-2">
        <div className="h-px flex-1 bg-hairline" />
        <div className="flex items-center gap-2 rounded-full border border-hairline bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
          <Zap className="h-3.5 w-3.5" strokeWidth={2} />
          Karya AI workspace
        </div>
        <div className="h-px flex-1 bg-hairline" />
      </div>
    </div>
  );
}

// ── Assumption Register ───────────────────────────────────────────────────────

export function AssumptionRegister() {
  return (
    <Panel className="p-5">
      <DemoTag />
      <p className="label-caps">Assumption register</p>
      <div className="mt-4 space-y-3">
        {[
          {
            assumption: '"final copy" refers to website-copy-v3.docx',
            risk: "Medium",
            action: "Confirm before publishing",
          },
          {
            assumption: "Brand colors from 2023 guidelines are current",
            risk: "Low",
            action: "Verify with client",
          },
        ].map(({ assumption, risk, action }) => (
          <div
            key={assumption}
            className="rounded-lg border border-warn/20 bg-warn-soft/30 p-4 space-y-2"
          >
            <p className="text-sm font-medium">"{assumption}"</p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>
                Risk: <span className="font-medium text-warn">{risk}</span>
              </span>
              <span>Action: {action}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Karya AI makes invisible assumptions visible before they become problems.
      </p>
    </Panel>
  );
}

// ── ReadinessPreview (hero sidebar) ───────────────────────────────────────────

const heroFindings = [
  { icon: AlertTriangle, tone: "text-warn", text: "Missing source document" },
  { icon: AlertTriangle, tone: "text-blocked", text: "Conflicting deadline" },
  { icon: AlertTriangle, tone: "text-warn", text: "Approval criteria unspecified" },
];

const heroNextSteps = ["Confirm evaluation criteria", "Review source files", "Compare requirements"];

export function ReadinessPreview() {
  return (
    <Panel className="p-6">
      <DemoTag />
      <p className="label-caps">Work readiness</p>
      <p className="mt-3 text-lg">Needs clarification</p>
      <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
        {heroFindings.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-sm">
            <f.icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", f.tone)} strokeWidth={1.8} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-hairline pt-5">
        <p className="label-caps">Next steps</p>
        <ol className="mt-3 space-y-2 text-sm">
          {heroNextSteps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}

// ── FlowStep ───────────────────────────────────────────────────────────────────

export function FlowStep({ label, last }: { label: string; last?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm">
        {label}
      </span>
      {last ? null : (
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
      )}
    </div>
  );
}

// ── AI Work Chat Demo ─────────────────────────────────────────────────────────

export function AIChatDemo() {
  return (
    <Panel className="p-0 overflow-hidden">
      <DemoTag />
      <div className="border-b border-hairline px-5 py-3">
        <p className="label-caps">AI Work Chat</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Understands current work, files, requirements, decisions, and history.
        </p>
      </div>
      <div className="space-y-4 p-5">
        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
            Can I start this?
          </div>
        </div>
        {/* AI response */}
        <div className="flex gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface">
            <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          </div>
          <div className="max-w-sm space-y-2.5 rounded-2xl rounded-tl-sm border border-hairline bg-muted/30 px-4 py-3">
            <p className="text-sm font-medium text-blocked">Not yet.</p>
            <p className="text-sm leading-relaxed">Two required inputs are missing:</p>
            <div className="space-y-1.5">
              {["Evaluation criteria", "Budget ceiling"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <X className="h-3 w-3 text-blocked" strokeWidth={2.2} />
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              You can compare the proposals provisionally, but a reliable recommendation cannot be
              made until these are confirmed.
            </p>
            <div className="border-t border-hairline pt-2.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Source
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on requirements extracted from the assignment email and Proposal-A.pdf.
              </p>
            </div>
          </div>
        </div>
        {/* Follow-up */}
        <div className="flex justify-end">
          <div className="max-w-xs rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
            Generate a message asking for the missing information.
          </div>
        </div>
        {/* Generated message */}
        <div className="flex gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface">
            <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          </div>
          <div className="max-w-sm rounded-2xl rounded-tl-sm border border-ready/30 bg-ready-soft/30 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-ready">Clarification message generated</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              "To complete the supplier recommendation, I need two things: (1) the evaluation
              criteria used to rank suppliers, and (2) the budget ceiling for the selected
              vendor. Could you confirm both before Friday?"
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ── Requirement Table ─────────────────────────────────────────────────────────

export function RequirementTable() {
  const rows = [
    {
      req: "Compare 3 suppliers",
      evidence: "3 proposal files",
      status: "Complete" as const,
      source: "Assignment email",
    },
    {
      req: "Include vendor references",
      evidence: "None found",
      status: "Missing" as const,
      source: "Proposal-A.pdf · p.4",
    },
    {
      req: "Submit by Friday",
      evidence: "Two conflicting dates",
      status: "Conflict" as const,
      source: "Email + Brief",
    },
  ];

  const statusCfg = {
    Complete: { cls: "bg-ready-soft text-ready", label: "Complete" },
    Missing: { cls: "bg-blocked-soft text-blocked", label: "Missing" },
    Conflict: { cls: "bg-warn-soft text-warn", label: "Clarification needed" },
  };

  return (
    <Panel className="overflow-hidden p-0">
      <DemoTag />
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-hairline bg-muted/30">
              <th className="px-4 py-3 text-left label-caps">Requirement</th>
              <th className="px-4 py-3 text-left label-caps">Evidence</th>
              <th className="px-4 py-3 text-left label-caps">Source</th>
              <th className="px-4 py-3 text-left label-caps">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((row) => (
              <tr key={row.req} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{row.req}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.evidence}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.source}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                      statusCfg[row.status].cls,
                    )}
                  >
                    {statusCfg[row.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ── Source-Backed Callout ─────────────────────────────────────────────────────

export function SourceBackedDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel className="space-y-3 p-5">
        <p className="label-caps">Finding</p>
        <p className="text-sm">"Delivery required by Friday."</p>
        <div className="border-t border-hairline pt-3">
          <p className="label-caps text-ready">Source</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
              Email · August 10
            </div>
            <p className="ml-5 text-xs italic text-muted-foreground">
              "Delivery required by Friday"
            </p>
          </div>
        </div>
      </Panel>
      <Panel className="space-y-3 p-5">
        <p className="label-caps">Finding</p>
        <p className="text-sm">"Budget ceiling not specified."</p>
        <div className="border-t border-hairline pt-3">
          <p className="label-caps text-blocked">No source found</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Budget was not mentioned in the assignment email, any proposal, or the brief. This is
            flagged as missing information.
          </p>
        </div>
      </Panel>
    </div>
  );
}

// ── Workspace Section ─────────────────────────────────────────────────────────

export function WorkspaceSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          title: "My Work",
          desc: "Active, blocked, waiting, completed, and needs-attention views — organized around readiness, not a generic kanban.",
          items: ["Active", "Blocked", "Waiting", "Completed", "Needs attention"],
          color: "text-info",
          bg: "bg-info-soft",
        },
        {
          title: "Templates",
          desc: "Reusable workflows for recurring work types that carry structure, questions, and evidence requirements.",
          items: ["Reports", "Research", "Presentations", "Websites", "Client work", "Data tasks"],
          color: "text-ready",
          bg: "bg-ready-soft",
        },
        {
          title: "Work History",
          desc: "The full evolution of a work item — every requirement change, decision, and clarification is preserved.",
          items: [
            "Original request",
            "Requirement added",
            "Question answered",
            "Decision recorded",
            "Final verification",
          ],
          color: "text-muted-foreground",
          bg: "bg-muted",
        },
      ].map((card) => (
        <Panel key={card.title} className="space-y-3 p-5">
          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", card.bg, card.color)}>
            {card.title}
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
          <ul className="space-y-1.5">
            {card.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs">
                <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

// ── Privacy Section ───────────────────────────────────────────────────────────

export function PrivacySection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: "Temporary processing",
          desc: "Files are processed to extract structure and evidence. They are not stored beyond what you explicitly save.",
        },
        {
          title: "Deletion controls",
          desc: "You can delete uploaded files and extracted data at any time.",
        },
        {
          title: "Retention settings",
          desc: "Configure how long your work data is retained.",
        },
        {
          title: "Your files, your control",
          desc: "Karya AI does not claim ownership of your work or use it to train models.",
        },
      ].map((item) => (
        <div key={item.title} className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
            <p className="text-sm font-medium">{item.title}</p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

// ── Integrations Section ──────────────────────────────────────────────────────

export function IntegrationsSection() {
  const planned = [
    "Gmail", "Outlook", "Google Drive", "OneDrive",
    "Dropbox", "Slack", "Teams", "Notion", "Jira",
  ];
  return (
    <div className="space-y-4">
      <p className="label-caps text-muted-foreground">Planned integrations</p>
      <div className="flex flex-wrap gap-2">
        {planned.map((name) => (
          <span
            key={name}
            className="rounded-full border border-hairline bg-surface px-3 py-1 text-xs text-muted-foreground"
          >
            {name}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        These integrations are in development. They do not currently exist in the product.
      </p>
    </div>
  );
}
