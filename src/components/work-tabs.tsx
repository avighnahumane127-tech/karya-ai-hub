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
  addEvidence,
  getEvidenceStats,
  getRequirementEvidence,
  getRequirementStats,
  stateLabels,
  updateQuestionAnswer,
  updateRequirement,
  type EvidenceConfidence,
  type EvidenceType,
  type Question,
  type QuestionPriority,
  type ReqStatus,
  type Requirement,
  type RequirementPriority,
  type RequirementType,
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
  "Evidence",
  "Plan",
  "Questions",
  "Files",
  "Verify",
  "Handoff",
] as const;

export type WorkTab = (typeof workTabs)[number];

const reqTone: Record<string, Tone> = {
  complete: "ready",
  partial: "warn",
  missing: "blocked",
  conflict: "blocked",
  "NOT STARTED": "neutral",
  "IN PROGRESS": "info",
  SATISFIED: "ready",
  "PARTIALLY SATISFIED": "warn",
  MISSING: "blocked",
  CONTRADICTORY: "blocked",
  "NEEDS REVIEW": "warn",
  WAIVED: "neutral",
};

const stepTone: Record<StepStatus, Tone> = {
  blocked: "blocked",
  ready: "ready",
  waiting: "warn",
  "not-started": "neutral",
  done: "ready",
  "in-progress": "info",
  skipped: "neutral",
  "needs-review": "warn",
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
                ? work.findings[0]?.explanation
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
        <Section label="Requirements & Evidence">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-hairline bg-surface p-4">
              <p className="text-sm font-medium">{work.requirements.length} requirements</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {getRequirementStats(work)["SATISFIED"] || 0} satisfied ·{" "}
                {getRequirementStats(work)["MISSING"] || 0} missing ·{" "}
                {getRequirementStats(work)["NEEDS REVIEW"] || 0} need review
              </p>
            </div>
            <div className="rounded-lg border border-hairline bg-surface p-4">
              <p className="text-sm font-medium">{getEvidenceStats(work).total} evidence items</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {getEvidenceStats(work).strong} strong · {getEvidenceStats(work).partial} partial ·{" "}
                {getEvidenceStats(work).none} without support
              </p>
            </div>
          </div>
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
    return <RequirementsTab work={work} />;
  }

  if (tab === "Evidence") {
    return <EvidenceTab work={work} />;
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

function requirementStatusLabel(status: ReqStatus) {
  if (status === "complete") return "SATISFIED";
  if (status === "partial") return "PARTIALLY SATISFIED";
  if (status === "missing") return "MISSING";
  if (status === "conflict") return "CONTRADICTORY";
  return status;
}

function RequirementsTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const stats = getRequirementStats(work);
  const attention = work.requirements.filter((requirement) => {
    const status = requirementStatusLabel(requirement.status);
    return (
      status === "MISSING" ||
      status === "CONTRADICTORY" ||
      status === "NEEDS REVIEW" ||
      requirement.priority === "CRITICAL"
    );
  });

  if (work.requirements.length === 0) {
    return (
      <EmptyState
        title="No requirements yet."
        description="Requirements will appear after Karya AI analyzes this Work's request and sources."
      />
    );
  }

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-caps">Requirements</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {work.requirements.length} total · {stats["SATISFIED"] || 0} satisfied ·{" "}
              {stats["PARTIALLY SATISFIED"] || 0} partial · {stats["MISSING"] || 0} missing ·{" "}
              {stats["NEEDS REVIEW"] || 0} needs review
            </p>
          </div>
          <StatusPill tone={attention.length > 0 ? "warn" : "ready"}>
            {attention.length > 0 ? `${attention.length} need attention` : "On track"}
          </StatusPill>
        </div>
        {attention.length > 0 ? (
          <div className="mt-4 space-y-2 border-t border-hairline pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Attention needed
            </p>
            {attention.slice(0, 3).map((requirement) => (
              <button
                type="button"
                key={requirement.id}
                className="block w-full rounded-md bg-accent/40 px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => setExpandedId(requirement.id)}
              >
                <span className="font-medium">{requirement.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {requirementStatusLabel(requirement.status)}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
        {work.requirements.map((requirement) => {
          const status = requirementStatusLabel(requirement.status);
          const linkedEvidence = getRequirementEvidence(work, requirement.id);
          const isExpanded = expandedId === requirement.id;
          return (
            <div key={requirement.id} className="p-5">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : requirement.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{requirement.title}</p>
                      {requirement.type ? (
                        <span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                          {requirement.type}
                        </span>
                      ) : null}
                      {requirement.priority ? (
                        <span className="rounded bg-accent px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                          {requirement.priority}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{requirement.why}</p>
                  </div>
                  <StatusPill tone={reqTone[requirement.status] || "neutral"}>{status}</StatusPill>
                </div>
              </button>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                <SourceTag kind={requirement.source.kind} label={requirement.source.label} />
                <span>
                  {linkedEvidence.length} evidence item{linkedEvidence.length === 1 ? "" : "s"}
                </span>
                {requirement.relatedTaskIds?.length ? (
                  <span>
                    {requirement.relatedTaskIds.length} related task
                    {requirement.relatedTaskIds.length === 1 ? "" : "s"}
                  </span>
                ) : null}
                {requirement.relatedQuestionIds?.length ? (
                  <span>
                    Waiting on {requirement.relatedQuestionIds.length} question
                    {requirement.relatedQuestionIds.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>

              {isExpanded ? (
                <div className="mt-5 space-y-5 border-t border-hairline pt-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="label-caps">Original wording</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {requirement.originalWording || requirement.title}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps">Current wording</p>
                      <p className="mt-1 text-sm text-foreground">
                        {requirement.currentWording || requirement.title}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="label-caps">Source</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {requirement.source.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {requirement.sourceLocation || "Source location unavailable."}
                      </p>
                    </div>
                    <div>
                      <p className="label-caps">Evidence</p>
                      {linkedEvidence.length === 0 ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          No supporting evidence found.
                        </p>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {linkedEvidence.map((evidence) => (
                            <p key={evidence.id} className="text-sm text-muted-foreground">
                              {evidence.description} · {evidence.confidence}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {requirement.history?.length ? (
                    <div>
                      <p className="label-caps">History</p>
                      <div className="mt-2 space-y-2">
                        {requirement.history.map((entry) => (
                          <div key={entry.id} className="rounded-md bg-muted/30 px-3 py-2 text-xs">
                            <p className="font-medium">
                              {entry.date} · {entry.changedBy}
                            </p>
                            <p className="mt-1 text-muted-foreground">
                              {entry.previousWording ? `${entry.previousWording} → ` : ""}
                              {entry.newWording}
                            </p>
                            {entry.source ? (
                              <p className="mt-1 text-muted-foreground">Source: {entry.source}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(requirement.id);
                        setDraftTitle(requirement.currentWording || requirement.title);
                      }}
                    >
                      Edit requirement
                    </Button>
                    <select
                      value={status}
                      onChange={(event) => {
                        updateRequirement(work.id, requirement.id, {
                          status: event.currentTarget.value as ReqStatus,
                        });
                        rerender((value) => value + 1);
                      }}
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {[
                        "NOT STARTED",
                        "IN PROGRESS",
                        "SATISFIED",
                        "PARTIALLY SATISFIED",
                        "MISSING",
                        "CONTRADICTORY",
                        "NEEDS REVIEW",
                        "WAIVED",
                      ].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  {editingId === requirement.id ? (
                    <div className="flex gap-2">
                      <input
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.currentTarget.value)}
                        className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          updateRequirement(work.id, requirement.id, { title: draftTitle });
                          setEditingId(null);
                          rerender((value) => value + 1);
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EvidenceTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState<EvidenceType>("Note");
  const [confidence, setConfidence] = useState<EvidenceConfidence>("PARTIAL EVIDENCE");
  const [requirementId, setRequirementId] = useState(work.requirements[0]?.id || "");
  const stats = getEvidenceStats(work);
  const linkedRequirementCount = work.requirements.filter(
    (requirement) => getRequirementEvidence(work, requirement.id).length > 0,
  ).length;

  const saveEvidence = () => {
    if (!description.trim()) return;
    addEvidence(work.id, {
      type,
      description: description.trim(),
      ...(source.trim() ? { source: source.trim() } : {}),
      sourceReference: source.trim() || "Added from user input.",
      relatedRequirementIds: requirementId ? [requirementId] : [],
      confidence,
      confidenceReason:
        confidence === "STRONG EVIDENCE"
          ? "User identified this as direct supporting evidence."
          : "User-provided evidence requires review for completeness.",
      addedBy: "USER-PROVIDED EVIDENCE",
      verificationState: "Unverified",
    });
    setDescription("");
    setSource("");
    setShowAdd(false);
    rerender((value) => value + 1);
  };

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label-caps">Evidence</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stats.total} evidence item{stats.total === 1 ? "" : "s"} · {stats.strong} strong ·{" "}
              {stats.partial} partial · {stats.weak} weak · {stats.none} no evidence
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supporting {linkedRequirementCount} of {work.requirements.length} requirements.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            Add evidence
          </Button>
        </div>
      </div>

      {work.evidence.length === 0 ? (
        <EmptyState
          title="No evidence recorded yet."
          description="Add a file, link, message, decision, approval, test result, or user confirmation to support a requirement."
          action={
            <Button size="sm" onClick={() => setShowAdd(true)}>
              Add evidence
            </Button>
          }
        />
      ) : (
        <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {work.evidence.map((evidence) => {
            const requirements = work.requirements.filter((requirement) =>
              evidence.relatedRequirementIds.includes(requirement.id),
            );
            return (
              <div key={evidence.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{evidence.description}</p>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                        {evidence.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {evidence.addedBy} · {evidence.addedDate} · {evidence.verificationState}
                    </p>
                  </div>
                  <StatusPill
                    tone={
                      evidence.confidence === "STRONG EVIDENCE"
                        ? "ready"
                        : evidence.confidence === "NO EVIDENCE"
                          ? "blocked"
                          : "warn"
                    }
                  >
                    {evidence.confidence}
                  </StatusPill>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="label-caps">Source</p>
                    <p className="mt-1 text-muted-foreground">
                      {evidence.source || "Source unavailable."}
                    </p>
                    {evidence.sourceLocation ? (
                      <p className="mt-1 text-muted-foreground">{evidence.sourceLocation}</p>
                    ) : null}
                  </div>
                  <div>
                    <p className="label-caps">Why it supports</p>
                    <p className="mt-1 text-muted-foreground">{evidence.confidenceReason}</p>
                  </div>
                </div>
                <div className="border-t border-hairline pt-3">
                  <p className="label-caps">Supports</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {requirements.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Not linked to a requirement.
                      </span>
                    ) : (
                      requirements.map((requirement) => (
                        <span key={requirement.id} className="rounded bg-accent px-2 py-1 text-xs">
                          {requirement.title}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add evidence</DialogTitle>
            <DialogDescription>
              Record evidence provided by you. Karya AI has not independently verified it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="grid gap-1.5 text-sm">
              <span className="label-caps">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
                placeholder="What does this evidence show?"
                rows={3}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="label-caps">Evidence type</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.currentTarget.value as EvidenceType)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {[
                    "File",
                    "Page",
                    "Link",
                    "Screenshot",
                    "Message",
                    "Number",
                    "Decision",
                    "Approval",
                    "Test result",
                    "User confirmation",
                    "Note",
                  ].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="label-caps">Confidence</span>
                <select
                  value={confidence}
                  onChange={(event) =>
                    setConfidence(event.currentTarget.value as EvidenceConfidence)
                  }
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {["STRONG EVIDENCE", "PARTIAL EVIDENCE", "WEAK EVIDENCE", "NO EVIDENCE"].map(
                    (option) => (
                      <option key={option}>{option}</option>
                    ),
                  )}
                </select>
              </label>
            </div>
            <label className="grid gap-1.5 text-sm">
              <span className="label-caps">Source reference</span>
              <input
                value={source}
                onChange={(event) => setSource(event.currentTarget.value)}
                placeholder="File name, URL, message, decision, or source reference"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="label-caps">Supports requirement</span>
              <select
                value={requirementId}
                onChange={(event) => setRequirementId(event.currentTarget.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">Not linked yet</option>
                {work.requirements.map((requirement) => (
                  <option key={requirement.id} value={requirement.id}>
                    {requirement.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={saveEvidence} disabled={!description.trim()}>
              Add user-provided evidence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
