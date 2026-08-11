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

// ── Hero Demonstration ─────────────────────────────────────────────────────────

const heroStages = [
  {
    label: "Messy request",
    rightLabel: "Analysing…",
    findings: [] as string[],
    missing: [] as string[],
    status: null as string | null,
  },
  {
    label: "Extracting requirements",
    rightLabel: "Requirements found",
    findings: ["Compare 3 suppliers", "Include risks", "Recommend 1 vendor", "Management summary"],
    missing: [] as string[],
    status: null as string | null,
  },
  {
    label: "Detecting gaps",
    rightLabel: "Missing information",
    findings: ["Compare 3 suppliers", "Include risks", "Recommend 1 vendor", "Management summary"],
    missing: ["Evaluation criteria", "Budget ceiling"],
    status: null as string | null,
  },
  {
    label: "Readiness assessment",
    rightLabel: "Work readiness",
    findings: ["Compare 3 suppliers", "Include risks", "Recommend 1 vendor", "Management summary"],
    missing: ["Evaluation criteria", "Budget ceiling"],
    status: "Needs clarification",
  },
];

export function HeroDemo() {
  const [stage, setStage] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setProcessing(true);
      setTimeout(() => {
        setStage((s) => (s + 1) % heroStages.length);
        setProcessing(false);
      }, 900);
    };
    const t = setInterval(cycle, 3200);
    return () => clearInterval(t);
  }, []);

  // stage is always in-bounds: useState(0) and setStage uses modulo on heroStages.length
  const current = heroStages[stage]!;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3">
      {/* LEFT – messy request */}
      <Panel className="space-y-3 p-4">
        <DemoTag />
        <p className="label-caps">Request</p>
        <p className="rounded-lg border border-hairline bg-muted/50 px-3 py-2.5 text-[13px] leading-relaxed text-muted-foreground">
          "Review the three supplier proposals and prepare a recommendation for management by
          Friday."
        </p>
        <div className="space-y-1.5">
          {[
            { icon: FileText, name: "Proposal-A.pdf" },
            { icon: FileText, name: "Proposal-B.pdf" },
            { icon: FileText, name: "Proposal-C.pdf" },
            { icon: Mail, name: "Email instructions" },
            { icon: FileText, name: "Previous notes" },
          ].map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-2.5 py-1.5"
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.7} />
              <span className="truncate text-xs">{name}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* CENTER – processing indicator */}
      <div className="flex flex-col items-center gap-1.5 pt-10">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface transition-all duration-500",
            processing && "border-primary/40 bg-primary/5",
          )}
        >
          <Zap
            className={cn(
              "h-3.5 w-3.5 transition-colors duration-500",
              processing ? "text-primary" : "text-muted-foreground",
            )}
            strokeWidth={1.8}
          />
        </div>
        <div className="h-8 w-px bg-hairline" />
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
      </div>

      {/* RIGHT – progressive results */}
      <Panel className="min-h-[240px] p-4">
        <p className="label-caps">{current.rightLabel}</p>

        {current.findings.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Deliverables
            </p>
            {current.findings.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs">
                <Check
                  className="h-3 w-3 shrink-0 text-ready"
                  strokeWidth={2.2}
                />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {current.missing.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Missing</p>
            {current.missing.map((m) => (
              <div key={m} className="flex items-center gap-2 text-xs">
                <X className="h-3 w-3 shrink-0 text-blocked" strokeWidth={2.2} />
                <span className="text-muted-foreground">{m}</span>
              </div>
            ))}
          </div>
        )}

        {current.status && (
          <div className="mt-4 border-t border-hairline pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-info-soft px-2.5 py-0.5 text-[11px] font-medium text-info">
              <HelpCircle className="h-3 w-3" strokeWidth={2} />
              {current.status}
            </span>
          </div>
        )}

        {current.findings.length === 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-muted-foreground/40 transition-all duration-300",
                processing && "animate-pulse bg-primary",
              )}
            />
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-muted-foreground/40 transition-all duration-500",
                processing && "animate-pulse bg-primary",
              )}
            />
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-muted-foreground/40 transition-all duration-700",
                processing && "animate-pulse bg-primary",
              )}
            />
          </div>
        )}
      </Panel>
    </div>
  );
}

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
    phase: "Understand",
    color: "text-info",
    bg: "bg-info-soft",
    features: [
      "Request extraction",
      "Deliverable extraction",
      "Requirement extraction",
      "Stakeholder detection",
      "Deadline detection",
    ],
  },
  {
    phase: "Prepare",
    color: "text-warn",
    bg: "bg-warn-soft",
    features: [
      "Missing information detection",
      "Ambiguity detection",
      "Dependency detection",
      "Risk detection",
      "Assumption register",
    ],
  },
  {
    phase: "Execute",
    color: "text-ready",
    bg: "bg-ready-soft",
    features: [
      "Ordered work plan",
      "Task dependencies",
      "Evidence requirements",
      "Questions",
      "Clarification messages",
    ],
  },
  {
    phase: "Verify",
    color: "text-blocked",
    bg: "bg-blocked-soft",
    features: [
      "Requirement verification",
      "Evidence mapping",
      "Missing deliverables",
      "Unsupported claims",
      "Completion tests",
    ],
  },
  {
    phase: "Handoff",
    color: "text-muted-foreground",
    bg: "bg-muted",
    features: [
      "Handoff packet",
      "Open issues",
      "Decisions",
      "Authoritative files",
      "Next steps",
    ],
  },
];

export function FeatureArchitecture() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {featureGroups.map((group) => (
        <div key={group.phase} className="space-y-2">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
              group.bg,
              group.color,
            )}
          >
            {group.phase}
          </span>
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
