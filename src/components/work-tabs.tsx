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
  addApproval,
  addAssignment,
  addCompletedWorkFile,
  addDecision,
  addEvidence,
  addOpenIssue,
  addPlanTask,
  analyzeFileIntelligence,
  addWorkComment,
  editCommunicationDraft,
  generateCommunicationDraft,
  generateHandoffPacket,
  generateReadinessReport,
  generateRequirementsCSV,
  generateWorkPlan,
  generateWorkPlanMarkdown,
  createShareLink,
  revokeShareLink,
  setRetentionPolicy,
  detectSensitiveData,
  dismissSensitiveFinding,
  setCollaborationEnabled,
  updateAssignmentStatus,
  updateDecision,
  updateOpenIssueStatus,
  getEvidenceStats,
  getRequirementEvidence,
  getRequirementStats,
  markFileAuthority,
  runVerification,
  stateLabels,
  updatePlanTask,
  updatePlanTaskStatus,
  updateQuestionAnswer,
  updateRequirement,
  updateWorkFile,
  type CommunicationDraft,
  type EvidenceConfidence,
  type ApprovalRecord,
  type EvidenceType,
  type FileAuthorityStatus,
  type FilePurpose,
  type Question,
  type ResponsibilityAssignment,
  type PlanGroup,
  type QuestionPriority,
  type ReqStatus,
  type OpenIssue,
  type WorkReport,
  type RetentionPolicy,
  type Requirement,
  type RequirementPriority,
  type RequirementType,
  type StepStatus,
  type VerificationFinalStatus,
  type WorkItem,
} from "@/lib/work";
import { cn } from "@/lib/utils";
import { Check, Clipboard, Download, MessageSquare, Send } from "lucide-react";
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
  "Collaborate",
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

function downloadText(filename: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function ReportExportActions({ report }: { report: WorkReport | undefined }) {
  const [copied, setCopied] = useState(false);
  if (!report) return null;
  const isCsv = report.type === "REQUIREMENTS MATRIX";
  const extension = isCsv ? "csv" : "md";
  const mimeType = isCsv ? "text/csv;charset=utf-8" : "text/markdown;charset=utf-8";
  const label = isCsv ? "Download CSV" : "Download Markdown";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report.markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="space-y-2 border-t border-hairline pt-4">
      <p className="text-xs text-muted-foreground">
        This report may contain confidential information.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            downloadText(
              `karya-${extension === "csv" ? "requirements-matrix" : report.type.toLowerCase().replaceAll(" ", "-")}-v${report.version}.${extension}`,
              report.markdown,
              mimeType,
            )
          }
        >
          <Download className="h-3.5 w-3.5" />
          {label}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => void copy()}>
          <Clipboard className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy contents"}
        </Button>
      </div>
    </div>
  );
}

