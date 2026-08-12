export type WorkState =
  | "ready"
  | "ready-with-warnings"
  | "blocked"
  | "clarify"
  | "in-progress"
  | "waiting"
  | "ready-to-submit"
  | "done"
  | "review";

export type RequirementStatus =
  | "NOT STARTED"
  | "IN PROGRESS"
  | "SATISFIED"
  | "PARTIALLY SATISFIED"
  | "MISSING"
  | "CONTRADICTORY"
  | "NEEDS REVIEW"
  | "WAIVED";
export type RequirementType =
  "MANDATORY" | "OPTIONAL" | "CONDITIONAL" | "INFORMATIONAL" | "APPROVAL-REQUIRED";
export type RequirementPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type ReqStatus = "complete" | "partial" | "missing" | "conflict" | RequirementStatus;
export type StepStatus =
  | "blocked"
  | "ready"
  | "waiting"
  | "not-started"
  | "done"
  | "in-progress"
  | "skipped"
  | "needs-review";
export type PlanGroup =
  "PREPARATION" | "RESEARCH" | "PRODUCTION" | "REVIEW" | "APPROVAL" | "DELIVERY";
export type PlanTaskStatus = StepStatus;
export type DeadlineFeasibility =
  | "FEASIBLE"
  | "FEASIBLE WITH WARNINGS"
  | "POTENTIALLY INFEASIBLE"
  | "BLOCKED"
  | "INSUFFICIENT INFORMATION";
export type SourceKind = "confirmed" | "inferred" | "assumption" | "conflict" | "unknown";

export type Source = { kind: SourceKind; label: string };

export type Issue = { id: string; problem: string; detail: string; action: string };

export type RequirementHistoryEntry = {
  id: string;
  date: string;
  previousWording?: string;
  newWording: string;
  changedBy: string;
  source?: string;
  reason?: string;
};

export type Requirement = {
  id: string;
  title: string;
  status: ReqStatus;
  why: string;
  evidence: string;
  source: Source;
  action: string;
  workId?: string;
  type?: RequirementType;
  priority?: RequirementPriority;
  sourceLocation?: string;
  originalWording?: string;
  currentWording?: string;
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  relatedDeliverableIds?: string[];
  relatedTaskIds?: string[];
  relatedQuestionIds?: string[];
  relatedEvidenceIds?: string[];
  relatedRiskIds?: string[];
  relatedDecisionIds?: string[];
  notes?: string;
  waiver?: { waived: boolean; by?: string; date?: string; reason?: string };
  history?: RequirementHistoryEntry[];
};

export type EvidenceType =
  | "File"
  | "Page"
  | "Link"
  | "Screenshot"
  | "Message"
  | "Number"
  | "Decision"
  | "Approval"
  | "Test result"
  | "User confirmation"
  | "Note";
export type EvidenceConfidence =
  "STRONG EVIDENCE" | "PARTIAL EVIDENCE" | "WEAK EVIDENCE" | "NO EVIDENCE";

export type EvidenceHistoryEntry = {
  id: string;
  date: string;
  change: string;
  by: string;
};

export type Evidence = {
  id: string;
  workId: string;
  type: EvidenceType;
  description: string;
  source?: string;
  sourceLocation?: string;
  sourceReference?: string;
  relatedRequirementIds: string[];
  confidence: EvidenceConfidence;
  confidenceReason: string;
  addedDate: string;
  addedBy: "USER-PROVIDED EVIDENCE" | "AI-DETECTED EVIDENCE";
  verificationState: "Unverified" | "Reviewed" | "Verified" | "Conflicted";
  history: EvidenceHistoryEntry[];
};

export type PlanDependency = {
  id: string;
  prerequisiteTaskId: string;
  dependentTaskId: string;
  reason: string;
  type: "task" | "requirement" | "question" | "file" | "evidence" | "approval" | "decision";
  status: "open" | "resolved";
};

export type PlanTask = {
  id: string;
  title: string;
  group?: PlanGroup;
  status: PlanTaskStatus;
  note?: string;
  objective?: string;
  inputs?: string[];
  expectedOutput?: string;
  dependencies?: string[];
  dependencyReasons?: string[];
  evidenceRequired?: string[];
  relatedRequirementIds?: string[];
  relatedDeliverableIds?: string[];
  relatedQuestionIds?: string[];
  relatedRiskIds?: string[];
  evidenceIds?: string[];
  estimatedEffort?: string;
  isCriticalPath?: boolean;
  canRunInParallel?: boolean;
  blocker?: string;
  blockedByTaskIds?: string[];
  userModified?: boolean;
  sourceReference?: string;
};

/** Legacy alias retained for existing Work Plan consumers. */
export type PlanStep = PlanTask;

export type WorkPlanHistoryEntry = {
  id: string;
  date: string;
  change: string;
  reason?: string;
  affectedTaskIds?: string[];
};

export type WorkPlan = {
  tasks: PlanTask[];
  dependencies: PlanDependency[];
  criticalPathTaskIds: string[];
  parallelGroups: string[][];
  feasibility: {
    status: DeadlineFeasibility;
    explanation: string;
    estimatedEffort?: string;
    availableTime?: string;
    unresolvedDependencyCount: number;
  };
  history: WorkPlanHistoryEntry[];
  version: number;
  lastGeneratedAt?: string;
};

export type QuestionCategory =
  | "Blocking"
  | "Planning"
  | "Scope"
  | "Deliverable"
  | "Files/assets"
  | "Review/approval"
  | "Optional preferences";

export type QuestionPriority = "MUST ANSWER BEFORE STARTING" | "CAN ANSWER LATER" | "OPTIONAL";

export type QuestionStatus =
  "Open" | "Ready to Ask" | "Asked" | "Waiting for Answer" | "Answered" | "Resolved" | "Dismissed";

export type Question = {
  id: string;
  workId: string;
  workTitle: string;
  question: string;
  why: string;
  category: QuestionCategory;
  priority: QuestionPriority;
  impact: "Low" | "Medium" | "High" | "Critical";
  status: QuestionStatus;
  personResponsible?: string;
  createdDate: string;
  askedDate?: string;
  answeredDate?: string;
  answer?: string;
  answerSource?: string;
  relatedRequirementIds: string[];
  relatedDependencyIds: string[];
  relatedRiskIds: string[];
  relatedFindingIds: string[];
  // Legacy support for older components
  state: "must" | "waiting" | "resolved";
};

export type FilePurpose =
  | "Brief"
  | "Requirement source"
  | "Reference"
  | "Supporting material"
  | "Working file"
  | "Final deliverable"
  | "Evidence"
  | "Template"
  | "Approval"
  | "Unknown";
export type FileAuthorityStatus =
  "Unknown" | "Candidate" | "Authoritative" | "Possibly outdated" | "Conflicted";
export type FileProcessingStatus = "Ready" | "Needs review" | "Unsupported";

export type WorkFile = {
  id: string;
  name: string;
  role: "Source" | "Working file" | "Final" | "Missing";
  meta?: string;
  type?: string;
  size?: string;
  content?: string;
  category?: string;
  source?: string;
  uploadedDate?: string;
  likelyPurpose?: FilePurpose;
  processingStatus?: FileProcessingStatus;
  versionLabel?: string;
  versionFamily?: string;
  authorityStatus?: FileAuthorityStatus;
  authorityConfirmedBy?: string;
  authorityConfirmedDate?: string;
  relatedRequirementIds?: string[];
  relatedEvidenceIds?: string[];
  relatedFileIds?: string[];
  relationshipConfidence?: "DIRECT RELATIONSHIP" | "POSSIBLE RELATIONSHIP";
  contentFingerprint?: string;
};

export type FileIntelligenceFindingType =
  | "exact-duplicate"
  | "possible-duplicate"
  | "version-conflict"
  | "possibly-outdated"
  | "missing-referenced-file"
  | "multiple-authoritative";
export type FileIntelligenceFinding = {
  id: string;
  type: FileIntelligenceFindingType;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  confidence?: "High" | "Medium" | "Low";
  title: string;
  detail: string;
  fileIds: string[];
  sourceReference?: string;
  recommendedAction: string;
  status: "Open" | "Resolved" | "Human review";
};

export type VerificationSeverity = "Critical" | "High" | "Medium" | "Low" | "Informational";
export type VerificationFinalStatus =
  "READY TO SUBMIT" | "READY WITH WARNINGS" | "NOT READY" | "HUMAN REVIEW REQUIRED";
export type VerificationFindingType =
  | "missing-requirement"
  | "partial-requirement"
  | "contradiction"
  | "numerical-inconsistency"
  | "missing-attachment"
  | "format"
  | "missing-section"
  | "weak-evidence"
  | "outdated-source"
  | "human-review";
export type VerificationFinding = {
  id: string;
  type: VerificationFindingType;
  severity: VerificationSeverity;
  confidence?: "High" | "Medium" | "Low";
  title: string;
  detail: string;
  relatedRequirementIds: string[];
  relatedEvidenceIds: string[];
  relatedFileIds: string[];
  sourceReference?: string;
  recommendedAction: string;
  status: "Open" | "Resolved" | "Human review";
};
export type VerificationRequirementResult = {
  requirementId: string;
  status: "SATISFIED" | "PARTIALLY SATISFIED" | "MISSING" | "CONTRADICTORY" | "NEEDS REVIEW";
  finding: string;
  evidenceIds: string[];
  outputFileIds: string[];
};
export type CompletionTestItem = {
  id: string;
  type:
    | "CONTENT"
    | "EVIDENCE"
    | "CONSISTENCY"
    | "FORMAT"
    | "ATTACHMENTS"
    | "APPROVAL"
    | "STRUCTURE"
    | "NUMERICAL"
    | "DEADLINE";
  title: string;
  status: "Pass" | "Warning" | "Fail" | "Needs review";
  detail: string;
  relatedRequirementIds: string[];
};
export type VerificationRun = {
  id: string;
  date: string;
  version: number;
  submittedFileIds: string[];
  requirementResults: VerificationRequirementResult[];
  findings: VerificationFinding[];
  completionTest: CompletionTestItem[];
  finalStatus: VerificationFinalStatus;
  summary: string;
};

export type VerifyCheck = {
  id: string;
  title: string;
  status: "satisfied" | "missing" | "review";
  note?: string;
};

export type Handoff = {
  id: string;
  title: string;
  person: string;
  direction: "incoming" | "outgoing";
  status: string;
  remainingIssues?: string;
  nextAction?: string;
};

export type RequestUnderstanding = {
  objective: string;
  action: string;
  outcome: string;
  deadline?: string;
  audience?: string;
  stakeholders?: string[];
  constraints?: string[];
  deliverables?: string[];
  tools?: string[];
  references?: string[];
};

export type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
};

export type ActivityRecord = {
  id: string;
  when: string;
  change: string;
  source?: string;
  user?: string;
};

export type ReadinessFindingType =
  | "missing-info"
  | "missing-asset"
  | "contradiction"
  | "ambiguity"
  | "assumption"
  | "risk"
  | "dependency";

export type ReadinessFindingSeverity =
  "low" | "medium" | "high" | "critical" | "blocking" | "non-blocking" | "informational";

export type ReadinessFinding = {
  id: string;
  type: ReadinessFindingType;
  severity: ReadinessFindingSeverity;
  confidence?: "High" | "Medium" | "Low";
  title: string;
  explanation: string;
  whyItMatters: string;
  sourceReference?: string;
  recommendedAction: string;
  status: "open" | "resolved" | "overridden";
};

export type ResponsibilityAssignment = {
  id: string;
  person: string;
  role: string;
  relatedObjectType:
    "work" | "deliverable" | "task" | "requirement" | "question" | "issue" | "approval";
  relatedObjectId: string;
  assignedDate: string;
  status: "Assigned" | "In progress" | "Completed" | "Waiting";
  dueDate?: string;
};

export type WorkComment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  relatedObjectType:
    | "work"
    | "requirement"
    | "task"
    | "question"
    | "evidence"
    | "verification"
    | "handoff"
    | "decision";
  relatedObjectId: string;
  editedAt?: string;
  mentionedUsers: string[];
};

export type ApprovalRecord = {
  id: string;
  relatedObjectType: "work" | "requirement" | "deliverable" | "revision" | "final-output";
  relatedObjectId: string;
  reviewer: string;
  status: "DRAFT" | "REVIEW" | "APPROVED" | "CHANGES REQUESTED";
  date: string;
  comment?: string;
};

export type CommunicationDraft = {
  id: string;
  purpose: "Clarification" | "Status update" | "Handoff" | "Delivery" | "Escalation";
  tone: "Professional" | "Direct" | "Friendly" | "Formal" | "Urgent";
  length: "Short" | "Detailed";
  text: string;
  createdAt: string;
  editedAt?: string;
  sourceObjectIds: string[];
};

