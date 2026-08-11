import { Link } from "@tanstack/react-router";
import { ArrowRight, Copy, FileText } from "lucide-react";
import { useState } from "react";

import { EmptyState, SourceTag, StatusPill, type Tone } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { questions as allQuestions } from "@/lib/mock-data";
import type { ReqStatus, Requirement, StepStatus, WorkItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const reqTone: Record<ReqStatus, Tone> = {
  complete: "ready",
  partial: "warn",
  missing: "blocked",
  conflict: "blocked",
};

const reqWord: Record<ReqStatus, string> = {
  complete: "Complete",
  partial: "Partial",
  missing: "Missing",
  conflict: "Conflict",
};

const stepTone: Record<StepStatus, Tone> = {
  blocked: "blocked",
  ready: "ready",
  waiting: "warn",
  "not-started": "neutral",
  done: "neutral",
};

const stepWord: Record<StepStatus, string> = {
  blocked: "Blocked",
  ready: "Ready",
  waiting: "Waiting",
  "not-started": "Not started",
  done: "Done",
};

function readinessTone(readiness: string): Tone {
  if (readiness.startsWith("BLOCKED")) return "blocked";
  if (readiness.startsWith("READY TO START")) return "ready";
  if (readiness.startsWith("READY")) return "info";
  return "warn";
}

export function Overview({ work, onTab }: { work: WorkItem; onTab: (t: string) => void }) {
  const done = work.requirements.filter((r) => r.status === "complete").length;
  const unresolved = allQuestions.filter(
    (q) => q.workId === work.id && q.state !== "resolved",
  ).length;

  return (
    <div className="space-y-12">
      <section>
        <p className="label-caps">Readiness</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "text-xl font-medium tracking-tight",
              readinessTone(work.readiness) === "blocked" && "text-blocked",
              readinessTone(work.readiness) === "ready" && "text-ready",
              readinessTone(work.readiness) === "warn" && "text-warn",
              readinessTone(work.readiness) === "info" && "text-info",
            )}
          >
            {work.readiness}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{work.readinessNote}</p>

        {work.issues.length > 0 ? (
          <div className="mt-5 divide-y divide-hairline border-y border-hairline">
            {work.issues.map((issue) => (
              <div key={issue.id} className="py-5">
                <p className="text-sm font-medium">{issue.problem}</p>
                <p className="mt-1 text-sm text-muted-foreground">{issue.detail}</p>
                <p className="mt-2 text-sm">
                  <span className="label-caps mr-2">Action</span>
                  {issue.action}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <p className="label-caps">What I understand</p>
        <p className="mt-2.5 max-w-xl text-sm leading-relaxed">{work.understanding}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Confirm</Button>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-hairline bg-surface px-5 py-5">
        <p className="label-caps">Next best action</p>
        <p className="mt-2 text-[15px] font-medium">{work.nextAction.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{work.nextAction.detail}</p>
        <Button size="sm" className="mt-4" onClick={() => onTab("questions")}>
          Resolve
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </section>

      <section>
        <p className="label-caps">Progress</p>
        <dl className="mt-3 grid gap-y-4 border-t border-hairline pt-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Requirements</dt>
            <dd className="mt-1 text-sm">
              {done} / {work.requirements.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Questions</dt>
            <dd className="mt-1 text-sm">{unresolved} unresolved</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Evidence</dt>
            <dd className="mt-1 text-sm">{work.files.filter((f) => f.role !== "Missing").length} items</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export function Requirements({ work }: { work: WorkItem }) {
  const [open, setOpen] = useState<Requirement | null>(null);

  return (
    <div>
      <p className="text-sm text-muted-foreground">What this work must satisfy.</p>
      <div className="mt-5 divide-y divide-hairline border-y border-hairline">
        {work.requirements.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setOpen(r)}
            className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-1 py-4 text-left transition-colors hover:bg-accent/40"
          >
            <span className="min-w-0 truncate text-sm">{r.title}</span>
            <StatusPill tone={reqTone[r.status]}>{reqWord[r.status]}</StatusPill>
          </button>
        ))}
      </div>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full px-6 sm:max-w-md">
          {open ? (
            <>
              <SheetHeader className="px-0">
                <SheetTitle className="text-base font-medium">{open.title}</SheetTitle>
              </SheetHeader>
              <div className="space-y-6">
                <div>
                  <p className="label-caps">Status</p>
                  <div className="mt-2">
                    <StatusPill tone={reqTone[open.status]}>{reqWord[open.status]}</StatusPill>
                  </div>
                </div>
                <div>
                  <p className="label-caps">Why</p>
                  <p className="mt-2 text-sm">{open.why}</p>
                </div>
                <div>
                  <p className="label-caps">Evidence</p>
                  <p className="mt-2 text-sm text-muted-foreground">{open.evidence}</p>
                </div>
                <div>
                  <p className="label-caps">Source</p>
                  <div className="mt-2">
                    <SourceTag kind={open.source.kind} label={open.source.label} />
                  </div>
                </div>
                <Button size="sm">{open.action}</Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Plan({ work }: { work: WorkItem }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">The order things have to happen in.</p>
      <ol className="mt-6 space-y-1">
        {work.plan.map((step, i) => (
          <li key={step.id}>
            <div
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border px-4 py-3.5",
                step.status === "ready"
                  ? "border-hairline bg-surface"
                  : "border-transparent bg-transparent",
              )}
            >
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm",
                      step.status === "not-started" && "text-muted-foreground",
                      step.status === "done" && "text-muted-foreground line-through",
                    )}
                  >
                    {step.title}
                  </p>
                  {step.note ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.note}</p>
                  ) : null}
                </div>
              </div>
              <StatusPill tone={stepTone[step.status]}>{stepWord[step.status]}</StatusPill>
            </div>
            {i < work.plan.length - 1 ? (
              <div className="ml-[1.35rem] h-4 w-px bg-hairline" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function WorkQuestions({ work }: { work: WorkItem }) {
  const items = allQuestions.filter((q) => q.workId === work.id);
  if (items.length === 0) {
    return (
      <EmptyState
        title="No unresolved questions."
        description="Nothing about this work is waiting on someone else."
      />
    );
  }
  const sections = [
    { key: "must", label: "Must answer" },
    { key: "waiting", label: "Waiting for response" },
    { key: "resolved", label: "Resolved" },
  ] as const;

  return (
    <div className="space-y-9">
      {sections.map((s) => {
        const group = items.filter((q) => q.state === s.key);
        if (group.length === 0) return null;
        return (
          <section key={s.key}>
            <h3 className="label-caps">{s.label}</h3>
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {group.map((q) => (
                <div key={q.id} className="py-4">
                  <p className="text-sm font-medium">{q.question}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{q.why}</p>
                  {s.key !== "resolved" ? (
                    <Button size="sm" variant="outline" className="mt-3">
                      Generate message
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function Files({ work }: { work: WorkItem }) {
  const finals = work.files.filter((f) => f.role === "Final" || f.role === "Working file");
  if (work.files.length === 0) {
    return (
      <EmptyState title="No files yet." description="Add the documents related to this work." />
    );
  }
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        What each file is, and which one is authoritative.
      </p>
      <div className="mt-5 divide-y divide-hairline border-y border-hairline">
        {work.files.map((f) => (
          <div key={f.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
              <div className="min-w-0">
                <p className="truncate text-sm">{f.name}</p>
                {f.meta ? <p className="text-xs text-muted-foreground">{f.meta}</p> : null}
              </div>
            </div>
            <StatusPill
              tone={f.role === "Missing" ? "blocked" : f.role === "Final" ? "ready" : "neutral"}
            >
              {f.role}
            </StatusPill>
          </div>
        ))}
      </div>
      {finals.length > 1 ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-surface px-4 py-3">
          <p className="text-sm">{finals.length} possible final versions found</p>
          <Button size="sm" variant="outline">
            Compare versions
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function Verify({ work }: { work: WorkItem }) {
  if (work.verify.checks.length === 0) {
    return (
      <EmptyState
        title="Nothing to verify yet."
        description="Upload the finished work when you're ready."
        action={<Button size="sm">Upload final work</Button>}
      />
    );
  }
  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-muted-foreground">
          Does the finished work actually satisfy the original request?
        </p>
        <p
          className={cn(
            "mt-6 text-2xl font-medium tracking-tight",
            work.verify.status === "READY" ? "text-ready" : "text-blocked",
          )}
        >
          {work.verify.status}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{work.verify.note}</p>
      </div>

      <section>
        <h3 className="label-caps">Completion test</h3>
        <div className="mt-3 divide-y divide-hairline border-y border-hairline">
          {work.verify.checks.map((c) => (
            <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-4">
              <div className="min-w-0">
                <p className="text-sm">{c.title}</p>
                {c.note ? <p className="mt-1 text-sm text-muted-foreground">{c.note}</p> : null}
              </div>
              <StatusPill
                tone={c.status === "satisfied" ? "ready" : c.status === "review" ? "warn" : "blocked"}
              >
                {c.status === "satisfied" ? "Satisfied" : c.status === "review" ? "Needs review" : "Missing"}
              </StatusPill>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Handoff({ work }: { work: WorkItem }) {
  const h = work.handoff;
  const blocks: { label: string; items?: string[]; text?: string }[] = [
    { label: "What was requested", text: h.requested },
    { label: "What is complete", items: h.complete },
    { label: "What remains", items: h.remains },
    { label: "Important decisions", items: h.decisions },
    { label: "Files", items: h.files },
    { label: "Risks", items: h.risks },
    { label: "Next person should know", text: h.nextPerson },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium">Ready to hand off?</h2>
      <div className="mt-6 divide-y divide-hairline rounded-lg border border-hairline bg-surface px-5">
        {blocks.map((b) => (
          <div key={b.label} className="py-5">
            <p className="label-caps">{b.label}</p>
            {b.text ? <p className="mt-2 max-w-xl text-sm leading-relaxed">{b.text}</p> : null}
            {b.items ? (
              b.items.length > 0 ? (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {b.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                      {i}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">None recorded.</p>
              )
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button size="sm">Generate handoff</Button>
        <Button size="sm" variant="outline">
          <Copy className="h-3.5 w-3.5" />
          Copy summary
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link to="/handoffs">All handoffs</Link>
        </Button>
      </div>
    </div>
  );
}