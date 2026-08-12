import { EmptyState, SourceTag, StatusPill, type Tone } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { stateLabels, type ReqStatus, type StepStatus, type WorkItem } from "@/lib/work";

export const workTabs = [
  "Overview",
  "Readiness",
  "Requirements",
  "Plan",
  "Questions",
  "Files",
  "Verify",
  "Handoff",
] as const;

export type WorkTab = (typeof workTabs)[number];

const reqTone: Record<ReqStatus, Tone> = {
  complete: "ready",
  partial: "warn",
  missing: "blocked",
  conflict: "blocked",
};

const stepTone: Record<StepStatus, Tone> = {
  blocked: "blocked",
  ready: "ready",
  waiting: "warn",
  "not-started": "neutral",
  done: "ready",
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="label-caps">{label}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function WorkTabPanel({ work, tab }: { work: WorkItem; tab: WorkTab }) {
  if (tab === "Overview") {
    return (
      <div className="space-y-9">
        <Section label="Readiness Status">
          <div className="rounded-xl border border-hairline bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <StatusPill
                tone={
                  work.state === "ready"
                    ? "ready"
                    : work.state === "ready-with-warnings"
                      ? "warn"
                      : work.state === "blocked"
                        ? "blocked"
                        : "info"
                }
              >
                {stateLabels[work.state]}
              </StatusPill>
              <span className="text-xs text-muted-foreground">
                Evaluated from {work.findings?.length || 0} findings
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.findings && work.findings.length > 0
                ? work.findings[0].explanation
                : "All required inputs are available and no blocking issues were detected."}
            </p>
            {work.recommendedNextAction ? (
              <div className="rounded-md bg-accent/50 p-3 text-xs space-y-1">
                <p className="font-medium">Recommended next action</p>
                <p className="text-muted-foreground">{work.recommendedNextAction}</p>
              </div>
            ) : null}
          </div>
        </Section>
        <Section label="What is being asked">
          <p className="text-sm leading-relaxed">{work.description}</p>
        </Section>
      </div>
    );
  }

  if (tab === "Readiness") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-hairline bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-caps">Readiness Engine</p>
              <h2 className="text-lg font-medium mt-1">{stateLabels[work.state]}</h2>
            </div>
            <StatusPill
              tone={
                work.state === "ready"
                  ? "ready"
                  : work.state === "ready-with-warnings"
                    ? "warn"
                    : work.state === "blocked"
                      ? "blocked"
                      : "info"
              }
            >
              {stateLabels[work.state]}
            </StatusPill>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Readiness Engine continuously evaluates your work package against requirements,
            constraints, assumptions, and sources.
          </p>
          {work.recommendedNextAction ? (
            <div className="rounded-lg border border-hairline bg-accent/40 p-4 space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Recommended Next Action
              </p>
              <p className="text-sm font-medium">{work.recommendedNextAction}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <h2 className="label-caps">Findings ({work.findings?.length || 0})</h2>
          {!work.findings || work.findings.length === 0 ? (
            <EmptyState
              title="No readiness findings."
              description="No blocking issues, contradictions, or assumptions detected."
            />
          ) : (
            <div className="divide-y divide-hairline border-y border-hairline bg-surface rounded-xl border">
              {work.findings.map((f) => (
                <div key={f.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase text-foreground">
                        {f.type}
                      </span>
                      <p className="text-sm font-medium">{f.title}</p>
                    </div>
                    <StatusPill
                      tone={
                        f.severity === "high" || f.severity === "critical"
                          ? "blocked"
                          : f.severity === "medium"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {f.severity}
                    </StatusPill>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.explanation}</p>
                  <p className="text-xs text-muted-foreground/80 italic">
                    Why it matters: {f.whyItMatters}
                  </p>
                  {f.sourceReference ? (
                    <p className="text-xs text-muted-foreground">Source: {f.sourceReference}</p>
                  ) : null}
                  <div className="pt-2 flex items-center justify-between border-t border-hairline text-xs">
                    <span className="font-medium text-foreground">
                      Action: {f.recommendedAction}
                    </span>
                    <span className="rounded bg-accent px-2 py-1 text-muted-foreground">
                      Status: {f.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (tab === "Requirements") {
    if (work.requirements.length === 0) {
      return (
        <EmptyState
          title="No requirements yet."
          description="Requirements will appear after Karya AI analyzes your work."
        />
      );
    }
    return (
      <div className="divide-y divide-hairline border-y border-hairline">
        {work.requirements.map((r) => (
          <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5">
            <div className="min-w-0 space-y-1.5">
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.why}</p>
              <SourceTag kind={r.source.kind} label={r.source.label} />
            </div>
            <StatusPill tone={reqTone[r.status]}>{r.status}</StatusPill>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Plan") {
    if (work.plan.length === 0) {
      return (
        <EmptyState
          title="No plan yet."
          description="Your work plan will appear after the request is analyzed."
        />
      );
    }
    return (
      <ol className="divide-y divide-hairline border-y border-hairline">
        {work.plan.map((step, i) => (
          <li key={step.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5">
            <div className="flex min-w-0 gap-3">
              <span className="mt-0.5 font-mono text-xs text-muted-foreground">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                {step.note ? (
                  <p className="mt-1 text-sm text-muted-foreground">{step.note}</p>
                ) : null}
              </div>
            </div>
            <StatusPill tone={stepTone[step.status]}>{step.status}</StatusPill>
          </li>
        ))}
      </ol>
    );
  }

  if (tab === "Questions") {
    if (work.questions.length === 0) {
      return (
        <EmptyState
          title="No unanswered questions."
          description="Questions appear when something must be clarified before the work can proceed."
        />
      );
    }
    return (
      <div className="divide-y divide-hairline border-y border-hairline">
        {work.questions.map((q) => (
          <div key={q.id} className="py-5">
            <p className="text-sm font-medium">{q.question}</p>
            <p className="mt-1 text-sm text-muted-foreground">{q.why}</p>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Files") {
    if (work.files.length === 0) {
      return (
        <EmptyState
          title="No files added to this work."
          description="Add the source documents, working files and final deliverables here."
          action={<Button size="sm">Upload files</Button>}
        />
      );
    }
    return (
      <div className="divide-y divide-hairline border-y border-hairline">
        {work.files.map((f) => (
          <div key={f.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm">{f.name}</p>
              {f.meta ? <p className="text-xs text-muted-foreground">{f.meta}</p> : null}
            </div>
            <StatusPill tone={f.role === "Missing" ? "blocked" : "neutral"}>{f.role}</StatusPill>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "Verify") {
    if (work.verify.length === 0) {
      return (
        <EmptyState
          title="Nothing to verify yet."
          description="Upload your completed work to verify it against the original request."
          action={<Button size="sm">Upload completed work</Button>}
        />
      );
    }
    return (
      <div className="divide-y divide-hairline border-y border-hairline">
        {work.verify.map((c) => (
          <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5">
            <div className="min-w-0">
              <p className="text-sm font-medium">{c.title}</p>
              {c.note ? <p className="mt-1 text-sm text-muted-foreground">{c.note}</p> : null}
            </div>
            <StatusPill
              tone={
                c.status === "satisfied" ? "ready" : c.status === "missing" ? "blocked" : "warn"
              }
            >
              {c.status}
            </StatusPill>
          </div>
        ))}
      </div>
    );
  }

  return (
    <EmptyState
      title="No handoff prepared."
      description="A handoff packet is created from completed work, unresolved issues, files and next steps."
    />
  );
}