export type RetentionPolicy = "DELETE_IMMEDIATELY" | "DELETE_AFTER_24_HOURS" | "KEEP";
export type SensitiveFinding = {
  id: string;
  category:
    | "Personal information"
    | "Financial information"
    | "Credential or API key"
    | "Contact information"
    | "Confidential document";
  confidence: "Low" | "Medium" | "High";
  sourceFileId: string;
  sourceFileName: string;
  location?: string;
  maskedPreview: string;
  status: "Open" | "Reviewed" | "Redacted" | "Dismissed";
};
export type SecurityEvent = {
  id: string;
  type:
    | "File deletion"
    | "Retention changed"
    | "Sensitive warning"
    | "Redaction performed"
    | "Export requested"
    | "Share link created"
    | "Share link revoked";
  date: string;
  detail: string;
};
export type ReportType = "READINESS" | "WORK PLAN" | "REQUIREMENTS MATRIX";
export type WorkReport = {
  id: string;
  type: ReportType;
  version: number;
  createdAt: string;
  sourceActivityId?: string;
  finalStatus?: string;
  markdown: string;
};
export type ShareSnapshot = {
  title: string;
  status: string;
  summary: string;
  requirementsSummary: string;
  criticalIssues: string[];
  verificationSummary: string;
  nextSteps: string[];
  generatedAt: string;
};
export type ShareLink = {
  token: string;
  createdAt: string;
  snapshot: ShareSnapshot;
};

export type UserTemplate = Template & {
  owner: "User" | "System";
  createdAt: string;
  updatedAt: string;
  uses: number;
  defaultRequirements?: string[];
  defaultDeliverables?: string[];
};

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  state: WorkState;
  collaborationEnabled?: boolean;
  templateId?: string;
  retentionPolicy?: RetentionPolicy;
  retentionScheduledFor?: string;
  shareLink?: ShareLink;
  due?: string;
  archived?: boolean;
  request: RequestUnderstanding;
  requirements: Requirement[];
  evidence: Evidence[];
  plan: PlanTask[];
  planMeta?: WorkPlan;
  questions: Question[];
  files: WorkFile[];
  fileFindings: FileIntelligenceFinding[];
  verificationRuns: VerificationRun[];
  verify: VerifyCheck[];
  timeline: TimelineEvent[];
  activity: ActivityRecord[];
  decisions: WorkDecision[];
  decisionHistory: DecisionChangeEntry[];
  openIssues: OpenIssue[];
  handoffPackets: HandoffPacket[];
  assignments: ResponsibilityAssignment[];
  comments: WorkComment[];
  approvals: ApprovalRecord[];
  communicationDrafts: CommunicationDraft[];
  sensitiveFindings: SensitiveFinding[];
  securityEvents: SecurityEvent[];
  reports: WorkReport[];
  assumptions: { id: string; text: string }[];
  issues: Issue[];
  findings: ReadinessFinding[];
  recommendedNextAction: string;
};

export type WorkDecision = {
  id: string;
  text: string;
  reason?: string;
  decidedBy?: string;
  date: string;
  source?: string;
  affectedRequirements?: string[];
  affectedTasks?: string[];
  affectedRisks?: string[];
  previousDecision?: string;
};

export type DecisionChangeEntry = {
  id: string;
  date: string;
  oldDecision?: string;
  newDecision: string;
  source?: string;
  changedBy?: string;
  impact?: string;
};

export type OpenIssue = {
  id: string;
  issue: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  relatedWorkObject?: string;
  owner?: string;
  createdDate: string;
  status: "Open" | "In progress" | "Waiting" | "Resolved" | "Dismissed";
  nextAction: string;
};

export type HandoffPacket = {
  id: string;
  version: number;
  date: string;
  readinessStatus: "READY" | "READY WITH WARNINGS" | "NOT READY" | "HUMAN REVIEW REQUIRED";
  whatWasRequested: string;
  whatWasCompleted: string[];
  whatRemains: string[];
  currentFiles: { name: string; type: string; purpose: string; status: string; version?: string }[];
  authoritativeFiles: string[];
  decisions: WorkDecision[];
  risks: { title: string; severity: string; action: string }[];
  openQuestions: { question: string; priority: string; owner?: string }[];
  nextSteps: string[];
  summary: {
    currentStatus: string;
    description: string;
    completed: string[];
    open: string[];
    decisions: string[];
    authoritativeFiles: string[];
    risks: string[];
    nextAction: string;
  };
};

export const stateLabels: Record<WorkState, string> = {
  ready: "Ready",
  "ready-with-warnings": "Ready with warnings",
  blocked: "Blocked",
  clarify: "Needs clarification",
  "in-progress": "In progress",
  waiting: "Waiting for response",
  "ready-to-submit": "Ready to submit",
  done: "Completed",
  review: "Review required",
};

const WORK_STORAGE_KEY = "karya-ai-work-items";

function loadPersistedWork(): WorkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WORK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkItem[];
    let retentionApplied = false;
    const normalized = parsed.map((item) => {
      const work: WorkItem = {
        ...item,
        evidence: item.evidence || [],
        findings: item.findings || [],
        activity: item.activity || [],
        timeline: item.timeline || [],
        questions: item.questions || [],
        requirements: item.requirements || [],
        fileFindings: item.fileFindings || [],
        verificationRuns: item.verificationRuns || [],
        decisions: item.decisions || [],
        decisionHistory: item.decisionHistory || [],
        openIssues: item.openIssues || [],
        handoffPackets: item.handoffPackets || [],
        assignments: item.assignments || [],
        comments: item.comments || [],
        approvals: item.approvals || [],
        communicationDrafts: item.communicationDrafts || [],
        sensitiveFindings: item.sensitiveFindings || [],
        securityEvents: item.securityEvents || [],
        reports: item.reports || [],
      };
      if (
        work.retentionPolicy === "DELETE_AFTER_24_HOURS" &&
        work.retentionScheduledFor &&
        Date.parse(work.retentionScheduledFor) <= Date.now()
      ) {
        retentionApplied =
          removeLocallyRetainedFiles(
            work,
            "The configured 24-hour local retention period elapsed.",
          ) > 0;
      }
      return work;
    });
    if (retentionApplied) window.localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return [];
  }
}

function persistWorkItems() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(workItems));
  } catch {
    // Storage may be unavailable or full; keep the current in-memory Work state.
  }
}

/** Real work items. Empty until the user adds work. */
export const workItems: WorkItem[] = loadPersistedWork();

/** Questions raised on real work. */
export const questions: Question[] = workItems.flatMap((item) => item.questions);

/** Handoffs on real work. */
export const handoffs: Handoff[] = workItems.flatMap((item) =>
  (item.handoffPackets || []).map((hp) => ({
    id: hp.id,
    title: item.title,
    person: "Team",
    direction: "outgoing" as const,
    status: hp.readinessStatus,
    ...(hp.whatRemains[0] ? { remainingIssues: hp.whatRemains[0] } : {}),
    ...(hp.nextSteps[0] ? { nextAction: hp.nextSteps[0] } : {}),
  })),
);

/** Notifications from real events. */
export const notifications: { id: string; text: string; when: string }[] = [];

export function getWork(id: string): WorkItem | undefined {
  return workItems.find((w) => w.id === id);
}

export function addWorkItem(item: WorkItem) {
  const created = nowLabel();
  item.requirements = item.requirements.map((requirement) => ({
    ...requirement,
    workId: requirement.workId || item.id,
    originalWording: requirement.originalWording || requirement.title,
    currentWording: requirement.currentWording || requirement.title,
    createdDate: requirement.createdDate || created,
    modifiedDate: requirement.modifiedDate || created,
    type: requirement.type || "MANDATORY",
    priority: requirement.priority || "HIGH",
    history: requirement.history || [],
    relatedEvidenceIds: requirement.relatedEvidenceIds || [],
    relatedTaskIds: requirement.relatedTaskIds || [],
    relatedQuestionIds: requirement.relatedQuestionIds || [],
  }));
  item.evidence = item.evidence || [];
  item.sensitiveFindings = item.sensitiveFindings || [];
  item.securityEvents = item.securityEvents || [];
  item.reports = item.reports || [];
  workItems.unshift(item);
  for (const q of item.questions) {
    questions.push(q);
  }
  persistWorkItems();
}

function nowLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function secureId(prefix: string) {
  const random =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

function recordSecurityEvent(work: WorkItem, type: SecurityEvent["type"], detail: string) {
  const date = new Date().toISOString();
  work.securityEvents.unshift({ id: secureId("security"), type, date, detail });
  work.activity.unshift({
    id: secureId("act"),
    when: nowLabel(),
    change: detail,
  });
}

function removeLocallyRetainedFiles(work: WorkItem, reason: string) {
  const filesToRemove = work.files.filter((file) => file.role !== "Missing");
  if (filesToRemove.length === 0) {
    delete work.retentionScheduledFor;
    return 0;
  }
  const removedFileIds = new Set(filesToRemove.map((file) => file.id));
  const removedNames = new Set(filesToRemove.map((file) => file.name));
  const affectedEvidenceIds = new Set(
    filesToRemove.flatMap((file) => file.relatedEvidenceIds || []),
  );

  work.files = work.files.map((file) => {
    if (!removedFileIds.has(file.id)) return file;
    const { content: _content, ...withoutContent } = file;
    return {
      ...withoutContent,
      role: "Missing",
      processingStatus: "Needs review",
      meta: "Locally removed by the configured file-retention setting.",
    };
  });

  for (const evidence of work.evidence) {
    const dependsOnRemovedFile =
      affectedEvidenceIds.has(evidence.id) ||
      (evidence.source ? removedNames.has(evidence.source) : false) ||
      (evidence.sourceReference ? removedNames.has(evidence.sourceReference) : false);
    if (dependsOnRemovedFile) {
      evidence.verificationState = "Conflicted";
      evidence.history.unshift({
        id: secureId("evidence-history"),
        date: nowLabel(),
        change: "Evidence source was locally removed by a retention setting; review is required.",
        by: "SYSTEM",
      });
    }
  }

  for (const requirement of work.requirements) {
    const dependsOnRemovedEvidence = requirement.relatedEvidenceIds?.some((id) =>
      affectedEvidenceIds.has(id),
    );
    const namesSource = removedNames.has(requirement.source.label);
    if (dependsOnRemovedEvidence || namesSource) {
      requirement.status = "NEEDS REVIEW";
      requirement.history?.unshift({
        id: secureId("requirement-history"),
        date: nowLabel(),
        newWording: requirement.currentWording || requirement.title,
        changedBy: "SYSTEM",
        reason: "A supporting source was locally removed by a retention setting.",
      });
    }
  }

  for (const file of filesToRemove) {
    if (
      work.fileFindings.some(
        (finding) =>
          finding.type === "missing-referenced-file" && finding.fileIds.includes(file.id),
      )
    ) {
      continue;
    }
    work.fileFindings.unshift({
      id: secureId("file-retention"),
      type: "missing-referenced-file",
      severity: "High",
      title: "Evidence source no longer available",
      detail:
        "A local file was removed by the configured retention setting. Related evidence and requirements may need review.",
      fileIds: [file.id],
      sourceReference: file.name,
      recommendedAction:
        "Re-upload the source if it is still needed, then rerun review and verification.",
      status: "Open",
    });
  }
  work.findings.unshift({
    id: secureId("retention-finding"),
    type: "missing-asset",
    severity: "high",
    confidence: "High",
    title: "Retained files are no longer available locally",
    explanation:
      "One or more files were locally removed by the configured retention setting. Any result depending on them may need recalculation.",
    whyItMatters: "Evidence, requirements, and verification cannot rely on unavailable sources.",
    sourceReference: "File retention",
    recommendedAction: "Re-upload needed sources and rerun analysis or verification.",
    status: "open",
  });
  work.recommendedNextAction =
    "Review Work items affected by locally removed files and re-upload any required source.";
  delete work.retentionScheduledFor;
  recordSecurityEvent(
    work,
    "File deletion",
    `${filesToRemove.length} locally stored file${filesToRemove.length === 1 ? "" : "s"} removed by the retention setting.`,
  );
  return filesToRemove.length;
}

export function applyRetentionPolicy(workId: string) {
  const work = getWork(workId);
  if (!work) return 0;
  const shouldRemoveImmediately = work.retentionPolicy === "DELETE_IMMEDIATELY";
  const shouldRemoveAfterDelay =
    work.retentionPolicy === "DELETE_AFTER_24_HOURS" &&
    work.retentionScheduledFor &&
    Date.parse(work.retentionScheduledFor) <= Date.now();
  const removed =
    shouldRemoveImmediately || shouldRemoveAfterDelay
      ? removeLocallyRetainedFiles(work, "The configured local retention action was applied.")
      : 0;
  if (removed > 0) persistWorkItems();
  return removed;
}

export function setRetentionPolicy(workId: string, policy: RetentionPolicy) {
  const work = getWork(workId);
  if (!work) return undefined;
  const labels: Record<RetentionPolicy, string> = {
    DELETE_IMMEDIATELY: "Delete immediately",
    DELETE_AFTER_24_HOURS: "Delete after 24 hours",
    KEEP: "Keep",
  };
  work.retentionPolicy = policy;
  if (policy === "DELETE_AFTER_24_HOURS") {
    work.retentionScheduledFor = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  } else {
    delete work.retentionScheduledFor;
  }
  recordSecurityEvent(work, "Retention changed", `File retention changed to ${labels[policy]}.`);
  if (policy === "DELETE_IMMEDIATELY") {
    removeLocallyRetainedFiles(
      work,
      "The configured immediate local retention action was applied.",
    );
  }
  persistWorkItems();
  return work;
}

function maskedPreview(value: string, category: SensitiveFinding["category"]) {
  if (category === "Contact information" || category === "Personal information") {
    if (value.includes("@")) {
      const [local = "", domain = ""] = value.split("@", 2);
      return `${local.slice(0, 1)}***@${domain}`;
    }
    const digits = value.replace(/\D/g, "");
    return digits.length >= 4 ? `•••• ${digits.slice(-4)}` : "••••";
  }
  if (category === "Financial information") {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 4 ? `•••• ${digits.slice(-4)}` : "••••";
  }
  return `${value.slice(0, 3)}••••`;
}

export function detectSensitiveData(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const findings: SensitiveFinding[] = [];
  const patterns: {
    category: SensitiveFinding["category"];
    confidence: SensitiveFinding["confidence"];
    regex: RegExp;
    location: string;
  }[] = [
    {
      category: "Contact information",
      confidence: "High",
      regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}/gi,
      location: "Text content",
    },
    {
      category: "Personal information",
      confidence: "Medium",
      regex: /\\b(?:phone|mobile|ssn|passport|national id)\\s*[:=]\\s*[^\\n,;]+/gi,
      location: "Labeled field",
    },
    {
      category: "Financial information",
      confidence: "High",
      regex: /\\b(?:\\d[ -]*?){13,19}\\b/g,
      location: "Number pattern",
    },
    {
      category: "Credential or API key",
      confidence: "High",
      regex:
        /\\b(?:sk-[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|api[_-]?key\\s*[:=]\\s*\\S+)\\b/g,
      location: "Credential pattern",
    },
  ];

  for (const file of work.files) {
    if (!file.content?.trim()) continue;
    for (const pattern of patterns) {
      for (const match of file.content.matchAll(pattern.regex)) {
        const value = match[0];
        const start = match.index ?? 0;
        const line = file.content.slice(0, start).split("\\n").length;
        if (
          findings.some(
            (finding) =>
              finding.sourceFileId === file.id &&
              finding.category === pattern.category &&
              finding.maskedPreview === maskedPreview(value, pattern.category),
          )
        ) {
          continue;
        }
        findings.push({
          id: secureId("sensitive"),
          category: pattern.category,
          confidence: pattern.confidence,
          sourceFileId: file.id,
          sourceFileName: file.name,
          location: `${pattern.location}; line ${line}`,
          maskedPreview: maskedPreview(value, pattern.category),
          status: "Open",
        });
      }
    }
  }

  const scannedFileIds = new Set(
    work.files.filter((file) => file.content?.trim()).map((file) => file.id),
  );
  work.sensitiveFindings = [
    ...work.sensitiveFindings.filter(
      (finding) => !scannedFileIds.has(finding.sourceFileId) || finding.status !== "Open",
    ),
    ...findings,
  ];
  if (findings.length > 0) {
    recordSecurityEvent(
      work,
      "Sensitive warning",
      `Sensitive-data review found ${findings.length} potential finding${findings.length === 1 ? "" : "s"}; values were masked.`,
    );
  } else {
    recordSecurityEvent(
      work,
      "Sensitive warning",
      "Sensitive-data review completed with no matching patterns in available text content.",
    );
  }
  persistWorkItems();
  return findings;
}

export function dismissSensitiveFinding(workId: string, findingId: string) {
  const work = getWork(workId);
  const finding = work?.sensitiveFindings.find((item) => item.id === findingId);
  if (!work || !finding) return undefined;
  finding.status = "Dismissed";
  recordSecurityEvent(
    work,
    "Sensitive warning",
    `Sensitive-data finding dismissed for ${finding.sourceFileName}.`,
  );
  persistWorkItems();
  return finding;
}

function markdownList(items: string[], empty = "None recorded.") {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\\n") : `- ${empty}`;
}

function csvCell(value: string | undefined) {
  const safe = value || "";
  return `"${safe.replaceAll('"', '""')}"`;
}

function latestVerification(work: WorkItem) {
  return work.verificationRuns?.[work.verificationRuns.length - 1];
}

function readinessStatus(work: WorkItem) {
  return latestVerification(work)?.finalStatus || stateLabels[work.state];
}

export function generateReadinessReport(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const verification = latestVerification(work);
  const requirements = getRequirementStats(work);
  const evidence = getEvidenceStats(work);
  const criticalIssues = [
    ...work.findings
      .filter((finding) => finding.severity === "critical" || finding.severity === "blocking")
      .map((finding) => `${finding.title}: ${finding.explanation}`),
    ...(verification?.findings || [])
      .filter((finding) => finding.severity === "Critical" && finding.status !== "Resolved")
      .map((finding) => `${finding.title}: ${finding.detail}`),
  ];
  const sourceLines = work.files.map(
    (file) =>
      `- ${file.name}${file.type ? ` (${file.type})` : ""}${file.role ? ` — ${file.role}` : ""}`,
  );
  const findingLines = work.findings.map(
    (finding) =>
      `- **${finding.type} / ${finding.severity}** — ${finding.title}: ${finding.explanation}${finding.sourceReference ? ` (source: ${finding.sourceReference})` : ""}`,
  );
  const requirementLines = work.requirements.map(
    (requirement) =>
      `- **${requirement.title}** — ${requirement.status}; source: ${requirement.source.kind} (${requirement.source.label}); evidence: ${requirement.evidence}`,
  );
  const now = new Date().toISOString();
  const version = work.reports.filter((report) => report.type === "READINESS").length + 1;
  const markdown = [
    "# Karya AI Readiness Report",
    "",
    "> This report is a generated snapshot of the current Work data. It is not an official certification of readiness.",
    "",
    `**Work:** ${work.title}`,
    `**Date:** ${now}`,
    `**Overall status:** ${readinessStatus(work)}`,
    "",
    "## What was requested",
    "",
    `**Objective:** ${work.request.objective}`,
    `**Action:** ${work.request.action}`,
    `**Outcome:** ${work.request.outcome}`,
    ...(work.request.deadline ? [`**Deadline:** ${work.request.deadline}`] : []),
    ...(work.request.audience ? [`**Audience:** ${work.request.audience}`] : []),
    "",
    "## Deliverables",
    "",
    markdownList(work.request.deliverables || []),
    "",
    "## Readiness findings",
    "",
    markdownList(findingLines),
    "",
    "## Critical issues",
    "",
    markdownList(criticalIssues),
    "",
    "## Recommended next actions",
    "",
    markdownList(work.recommendedNextAction ? [work.recommendedNextAction] : []),
    "",
    "## Requirements summary",
    "",
    `- Total requirements: ${work.requirements.length}`,
    `- Satisfied: ${requirements["SATISFIED"] || 0}`,
    `- Missing: ${requirements["MISSING"] || 0}`,
    `- Needs review: ${requirements["NEEDS REVIEW"] || 0}`,
    `- Evidence items: ${evidence.total}`,
    "",
    markdownList(requirementLines),
    "",
    "## Verification",
    "",
    verification
      ? `Latest verification: version ${verification.version}, ${verification.finalStatus}. ${verification.summary}`
      : "Verification has not been run for this Work.",
    "",
    "## Sources",
    "",
    markdownList(sourceLines),
    "",
    "## Interpretation",
    "",
    "Confirmed information is represented by user-provided Work fields and recorded evidence. Readiness findings may contain AI analysis or inference, and their source references are shown where available. Unknown information is not filled in by this report.",
  ].join("\\n");
  const report: WorkReport = {
    id: secureId("report"),
    type: "READINESS",
    version,
    createdAt: now,
    ...(verification
      ? { sourceActivityId: verification.id, finalStatus: verification.finalStatus }
      : { finalStatus: readinessStatus(work) }),
    markdown,
  };
  work.reports.unshift(report);
  recordSecurityEvent(work, "Export requested", `Readiness report version ${version} generated.`);
  persistWorkItems();
  return report;
}

export function generateWorkPlanMarkdown(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const now = new Date().toISOString();
  const version = work.reports.filter((report) => report.type === "WORK PLAN").length + 1;
  const groups: PlanGroup[] = [
    "PREPARATION",
    "RESEARCH",
    "PRODUCTION",
    "REVIEW",
    "APPROVAL",
    "DELIVERY",
  ];
  const sections = groups.flatMap((group) => {
    const tasks = work.plan.filter((task) => (task.group || "PRODUCTION") === group);
    if (tasks.length === 0) return [];
    return [
      `## ${group[0] + group.slice(1).toLowerCase()}`,
      "",
      ...tasks.flatMap((task, index) => [
        `### ${index + 1}. ${task.title}`,
        "",
        `- Status: ${task.status}`,
        ...(task.objective ? [`- Objective: ${task.objective}`] : []),
        ...(task.inputs?.length ? [`- Inputs: ${task.inputs.join("; ")}`] : []),
        ...(task.dependencies?.length ? [`- Dependencies: ${task.dependencies.join("; ")}`] : []),
        ...(task.expectedOutput ? [`- Expected output: ${task.expectedOutput}`] : []),
        ...(task.evidenceRequired?.length
          ? [`- Evidence required: ${task.evidenceRequired.join("; ")}`]
          : []),
        ...(task.estimatedEffort ? [`- Estimated effort: ${task.estimatedEffort}`] : []),
        ...(task.isCriticalPath ? ["- Critical path: Yes"] : []),
        ...(task.canRunInParallel ? ["- Parallelizable: Yes"] : []),
        ...(task.blocker ? [`- Blocker: ${task.blocker}`] : []),
        "",
      ]),
    ];
  });
  const criticalPath = work.plan.filter((task) => task.isCriticalPath).map((task) => task.title);
  const markdown = [
    "# Karya AI Work Plan",
    "",
    `**Work:** ${work.title}`,
    `**Objective:** ${work.request.objective}`,
    ...(work.due ? [`**Deadline:** ${work.due}`] : []),
    "",
    "## Deliverables",
    "",
    markdownList(work.request.deliverables || []),
    "",
    "## Deadline feasibility",
    "",
    work.planMeta
      ? `**${work.planMeta.feasibility.status}** — ${work.planMeta.feasibility.explanation}`
      : "Not available: no generated feasibility assessment is recorded.",
    "",
    "## Critical path",
    "",
    markdownList(criticalPath),
    "",
    ...sections,
    ...(sections.length === 0 ? ["## Tasks", "", "- No plan tasks are recorded."] : []),
  ].join("\\n");
  const report: WorkReport = {
    id: secureId("report"),
    type: "WORK PLAN",
    version,
    createdAt: now,
    markdown,
  };
  work.reports.unshift(report);
  recordSecurityEvent(work, "Export requested", `Work plan version ${version} generated.`);
  persistWorkItems();
  return report;
}

export function generateRequirementsCSV(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const verification = latestVerification(work);
  const verificationByRequirement = new Map(
    (verification?.requirementResults || []).map((result) => [result.requirementId, result.status]),
  );
  const header = [
    "Requirement",
    "Type",
    "Priority",
    "Status",
    "Source",
    "Evidence",
    "Evidence Confidence",
    "Related Deliverable",
    "Related Task",
    "Verification Status",
  ];
  const rows = work.requirements.flatMap((requirement) => {
    const related = work.evidence.filter(
      (item) =>
        requirement.relatedEvidenceIds?.includes(item.id) ||
        item.relatedRequirementIds.includes(requirement.id),
    );
    const evidenceRows = related.length > 0 ? related : [undefined];
    return evidenceRows.map((evidence) =>
      [
        requirement.title,
        requirement.type || "Not recorded",
        requirement.priority || "Not recorded",
        requirement.status,
        `${requirement.source.kind}: ${requirement.source.label}`,
        evidence?.description || "No evidence recorded",
        evidence?.confidence || "No evidence recorded",
        requirement.relatedDeliverableIds?.join("; ") || "Not linked",
        requirement.relatedTaskIds?.join("; ") || "Not linked",
        verificationByRequirement.get(requirement.id) || "Not verified",
      ]
        .map((value) => csvCell(value))
        .join(","),
    );
  });
  const csv = [header.map(csvCell).join(","), ...rows].join("\\n");
  const version = work.reports.filter((report) => report.type === "REQUIREMENTS MATRIX").length + 1;
  const report: WorkReport = {
    id: secureId("report"),
    type: "REQUIREMENTS MATRIX",
    version,
    createdAt: new Date().toISOString(),
    markdown: csv,
  };
  work.reports.unshift(report);
  recordSecurityEvent(
    work,
    "Export requested",
    `Requirements matrix version ${version} generated.`,
  );
  persistWorkItems();
  return report;
}

function createShareToken() {
  if (typeof globalThis.crypto?.getRandomValues !== "function") return undefined;
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createShareLink(workId: string) {
  const work = getWork(workId);
  const token = createShareToken();
  if (!work || !token) return undefined;
  const verification = latestVerification(work);
  const requirements = getRequirementStats(work);
  const snapshot: ShareSnapshot = {
    title: work.title,
    status: readinessStatus(work),
    summary: work.description,
    requirementsSummary: `${requirements["SATISFIED"] || 0}/${work.requirements.length} requirements satisfied`,
    criticalIssues: [
      ...work.findings
        .filter((finding) => finding.severity === "critical" || finding.severity === "blocking")
        .map((finding) => finding.title),
      ...(verification?.findings || [])
        .filter((finding) => finding.severity === "Critical" && finding.status !== "Resolved")
        .map((finding) => finding.title),
    ],
    verificationSummary: verification?.summary || "Verification has not been run for this Work.",
    nextSteps: work.recommendedNextAction ? [work.recommendedNextAction] : [],
    generatedAt: new Date().toISOString(),
  };
  work.shareLink = { token, createdAt: new Date().toISOString(), snapshot };
  recordSecurityEvent(
    work,
    "Share link created",
    "A readiness share link was created from the current Work snapshot.",
  );
  persistWorkItems();
  return work.shareLink;
}

export function revokeShareLink(workId: string) {
  const work = getWork(workId);
  if (!work?.shareLink) return false;
  delete work.shareLink;
  recordSecurityEvent(work, "Share link revoked", "The readiness share link was revoked.");
  persistWorkItems();
  return true;
}

export function getShareSnapshot(token: string) {
  for (const work of workItems) {
    if (work.shareLink?.token === token) return work.shareLink.snapshot;
  }
  return undefined;
}

export function addEvidence(
  workId: string,
  input: Omit<Evidence, "id" | "workId" | "addedDate" | "history">,
) {
  const work = getWork(workId);
  if (!work) return undefined;

  const evidence: Evidence = {
    ...input,
    id: `evidence-${Date.now()}`,
    workId,
    addedDate: nowLabel(),
    history: [
      {
        id: `evidence-history-${Date.now()}`,
        date: nowLabel(),
        change: "Evidence added",
        by: input.addedBy,
      },
    ],
  };

  work.evidence.push(evidence);
  for (const requirementId of evidence.relatedRequirementIds) {
    const requirement = work.requirements.find((item) => item.id === requirementId);
    if (!requirement) continue;
    requirement.relatedEvidenceIds = [...(requirement.relatedEvidenceIds || []), evidence.id];
    requirement.status =
      evidence.confidence === "STRONG EVIDENCE" ? "SATISFIED" : "PARTIALLY SATISFIED";
    requirement.evidence = [
      ...(requirement.evidence ? [requirement.evidence] : []),
      evidence.description,
    ].join("; ");
    requirement.modifiedDate = nowLabel();
    requirement.history = [
      ...(requirement.history || []),
      {
        id: `requirement-history-${Date.now()}-${requirement.id}`,
        date: nowLabel(),
        previousWording: requirement.currentWording || requirement.title,
        newWording: requirement.currentWording || requirement.title,
        changedBy: input.addedBy,
        source: evidence.sourceReference || evidence.source || "Source unavailable.",
        reason: "Evidence relationship updated",
      },
    ];
  }

  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Evidence added: ${evidence.description}`,
    source: evidence.sourceReference || evidence.source || "Source unavailable.",
  });

  generateWorkPlan(workId);
  persistWorkItems();
  return evidence;
}

export function removeEvidence(workId: string, evidenceId: string) {
  const work = getWork(workId);
  if (!work) return;
  const evidence = work.evidence.find((item) => item.id === evidenceId);
  if (!evidence) return;

  work.evidence = work.evidence.filter((item) => item.id !== evidenceId);
  for (const requirement of work.requirements) {
    if (!requirement.relatedEvidenceIds?.includes(evidenceId)) continue;
    requirement.relatedEvidenceIds = requirement.relatedEvidenceIds.filter(
      (id) => id !== evidenceId,
    );
    requirement.status =
      requirement.relatedEvidenceIds.length > 0 ? "PARTIALLY SATISFIED" : "MISSING";
    requirement.modifiedDate = nowLabel();
  }
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Evidence removed: ${evidence.description}`,
  });
  generateWorkPlan(workId);
  persistWorkItems();
}

