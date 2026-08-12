import { EmptyState, SourceTag, StatusPill, type Tone } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  stateLabels,
  updateQuestionAnswer,
  type Question,
  type QuestionPriority,
  type ReqStatus,
  type StepStatus,
  type WorkItem,
} from "@/lib/work";
import { cn } from "@/lib/utils";
import { Check, Clipboard, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

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
    return <QuestionsTab work={work} />;
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

function QuestionsTab({ work }: { work: WorkItem }) {
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [selectedTone, setSelectedMessageTone] = useState("Professional");

  if (work.questions.length === 0) {
    return (
      <EmptyState
        title="No unanswered questions."
        description="Questions appear when something must be clarified before the work can proceed."
      />
    );
  }

  const priorities: QuestionPriority[] = [
    "MUST ANSWER BEFORE STARTING",
    "CAN ANSWER LATER",
    "OPTIONAL",
  ];

  const handleAnswer = (qId: string) => {
    updateQuestionAnswer(work.id, qId, answer);
    setAnsweringId(null);
    setAnswer("");
  };

  const generateAskMessage = (questions: Question[]) => {
    setIsGenerating(true);
    // Simulate AI message generation
    setTimeout(() => {
      const qList = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");
      const msg = `Hi, before I proceed with the "${work.title}" project, could you please clarify the following:\n\n${qList}\n\nThis will help ensure the work is accurate and meets your expectations. Thanks!`;
      setGeneratedMessage(msg);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="label-caps">
          {work.questions.filter((q) => q.state !== "resolved").length} Active Questions
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateAskMessage(work.questions.filter((q) => q.state !== "resolved"))}
        >
          <Send className="mr-2 h-3.5 w-3.5" />
          Ask Boss/Client
        </Button>
      </div>

      <div className="space-y-12">
        {priorities.map((priority) => {
          const items = work.questions.filter((q) => q.priority === priority);
          if (items.length === 0) return null;

          return (
            <section key={priority} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3
                  className={cn(
                    "text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded",
                    priority === "MUST ANSWER BEFORE STARTING"
                      ? "bg-blocked-soft text-blocked"
                      : priority === "CAN ANSWER LATER"
                        ? "bg-warn-soft text-warn"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {priority}
                </h3>
                <div className="h-px flex-1 bg-hairline" />
              </div>

              <div className="divide-y divide-hairline border-y border-hairline">
                {items.map((q) => (
                  <div key={q.id} className="py-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                        <p className="text-xs text-muted-foreground">{q.why}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            Category: {q.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            Impact: {q.impact}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {q.state === "resolved" ? (
                          <StatusPill tone="ready">Resolved</StatusPill>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAnsweringId(q.id);
                                setAnswer(q.answer || "");
                              }}
                            >
                              Answer
                            </Button>
                            <StatusPill
                              tone={priority === "MUST ANSWER BEFORE STARTING" ? "blocked" : "warn"}
                            >
                              {q.status}
                            </StatusPill>
                          </>
                        )}
                      </div>
                    </div>

                    {q.state === "resolved" && q.answer && (
                      <div className="rounded-lg bg-accent/30 p-4 border border-hairline">
                        <p className="text-xs font-medium uppercase text-muted-foreground mb-2">
                          Answer
                        </p>
                        <p className="text-sm text-foreground">{q.answer}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 italic">
                          Source: {q.answerSource}
                        </p>
                      </div>
                    )}

                    {answeringId === q.id && (
                      <div className="space-y-3 p-4 rounded-lg border border-input bg-surface">
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type the answer here..."
                          className="w-full min-h-[100px] bg-transparent text-sm outline-none resize-y"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setAnsweringId(null)}>
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAnswer(q.id)}
                            disabled={!answer.trim()}
                          >
                            Save Answer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Dialog open={!!generatedMessage} onOpenChange={(open) => !open && setGeneratedMessage("")}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask Boss / Client</DialogTitle>
            <DialogDescription>
              We've drafted a professional message to help you get the answers you need.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">Tone:</span>
              {["Professional", "Direct", "Friendly", "Urgent", "Formal"].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedMessageTone(tone)}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border transition-colors",
                    selectedTone === tone
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-hairline hover:border-muted-foreground",
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full min-h-[250px] p-4 rounded-lg border border-hairline bg-muted/20 text-sm leading-relaxed font-sans outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(generatedMessage)}
              >
                <Clipboard className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneratedMessage("")}>
              Close
            </Button>
            <Button
              onClick={() => {
                // In a real app, this might trigger a share or copy
                navigator.clipboard.writeText(generatedMessage);
                setGeneratedMessage("");
              }}
            >
              <Check className="mr-2 h-3.5 w-3.5" />
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