function WorkSecurityControls({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [scanMessage, setScanMessage] = useState("");
  const policy = work.retentionPolicy || "KEEP";
  const findings = work.sensitiveFindings.filter((finding) => finding.status !== "Dismissed");
  const policyLabels: Record<RetentionPolicy, string> = {
    DELETE_IMMEDIATELY: "Delete immediately",
    DELETE_AFTER_24_HOURS: "Delete after 24 hours",
    KEEP: "Keep",
  };

  const updateRetention = (value: RetentionPolicy) => {
    setRetentionPolicy(work.id, value);
    rerender((current) => current + 1);
  };

  const scan = () => {
    const result = detectSensitiveData(work.id) || [];
    setScanMessage(
      result.length > 0
        ? `${result.length} potential finding${result.length === 1 ? "" : "s"} found. Values are masked.`
        : "No matching patterns found in available text content.",
    );
    rerender((current) => current + 1);
  };

  const dismiss = (findingId: string) => {
    dismissSensitiveFinding(work.id, findingId);
    rerender((current) => current + 1);
  };

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm font-medium">File retention</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Delete immediately removes locally stored file content after current processing. Delete
            after 24 hours is enforced when this local app next loads after its deadline; it does
            not control provider or backup retention.
          </p>
        </div>
        <select
          aria-label="File retention"
          value={policy}
          onChange={(event) => updateRetention(event.currentTarget.value as RetentionPolicy)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          {Object.entries(policyLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="border-t border-hairline pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Sensitive data review</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Scans only available text content for potential patterns. This is a warning, not a
              certainty.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={scan}>
            Scan available text
          </Button>
        </div>
        {scanMessage ? <p className="mt-3 text-xs text-muted-foreground">{scanMessage}</p> : null}
        {findings.length > 0 ? (
          <div className="mt-4 divide-y divide-hairline rounded-lg border border-hairline">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className="flex flex-wrap items-center justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium">
                    {finding.category} · {finding.confidence} confidence
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {finding.sourceFileName}
                    {finding.location ? ` · ${finding.location}` : ""} · {finding.maskedPreview}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => dismiss(finding.id)}>
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Redaction is not implemented. Review findings before sharing or exporting Work
          information.
        </p>
      </div>
    </div>
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
        <Section label="Security & Privacy">
          <WorkSecurityControls work={work} />
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
                  {f.confidence ? (
                    <p className="text-xs text-muted-foreground">Confidence: {f.confidence}</p>
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
    return <WorkPlanTab work={work} />;
  }

  if (tab === "Questions") {
    return <QuestionsTab work={work} />;
  }

  if (tab === "Files") {
    return <FileIntelligenceTab work={work} />;
  }

  if (tab === "Verify") {
    return <VerificationTab work={work} />;
  }

  if (tab === "Collaborate") {
    return <CollaborationTab work={work} />;
  }

  return <HandoffTab work={work} />;
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
  const [latestReport, setLatestReport] = useState<WorkReport | undefined>(() =>
    work.reports.find((report) => report.type === "REQUIREMENTS MATRIX"),
  );
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

  const exportMatrix = () => {
    const report = generateRequirementsCSV(work.id);
    if (!report) return;
    setLatestReport(report);
    rerender((value) => value + 1);
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={attention.length > 0 ? "warn" : "ready"}>
              {attention.length > 0 ? `${attention.length} need attention` : "On track"}
            </StatusPill>
            <Button size="sm" variant="outline" onClick={exportMatrix}>
              <Download className="h-3.5 w-3.5" />
              Export matrix
            </Button>
          </div>
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
        <ReportExportActions report={latestReport} />
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

function WorkPlanTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [latestReport, setLatestReport] = useState<WorkReport | undefined>(() =>
    work.reports.find((report) => report.type === "WORK PLAN"),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newGroup, setNewGroup] = useState<PlanGroup>("PRODUCTION");
  const tasks = work.plan || [];
  const plan = work.planMeta;
  const grouped = [
    "PREPARATION",
    "RESEARCH",
    "PRODUCTION",
    "REVIEW",
    "APPROVAL",
    "DELIVERY",
  ] as const;
  const blocked = tasks.filter((task) => task.status === "blocked");
  const waiting = tasks.filter((task) => task.status === "waiting");
  const readyNow = tasks.filter((task) => task.status === "ready");
  const inProgress = tasks.filter((task) => task.status === "in-progress");
  const completed = tasks.filter((task) => task.status === "done");

  const regenerate = () => {
    generateWorkPlan(work.id);
    rerender((value) => value + 1);
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    addPlanTask(work.id, newTitle, newGroup);
    setNewTitle("");
    setShowAdd(false);
    rerender((value) => value + 1);
  };

  const exportPlan = () => {
    const report = generateWorkPlanMarkdown(work.id);
    if (!report) return;
    setLatestReport(report);
    rerender((value) => value + 1);
  };

  if (!plan || tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-hairline p-8 text-center">
        <p className="text-sm font-medium">No Work Plan has been generated yet.</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Karya AI will use the confirmed request, requirements, questions, evidence, and readiness
          findings to create an executable plan.
        </p>
        <Button className="mt-5" onClick={regenerate}>
          Generate Work Plan
        </Button>
      </div>
    );
  }

  const feasibilityTone: Tone =
    plan.feasibility.status === "FEASIBLE"
      ? "ready"
      : plan.feasibility.status === "BLOCKED" ||
          plan.feasibility.status === "POTENTIALLY INFEASIBLE"
        ? "blocked"
        : "warn";

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-hairline bg-surface p-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-caps">Work Plan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Version {plan.version} · Generated from the current Work data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone={feasibilityTone}>{plan.feasibility.status}</StatusPill>
            <Button size="sm" variant="outline" onClick={exportPlan}>
              <Download className="h-3.5 w-3.5" />
              Export work plan
            </Button>
            <Button size="sm" variant="outline" onClick={regenerate}>
              Recalculate
            </Button>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{plan.feasibility.explanation}</p>
        <ReportExportActions report={latestReport} />
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Estimated effort</p>
            <p className="mt-1 text-sm font-medium">
              {plan.feasibility.estimatedEffort || "Cannot be estimated reliably yet."}
            </p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Critical path</p>
            <p className="mt-1 text-sm font-medium">
              {plan.criticalPathTaskIds.length} task
              {plan.criticalPathTaskIds.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Unresolved dependencies</p>
            <p className="mt-1 text-sm font-medium">{plan.feasibility.unresolvedDependencyCount}</p>
          </div>
        </div>
      </div>

      {blocked.length > 0 || waiting.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="label-caps">Needs attention</h2>
            <span className="text-xs text-muted-foreground">
              {blocked.length} blocked · {waiting.length} waiting
            </span>
          </div>
          <div className="space-y-2">
            {[...blocked, ...waiting].map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setExpandedId(task.id)}
                className="w-full rounded-lg border border-hairline bg-surface p-4 text-left hover:bg-accent/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.blocker ||
                        (task.status === "waiting"
                          ? "Waiting for a prerequisite or answer."
                          : "Blocked by an unresolved input.")}
                    </p>
                  </div>
                  <StatusPill tone={task.status === "blocked" ? "blocked" : "warn"}>
                    {task.status === "blocked" ? "Blocked" : "Waiting"}
                  </StatusPill>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {readyNow.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Ready now</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {readyNow.map((task) => (
              <TaskSummary key={task.id} task={task} onOpen={() => setExpandedId(task.id)} />
            ))}
          </div>
        </section>
      ) : null}

      {inProgress.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">In progress</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {inProgress.map((task) => (
              <TaskSummary key={task.id} task={task} onOpen={() => setExpandedId(task.id)} />
            ))}
          </div>
        </section>
      ) : null}

      {plan.parallelGroups.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Can run in parallel</h2>
          <div className="rounded-lg border border-hairline bg-surface p-4">
            <p className="text-sm text-muted-foreground">
              These tasks share prerequisites but do not depend on one another.
            </p>
            {plan.parallelGroups.map((group) => (
              <div key={group.join("-")} className="mt-3 flex flex-wrap gap-2">
                {group.map((taskId) => (
                  <span key={taskId} className="rounded bg-accent px-2.5 py-1 text-xs">
                    {tasks.find((task) => task.id === taskId)?.title || taskId}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="label-caps">Critical path</h2>
          <span className="text-xs text-muted-foreground">
            {plan.criticalPathTaskIds.length} tasks determine the earliest possible completion
          </span>
        </div>
        <div className="rounded-lg border border-hairline bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            {plan.criticalPathTaskIds.map((taskId, index) => (
              <div key={taskId} className="flex items-center gap-2">
                <span className="rounded bg-accent px-2.5 py-1 text-xs">
                  {tasks.find((task) => task.id === taskId)?.title || taskId}
                </span>
                {index < plan.criticalPathTaskIds.length - 1 ? (
                  <span className="text-muted-foreground">→</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="label-caps">Detailed plan</h2>
          <Button size="sm" variant="outline" onClick={() => setShowAdd(true)}>
            Add task
          </Button>
        </div>
        <div className="space-y-6">
          {grouped.map((group) => {
            const groupTasks = tasks.filter((task) => task.group === group);
            if (groupTasks.length === 0) return null;
            return (
              <div key={group} className="space-y-2">
                <h3 className="text-xs font-medium tracking-wider text-muted-foreground">
                  {group}
                </h3>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {groupTasks.map((task) => {
                    const expanded = expandedId === task.id;
                    return (
                      <div key={task.id} className="p-4">
                        <button
                          type="button"
                          className="w-full text-left"
                          onClick={() => setExpandedId(expanded ? null : task.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 gap-3">
                              <span className="font-mono text-xs text-muted-foreground">
                                {tasks.indexOf(task) + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium">{task.title}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {task.estimatedEffort
                                    ? `Estimated effort: ${task.estimatedEffort}`
                                    : "Effort cannot be estimated reliably yet."}
                                </p>
                              </div>
                            </div>
                            <StatusPill tone={stepTone[task.status]}>
                              {task.status === "not-started"
                                ? "Not started"
                                : task.status === "in-progress"
                                  ? "In progress"
                                  : task.status === "needs-review"
                                    ? "Needs review"
                                    : task.status === "done"
                                      ? "Completed"
                                      : task.status}
                            </StatusPill>
                          </div>
                        </button>
                        {expanded ? (
                          <div className="mt-4 space-y-4 border-t border-hairline pt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="label-caps">Objective</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {task.objective || task.title}
                                </p>
                              </div>
                              <div>
                                <p className="label-caps">Expected output</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {task.expectedOutput || "Not specified."}
                                </p>
                              </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="label-caps">Inputs</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {task.inputs?.length
                                    ? task.inputs.join(" · ")
                                    : "No additional inputs recorded."}
                                </p>
                              </div>
                              <div>
                                <p className="label-caps">Evidence required</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {task.evidenceRequired?.length
                                    ? task.evidenceRequired.join(" · ")
                                    : "No evidence requirement recorded."}
                                </p>
                              </div>
                            </div>
                            {task.blocker ? (
                              <div className="rounded-md bg-blocked-soft p-3 text-xs text-blocked">
                                <p className="font-medium">Why this is blocked</p>
                                <p className="mt-1">{task.blocker}</p>
                              </div>
                            ) : null}
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>
                                {task.relatedRequirementIds?.length || 0} related requirements
                              </span>
                              <span>{task.relatedQuestionIds?.length || 0} related questions</span>
                              <span>{task.evidenceIds?.length || 0} linked evidence items</span>
                              {task.isCriticalPath ? (
                                <span className="rounded bg-accent px-2 py-0.5">Critical path</span>
                              ) : null}
                              {task.canRunInParallel ? (
                                <span className="rounded bg-accent px-2 py-0.5">
                                  Parallelizable
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={task.status}
                                onChange={(event) => {
                                  updatePlanTaskStatus(
                                    work.id,
                                    task.id,
                                    event.currentTarget.value as PlanTaskStatus,
                                  );
                                  rerender((value) => value + 1);
                                }}
                                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                              >
                                <option value="not-started">Not started</option>
                                <option value="ready">Ready</option>
                                <option value="in-progress">In progress</option>
                                <option value="waiting">Waiting</option>
                                <option value="blocked">Blocked</option>
                                <option value="done">Completed</option>
                                <option value="skipped">Skipped</option>
                                <option value="needs-review">Needs review</option>
                              </select>
                              <span className="text-xs text-muted-foreground">
                                Status changes are recorded as user edits.
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {completed.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Completed</h2>
          <p className="text-sm text-muted-foreground">
            {completed.length} task{completed.length === 1 ? "" : "s"} marked complete through
            explicit user status or evidence.
          </p>
        </section>
      ) : null}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add plan task</DialogTitle>
            <DialogDescription>
              Add a task based on actual Work needs. User-created tasks are preserved during
              recalculation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="grid gap-1.5 text-sm">
              <span className="label-caps">Task</span>
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.currentTarget.value)}
                placeholder="Describe the action that needs to happen"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="label-caps">Stage</span>
              <select
                value={newGroup}
                onChange={(event) => setNewGroup(event.currentTarget.value as PlanGroup)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                {grouped.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={addTask} disabled={!newTitle.trim()}>
              Add task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskSummary({ task, onOpen }: { task: WorkItem["plan"][number]; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-lg border border-hairline bg-surface p-4 text-left hover:bg-accent/30"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{task.title}</p>
        <StatusPill tone={stepTone[task.status]}>
          {task.status === "in-progress" ? "In progress" : "Ready"}
        </StatusPill>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {task.objective || "Action connected to the confirmed Work request."}
      </p>
    </button>
  );
}

type PlanTaskStatus = StepStatus;

function FileIntelligenceTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const findings = work.fileFindings || [];
  const authoritative = work.files.filter(
    (file) => file.authorityStatus === "Authoritative",
  ).length;
  const needsReview = work.files.filter(
    (file) =>
      file.processingStatus === "Needs review" ||
      file.authorityStatus === "Possibly outdated" ||
      file.authorityStatus === "Conflicted",
  ).length;

  const analyze = () => {
    analyzeFileIntelligence(work.id);
    rerender((value) => value + 1);
  };

  if (work.files.length === 0) {
    return (
      <EmptyState
        title="No files added to this Work."
        description="Add source documents through Work Input before asking Karya AI to analyze file relationships, versions, and authority."
      />
    );
  }

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-hairline bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-caps">File Intelligence</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {work.files.length} files · {authoritative} explicitly authoritative ·{" "}
              {findings.length} findings
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={analyze}>
            Re-analyze files
          </Button>
        </div>
        {needsReview > 0 ? (
          <p className="mt-4 rounded-md bg-warn-soft px-3 py-2 text-xs text-warn">
            {needsReview} file{needsReview === 1 ? "" : "s"} need review before they can be treated
            as reliable sources.
          </p>
        ) : null}
      </div>

      {findings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">File findings</h2>
          <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
            {findings.map((finding) => (
              <div key={finding.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{finding.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{finding.detail}</p>
                  </div>
                  <StatusPill
                    tone={
                      finding.severity === "Critical" || finding.severity === "High"
                        ? "blocked"
                        : finding.severity === "Medium"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {finding.status}
                  </StatusPill>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>Action: {finding.recommendedAction}</span>
                  {finding.sourceReference ? <span>Source: {finding.sourceReference}</span> : null}
                  {finding.confidence ? <span>Confidence: {finding.confidence}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No file intelligence findings."
          description="No duplicate, version, authority, or missing-reference finding has been recorded from the available file data."
        />
      )}

      <section className="space-y-3">
        <h2 className="label-caps">File inventory</h2>
        <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {work.files.map((file) => {
            const expanded = expandedId === file.id;
            const authorityTone =
              file.authorityStatus === "Authoritative"
                ? "ready"
                : file.authorityStatus === "Conflicted" ||
                    file.authorityStatus === "Possibly outdated"
                  ? "warn"
                  : "neutral";
            return (
              <div key={file.id} className="p-4">
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => setExpandedId(expanded ? null : file.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {file.type || "Unknown type"}
                        {file.size ? ` · ${file.size}` : ""} · {file.role}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusPill tone={authorityTone}>
                        {file.authorityStatus || "Unknown"}
                      </StatusPill>
                      <StatusPill
                        tone={
                          file.processingStatus === "Unsupported"
                            ? "blocked"
                            : file.processingStatus === "Needs review"
                              ? "warn"
                              : "ready"
                        }
                      >
                        {file.processingStatus || "Not analyzed"}
                      </StatusPill>
                    </div>
                  </div>
                </button>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Likely purpose: {file.likelyPurpose || "Unknown"}</span>
                  {file.relationshipConfidence ? (
                    <span>· {file.relationshipConfidence}</span>
                  ) : null}
                  {file.relatedFileIds?.length ? (
                    <span>
                      · {file.relatedFileIds.length} related file
                      {file.relatedFileIds.length === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </div>
                {expanded ? (
                  <div className="mt-4 space-y-4 border-t border-hairline pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="label-caps">Source</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {file.source || "Source unavailable."}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Uploaded: {file.uploadedDate || "Date unavailable."}
                        </p>
                      </div>
                      <div>
                        <p className="label-caps">Version family</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {file.versionFamily || "Not determined."}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          A filename marker is not treated as authority.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-xs text-muted-foreground">
                        Classify purpose
                        <select
                          value={file.likelyPurpose || "Unknown"}
                          onChange={(event) => {
                            updateFilePurpose(
                              work.id,
                              file.id,
                              event.currentTarget.value as FilePurpose,
                            );
                            rerender((value) => value + 1);
                          }}
                          className="ml-2 h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          {[
                            "Brief",
                            "Requirement source",
                            "Reference",
                            "Supporting material",
                            "Working file",
                            "Final deliverable",
                            "Evidence",
                            "Template",
                            "Approval",
                            "Unknown",
                          ].map((purpose) => (
                            <option key={purpose}>{purpose}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs text-muted-foreground">
                        Authority
                        <select
                          value={file.authorityStatus || "Unknown"}
                          onChange={(event) => {
                            markFileAuthority(
                              work.id,
                              file.id,
                              event.currentTarget.value as FileAuthorityStatus,
                            );
                            rerender((value) => value + 1);
                          }}
                          className="ml-2 h-8 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          {[
                            "Unknown",
                            "Candidate",
                            "Authoritative",
                            "Possibly outdated",
                            "Conflicted",
                          ].map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function VerificationTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [latestReport, setLatestReport] = useState<WorkReport | undefined>(() =>
    work.reports.find((report) => report.type === "READINESS"),
  );
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);
  const currentRun = work.verificationRuns?.[work.verificationRuns.length - 1];
  const finalFiles = work.files.filter((file) => file.role === "Final");

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    const isText = /\.(txt|md|csv)$/i.test(file.name);
    const content = isText ? await file.text() : undefined;
    addCompletedWorkFile(work.id, {
      name: file.name,
      ...(file.type ? { type: file.type } : {}),
      ...(file.size ? { size: `${Math.ceil(file.size / 1024)} KB` } : {}),
      ...(content ? { content } : {}),
      source: "User upload",
    });
    runVerification(work.id);
    rerender((value) => value + 1);
  };

  const verify = () => {
    runVerification(work.id);
    rerender((value) => value + 1);
  };

  const exportReadiness = () => {
    const report = generateReadinessReport(work.id);
    if (!report) return;
    setLatestReport(report);
    rerender((value) => value + 1);
  };

  if (!currentRun) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed border-hairline p-8 text-center">
          <p className="text-sm font-medium">No completed work has been verified yet.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Upload a final PDF, DOCX, PPTX, spreadsheet, image, or supported text file. Unsupported
            formats will remain explicitly marked for human review.
          </p>
          <label className="mt-5 inline-flex cursor-pointer items-center rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90">
            <span>Upload completed work</span>
            <input
              type="file"
              className="sr-only"
              onChange={(event) => void handleUpload(event.currentTarget.files?.[0])}
            />
          </label>
        </div>
        <div className="rounded-lg border border-hairline bg-surface p-4 text-xs text-muted-foreground">
          Requirements are checked individually. A file existing in the Work Package is not treated
          as proof that the completed work satisfies it.
        </div>
      </div>
    );
  }

  const resultCounts = currentRun.requirementResults.reduce(
    (counts, result) => {
      counts[result.status] = (counts[result.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );
  const critical = currentRun.findings.filter((finding) => finding.severity === "Critical");
  const warnings = currentRun.findings.filter((finding) => finding.severity !== "Critical");
  const statusTone: Tone =
    currentRun.finalStatus === "READY TO SUBMIT"
      ? "ready"
      : currentRun.finalStatus === "NOT READY"
        ? "blocked"
        : currentRun.finalStatus === "HUMAN REVIEW REQUIRED"
          ? "info"
          : "warn";

  return (
    <div className="space-y-7">
      <div className="rounded-xl border border-hairline bg-surface p-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-caps">Verify</p>
            <h2 className="mt-1 text-lg font-medium">{work.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Version {currentRun.version} · {currentRun.date} ·{" "}
              {finalFiles.map((file) => file.name).join(", ")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={statusTone}>{currentRun.finalStatus}</StatusPill>
            <Button size="sm" variant="outline" onClick={exportReadiness}>
              <Download className="h-3.5 w-3.5" />
              Export readiness report
            </Button>
            <Button size="sm" variant="outline" onClick={verify}>
              Rerun verification
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <span>Upload new version</span>
              <input
                type="file"
                className="sr-only"
                onChange={(event) => void handleUpload(event.currentTarget.files?.[0])}
              />
            </label>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{currentRun.summary}</p>
        <ReportExportActions report={latestReport} />
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Satisfied</p>
            <p className="mt-1 text-lg font-medium">{resultCounts["SATISFIED"] || 0}</p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Partial</p>
            <p className="mt-1 text-lg font-medium">{resultCounts["PARTIALLY SATISFIED"] || 0}</p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Missing</p>
            <p className="mt-1 text-lg font-medium">{resultCounts["MISSING"] || 0}</p>
          </div>
          <div className="rounded-lg bg-accent/40 p-3">
            <p className="label-caps">Needs review</p>
            <p className="mt-1 text-lg font-medium">{resultCounts["NEEDS REVIEW"] || 0}</p>
          </div>
        </div>
      </div>

      {critical.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Critical issues</h2>
          <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
            {critical.map((finding) => (
              <VerificationFindingRow
                key={finding.id}
                finding={finding}
                expanded={expandedFindingId === finding.id}
                onToggle={() =>
                  setExpandedFindingId(expandedFindingId === finding.id ? null : finding.id)
                }
              />
            ))}
          </div>
        </section>
      ) : null}
      {warnings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Warnings and review items</h2>
          <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
            {warnings.map((finding) => (
              <VerificationFindingRow
                key={finding.id}
                finding={finding}
                expanded={expandedFindingId === finding.id}
                onToggle={() =>
                  setExpandedFindingId(expandedFindingId === finding.id ? null : finding.id)
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="label-caps">Requirement verification</h2>
          <span className="text-xs text-muted-foreground">
            Each requirement is checked separately
          </span>
        </div>
        <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {currentRun.requirementResults.map((result) => (
            <div
              key={result.requirementId}
              className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div>
                <p className="text-sm font-medium">
                  {work.requirements.find((requirement) => requirement.id === result.requirementId)
                    ?.title || "Requirement"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{result.finding}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Evidence checked: {result.evidenceIds.length} · Output files checked:{" "}
                  {result.outputFileIds.length}
                </p>
              </div>
              <StatusPill
                tone={
                  result.status === "SATISFIED"
                    ? "ready"
                    : result.status === "NEEDS REVIEW"
                      ? "info"
                      : result.status === "PARTIALLY SATISFIED"
                        ? "warn"
                        : "blocked"
                }
              >
                {result.status}
              </StatusPill>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="label-caps">Completion test</h2>
        <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
          {currentRun.completionTest.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.type} · {item.detail}
                </p>
              </div>
              <StatusPill
                tone={
                  item.status === "Pass"
                    ? "ready"
                    : item.status === "Fail"
                      ? "blocked"
                      : item.status === "Needs review"
                        ? "info"
                        : "warn"
                }
              >
                {item.status}
              </StatusPill>
            </div>
          ))}
        </div>
      </section>

      {work.verificationRuns.length > 1 ? (
        <section className="space-y-3">
          <h2 className="label-caps">Verification history</h2>
          <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
            {work.verificationRuns
              .slice()
              .reverse()
              .map((run) => (
                <div key={run.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-medium">
                      {run.date} · Version {run.version}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{run.summary}</p>
                  </div>
                  <StatusPill
                    tone={
                      run.finalStatus === "READY TO SUBMIT"
                        ? "ready"
                        : run.finalStatus === "NOT READY"
                          ? "blocked"
                          : "warn"
                    }
                  >
                    {run.finalStatus}
                  </StatusPill>
                </div>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function VerificationFindingRow({
  finding,
  expanded,
  onToggle,
}: {
  finding: WorkItem["verificationRuns"][number]["findings"][number];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="p-4">
      <button type="button" className="w-full text-left" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{finding.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{finding.detail}</p>
          </div>
          <StatusPill
            tone={
              finding.severity === "Critical"
                ? "blocked"
                : finding.status === "Human review"
                  ? "info"
                  : "warn"
            }
          >
            {finding.severity}
          </StatusPill>
        </div>
      </button>
      {expanded ? (
        <div className="mt-4 space-y-3 border-t border-hairline pt-4 text-xs">
          <p>
            <span className="font-medium">Recommended action: </span>
            {finding.recommendedAction}
          </p>
          <p>
            <span className="font-medium">Status: </span>
            {finding.status}
          </p>
          {finding.confidence ? (
            <p>
              <span className="font-medium">Confidence: </span>
              {finding.confidence}
            </p>
          ) : null}
          {finding.sourceReference ? (
            <p>
              <span className="font-medium">Source: </span>
              {finding.sourceReference}
            </p>
          ) : (
            <p className="text-muted-foreground">Source reference unavailable.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function updateFilePurpose(workId: string, fileId: string, likelyPurpose: FilePurpose) {
  updateWorkFile(workId, fileId, { likelyPurpose });
}

function HandoffTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [newDecisionText, setNewDecisionText] = useState("");
  const [newDecisionReason, setNewDecisionReason] = useState("");
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueSeverity, setNewIssueSeverity] = useState<"Critical" | "High" | "Medium" | "Low">(
    "High",
  );
  const [newIssueDesc, setNewIssueDesc] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const packets = work.handoffPackets || [];
  const latestPacket = packets[packets.length - 1];

  const handleGenerate = () => {
    generateHandoffPacket(work.id);
    rerender((value) => value + 1);
  };

  const handleShare = async () => {
    const link = createShareLink(work.id);
    if (!link) return;
    const href = `${window.location.origin}/r/${link.token}`;
    try {
      await navigator.clipboard.writeText(href);
      setShareMessage("Readiness link copied. It contains only the current read-only snapshot.");
    } catch {
      setShareMessage(href);
    }
    rerender((value) => value + 1);
  };

  const handleRevokeShare = () => {
    revokeShareLink(work.id);
    setShareMessage("The readiness link was revoked.");
    rerender((value) => value + 1);
  };

  const handleAddDecision = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newDecisionText.trim()) return;
    addDecision(work.id, newDecisionText, newDecisionReason);
    setNewDecisionText("");
    setNewDecisionReason("");
    rerender((value) => value + 1);
  };

  const handleAddIssue = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newIssueTitle.trim()) return;
    addOpenIssue(work.id, {
      issue: newIssueTitle.trim(),
      severity: newIssueSeverity,
      description: newIssueDesc.trim() || "No description provided.",
      status: "Open",
      nextAction: "Review and resolve issue.",
    });
    setNewIssueTitle("");
    setNewIssueDesc("");
    rerender((value) => value + 1);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-hairline bg-surface p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-caps">Handoff Mode</p>
            <h2 className="mt-1 text-lg font-medium">{work.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {latestPacket
                ? `Latest packet version ${latestPacket.version} · Generated ${latestPacket.date}`
                : "No handoff packet generated yet."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {latestPacket ? (
              <StatusPill
                tone={
                  latestPacket.readinessStatus === "READY"
                    ? "ready"
                    : latestPacket.readinessStatus === "NOT READY"
                      ? "blocked"
                      : "warn"
                }
              >
                {latestPacket.readinessStatus}
              </StatusPill>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              onClick={work.shareLink ? handleRevokeShare : () => void handleShare()}
            >
              {work.shareLink ? "Revoke shared report" : "Share readiness"}
            </Button>
            <Button size="sm" onClick={handleGenerate}>
              {latestPacket ? "Generate updated handoff" : "Generate handoff"}
            </Button>
          </div>
        </div>

        {work.shareLink ? (
          <div className="rounded-lg border border-hairline bg-accent/30 p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active readiness link
            </p>
            <p className="break-all text-xs text-muted-foreground">
              {typeof window === "undefined"
                ? ""
                : `${window.location.origin}/r/${work.shareLink.token}`}
            </p>
            <p className="text-[11px] text-muted-foreground">
              This local read-only snapshot intentionally excludes private comments, decisions,
              credentials, and files. Server-backed public sharing and expiration are not enabled in
              this client.
            </p>
          </div>
        ) : null}
        {shareMessage ? <p className="text-xs text-muted-foreground">{shareMessage}</p> : null}
        {latestPacket ? (
          <div className="rounded-lg bg-accent/30 p-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              What you need to know before touching this project
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-foreground">
              <li>The work objective is: {latestPacket.summary.description}</li>
              <li>Authoritative files: {latestPacket.summary.authoritativeFiles.join(", ")}</li>
              <li>
                Completed items:{" "}
                {latestPacket.summary.completed.length > 0
                  ? latestPacket.summary.completed[0]
                  : "None recorded yet."}
              </li>
              <li>
                Open items:{" "}
                {latestPacket.summary.open.length > 0
                  ? latestPacket.summary.open[0]
                  : "No critical open items."}
              </li>
              <li className="font-medium text-foreground">
                Next action: {latestPacket.summary.nextAction}
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {latestPacket ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="label-caps">What was completed</h2>
              <div className="rounded-xl border border-hairline bg-surface p-4">
                {latestPacket.whatWasCompleted.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items completed yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {latestPacket.whatWasCompleted.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-foreground">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="label-caps">What remains</h2>
              <div className="rounded-xl border border-hairline bg-surface p-4">
                {latestPacket.whatRemains.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No remaining items.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {latestPacket.whatRemains.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-warn">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="label-caps">Authoritative files</h2>
              <div className="rounded-xl border border-hairline bg-surface p-4">
                {latestPacket.authoritativeFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No authoritative file confirmed yet.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {latestPacket.authoritativeFiles.map((name, idx) => (
                      <li key={idx} className="font-medium text-foreground">
                        📁 {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="label-caps">Open issues ({work.openIssues?.length || 0})</h2>
              <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface p-4 space-y-4">
                <form onSubmit={handleAddIssue} className="space-y-3 border-b border-hairline pb-4">
                  <p className="text-xs font-medium">Record open issue</p>
                  <input
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.currentTarget.value)}
                    placeholder="Issue summary..."
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newIssueSeverity}
                      onChange={(e) =>
                        setNewIssueSeverity(e.currentTarget.value as OpenIssue["severity"])
                      }
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input
                      value={newIssueDesc}
                      onChange={(e) => setNewIssueDesc(e.currentTarget.value)}
                      placeholder="Description / next action..."
                      className="h-8 flex-1 rounded-md border border-input bg-background px-3 text-xs"
                    />
                    <Button type="submit" size="sm">
                      Add
                    </Button>
                  </div>
                </form>

                {!work.openIssues || work.openIssues.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No open issues recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {work.openIssues.map((issue) => (
                      <div key={issue.id} className="flex items-start justify-between gap-3 pt-2">
                        <div>
                          <p className="text-sm font-medium">{issue.issue}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {issue.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill
                            tone={
                              issue.severity === "Critical"
                                ? "blocked"
                                : issue.severity === "High"
                                  ? "warn"
                                  : "neutral"
                            }
                          >
                            {issue.severity}
                          </StatusPill>
                          <select
                            value={issue.status}
                            onChange={(e) => {
                              updateOpenIssueStatus(
                                work.id,
                                issue.id,
                                e.currentTarget.value as OpenIssue["status"],
                              );
                              rerender((v) => v + 1);
                            }}
                            className="h-7 rounded-md border border-input bg-background px-1 text-xs"
                          >
                            <option value="Open">Open</option>
                            <option value="In progress">In progress</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Dismissed">Dismissed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="label-caps">Decisions ({work.decisions?.length || 0})</h2>
              <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface p-4 space-y-4">
                <form
                  onSubmit={handleAddDecision}
                  className="space-y-3 border-b border-hairline pb-4"
                >
                  <p className="text-xs font-medium">Record new decision</p>
                  <input
                    value={newDecisionText}
                    onChange={(e) => setNewDecisionText(e.currentTarget.value)}
                    placeholder="Decision (e.g. Use Q3 pricing)..."
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      value={newDecisionReason}
                      onChange={(e) => setNewDecisionReason(e.currentTarget.value)}
                      placeholder="Reason..."
                      className="h-8 flex-1 rounded-md border border-input bg-background px-3 text-xs"
                    />
                    <Button type="submit" size="sm">
                      Record
                    </Button>
                  </div>
                </form>

                {!work.decisions || work.decisions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No decisions recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {work.decisions.map((d) => (
                      <div key={d.id} className="pt-2 text-sm">
                        <p className="font-medium">{d.text}</p>
                        {d.reason ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">Reason: {d.reason}</p>
                        ) : null}
                        <p className="mt-1 text-xs text-muted-foreground">
                          Decided by {d.decidedBy || "User"} · {d.date}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No handoff packet generated yet."
          description="Click 'Generate handoff' above to compile a structured handoff packet, AI insights summary, open issues, and decision history from the current Work state."
        />
      )}
    </div>
  );
}

function CollaborationTab({ work }: { work: WorkItem }) {
  const [, rerender] = useState(0);
  const [person, setPerson] = useState("");
  const [role, setRole] = useState("");
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalRecord["status"]>("REVIEW");
  const [purpose, setPurpose] = useState<CommunicationDraft["purpose"]>("Status update");
  const [tone, setTone] = useState<CommunicationDraft["tone"]>("Professional");
  const [length, setLength] = useState<CommunicationDraft["length"]>("Short");
  const [latestDraft, setLatestDraft] = useState<CommunicationDraft | undefined>(
    work.communicationDrafts?.[0],
  );

  if (!work.collaborationEnabled) {
    return (
      <div className="rounded-xl border border-dashed border-hairline p-8 text-center">
        <p className="text-sm font-medium">Collaboration is disabled for this Work.</p>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Enable it only when authorized collaborators, comments, responsibilities, or approvals are
          needed. Karya AI will not create placeholder people or activity.
        </p>
        <Button
          className="mt-5"
          size="sm"
          onClick={() => {
            setCollaborationEnabled(work.id, true);
            rerender((value) => value + 1);
          }}
        >
          Enable collaboration
        </Button>
      </div>
    );
  }

  const submitAssignment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!person.trim() || !role.trim()) return;
    addAssignment(work.id, {
      person: person.trim(),
      role: role.trim(),
      relatedObjectType: "work",
      relatedObjectId: work.id,
      status: "Assigned",
    });
    setPerson("");
    setRole("");
    rerender((value) => value + 1);
  };

  const submitComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!author.trim() || !commentText.trim()) return;
    addWorkComment(work.id, {
      author: author.trim(),
      text: commentText.trim(),
      relatedObjectType: "work",
      relatedObjectId: work.id,
    });
    setCommentText("");
    rerender((value) => value + 1);
  };

  const submitApproval = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reviewer.trim()) return;
    addApproval(work.id, {
      relatedObjectType: "work",
      relatedObjectId: work.id,
      reviewer: reviewer.trim(),
      status: approvalStatus,
    });
    setReviewer("");
    rerender((value) => value + 1);
  };

  const generateMessage = () => {
    const draft = generateCommunicationDraft(work.id, purpose, tone, length);
    setLatestDraft(draft);
    rerender((value) => value + 1);
  };

  const myAssignments = work.assignments.filter(
    (assignment) => assignment.person.toLowerCase() === "me",
  );
  const otherAssignments = work.assignments.filter(
    (assignment) => assignment.person.toLowerCase() !== "me",
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-surface p-4">
        <div>
          <p className="label-caps">Collaboration enabled</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Only explicitly entered people, comments, assignments, and approvals appear here.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCollaborationEnabled(work.id, false);
            rerender((value) => value + 1);
          }}
        >
          Disable collaboration
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="label-caps">Responsibilities</h2>
          <span className="text-xs text-muted-foreground">{work.assignments.length} assigned</span>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-4 space-y-4">
          <form onSubmit={submitAssignment} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={person}
              onChange={(event) => setPerson(event.currentTarget.value)}
              placeholder="Person"
              className="h-9 rounded-md border border-input bg-background px-3 text-xs"
            />
            <input
              value={role}
              onChange={(event) => setRole(event.currentTarget.value)}
              placeholder="Responsibility"
              className="h-9 rounded-md border border-input bg-background px-3 text-xs"
            />
            <Button type="submit" size="sm">
              Assign
            </Button>
          </form>
          {work.assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No responsibility has been explicitly assigned.
            </p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="label-caps">My responsibilities</p>
                {myAssignments.length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    No assignment recorded to “Me”.
                  </p>
                ) : (
                  myAssignments.map((assignment) => (
                    <AssignmentRow
                      key={assignment.id}
                      assignment={assignment}
                      workId={work.id}
                      onChange={() => rerender((value) => value + 1)}
                    />
                  ))
                )}
              </div>
              <div>
                <p className="label-caps">Other responsibilities</p>
                {otherAssignments.length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">No other person assigned.</p>
                ) : (
                  otherAssignments.map((assignment) => (
                    <AssignmentRow
                      key={assignment.id}
                      assignment={assignment}
                      workId={work.id}
                      onChange={() => rerender((value) => value + 1)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="label-caps">Comments</h2>
          <div className="rounded-xl border border-hairline bg-surface p-4 space-y-4">
            <form onSubmit={submitComment} className="space-y-2">
              <input
                value={author}
                onChange={(event) => setAuthor(event.currentTarget.value)}
                placeholder="Your name"
                className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs"
              />
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.currentTarget.value)}
                placeholder="Comment on this Work. Use @name to mention someone."
                className="min-h-20 w-full rounded-md border border-input bg-background p-3 text-xs"
              />
              <Button type="submit" size="sm">
                Add comment
              </Button>
            </form>
            {work.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments recorded.</p>
            ) : (
              <div className="space-y-3">
                {work.comments.map((comment) => (
                  <div key={comment.id} className="border-t border-hairline pt-3">
                    <p className="text-sm">{comment.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {comment.author} · {comment.createdAt}
                      {comment.mentionedUsers.length > 0
                        ? ` · Mentions: ${comment.mentionedUsers.map((mention) => `@${mention}`).join(", ")}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="label-caps">Approvals</h2>
          <div className="rounded-xl border border-hairline bg-surface p-4 space-y-4">
            <form onSubmit={submitApproval} className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={reviewer}
                  onChange={(event) => setReviewer(event.currentTarget.value)}
                  placeholder="Reviewer"
                  className="h-8 flex-1 rounded-md border border-input bg-background px-3 text-xs"
                />
                <select
                  value={approvalStatus}
                  onChange={(event) =>
                    setApprovalStatus(event.currentTarget.value as ApprovalRecord["status"])
                  }
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option>DRAFT</option>
                  <option>REVIEW</option>
                  <option>CHANGES REQUESTED</option>
                  <option>APPROVED</option>
                </select>
              </div>
              <Button type="submit" size="sm">
                Record approval state
              </Button>
            </form>
            {work.approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No explicit approval has been recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {work.approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-start justify-between gap-3 border-t border-hairline pt-3"
                  >
                    <div>
                      <p className="text-sm">{approval.reviewer}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{approval.date}</p>
                    </div>
                    <StatusPill
                      tone={
                        approval.status === "APPROVED"
                          ? "ready"
                          : approval.status === "CHANGES REQUESTED"
                            ? "blocked"
                            : "warn"
                      }
                    >
                      {approval.status}
                    </StatusPill>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="label-caps">Communication drafts</h2>
        <div className="rounded-xl border border-hairline bg-surface p-4 space-y-4">
          <div className="grid gap-2 sm:grid-cols-4">
            <select
              value={purpose}
              onChange={(event) =>
                setPurpose(event.currentTarget.value as CommunicationDraft["purpose"])
              }
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option>Status update</option>
              <option>Clarification</option>
              <option>Handoff</option>
              <option>Delivery</option>
              <option>Escalation</option>
            </select>
            <select
              value={tone}
              onChange={(event) => setTone(event.currentTarget.value as CommunicationDraft["tone"])}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option>Professional</option>
              <option>Direct</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Urgent</option>
            </select>
            <select
              value={length}
              onChange={(event) =>
                setLength(event.currentTarget.value as CommunicationDraft["length"])
              }
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option>Short</option>
              <option>Detailed</option>
            </select>
            <Button size="sm" onClick={generateMessage}>
              Generate draft
            </Button>
          </div>
          {latestDraft ? (
            <div className="space-y-3">
              <textarea
                value={latestDraft.text}
                onChange={(event) => {
                  const updated = { ...latestDraft, text: event.currentTarget.value };
                  setLatestDraft(updated);
                  editCommunicationDraft(work.id, latestDraft.id, event.currentTarget.value);
                }}
                className="min-h-32 w-full rounded-md border border-input bg-background p-3 text-sm"
              />
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {latestDraft.purpose} · {latestDraft.tone} · Generated from current Work data
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard?.writeText(latestDraft.text)}
                >
                  Copy message
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No message draft generated yet. Karya AI will not send messages automatically.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function AssignmentRow({
  assignment,
  workId,
  onChange,
}: {
  assignment: ResponsibilityAssignment;
  workId: string;
  onChange: () => void;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 border-t border-hairline pt-2">
      <div>
        <p className="text-sm">{assignment.person}</p>
        <p className="text-xs text-muted-foreground">{assignment.role}</p>
      </div>
      <select
        value={assignment.status}
        onChange={(event) => {
          updateAssignmentStatus(
            workId,
            assignment.id,
            event.currentTarget.value as ResponsibilityAssignment["status"],
          );
          onChange();
        }}
        className="h-7 rounded-md border border-input bg-background px-2 text-xs"
      >
        <option>Assigned</option>
        <option>In progress</option>
        <option>Completed</option>
        <option>Waiting</option>
      </select>
    </div>
  );
}