export function updateRequirement(
  workId: string,
  requirementId: string,
  patch: Partial<Pick<Requirement, "title" | "type" | "priority" | "status" | "notes">>,
  changedBy = "User",
) {
  const work = getWork(workId);
  const requirement = work?.requirements.find((item) => item.id === requirementId);
  if (!work || !requirement) return;

  const previous = requirement.currentWording || requirement.title;
  if (patch.title && patch.title !== previous) {
    requirement.history = [
      ...(requirement.history || []),
      {
        id: `requirement-history-${Date.now()}`,
        date: nowLabel(),
        previousWording: previous,
        newWording: patch.title,
        changedBy,
        reason: "Requirement wording edited",
      },
    ];
    requirement.currentWording = patch.title;
    requirement.title = patch.title;
  }
  Object.assign(requirement, patch);
  requirement.modifiedDate = nowLabel();
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Requirement updated: ${requirement.title}`,
  });
  generateWorkPlan(workId);
  persistWorkItems();
}

export function getRequirementEvidence(work: WorkItem, requirementId: string) {
  const requirement = work.requirements.find((item) => item.id === requirementId);
  if (!requirement) return [];
  return work.evidence.filter((item) => requirement.relatedEvidenceIds?.includes(item.id));
}

export function getRequirementStats(work: WorkItem) {
  const status = (requirement: Requirement) => {
    if (requirement.status === "complete") return "SATISFIED";
    if (requirement.status === "partial") return "PARTIALLY SATISFIED";
    if (requirement.status === "missing") return "MISSING";
    if (requirement.status === "conflict") return "CONTRADICTORY";
    return requirement.status;
  };
  return work.requirements.reduce(
    (result, requirement) => {
      const key = status(requirement);
      result[key] = (result[key] || 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );
}

export function getEvidenceStats(work: WorkItem) {
  return work.evidence.reduce(
    (result, evidence) => {
      result.total += 1;
      if (evidence.confidence === "STRONG EVIDENCE") result.strong += 1;
      if (evidence.confidence === "PARTIAL EVIDENCE") result.partial += 1;
      if (evidence.confidence === "WEAK EVIDENCE") result.weak += 1;
      if (evidence.confidence === "NO EVIDENCE") result.none += 1;
      return result;
    },
    { total: 0, strong: 0, partial: 0, weak: 0, none: 0 },
  );
}

function normalizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.(pdf|docx|doc|pptx|ppt|xlsx|xls|csv|txt|md|png|jpg|jpeg|webp|zip)$/i, "")
    .replace(
      /(?:[-_ ]?(?:copy|final|latest|approved|revised|updated|version|v)?[-_ ]?\d+|[-_ ]?(?:copy|final|latest|approved|revised|updated))$/i,
      "",
    )
    .replace(/[-_ ]+/g, " ")
    .trim();
}

function fileFingerprint(file: WorkFile) {
  if (!file.content) return undefined;
  return `${file.type || "unknown"}:${file.size || ""}:${file.content.trim().toLowerCase()}`;
}

function inferFilePurpose(file: WorkFile): FilePurpose {
  if (file.role === "Final") return "Final deliverable";
  if (file.role === "Working file") return "Working file";
  const label = `${file.name} ${file.category || ""}`.toLowerCase();
  if (label.includes("brief")) return "Brief";
  if (label.includes("requirement") || label.includes("instruction")) return "Requirement source";
  if (label.includes("template")) return "Template";
  if (label.includes("approval") || label.includes("approved")) return "Approval";
  if (label.includes("evidence")) return "Evidence";
  if (label.includes("proposal") || label.includes("budget") || label.includes("reference"))
    return "Supporting material";
  return "Unknown";
}

function fileProcessingStatus(file: WorkFile): FileProcessingStatus {
  const extension = file.name.toLowerCase().split(".").pop() || "";
  const supported = [
    "pdf",
    "docx",
    "doc",
    "pptx",
    "ppt",
    "xlsx",
    "xls",
    "csv",
    "txt",
    "md",
    "png",
    "jpg",
    "jpeg",
    "webp",
  ];
  if (!supported.includes(extension)) return "Unsupported";
  if (!file.content && ["txt", "md", "csv"].includes(extension)) return "Needs review";
  return "Ready";
}

function contentReferences(content: string | undefined) {
  if (!content) return [];
  const references: string[] = [];
  const pattern =
    /(?:see|attached|refer(?:ence)? to|appendix)\s+(?:the\s+)?([a-z0-9_.-]+\.(?:pdf|docx|doc|pptx|ppt|xlsx|xls|csv|png|jpg|jpeg))/gi;
  let match = pattern.exec(content);
  while (match) {
    if (match[1]) references.push(match[1]);
    match = pattern.exec(content);
  }
  return references;
}

export function analyzeFileIntelligence(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const files = work.files;
  const findings: FileIntelligenceFinding[] = [];
  const now = nowLabel();

  for (const file of files) {
    file.likelyPurpose = file.likelyPurpose || inferFilePurpose(file);
    file.processingStatus = fileProcessingStatus(file);
    file.source = file.source || "User upload";
    file.uploadedDate = file.uploadedDate || now;
    file.authorityStatus = file.authorityStatus || "Unknown";
    if (!file.contentFingerprint) {
      const fingerprint = fileFingerprint(file);
      if (fingerprint) file.contentFingerprint = fingerprint;
    }
    file.versionFamily = file.versionFamily || normalizeFileName(file.name);
    file.relatedRequirementIds = file.relatedRequirementIds || [];
    file.relatedEvidenceIds = file.relatedEvidenceIds || [];
    file.relatedFileIds = file.relatedFileIds || [];
  }

  for (let i = 0; i < files.length; i += 1) {
    const left = files[i];
    if (!left) continue;
    for (let j = i + 1; j < files.length; j += 1) {
      const right = files[j];
      if (!right) continue;
      const sameFingerprint =
        left.contentFingerprint &&
        right.contentFingerprint &&
        left.contentFingerprint === right.contentFingerprint;
      const sameFamily =
        left.versionFamily && right.versionFamily && left.versionFamily === right.versionFamily;
      const similarName = normalizeFileName(left.name) === normalizeFileName(right.name);
      if (!sameFingerprint && !sameFamily && !similarName) continue;

      left.relatedFileIds = Array.from(new Set([...(left.relatedFileIds || []), right.id]));
      right.relatedFileIds = Array.from(new Set([...(right.relatedFileIds || []), left.id]));
      left.relationshipConfidence = sameFingerprint
        ? "DIRECT RELATIONSHIP"
        : "POSSIBLE RELATIONSHIP";
      right.relationshipConfidence = sameFingerprint
        ? "DIRECT RELATIONSHIP"
        : "POSSIBLE RELATIONSHIP";

      if (sameFingerprint) {
        findings.push({
          id: `file-finding-duplicate-${left.id}-${right.id}`,
          type: "exact-duplicate",
          severity: "Medium",
          confidence: "High",
          title: "Exact duplicate files detected",
          detail: `${left.name} and ${right.name} have matching available content fingerprints. Neither file was removed or chosen as authoritative.`,
          fileIds: [left.id, right.id],
          recommendedAction: "Keep both, remove one, or explicitly mark the authoritative file.",
          status: "Open",
        });
      } else if (sameFamily || similarName) {
        findings.push({
          id: `file-finding-version-${left.id}-${right.id}`,
          type: "version-conflict",
          severity: "High",
          confidence: "Medium",
          title: "Possible version conflict",
          detail: `${left.name} and ${right.name} appear related, but Karya AI cannot safely determine which version is authoritative from filenames alone.`,
          fileIds: [left.id, right.id],
          recommendedAction: "Review the versions and confirm the authoritative file.",
          status: "Human review",
        });
      }
    }
  }

  for (const file of files) {
    const references = contentReferences(file.content);
    for (const reference of references) {
      const matchingFile = files.find(
        (candidate) => candidate.name.toLowerCase() === reference.toLowerCase(),
      );
      if (matchingFile) {
        file.relatedFileIds = Array.from(
          new Set([...(file.relatedFileIds || []), matchingFile.id]),
        );
        matchingFile.relatedFileIds = Array.from(
          new Set([...(matchingFile.relatedFileIds || []), file.id]),
        );
        file.relationshipConfidence = "DIRECT RELATIONSHIP";
      } else {
        findings.push({
          id: `file-finding-missing-${file.id}-${reference}`,
          type: "missing-referenced-file",
          severity: "High",
          confidence: "High",
          title: "Referenced file missing",
          detail: `${file.name} refers to ${reference}, but no matching file was found in this Work Package.`,
          fileIds: [file.id],
          sourceReference: file.name,
          recommendedAction: `Request or add ${reference}, then reassess the affected requirements and plan tasks.`,
          status: "Open",
        });
      }
    }
  }

  const families = new Map<string, WorkFile[]>();
  for (const file of files) {
    if (!file.versionFamily || file.versionFamily === "") continue;
    const family = families.get(file.versionFamily) || [];
    family.push(file);
    families.set(file.versionFamily, family);
  }
  for (const family of families.values()) {
    const candidates = family.filter(
      (file) => file.authorityStatus === "Candidate" || file.authorityStatus === "Unknown",
    );
    if (candidates.length > 1) {
      findings.push({
        id: `file-finding-authority-${family.map((file) => file.id).join("-")}`,
        type: "multiple-authoritative",
        severity: "High",
        confidence: "Medium",
        title: "Multiple possible authoritative files",
        detail: `${candidates.length} related files remain possible sources of truth. Filename markers such as latest or final were not treated as proof.`,
        fileIds: candidates.map((file) => file.id),
        recommendedAction: "Review the versions and explicitly mark one as authoritative.",
        status: "Human review",
      });
    }
    const hasApproved = family.some((file) => /approved|revised|updated/i.test(file.name));
    if (hasApproved) {
      const older = family.filter((file) => !/approved|revised|updated/i.test(file.name));
      for (const file of older) {
        if (file.authorityStatus !== "Authoritative") file.authorityStatus = "Possibly outdated";
      }
      if (older.length > 0) {
        findings.push({
          id: `file-finding-outdated-${family.map((file) => file.id).join("-")}`,
          type: "possibly-outdated",
          severity: "Medium",
          confidence: "Medium",
          title: "Possible outdated source",
          detail: `An approved, revised, or updated file exists alongside an older-looking version. Karya AI did not automatically replace the older file.`,
          fileIds: family.map((file) => file.id),
          recommendedAction: "Review the versions and confirm which source should be trusted.",
          status: "Human review",
        });
      }
    }
  }

  work.fileFindings = findings;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: now,
    change: `File Intelligence analyzed ${files.length} file${files.length === 1 ? "" : "s"} and found ${findings.length} finding${findings.length === 1 ? "" : "s"}.`,
  });
  persistWorkItems();
  return findings;
}

export function markFileAuthority(
  workId: string,
  fileId: string,
  status: FileAuthorityStatus,
  confirmedBy = "User",
) {
  const work = getWork(workId);
  const file = work?.files.find((item) => item.id === fileId);
  if (!work || !file) return;
  const previous = file.authorityStatus || "Unknown";
  file.authorityStatus = status;
  if (status === "Authoritative") {
    file.authorityConfirmedBy = confirmedBy;
    file.authorityConfirmedDate = nowLabel();
  }
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `File authority changed: ${file.name} · ${previous} → ${status}`,
  });
  analyzeFileIntelligence(workId);
  persistWorkItems();
}

export function updateWorkFile(workId: string, fileId: string, patch: Partial<WorkFile>) {
  const work = getWork(workId);
  const file = work?.files.find((item) => item.id === fileId);
  if (!work || !file) return;
  Object.assign(file, patch);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `File metadata updated: ${file.name}`,
  });
  analyzeFileIntelligence(workId);
  persistWorkItems();
}

export function addCompletedWorkFile(workId: string, input: Omit<WorkFile, "id" | "role">) {
  const work = getWork(workId);
  if (!work) return undefined;
  const file: WorkFile = {
    ...input,
    id: `file-final-${Date.now()}`,
    role: "Final",
    source: input.source || "User upload",
    uploadedDate: input.uploadedDate || nowLabel(),
    likelyPurpose: "Final deliverable",
    processingStatus: fileProcessingStatus(input as WorkFile),
    authorityStatus: "Unknown",
  };
  work.files.push(file);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Completed work uploaded: ${file.name}`,
  });
  analyzeFileIntelligence(workId);
  persistWorkItems();
  return file;
}

function requirementStatusForVerification(
  status: ReqStatus,
): VerificationRequirementResult["status"] {
  if (status === "complete") return "SATISFIED";
  if (status === "partial") return "PARTIALLY SATISFIED";
  if (status === "missing") return "MISSING";
  if (status === "conflict") return "CONTRADICTORY";
  if (status === "SATISFIED") return "SATISFIED";
  if (status === "PARTIALLY SATISFIED") return "PARTIALLY SATISFIED";
  if (status === "MISSING") return "MISSING";
  if (status === "CONTRADICTORY") return "CONTRADICTORY";
  return "NEEDS REVIEW";
}

function contentHasRequirement(content: string, title: string) {
  const words = title
    .toLowerCase()
    .split(/\\W+/)
    .filter((word) => word.length > 4);
  if (words.length === 0) return false;
  const normalized = content.toLowerCase();
  return words.filter((word) => normalized.includes(word)).length >= Math.min(2, words.length);
}

function buildCompletionTest(
  work: WorkItem,
  results: VerificationRequirementResult[],
  submittedFiles: WorkFile[],
) {
  const items: CompletionTestItem[] = results.map((result) => ({
    id: `completion-requirement-${result.requirementId}`,
    type: "CONTENT",
    title:
      work.requirements.find((requirement) => requirement.id === result.requirementId)?.title ||
      "Requirement",
    status:
      result.status === "SATISFIED"
        ? "Pass"
        : result.status === "PARTIALLY SATISFIED"
          ? "Warning"
          : result.status === "NEEDS REVIEW"
            ? "Needs review"
            : "Fail",
    detail: result.finding,
    relatedRequirementIds: [result.requirementId],
  }));
  if (work.due) {
    items.push({
      id: "completion-deadline",
      type: "DEADLINE",
      title: "Required delivery deadline",
      status: "Needs review",
      detail:
        "A deadline exists, but submission timing cannot be verified from the uploaded file alone.",
      relatedRequirementIds: [],
    });
  }
  if (submittedFiles.some((file) => file.processingStatus === "Unsupported")) {
    items.push({
      id: "completion-format",
      type: "FORMAT",
      title: "Supported verification format",
      status: "Needs review",
      detail:
        "At least one submitted file format is not currently supported for reliable verification.",
      relatedRequirementIds: [],
    });
  }
  return items;
}

export function runVerification(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const submittedFiles = work.files.filter((file) => file.role === "Final");
  if (submittedFiles.length === 0) return undefined;
  const content = submittedFiles
    .map((file) => file.content || "")
    .filter(Boolean)
    .join("\\n");
  const results: VerificationRequirementResult[] = [];
  const findings: VerificationFinding[] = [];

  for (const requirement of work.requirements) {
    const baseStatus = requirementStatusForVerification(requirement.status);
    const evidenceIds = requirement.relatedEvidenceIds || [];
    const contentAvailable = content.trim().length > 0;
    let status = baseStatus;
    let finding = "No verification result has been established.";
    if (!contentAvailable) {
      status = "NEEDS REVIEW";
      finding =
        "The submitted format does not expose searchable content, so this requirement needs human review.";
    } else if (baseStatus === "SATISFIED" && !contentHasRequirement(content, requirement.title)) {
      status = "NEEDS REVIEW";
      finding =
        "Supporting evidence exists for the requirement, but the submitted work did not expose a clear matching statement for automated verification.";
    } else if (baseStatus === "MISSING") {
      finding =
        "No supporting evidence or completed-output confirmation was found for this requirement.";
    } else if (baseStatus === "PARTIALLY SATISFIED") {
      finding =
        "The requirement has some supporting evidence, but the available Work data does not establish that every part is complete.";
    } else if (baseStatus === "CONTRADICTORY") {
      finding =
        "Available sources or evidence conflict. The requirement cannot be treated as satisfied without review.";
    } else if (baseStatus === "SATISFIED") {
      finding =
        "The requirement is supported by the current evidence and a matching statement was found in the submitted work.";
    } else {
      finding =
        "The requirement is present in the Work, but the submitted work does not yet establish completion.";
    }

    const result: VerificationRequirementResult = {
      requirementId: requirement.id,
      status,
      finding,
      evidenceIds,
      outputFileIds: submittedFiles.map((file) => file.id),
    };
    results.push(result);

    if (status !== "SATISFIED") {
      const severity: VerificationSeverity =
        requirement.priority === "CRITICAL"
          ? "Critical"
          : requirement.priority === "HIGH"
            ? "High"
            : "Medium";
      const type: VerificationFindingType =
        status === "MISSING"
          ? "missing-requirement"
          : status === "PARTIALLY SATISFIED"
            ? "partial-requirement"
            : status === "CONTRADICTORY"
              ? "contradiction"
              : "human-review";
      findings.push({
        id: `verification-finding-${Date.now()}-${requirement.id}`,
        type,
        severity,
        title:
          status === "MISSING"
            ? "Requirement not satisfied"
            : status === "PARTIALLY SATISFIED"
              ? "Requirement partially satisfied"
              : status === "CONTRADICTORY"
                ? "Conflicting requirement evidence"
                : "Human review required",
        detail: `${requirement.title}: ${finding}`,
        relatedRequirementIds: [requirement.id],
        relatedEvidenceIds: evidenceIds,
        relatedFileIds: submittedFiles.map((file) => file.id),
        ...(requirement.source.label ? { sourceReference: requirement.source.label } : {}),
        confidence:
          status === "NEEDS REVIEW" ? "Low" : status === "CONTRADICTORY" ? "Medium" : "High",
        recommendedAction:
          status === "NEEDS REVIEW"
            ? "Review the submitted work and confirm the requirement manually."
            : "Add the missing support or correct the submitted work, then rerun verification.",
        status: status === "NEEDS REVIEW" ? "Human review" : "Open",
      });
    }
    requirement.status = status;
    requirement.modifiedDate = nowLabel();
    requirement.history = [
      ...(requirement.history || []),
      {
        id: `requirement-history-verification-${Date.now()}-${requirement.id}`,
        date: nowLabel(),
        previousWording: requirement.currentWording || requirement.title,
        newWording: requirement.currentWording || requirement.title,
        changedBy: "Verification Engine",
        source: submittedFiles.map((file) => file.name).join(", "),
        reason: `Verification result: ${status}`,
      },
    ];
  }

  for (const fileFinding of work.fileFindings || []) {
    if (fileFinding.status === "Open" || fileFinding.status === "Human review") {
      findings.push({
        id: `verification-file-finding-${fileFinding.id}`,
        type:
          fileFinding.type === "missing-referenced-file"
            ? "missing-attachment"
            : fileFinding.type === "possibly-outdated"
              ? "outdated-source"
              : "human-review",
        severity: fileFinding.severity,
        title: fileFinding.title,
        detail: fileFinding.detail,
        relatedRequirementIds: [],
        relatedEvidenceIds: [],
        relatedFileIds: fileFinding.fileIds,
        ...(fileFinding.sourceReference ? { sourceReference: fileFinding.sourceReference } : {}),
        recommendedAction: fileFinding.recommendedAction,
        status: fileFinding.status === "Human review" ? "Human review" : "Open",
      });
    }
  }

  const completionTest = buildCompletionTest(work, results, submittedFiles);
  const criticalFindings = findings.filter(
    (finding) => finding.severity === "Critical" && finding.status === "Open",
  );
  const openFindings = findings.filter((finding) => finding.status === "Open");
  const humanReview = findings.some(
    (finding) =>
      finding.status === "Human review" ||
      (finding.severity === "Critical" && finding.status !== "Resolved"),
  );
  const allSatisfied =
    results.length > 0 &&
    results.every((result) => result.status === "SATISFIED") &&
    openFindings.length === 0;
  const finalStatus: VerificationFinalStatus = humanReview
    ? "HUMAN REVIEW REQUIRED"
    : criticalFindings.length > 0 ||
        results.some((result) => result.status === "MISSING" || result.status === "CONTRADICTORY")
      ? "NOT READY"
      : allSatisfied
        ? "READY TO SUBMIT"
        : "READY WITH WARNINGS";

  const version = (work.verificationRuns?.length || 0) + 1;
  const run: VerificationRun = {
    id: `verification-${Date.now()}`,
    date: nowLabel(),
    version,
    submittedFileIds: submittedFiles.map((file) => file.id),
    requirementResults: results,
    findings,
    completionTest,
    finalStatus,
    summary: `${results.filter((result) => result.status === "SATISFIED").length}/${results.length} requirements satisfied · ${findings.filter((finding) => finding.severity === "Critical").length} critical issues · ${findings.length} total findings`,
  };

  work.verificationRuns = [...(work.verificationRuns || []), run];
  work.verify = results.map((result) => ({
    id: `verify-${result.requirementId}`,
    title:
      work.requirements.find((requirement) => requirement.id === result.requirementId)?.title ||
      "Requirement",
    status:
      result.status === "SATISFIED"
        ? "satisfied"
        : result.status === "NEEDS REVIEW"
          ? "review"
          : "missing",
    note: result.finding,
  }));
  work.state =
    finalStatus === "READY TO SUBMIT"
      ? "ready-to-submit"
      : finalStatus === "HUMAN REVIEW REQUIRED"
        ? "review"
        : "blocked";
  work.recommendedNextAction =
    finalStatus === "READY TO SUBMIT"
      ? "Proceed with the handoff or submission."
      : findings.find((finding) => finding.status !== "Resolved")?.recommendedAction ||
        "Review the verification findings and rerun after corrections.";
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Verification completed · version ${version} · ${finalStatus}`,
  });
  work.timeline.unshift({
    id: `timeline-${Date.now()}`,
    date: nowLabel(),
    title: "Verification completed",
    detail: run.summary,
  });
  persistWorkItems();
  return run;
}

export function updateVerificationFinding(
  workId: string,
  runId: string,
  findingId: string,
  status: "Resolved" | "Human review",
) {
  const work = getWork(workId);
  const run = work?.verificationRuns.find((item) => item.id === runId);
  const finding = run?.findings.find((item) => item.id === findingId);
  if (!work || !run || !finding) return;
  finding.status = status;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Verification finding ${status.toLowerCase()}: ${finding.title}`,
  });
  persistWorkItems();
}

export function generateHandoffPacket(workId: string): HandoffPacket | undefined {
  const work = getWork(workId);
  if (!work) return undefined;

  const now = nowLabel();
  const completedReqs = work.requirements.filter((r) => r.status === "SATISFIED");
  const openReqs = work.requirements.filter((r) => r.status !== "SATISFIED");
  const completedTasks = work.plan.filter((t) => t.status === "done");
  const openTasks = work.plan.filter((t) => t.status !== "done");
  const openQuestions = work.questions.filter((q) => q.state !== "resolved");
  const authoritativeFiles = work.files.filter((f) => f.authorityStatus === "Authoritative");
  const currentStatus =
    (work.verificationRuns?.length || 0) > 0
      ? work.verificationRuns[work.verificationRuns.length - 1]?.finalStatus ||
        "READY WITH WARNINGS"
      : work.state === "ready-to-submit"
        ? "READY TO SUBMIT"
        : work.state === "blocked"
          ? "NOT READY"
          : "READY WITH WARNINGS";

  const whatWasCompleted = [
    ...completedReqs.map((r) => `Requirement satisfied: ${r.title}`),
    ...completedTasks.map((t) => `Task completed: ${t.title}`),
    ...(work.verificationRuns?.length > 0
      ? [`Verification run #${work.verificationRuns.length}: ${currentStatus}`]
      : []),
  ];

  const whatRemains = [
    ...openReqs.map((r) => `Unresolved requirement (${r.status}): ${r.title}`),
    ...openTasks.slice(0, 3).map((t) => `Pending task: ${t.title}`),
    ...openQuestions.map((q) => `Unanswered question: ${q.question}`),
  ];

  const currentFiles = work.files.map((f) => ({
    name: f.name,
    type: f.type || "file",
    purpose: f.likelyPurpose || "Unknown",
    status: f.authorityStatus || "Unknown",
  }));

  const authFileNames = authoritativeFiles.map((f) => f.name);
  const risks = (work.fileFindings || []).map((f) => ({
    title: f.title,
    severity: f.severity,
    action: f.recommendedAction,
  }));

  const nextSteps =
    openTasks.length > 0 && openTasks[0]?.title
      ? [openTasks[0].title]
      : [work.recommendedNextAction || "Review current state and continue work."];

  const packet: HandoffPacket = {
    id: `handoff-${Date.now()}`,
    version: (work.handoffPackets?.length || 0) + 1,
    date: now,
    readinessStatus:
      currentStatus === "READY TO SUBMIT"
        ? "READY"
        : currentStatus === "NOT READY"
          ? "NOT READY"
          : "READY WITH WARNINGS",
    whatWasRequested: work.request.objective || work.description,
    whatWasCompleted,
    whatRemains,
    currentFiles,
    authoritativeFiles: authFileNames.length > 0 ? authFileNames : [],
    decisions: work.decisions || [],
    risks,
    openQuestions: openQuestions.map((q) => ({
      question: q.question,
      priority: q.priority,
      ...(q.personResponsible ? { owner: q.personResponsible } : {}),
    })),
    nextSteps,
    summary: {
      currentStatus,
      description: work.request.objective || work.description,
      completed: whatWasCompleted.slice(0, 4),
      open: whatRemains.slice(0, 4),
      decisions: (work.decisions || []).slice(0, 3).map((d) => d.text),
      authoritativeFiles:
        authFileNames.length > 0 ? authFileNames : ["No authoritative file confirmed."],
      risks: risks.map((r) => r.title),
      nextAction: nextSteps[0] || "Review current state.",
    },
  };

  work.handoffPackets = [...(work.handoffPackets || []), packet];
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: now,
    change: `Handoff generated · Version ${packet.version} · ${currentStatus}`,
  });
  persistWorkItems();
  return packet;
}

export function addDecision(
  workId: string,
  text: string,
  reason?: string,
  decidedBy = "User",
  source?: string,
) {
  const work = getWork(workId);
  if (!work || !text.trim()) return;
  const decision: WorkDecision = {
    id: `decision-${Date.now()}`,
    text: text.trim(),
    ...(reason?.trim() ? { reason: reason.trim() } : {}),
    decidedBy,
    date: nowLabel(),
    ...(source?.trim() ? { source: source.trim() } : {}),
  };
  work.decisions.unshift(decision);
  work.decisionHistory.unshift({
    id: `decision-hist-${Date.now()}`,
    date: nowLabel(),
    newDecision: decision.text,
    ...(decision.source ? { source: decision.source } : {}),
    ...(decision.decidedBy ? { changedBy: decision.decidedBy } : {}),
    impact: "New decision recorded.",
  });
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Decision recorded: ${decision.text}`,
  });
  generateHandoffPacket(workId);
  persistWorkItems();
}

export function updateDecision(
  workId: string,
  decisionId: string,
  newText: string,
  reason?: string,
  source?: string,
) {
  const work = getWork(workId);
  if (!work) return;
  const decision = work.decisions.find((d) => d.id === decisionId);
  if (!decision) return;
  const oldText = decision.text;
  decision.text = newText.trim();
  if (reason) decision.reason = reason.trim();
  if (source) decision.source = source.trim();
  decision.previousDecision = oldText;

  work.decisionHistory.unshift({
    id: `decision-hist-${Date.now()}`,
    date: nowLabel(),
    oldDecision: oldText,
    newDecision: decision.text,
    ...(decision.source ? { source: decision.source } : {}),
    ...(decision.decidedBy ? { changedBy: decision.decidedBy } : {}),
    impact: "Decision updated; may affect related requirements or tasks.",
  });
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Decision updated: ${oldText} → ${decision.text}`,
  });
  generateHandoffPacket(workId);
  persistWorkItems();
}

export function addOpenIssue(workId: string, input: Omit<OpenIssue, "id" | "createdDate">) {
  const work = getWork(workId);
  if (!work) return;
  const issue: OpenIssue = {
    ...input,
    id: `issue-${Date.now()}`,
    createdDate: nowLabel(),
  };
  work.openIssues.unshift(issue);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Open issue created: ${issue.issue}`,
  });
  persistWorkItems();
}

export function updateOpenIssueStatus(
  workId: string,
  issueId: string,
  status: OpenIssue["status"],
) {
  const work = getWork(workId);
  if (!work) return;
  const issue = work.openIssues.find((i) => i.id === issueId);
  if (!issue) return;
  issue.status = status;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Open issue status updated: ${issue.issue} · ${status}`,
  });
  persistWorkItems();
}

function collaborationIsEnabled(work: WorkItem) {
  return work.collaborationEnabled === true;
}

export function setCollaborationEnabled(workId: string, enabled: boolean) {
  const work = getWork(workId);
  if (!work) return;
  work.collaborationEnabled = enabled;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Collaboration ${enabled ? "enabled" : "disabled"} for this Work`,
  });
  persistWorkItems();
}

export function addAssignment(
  workId: string,
  input: Omit<ResponsibilityAssignment, "id" | "assignedDate">,
) {
  const work = getWork(workId);
  if (!work || !collaborationIsEnabled(work) || !input.person.trim()) return;
  const assignment: ResponsibilityAssignment = {
    ...input,
    id: `assignment-${Date.now()}`,
    assignedDate: nowLabel(),
  };
  work.assignments.unshift(assignment);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Responsibility assigned to ${assignment.person}: ${assignment.role}`,
  });
  persistWorkItems();
}

export function updateAssignmentStatus(
  workId: string,
  assignmentId: string,
  status: ResponsibilityAssignment["status"],
) {
  const work = getWork(workId);
  if (!work || !collaborationIsEnabled(work)) return;
  const assignment = work.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return;
  assignment.status = status;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Responsibility status updated: ${assignment.person} · ${status}`,
  });
  persistWorkItems();
}

function extractMentions(text: string) {
  return Array.from(
    new Set((text.match(/@[A-Za-z0-9_-]+/g) || []).map((mention) => mention.slice(1))),
  );
}

export function addWorkComment(
  workId: string,
  input: Omit<WorkComment, "id" | "createdAt" | "mentionedUsers">,
) {
  const work = getWork(workId);
  if (!work || !collaborationIsEnabled(work) || !input.text.trim() || !input.author.trim()) return;
  const comment: WorkComment = {
    ...input,
    id: `comment-${Date.now()}`,
    createdAt: nowLabel(),
    mentionedUsers: extractMentions(input.text),
  };
  work.comments.unshift(comment);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Comment added by ${comment.author}`,
  });
  persistWorkItems();
}

export function addApproval(workId: string, input: Omit<ApprovalRecord, "id" | "date">) {
  const work = getWork(workId);
  if (!work || !collaborationIsEnabled(work)) return;
  const approval: ApprovalRecord = { ...input, id: `approval-${Date.now()}`, date: nowLabel() };
  work.approvals.unshift(approval);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Approval recorded: ${approval.status} by ${approval.reviewer}`,
  });
  persistWorkItems();
}

export function generateCommunicationDraft(
  workId: string,
  purpose: CommunicationDraft["purpose"],
  tone: CommunicationDraft["tone"] = "Professional",
  length: CommunicationDraft["length"] = "Short",
) {
  const work = getWork(workId);
  if (!work) return undefined;
  const openQuestions = work.questions.filter((q) => q.state !== "resolved");
  const openRequirements = work.requirements.filter((r) => r.status !== "SATISFIED");
  const blockedTasks = work.plan.filter(
    (task) => task.status === "blocked" || task.status === "waiting",
  );
  const latestRun = work.verificationRuns?.[work.verificationRuns.length - 1];
  const authoritativeFiles = work.files
    .filter((file) => file.authorityStatus === "Authoritative")
    .map((file) => file.name);
  const greeting = tone === "Friendly" ? "Hi," : tone === "Formal" ? "Dear colleague," : "Hello,";
  const signoff = tone === "Friendly" ? "Thanks." : tone === "Formal" ? "Regards." : "Thank you.";
  const context =
    purpose === "Clarification"
      ? openQuestions.length > 0
        ? `I need clarification on: ${openQuestions
            .slice(0, 3)
            .map((q) => q.question)
            .join("; ")}.`
        : openRequirements.length > 0
          ? `Could you clarify the unresolved requirement: ${openRequirements[0]?.title || "the current requirement"}?`
          : "No unresolved clarification item is recorded in this Work."
      : purpose === "Status update"
        ? `${work.title} has ${work.plan.filter((task) => task.status === "done").length} completed plan task(s). ${openRequirements.length} requirement(s) remain unresolved${blockedTasks.length > 0 ? `, and ${blockedTasks.length} task(s) are blocked or waiting` : ""}.`
        : purpose === "Handoff"
          ? `The current Work state is ready for continuation. ${work.recommendedNextAction || "Please review the open items before continuing."}${authoritativeFiles.length > 0 ? ` Use ${authoritativeFiles.join(", ")} as the confirmed source file(s).` : " No authoritative file has been confirmed."}`
          : purpose === "Delivery"
            ? `The completed work for ${work.title} is attached. ${latestRun ? `The latest verification status is ${latestRun.finalStatus}.` : "Verification has not been run yet."}`
            : `This Work is currently ${work.state}. ${work.recommendedNextAction || "Please review the blockers and next action."}`;
  const extra =
    length === "Detailed"
      ? `\n\nRelevant open items: ${[...openRequirements.map((r) => r.title), ...openQuestions.map((q) => q.question)].slice(0, 5).join("; ") || "None recorded."}`
      : "";
  const text = `${greeting}\n\n${context}${extra}\n\n${signoff}`;
  const draft: CommunicationDraft = {
    id: `message-${Date.now()}`,
    purpose,
    tone,
    length,
    text,
    createdAt: nowLabel(),
    sourceObjectIds: [
      ...openQuestions.map((q) => q.id),
      ...openRequirements.map((r) => r.id),
      ...blockedTasks.map((task) => task.id),
    ],
  };
  work.communicationDrafts.unshift(draft);
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `${purpose} message draft generated`,
  });
  persistWorkItems();
  return draft;
}

export function editCommunicationDraft(workId: string, draftId: string, text: string) {
  const work = getWork(workId);
  const draft = work?.communicationDrafts.find((item) => item.id === draftId);
  if (!work || !draft || !text.trim()) return;
  draft.text = text;
  draft.editedAt = nowLabel();
  persistWorkItems();
}

export function applyTemplateToWork(workId: string, templateId: string) {
  const work = getWork(workId);
  const template = [...templates, ...userTemplates].find((item) => item.id === templateId);
  if (!work || !template) return;
  work.templateId = template.id;
  for (const check of template.checks) {
    if (work.requirements.some((requirement) => requirement.title === check)) continue;
    work.requirements.push({
      id: `template-req-${Date.now()}-${work.requirements.length}`,
      title: check,
      status: "NOT STARTED",
      why: "Added from the selected Work template.",
      evidence: "Not established.",
      source: { kind: "confirmed", label: `Template: ${template.name}` },
      action: "Address this template check before completion.",
      workId,
      type: "MANDATORY",
      priority: "MEDIUM",
      originalWording: check,
      currentWording: check,
      createdDate: nowLabel(),
      modifiedDate: nowLabel(),
      relatedEvidenceIds: [],
      relatedTaskIds: [],
      relatedQuestionIds: [],
      history: [],
    });
  }
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Template applied: ${template.name}`,
  });
  persistWorkItems();
}

function canonicalRequirementStatus(status: ReqStatus) {
  if (status === "complete") return "SATISFIED";
  if (status === "partial") return "PARTIALLY SATISFIED";
  if (status === "missing") return "MISSING";
  if (status === "conflict") return "CONTRADICTORY";
  return status;
}

function taskEffort(group: PlanGroup, complexity: number) {
  const ranges: Record<PlanGroup, [number, number]> = {
    PREPARATION: [0.5, 1.5],
    RESEARCH: [1, 3],
    PRODUCTION: [2, 5],
    REVIEW: [0.5, 1.5],
    APPROVAL: [0.25, 1],
    DELIVERY: [0.25, 1],
  };
  const [min, max] = ranges[group];
  const multiplier = Math.max(1, Math.min(3, complexity));
  return `${Math.ceil(min * multiplier)}–${Math.ceil(max * multiplier)} hours`;
}

function estimatePlanEffort(tasks: PlanTask[]) {
  let min = 0;
  let max = 0;
  for (const task of tasks) {
    const match = task.estimatedEffort?.match(/(\d+)–(\d+)/);
    if (match) {
      min += Number(match[1]);
      max += Number(match[2]);
    }
  }
  return min || max ? `${min}–${max} hours` : undefined;
}

function makePlanTask(task: Omit<PlanTask, "id"> & { id: string }, existing: PlanTask[]): PlanTask {
  const previous = existing.find((item) => item.id === task.id);
  if (!previous?.userModified) return task;
  return {
    ...task,
    ...previous,
    ...(task.dependencies ? { dependencies: task.dependencies } : {}),
    ...(task.dependencyReasons ? { dependencyReasons: task.dependencyReasons } : {}),
    ...(task.blockedByTaskIds ? { blockedByTaskIds: task.blockedByTaskIds } : {}),
    ...(task.relatedRequirementIds ? { relatedRequirementIds: task.relatedRequirementIds } : {}),
    ...(task.relatedQuestionIds ? { relatedQuestionIds: task.relatedQuestionIds } : {}),
    ...(task.evidenceRequired ? { evidenceRequired: task.evidenceRequired } : {}),
    ...(task.isCriticalPath !== undefined ? { isCriticalPath: task.isCriticalPath } : {}),
  };
}

export function generateWorkPlan(workId: string) {
  const work = getWork(workId);
  if (!work) return undefined;

  const existing = work.plan || [];
  const tasks: PlanTask[] = [];
  const mustQuestions = work.questions.filter(
    (question) =>
      question.priority === "MUST ANSWER BEFORE STARTING" && question.state !== "resolved",
  );
  const missingFiles = work.files.filter((file) => file.role === "Missing");
  const criticalRequirements = work.requirements.filter(
    (requirement) =>
      requirement.priority === "CRITICAL" &&
      ["MISSING", "CONTRADICTORY", "NEEDS REVIEW", "missing", "conflict"].includes(
        canonicalRequirementStatus(requirement.status),
      ),
  );
  const requirementIds = work.requirements.map((requirement) => requirement.id);
  const deliverables = work.request.deliverables?.filter(Boolean) || [];
  const sourceNames = work.files.filter((file) => file.role !== "Missing").map((file) => file.name);

  const addTask = (task: PlanTask) => {
    tasks.push(makePlanTask(task, existing));
  };

  if (mustQuestions.length > 0 || criticalRequirements.length > 0 || missingFiles.length > 0) {
    const questionIds = mustQuestions.map((question) => question.id);
    const requirementIdsForPreparation = criticalRequirements.map((requirement) => requirement.id);
    const blockers = [
      ...mustQuestions.map((question) => question.question),
      ...criticalRequirements.map(
        (requirement) =>
          `${requirement.title} is ${canonicalRequirementStatus(requirement.status).toLowerCase()}`,
      ),
      ...missingFiles.map((file) => `${file.name} is missing`),
    ];
    const preparationSourceReference = work.findings?.find(
      (finding) => finding.status === "open",
    )?.sourceReference;
    addTask({
      id: "task-preparation-clarify",
      title: "Resolve the open questions and critical input gaps",
      group: "PREPARATION",
      status: "blocked",
      objective:
        "Remove the uncertainties and missing inputs that would create material rework or incorrect output.",
      inputs: blockers,
      expectedOutput: "Confirmed answers, available inputs, and an updated readiness state.",
      dependencies: [],
      dependencyReasons: [],
      evidenceRequired: ["Recorded answer or source confirmation"],
      relatedRequirementIds: requirementIdsForPreparation,
      relatedDeliverableIds: deliverables,
      relatedQuestionIds: questionIds,
      relatedRiskIds: [],
      evidenceIds: [],
      estimatedEffort: taskEffort("PREPARATION", blockers.length),
      isCriticalPath: true,
      canRunInParallel: false,
      blocker: blockers.join("; "),
      blockedByTaskIds: [],
      ...(preparationSourceReference ? { sourceReference: preparationSourceReference } : {}),
    });
  }

  const preparationTaskId = tasks[tasks.length - 1]?.id;
  const preparationIsBlocked = Boolean(
    preparationTaskId && tasks[tasks.length - 1]?.status === "blocked",
  );
  const researchTaskId = "task-research-sources";
  addTask({
    id: researchTaskId,
    title: "Review and organize the supplied sources",
    group: "RESEARCH",
    status: missingFiles.length > 0 || preparationIsBlocked ? "blocked" : "ready",
    objective:
      "Create a source-backed understanding of the request, requirements, constraints, and available evidence.",
    inputs: sourceNames,
    expectedOutput: "An organized evidence map and confirmed requirement context.",
    dependencies: preparationTaskId ? [preparationTaskId] : [],
    dependencyReasons: preparationTaskId ? ["Open preparation items must be resolved first."] : [],
    evidenceRequired: ["Source map with original references"],
    relatedRequirementIds: requirementIds,
    relatedDeliverableIds: deliverables,
    relatedQuestionIds: mustQuestions.map((question) => question.id),
    relatedRiskIds: [],
    evidenceIds: work.evidence.map((evidence) => evidence.id),
    estimatedEffort: taskEffort("RESEARCH", Math.max(1, sourceNames.length / 2)),
    isCriticalPath: true,
    canRunInParallel: false,
    ...(missingFiles.length > 0
      ? {
          blocker: `Required files are missing: ${missingFiles.map((file) => file.name).join(", ")}.`,
        }
      : preparationIsBlocked
        ? { blocker: "Resolve preparation questions and critical inputs first." }
        : {}),
    blockedByTaskIds: preparationTaskId ? [preparationTaskId] : [],
  });

  const productionDeliverables =
    deliverables.length > 0 ? deliverables : [work.request.outcome || work.request.action];
  const productionTaskIds: string[] = [];
  productionDeliverables.forEach((deliverable, index) => {
    const id = `task-production-${index + 1}`;
    productionTaskIds.push(id);
    addTask({
      id,
      title: `Produce: ${deliverable}`,
      group: "PRODUCTION",
      status: "waiting",
      objective: `Create the deliverable required by the confirmed request: ${deliverable}.`,
      inputs: ["Confirmed requirements", "Organized source context"],
      expectedOutput: deliverable,
      dependencies: [researchTaskId],
      dependencyReasons: ["The source-backed context must be organized before production begins."],
      evidenceRequired: ["Completed deliverable linked to supporting evidence"],
      relatedRequirementIds: requirementIds,
      relatedDeliverableIds: [deliverable],
      relatedQuestionIds: [],
      relatedRiskIds:
        work.findings?.filter((finding) => finding.type === "risk").map((finding) => finding.id) ||
        [],
      evidenceIds: [],
      estimatedEffort: taskEffort("PRODUCTION", Math.max(1, deliverable.length / 40)),
      isCriticalPath: index === 0,
      canRunInParallel: productionDeliverables.length > 1,
      blockedByTaskIds: [researchTaskId],
    });
  });

  const reviewTaskId = "task-review-requirements";
  addTask({
    id: reviewTaskId,
    title: "Review the completed work against requirements",
    group: "REVIEW",
    status: "waiting",
    objective:
      "Check the output against every relevant requirement and identify unsupported claims or missing evidence.",
    inputs: ["Completed deliverables", "Requirements", "Evidence map"],
    expectedOutput: "Verification results with unresolved issues clearly recorded.",
    dependencies: productionTaskIds,
    dependencyReasons: ["All required deliverables must exist before final review."],
    evidenceRequired: ["Verification record and requirement status update"],
    relatedRequirementIds: requirementIds,
    relatedDeliverableIds: deliverables,
    relatedQuestionIds: [],
    relatedRiskIds: [],
    evidenceIds: [],
    estimatedEffort: taskEffort("REVIEW", Math.max(1, requirementIds.length / 3)),
    isCriticalPath: true,
    canRunInParallel: false,
    blockedByTaskIds: productionTaskIds,
  });

  const approvalRequirements = work.requirements.filter(
    (requirement) => requirement.type === "APPROVAL-REQUIRED",
  );
  const approvalTaskId = approvalRequirements.length > 0 ? "task-approval" : undefined;
  if (approvalTaskId) {
    addTask({
      id: approvalTaskId,
      title: "Obtain the required approval",
      group: "APPROVAL",
      status: "waiting",
      objective:
        "Obtain explicit approval for requirements that cannot be satisfied without stakeholder confirmation.",
      inputs: approvalRequirements.map((requirement) => requirement.title),
      expectedOutput: "Recorded approval linked to the relevant requirements.",
      dependencies: [reviewTaskId],
      dependencyReasons: ["Approval follows completion review."],
      evidenceRequired: ["Approval record or user confirmation"],
      relatedRequirementIds: approvalRequirements.map((requirement) => requirement.id),
      relatedDeliverableIds: deliverables,
      relatedQuestionIds: [],
      relatedRiskIds: [],
      evidenceIds: [],
      estimatedEffort: taskEffort("APPROVAL", 1),
      isCriticalPath: true,
      canRunInParallel: false,
      blockedByTaskIds: [reviewTaskId],
    });
  }

  const deliveryTaskId = "task-delivery";
  addTask({
    id: deliveryTaskId,
    title: "Submit the verified work",
    group: "DELIVERY",
    status: "waiting",
    objective: "Deliver the verified output to the stated audience or destination.",
    inputs: ["Verified deliverables", "Confirmed audience"],
    expectedOutput: "Submitted work with a recorded delivery or handoff event.",
    dependencies: [approvalTaskId || reviewTaskId],
    dependencyReasons: [
      approvalTaskId
        ? "Required approval must be recorded before delivery."
        : "Final review must be complete before delivery.",
    ],
    evidenceRequired: ["Submission, delivery, or handoff confirmation"],
    relatedRequirementIds: requirementIds,
    relatedDeliverableIds: deliverables,
    relatedQuestionIds: [],
    relatedRiskIds: [],
    evidenceIds: [],
    estimatedEffort: taskEffort("DELIVERY", 1),
    isCriticalPath: true,
    canRunInParallel: false,
    blockedByTaskIds: [approvalTaskId || reviewTaskId],
  });

  const dependencies: PlanDependency[] = [];
  for (const task of tasks) {
    for (const prerequisiteTaskId of task.dependencies || []) {
      dependencies.push({
        id: `dependency-${prerequisiteTaskId}-${task.id}`,
        prerequisiteTaskId,
        dependentTaskId: task.id,
        reason: task.dependencyReasons?.[0] || "Prerequisite task must be complete.",
        type: "task",
        status: "open",
      });
    }
  }

  const criticalPathTaskIds = tasks.filter((task) => task.isCriticalPath).map((task) => task.id);
  const parallelGroups = productionDeliverables.length > 1 ? [productionTaskIds] : [];
  const unresolvedDependencies = tasks.filter(
    (task) => task.status === "blocked" || task.status === "waiting",
  ).length;
  const openQuestions =
    mustQuestions.length +
    work.questions.filter((question) => question.state !== "resolved").length;
  const feasibilityStatus: DeadlineFeasibility = !work.due
    ? "INSUFFICIENT INFORMATION"
    : tasks.some((task) => task.status === "blocked")
      ? "BLOCKED"
      : openQuestions > 0 || criticalRequirements.length > 0
        ? "FEASIBLE WITH WARNINGS"
        : "FEASIBLE";
  const estimatedEffort = estimatePlanEffort(tasks);
  const feasibilityExplanation = !work.due
    ? "A deadline has not been provided, so available time cannot be compared with the estimated work."
    : feasibilityStatus === "BLOCKED"
      ? `${tasks.filter((task) => task.status === "blocked").length} plan task(s) cannot proceed because required inputs or answers are unresolved.`
      : feasibilityStatus === "FEASIBLE WITH WARNINGS"
        ? "The plan can proceed, but unresolved questions or critical requirements may affect the final schedule."
        : "The stated deadline appears achievable based on the current work inputs and dependency chain.";

  const previousMeta = work.planMeta;
  const nextVersion = (previousMeta?.version || 0) + 1;
  const history = [
    ...(previousMeta?.history || []),
    {
      id: `plan-history-${Date.now()}`,
      date: nowLabel(),
      change: previousMeta
        ? "Work Plan regenerated from current Work data"
        : "Work Plan generated from current Work data",
      reason: previousMeta
        ? "Meaningful Work information changed or user requested recalculation."
        : "Request understanding confirmed.",
      affectedTaskIds: tasks.map((task) => task.id),
    },
  ];

  work.plan = tasks;
  work.planMeta = {
    tasks,
    dependencies,
    criticalPathTaskIds,
    parallelGroups,
    feasibility: {
      status: feasibilityStatus,
      explanation: feasibilityExplanation,
      ...(estimatedEffort ? { estimatedEffort } : {}),
      ...(work.due ? { availableTime: "Deadline provided; working hours not provided." } : {}),
      unresolvedDependencyCount: unresolvedDependencies,
    },
    history,
    version: nextVersion,
    lastGeneratedAt: nowLabel(),
  };

  for (const requirement of work.requirements) {
    requirement.relatedTaskIds = tasks
      .filter((task) => task.relatedRequirementIds?.includes(requirement.id))
      .map((task) => task.id);
  }
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Work Plan ${previousMeta ? "regenerated" : "generated"} · version ${nextVersion}`,
  });
  work.timeline.unshift({
    id: `timeline-${Date.now()}`,
    date: nowLabel(),
    title: "Work Plan updated",
    detail: feasibilityExplanation,
  });
  persistWorkItems();
  return work.planMeta;
}

export function updatePlanTask(workId: string, taskId: string, patch: Partial<PlanTask>) {
  const work = getWork(workId);
  if (!work) return;
  const task = work.plan.find((item) => item.id === taskId);
  if (!task) return;
  Object.assign(task, patch, { userModified: true });
  if (work.planMeta) work.planMeta.tasks = work.plan;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Work Plan task edited: ${task.title}`,
  });
  persistWorkItems();
}

export function addPlanTask(workId: string, title: string, group: PlanGroup = "PRODUCTION") {
  const work = getWork(workId);
  if (!work || !title.trim()) return;
  const task: PlanTask = {
    id: `task-user-${Date.now()}`,
    title: title.trim(),
    group,
    status: "not-started",
    objective: title.trim(),
    inputs: [],
    expectedOutput: "User-defined output.",
    dependencies: [],
    dependencyReasons: [],
    evidenceRequired: [],
    relatedRequirementIds: [],
    relatedDeliverableIds: [],
    relatedQuestionIds: [],
    relatedRiskIds: [],
    evidenceIds: [],
    isCriticalPath: false,
    canRunInParallel: false,
    blockedByTaskIds: [],
    userModified: true,
  };
  work.plan.push(task);
  if (work.planMeta) work.planMeta.tasks = work.plan;
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: nowLabel(),
    change: `Plan task added: ${task.title}`,
  });
  persistWorkItems();
}

export function updatePlanTaskStatus(workId: string, taskId: string, status: PlanTaskStatus) {
  updatePlanTask(workId, taskId, { status });
}

export function archiveWork(id: string) {
  const item = workItems.find((w) => w.id === id);
  if (item) {
    item.archived = true;
    item.activity.unshift({
      id: `act-${Date.now()}`,
      when: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      change: "Work archived",
    });
    persistWorkItems();
  }
}

export function restoreWork(id: string) {
  const item = workItems.find((w) => w.id === id);
  if (item) {
    item.archived = false;
    item.activity.unshift({
      id: `act-${Date.now()}`,
      when: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      change: "Work restored from archive",
    });
    persistWorkItems();
  }
}

export function updateQuestionAnswer(
  workId: string,
  questionId: string,
  answer: string,
  source?: string,
) {
  const work = workItems.find((w) => w.id === workId);
  if (!work) return;

  const question = work.questions.find((q) => q.id === questionId);
  if (!question) return;

  const globalQ = questions.find((q) => q.id === questionId);

  const now = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  question.answer = answer;
  question.answerSource = source || "User input";
  question.answeredDate = now;
  question.status = "Answered";
  question.state = "resolved";

  if (globalQ) {
    globalQ.answer = answer;
    globalQ.answeredDate = now;
    globalQ.status = "Answered";
    globalQ.state = "resolved";
  }

  // Record activity
  work.activity.unshift({
    id: `act-${Date.now()}`,
    when: now,
    change: `Question answered: "${question.question.substring(0, 30)}..."`,
  });

  // Recalculate readiness and the dependency-aware Work Plan.
  recalculateReadiness(work);
  generateWorkPlan(workId);
  persistWorkItems();
}

function recalculateReadiness(work: WorkItem) {
  const openCriticalQuestions = work.questions.filter(
    (q) => q.priority === "MUST ANSWER BEFORE STARTING" && q.state !== "resolved",
  );

  const oldState = work.state;

  if (openCriticalQuestions.length > 0) {
    work.state = "blocked";
  } else {
    const hasWarnings = work.findings.some((f) => f.status === "open");
    work.state = hasWarnings ? "ready-with-warnings" : "ready";
  }

  if (oldState !== work.state) {
    work.activity.unshift({
      id: `act-${Date.now()}-readiness`,
      when: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      change: `Readiness recalculated: ${oldState} → ${work.state}`,
    });
  }
}

/**
 * Product-level templates. These are static product guidance — they contain no
 * user, client or project data.
 */
export type Template = { id: string; name: string; description: string; checks: string[] };

export const templates: Template[] = [
  {
    id: "research",
    name: "Research",
    description: "Start a structured research workflow.",
    checks: ["Question defined", "Sources required", "Findings supported by evidence"],
  },
  {
    id: "report",
    name: "Report",
    description: "Write a report with a defined structure and audience.",
    checks: ["Audience confirmed", "Required sections", "Claims cite a source"],
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "Prepare a presentation for a specific decision or audience.",
    checks: ["Objective stated", "Slide structure", "Numbers traceable"],
  },
  {
    id: "website",
    name: "Website",
    description: "Build or update web pages against a defined scope.",
    checks: ["Pages in scope", "Assets required", "Approval step defined"],
  },
  {
    id: "design",
    name: "Design",
    description: "Produce design work with clear constraints.",
    checks: ["Brand constraints", "Deliverable formats", "Review round defined"],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Analyse a dataset to answer a specific question.",
    checks: ["Dataset available", "Method stated", "Assumptions recorded"],
  },
  {
    id: "supplier-comparison",
    name: "Supplier Comparison",
    description: "Compare options against agreed criteria.",
    checks: ["Criteria and weighting", "All options received", "Recommendation justified"],
  },
  {
    id: "client-onboarding",
    name: "Client Onboarding",
    description: "Take on new work with nothing missing.",
    checks: ["Scope agreed", "Required inputs collected", "Owner assigned"],
  },
  {
    id: "school-assignment",
    name: "School Assignment",
    description: "Complete an assignment against its brief.",
    checks: ["Brief requirements", "Format rules", "Submission deadline"],
  },
  {
    id: "general-office-work",
    name: "General Office Work",
    description: "Handle everyday requests without missing anything.",
    checks: ["Requested outcome", "Inputs needed", "Who signs off"],
  },
];

const USER_TEMPLATE_STORAGE_KEY = "karya-ai-user-templates";

function loadUserTemplates(): UserTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USER_TEMPLATE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserTemplate[]) : [];
  } catch {
    return [];
  }
}

function persistUserTemplates() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_TEMPLATE_STORAGE_KEY, JSON.stringify(userTemplates));
  } catch {
    // Keep the in-memory template if browser storage is unavailable.
  }
}

export const userTemplates: UserTemplate[] = loadUserTemplates();

export function createUserTemplate(input: Pick<UserTemplate, "name" | "description" | "checks">) {
  if (!input.name.trim() || input.checks.length === 0) return undefined;
  const template: UserTemplate = {
    id: `user-template-${Date.now()}`,
    name: input.name.trim(),
    description: input.description.trim() || "Personal Work template.",
    checks: input.checks.filter(Boolean),
    owner: "User",
    createdAt: nowLabel(),
    updatedAt: nowLabel(),
    uses: 0,
  };
  userTemplates.unshift(template);
  persistUserTemplates();
  return template;
}

export function updateUserTemplate(
  templateId: string,
  patch: Partial<Pick<UserTemplate, "name" | "description" | "checks">>,
) {
  const template = userTemplates.find((item) => item.id === templateId);
  if (!template) return;
  if (patch.name?.trim()) template.name = patch.name.trim();
  if (patch.description !== undefined) template.description = patch.description.trim();
  if (patch.checks) template.checks = patch.checks.filter(Boolean);
  template.updatedAt = nowLabel();
  persistUserTemplates();
}

export function deleteUserTemplate(templateId: string) {
  const index = userTemplates.findIndex((item) => item.id === templateId);
  if (index < 0) return;
  userTemplates.splice(index, 1);
  persistUserTemplates();
}

export function recordTemplateUse(templateId: string) {
  const template = userTemplates.find((item) => item.id === templateId);
  if (!template) return;
  template.uses += 1;
  template.updatedAt = nowLabel();
  persistUserTemplates();
}
