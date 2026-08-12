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

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  status?: WorkState | "ALL";
  templateId?: string | "ALL";
};
export type AnalyticsRankedItem = {
  label: string;
  count: number;
  workIds: string[];
  confidence: "High" | "Medium" | "Low";
  provenance: "FOUND IN DATA" | "INFERRED" | "UNKNOWN";
  detail: string;
};
export type OrganizationalPattern = {
  id: string;
  pattern: string;
  evidence: string;
  frequency: number;
  sources: string[];
  lastObserved: string;
  scope: "INDIVIDUAL" | "TEAM" | "ORGANIZATION";
  confidence: "High" | "Medium" | "Low";
  status: "Known pattern" | "Marked incorrect";
};
export type OrganizationPolicy = {
  id: string;
  name: string;
  rule: string;
  scope: "INDIVIDUAL" | "TEAM" | "ORGANIZATION";
  appliesTo: string;
  severity: "Informational" | "Warning" | "Blocking";
  enforcementMode: "Observe" | "Require review" | "Block";
  createdBy: string;
  createdDate: string;
  version: number;
  history: { id: string; date: string; change: string; by: string }[];
};
export type PolicyCheck = {
  id: string;
  policyId: string;
  workId: string;
  status: "PASS" | "WARNING" | "BLOCKED";
  detail: string;
  source: "Organization Policy";
  checkedAt: string;
};
export type CrossWorkDependency = {
  id: string;
  sourceWorkId: string;
  targetWorkId: string;
  dependency: string;
  status: "Potentially blocked" | "Confirmed" | "Blocked" | "Resolved";
  owner?: string;
  impact: string;
  expectedAvailability?: string;
  evidence: string;
  confidence: "High" | "Medium" | "Low";
  userConfirmed: boolean;
  createdAt: string;
};
export type ChangeImpactRecord = {
  id: string;
  workId: string;
  changeType:
    | "Deadline"
    | "Requirement"
    | "Deliverable"
    | "Scope"
    | "File/version"
    | "Decision"
    | "Policy"
    | "Approval";
  oldValue: string;
  newValue: string;
  affectedTaskIds: string[];
  affectedDependencyIds: string[];
  affectedRequirementIds: string[];
  affectedHandoffIds: string[];
  criticalPathChanged: boolean;
  risk: "Low" | "Medium" | "High";
  feasibility?: DeadlineFeasibility;
  summary: string;
  createdAt: string;
};
export type SourceComparison = {
  id: string;
  workId: string;
  previousFileId: string;
  currentFileId: string;
  addedLines: string[];
  removedLines: string[];
  changedRequirementIds: string[];
  affectedTaskIds: string[];
  summary: string;
  createdAt: string;
};
export type RequirementChangeRecord = {
  id: string;
  workId: string;
  requirementId: string;
  changeType:
    "New" | "Removed" | "Modified" | "Priority changed" | "Type changed" | "Status changed";
  oldValue?: string;
  newValue?: string;
  source?: string;
  impact: string;
  createdAt: string;
};
export type RegressionCheck = {
  id: string;
  previousWorkId: string;
  currentWorkId: string;
  recurringBasis: string;
  expectedRequirementIds: string[];
  satisfiedRequirementIds: string[];
  missingRequirementIds: string[];
  newRequirementIds: string[];
  status: "PASS" | "REGRESSION DETECTED" | "INSUFFICIENT DATA";
  summary: string;
  createdAt: string;
};
export type QualityPattern = {
  id: string;
  pattern: string;
  frequency: number;
  severity: "Low" | "Medium" | "High";
  workIds: string[];
  firstObserved: string;
  lastObserved: string;
  trend: "Increasing" | "Stable" | "Decreasing" | "Unknown";
  confidence: "High" | "Medium" | "Low";
  provenance: "FOUND IN DATA" | "INFERRED" | "UNKNOWN";
};
export type ProcessRecommendation = {
  id: string;
  title: string;
  evidence: string;
  frequency: number;
  impact: string;
  confidence: "High" | "Medium" | "Low";
  relatedWorkIds: string[];
  action: "Review recommendation" | "Create template" | "Create policy";
  status: "Open" | "Accepted" | "Dismissed" | "Snoozed";
  createdAt: string;
};
export type IntelligenceActivity = {
  id: string;
  type:
    | "Pattern detected"
    | "Policy created"
    | "Cross-work dependency detected"
    | "Change impact generated"
    | "Requirement changes detected"
    | "Regression detected"
    | "Quality pattern detected"
    | "Process recommendation generated"
    | "Recommendation updated";
  detail: string;
  date: string;
  workIds: string[];
};
export type IntelligenceStore = {
  patterns: OrganizationalPattern[];
  qualityPatterns: QualityPattern[];
  policies: OrganizationPolicy[];
  policyChecks: PolicyCheck[];
  crossWorkDependencies: CrossWorkDependency[];
  changeImpacts: ChangeImpactRecord[];
  requirementChanges: RequirementChangeRecord[];
  sourceComparisons: SourceComparison[];
  regressions: RegressionCheck[];
  recommendations: ProcessRecommendation[];
  activities: IntelligenceActivity[];
};
export type AnalyticsSnapshot = {
  generatedAt: string;
  filters: AnalyticsFilters;
  includedWorkIds: string[];
  hasData: boolean;
  overview: {
    totalWork: number;
    completed: number;
    blocked: number;
    waiting: number;
    verificationOutcomes: AnalyticsRankedItem[];
    completedOverTime: AnalyticsRankedItem[];
    completedByType: AnalyticsRankedItem[];
    completionTiming: { withinDeadline: number; afterDeadline: number; unavailable: number };
    averageCompletionDuration: string;
  };
  blockers: AnalyticsRankedItem[];
  clarifications: {
    averagePerWork: string;
    beforeStarting: number;
    duringExecution: number;
    waitingForResponse: number;
    resolved: number;
    averageResolutionTime: string;
  };
  missingInformation: AnalyticsRankedItem[];
  repeatedRequirements: AnalyticsRankedItem[];
  requirementFailures: AnalyticsRankedItem[];
  handoffDelays: { status: "AVAILABLE" | "NOT ENOUGH DATA"; detail: string };
  revisionCauses: AnalyticsRankedItem[];
  quality: {
    firstPassSatisfied: string;
    requirementsNeedingRevision: number;
    evidenceCoverage: string;
    verificationFailures: number;
    repeatedQualityPatterns: QualityPattern[];
  };
  patterns: OrganizationalPattern[];
  policyChecks: PolicyCheck[];
  crossWorkDependencies: CrossWorkDependency[];
  changeImpacts: ChangeImpactRecord[];
  requirementChanges: RequirementChangeRecord[];
  sourceComparisons: SourceComparison[];
  regressions: RegressionCheck[];
  recommendations: ProcessRecommendation[];
};

export type UserTemplate = Template & {
  owner: "User" | "System";
  createdAt: string;
  updatedAt: string;
  uses: number;
  /** Incremented for each user-authored update; legacy records are treated as version 1. */
  version?: number;
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
  analyticsExcluded?: boolean;
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
const INTELLIGENCE_STORAGE_KEY = "karya-ai-intelligence";

function emptyIntelligenceStore(): IntelligenceStore {
  return {
    patterns: [],
    qualityPatterns: [],
    policies: [],
    policyChecks: [],
    crossWorkDependencies: [],
    changeImpacts: [],
    requirementChanges: [],
    sourceComparisons: [],
    regressions: [],
    recommendations: [],
    activities: [],
  };
}

function loadIntelligenceStore(): IntelligenceStore {
  if (typeof window === "undefined") return emptyIntelligenceStore();
  try {
    const raw = window.localStorage.getItem(INTELLIGENCE_STORAGE_KEY);
    if (!raw) return emptyIntelligenceStore();
    const parsed = JSON.parse(raw) as Partial<IntelligenceStore>;
    return {
      ...emptyIntelligenceStore(),
      ...parsed,
      patterns: parsed.patterns || [],
      qualityPatterns: parsed.qualityPatterns || [],
      policies: parsed.policies || [],
      policyChecks: parsed.policyChecks || [],
      crossWorkDependencies: parsed.crossWorkDependencies || [],
      changeImpacts: parsed.changeImpacts || [],
      requirementChanges: parsed.requirementChanges || [],
      sourceComparisons: parsed.sourceComparisons || [],
      regressions: parsed.regressions || [],
      recommendations: parsed.recommendations || [],
      activities: parsed.activities || [],
    };
  } catch {
    return emptyIntelligenceStore();
  }
}

export const intelligenceStore: IntelligenceStore = loadIntelligenceStore();

function persistIntelligenceStore() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTELLIGENCE_STORAGE_KEY, JSON.stringify(intelligenceStore));
  } catch {
    // Local storage may be unavailable or full; retain the in-memory intelligence state.
  }
}

function recordIntelligenceActivity(
  type: IntelligenceActivity["type"],
  detail: string,
  workIds: string[],
) {
  intelligenceStore.activities.unshift({
    id: secureId("intelligence-activity"),
    type,
    detail,
    date: nowLabel(),
    workIds,
  });
}

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
  recalculateReadiness(work);
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
      regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      location: "Text content",
    },
    {
      category: "Personal information",
      confidence: "Medium",
      regex: /\b(?:phone|mobile|ssn|passport|national id)\s*[:=]\s*[^\n,;]+/gi,
      location: "Labeled field",
    },
    {
      category: "Financial information",
      confidence: "High",
      regex: /\b(?:\d[ -]*?){13,19}\b/g,
      location: "Number pattern",
    },
    {
      category: "Credential or API key",
      confidence: "High",
      regex:
        /\b(?:sk-[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|api[_-]?key\s*[:=]\s*\S+)\b/g,
      location: "Credential pattern",
    },
  ];

  for (const file of work.files) {
    if (!file.content?.trim()) continue;
    for (const pattern of patterns) {
      for (const match of file.content.matchAll(pattern.regex)) {
        const value = match[0];
        const start = match.index ?? 0;
        const line = file.content.slice(0, start).split("\n").length;
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
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : `- ${empty}`;
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
  ].join("\n");
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
  ].join("\n");
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
  const csv = [header.map(csvCell).join(","), ...rows].join("\n");
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

function normalizePatternText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function requirementPatternLabel(value: string) {
  const normalized = normalizePatternText(value);
  if (/\b(source|sources|reference|references|citation|citations|cite)\b/.test(normalized)) {
    return "Source / citation requirement";
  }
  if (/\b(executive summary|management summary)\b/.test(normalized)) {
    return "Executive summary";
  }
  if (/\b(approval|approved|sign off|signoff)\b/.test(normalized)) {
    return "Approval requirement";
  }
  if (/\b(template|approved format)\b/.test(normalized)) {
    return "Approved template or format";
  }
  return value.trim();
}

function parseDate(value: string | undefined) {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : timestamp;
}

function averageDuration(startDates: (string | undefined)[], endDates: (string | undefined)[]) {
  const durations = startDates.flatMap((start, index) => {
    const end = endDates[index];
    const hasTimePrecision = (value: string | undefined) =>
      Boolean(value && /T|\d{1,2}:\d{2}/.test(value));
    if (!hasTimePrecision(start) || !hasTimePrecision(end)) return [];
    const from = parseDate(start);
    const to = parseDate(end);
    return from !== undefined && to !== undefined && to >= from ? [to - from] : [];
  });
  if (durations.length === 0) return "Not enough data yet.";
  const average = durations.reduce((sum, value) => sum + value, 0) / durations.length;
  const days = average / 86_400_000;
  return days < 1 ? `${Math.max(1, Math.round(days * 24))} hours` : `${days.toFixed(1)} days`;
}

function rankAnalyticsItems(
  values: { label: string; workId: string; detail: string }[],
  provenance: AnalyticsRankedItem["provenance"] = "FOUND IN DATA",
): AnalyticsRankedItem[] {
  const grouped = new Map<
    string,
    { displayLabel: string; workIds: Set<string>; details: Set<string> }
  >();
  for (const value of values) {
    const key = normalizePatternText(value.label);
    if (!key) continue;
    const group = grouped.get(key) || {
      displayLabel: value.label,
      workIds: new Set<string>(),
      details: new Set<string>(),
    };
    group.workIds.add(value.workId);
    if (value.detail) group.details.add(value.detail);
    grouped.set(key, group);
  }
  return Array.from(grouped.entries())
    .map(([, group]) => ({
      label: group.displayLabel,
      count: group.workIds.size,
      workIds: Array.from(group.workIds),
      confidence: (group.workIds.size >= 3
        ? "High"
        : group.workIds.size >= 2
          ? "Medium"
          : "Low") as AnalyticsRankedItem["confidence"],
      provenance,
      detail: Array.from(group.details).slice(0, 2).join("; ") || "Observed in Work history.",
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function includedWorks(filters: AnalyticsFilters = {}) {
  const from = parseDate(filters.from);
  const to = parseDate(filters.to);
  return workItems.filter((work) => {
    if (work.analyticsExcluded || work.archived) return false;
    if (filters.status && filters.status !== "ALL" && work.state !== filters.status) return false;
    if (
      filters.templateId &&
      filters.templateId !== "ALL" &&
      work.templateId !== filters.templateId
    )
      return false;
    const dates = [
      ...work.activity
        .map((event) => parseDate(event.when))
        .filter((date): date is number => date !== undefined),
      ...work.timeline
        .map((event) => parseDate(event.date))
        .filter((date): date is number => date !== undefined),
    ];
    if (from !== undefined && dates.length > 0 && Math.max(...dates) < from) return false;
    if (to !== undefined && dates.length > 0 && Math.min(...dates) > to) return false;
    return true;
  });
}

function blockerSignals(work: WorkItem) {
  const signals: { label: string; detail: string }[] = [];
  if (
    work.questions.some(
      (question) =>
        question.priority === "MUST ANSWER BEFORE STARTING" && question.state !== "resolved",
    )
  ) {
    signals.push({
      label: "Waiting for response",
      detail: "An unanswered blocking question is recorded.",
    });
  }
  if (
    work.fileFindings.some(
      (finding) => finding.type === "missing-referenced-file" && finding.status !== "Resolved",
    )
  ) {
    signals.push({ label: "Missing file", detail: "A referenced file is missing from the Work." });
  }
  if (
    work.requirements.some(
      (requirement) => canonicalRequirementStatus(requirement.status) === "CONTRADICTORY",
    )
  ) {
    signals.push({
      label: "Requirement conflict",
      detail: "A requirement has contradictory status.",
    });
  } else if (
    work.requirements.some(
      (requirement) => canonicalRequirementStatus(requirement.status) === "MISSING",
    )
  ) {
    signals.push({
      label: "Missing information",
      detail: "A requirement is missing supporting information.",
    });
  }
  if (work.plan.some((task) => task.status === "blocked")) {
    signals.push({ label: "Dependency", detail: "A Work Plan task is blocked." });
  }
  if (
    work.openIssues.some((issue) => /approval/i.test(issue.issue) && issue.status !== "Resolved")
  ) {
    signals.push({
      label: "Missing approval",
      detail: "An unresolved approval issue is recorded.",
    });
  }
  if (work.state === "blocked" && signals.length === 0) {
    signals.push({
      label: "Unknown blocker",
      detail: "The Work is blocked but no structured blocker category is recorded.",
    });
  }
  return signals;
}

function refreshOrganizationalMemory(works = includedWorks()) {
  const values = works.flatMap((work) =>
    work.requirements.map((requirement) => ({
      work,
      requirement,
      key: normalizePatternText(requirement.title),
    })),
  );
  const groups = new Map<string, typeof values>();
  for (const value of values) {
    if (!value.key) continue;
    const group = groups.get(value.key) || [];
    group.push(value);
    groups.set(value.key, group);
  }
  const existingStatuses = new Map(
    intelligenceStore.patterns.map((pattern) => [pattern.id, pattern.status]),
  );
  const patterns = Array.from(groups.entries())
    .filter(([, group]) => new Set(group.map((item) => item.work.id)).size >= 2)
    .map(([key, group]) => {
      const workIds = Array.from(new Set(group.map((item) => item.work.id)));
      const sources = Array.from(new Set(group.map((item) => item.requirement.source.label)));
      return {
        id: `pattern-requirement-${key.replace(/\s+/g, "-")}`,
        pattern: group[0]?.requirement.title || key,
        evidence: `Observed in ${workIds.length} Work items through recorded requirements.`,
        frequency: workIds.length,
        sources,
        lastObserved:
          group.map((item) => item.work.activity[0]?.when).find(Boolean) || "Date unavailable",
        scope: "INDIVIDUAL" as const,
        confidence: workIds.length >= 3 ? ("High" as const) : ("Medium" as const),
        status:
          existingStatuses.get(`pattern-requirement-${key.replace(/\s+/g, "-")}`) ||
          "Known pattern",
      };
    });
  intelligenceStore.patterns = patterns;
  if (patterns.length > 0) {
    recordIntelligenceActivity(
      "Pattern detected",
      `${patterns.length} recurring requirement pattern${patterns.length === 1 ? "" : "s"} derived from Work history.`,
      patterns.flatMap((pattern) =>
        values
          .filter(
            (value) =>
              normalizePatternText(value.requirement.title) ===
              normalizePatternText(pattern.pattern),
          )
          .map((value) => value.work.id),
      ),
    );
  }
  persistIntelligenceStore();
  return patterns;
}

export function getAnalyticsSnapshot(filters: AnalyticsFilters = {}): AnalyticsSnapshot {
  const works = includedWorks(filters);
  const completed = works.filter((work) => work.state === "done");
  const blocked = works.filter((work) => work.state === "blocked");
  const waiting = works.filter((work) => work.state === "waiting");
  const blockerValues = blocked.flatMap((work) =>
    blockerSignals(work).map((signal) => ({ ...signal, workId: work.id })),
  );
  const questionValues = works.flatMap((work) =>
    work.questions
      .filter((question) => question.state !== "resolved")
      .map((question) => ({
        label: question.category,
        detail: question.question,
        workId: work.id,
      })),
  );
  const missingValues = works.flatMap((work) => [
    ...work.findings
      .filter((finding) => finding.type === "missing-info" || finding.type === "missing-asset")
      .map((finding) => ({ label: finding.title, detail: finding.explanation, workId: work.id })),
    ...work.questions
      .filter((question) => question.state !== "resolved")
      .map((question) => ({ label: question.question, detail: question.why, workId: work.id })),
  ]);
  const requirementValues = works.flatMap((work) =>
    work.requirements.map((requirement) => ({
      label: requirementPatternLabel(requirement.title),
      detail: `${requirement.title} · ${requirement.source.label}`,
      workId: work.id,
    })),
  );
  const failureValues = works.flatMap((work) =>
    work.verificationRuns.flatMap((run) =>
      run.findings.map((finding) => ({
        label: finding.title,
        detail: finding.detail,
        workId: work.id,
      })),
    ),
  );
  const revisionValues = works.flatMap((work) => [
    ...work.requirements.flatMap((requirement) =>
      (requirement.history || []).map((entry) => ({
        label: entry.reason || "Requirement changed",
        detail: entry.newWording,
        workId: work.id,
      })),
    ),
    ...work.decisionHistory.map((entry) => ({
      label: "Decision changed",
      detail: entry.impact || entry.newDecision,
      workId: work.id,
    })),
  ]);
  const verificationOutcomes = rankAnalyticsItems(
    works.flatMap((work) =>
      work.verificationRuns.map((run) => ({
        label: run.finalStatus,
        detail: run.summary,
        workId: work.id,
      })),
    ),
  );
  const completedOverTime = rankAnalyticsItems(
    completed.map((work) => ({
      label: work.activity[work.activity.length - 1]?.when || "Date unavailable",
      detail: work.title,
      workId: work.id,
    })),
  );
  const completedByType = rankAnalyticsItems(
    completed.map((work) => ({
      label: work.templateId || "Untemplated Work",
      detail: work.title,
      workId: work.id,
    })),
  );
  const questionCount = works.reduce((sum, work) => sum + work.questions.length, 0);
  const resolvedQuestions = works.flatMap((work) =>
    work.questions.filter((question) => question.state === "resolved"),
  );
  const beforeStarting = works.reduce(
    (sum, work) =>
      sum +
      work.questions.filter((question) => question.priority === "MUST ANSWER BEFORE STARTING")
        .length,
    0,
  );
  const waitingForResponse = works.reduce(
    (sum, work) =>
      sum +
      work.questions.filter(
        (question) => question.status === "Waiting for Answer" || question.state === "waiting",
      ).length,
    0,
  );
  const qualityRuns = works.flatMap((work) => work.verificationRuns);
  const satisfiedFirstPass = qualityRuns
    .filter((run) => run.version === 1)
    .reduce(
      (sum, run) =>
        sum + run.requirementResults.filter((result) => result.status === "SATISFIED").length,
      0,
    );
  const firstPassTotal = qualityRuns
    .filter((run) => run.version === 1)
    .reduce((sum, run) => sum + run.requirementResults.length, 0);
  const strongEvidence = works.reduce(
    (sum, work) =>
      sum + work.evidence.filter((item) => item.confidence === "STRONG EVIDENCE").length,
    0,
  );
  const totalEvidence = works.reduce((sum, work) => sum + work.evidence.length, 0);
  const patterns =
    intelligenceStore.patterns.length > 0
      ? intelligenceStore.patterns
      : refreshOrganizationalMemory(works);
  const repeatedQualityPatterns = rankAnalyticsItems(failureValues)
    .filter((item) => item.count >= 2)
    .map((item) => ({
      id: `quality-${normalizePatternText(item.label).replace(/\s+/g, "-")}`,
      pattern: item.label,
      frequency: item.count,
      severity: item.count >= 3 ? ("High" as const) : ("Medium" as const),
      workIds: item.workIds,
      firstObserved: "Date unavailable",
      lastObserved: "Date unavailable",
      trend: "Unknown" as const,
      confidence: item.confidence,
      provenance: "FOUND IN DATA" as const,
    }));
  intelligenceStore.qualityPatterns = repeatedQualityPatterns;
  persistIntelligenceStore();
  const includedWorkIds = works.map((work) => work.id);
  return {
    generatedAt: new Date().toISOString(),
    filters,
    includedWorkIds,
    hasData: works.length > 0,
    overview: {
      totalWork: works.length,
      completed: completed.length,
      blocked: blocked.length,
      waiting: waiting.length,
      verificationOutcomes,
      completedOverTime,
      completedByType,
      completionTiming: { withinDeadline: 0, afterDeadline: 0, unavailable: completed.length },
      averageCompletionDuration: "Not enough timestamp data yet.",
    },
    blockers: rankAnalyticsItems(blockerValues),
    clarifications: {
      averagePerWork:
        works.length > 0 ? (questionCount / works.length).toFixed(1) : "Not enough data yet.",
      beforeStarting,
      duringExecution: Math.max(0, questionCount - beforeStarting),
      waitingForResponse,
      resolved: resolvedQuestions.length,
      averageResolutionTime: averageDuration(
        resolvedQuestions.map((question) => question.createdDate),
        resolvedQuestions.map((question) => question.answeredDate),
      ),
    },
    missingInformation: rankAnalyticsItems(missingValues),
    repeatedRequirements: rankAnalyticsItems(requirementValues).filter((item) => item.count >= 2),
    requirementFailures: rankAnalyticsItems(failureValues).filter((item) => item.count >= 1),
    handoffDelays: {
      status: "NOT ENOUGH DATA",
      detail:
        "Handoff receipt and first-action timestamps are not recorded in the current Work model.",
    },
    revisionCauses: rankAnalyticsItems(revisionValues),
    quality: {
      firstPassSatisfied:
        firstPassTotal > 0 ? `${satisfiedFirstPass}/${firstPassTotal}` : "Not enough data yet.",
      requirementsNeedingRevision: works.reduce(
        (sum, work) =>
          sum +
          work.requirements.filter((requirement) => (requirement.history || []).length > 0).length,
        0,
      ),
      evidenceCoverage:
        works.length > 0
          ? `${strongEvidence}/${Math.max(totalEvidence, 1)} strong evidence items`
          : "Not enough data yet.",
      verificationFailures: qualityRuns.reduce(
        (sum, run) => sum + run.findings.filter((finding) => finding.status !== "Resolved").length,
        0,
      ),
      repeatedQualityPatterns,
    },
    patterns,
    policyChecks: intelligenceStore.policyChecks.filter((check) =>
      includedWorkIds.includes(check.workId),
    ),
    crossWorkDependencies: intelligenceStore.crossWorkDependencies.filter(
      (dependency) =>
        includedWorkIds.includes(dependency.sourceWorkId) ||
        includedWorkIds.includes(dependency.targetWorkId),
    ),
    changeImpacts: intelligenceStore.changeImpacts.filter((impact) =>
      includedWorkIds.includes(impact.workId),
    ),
    requirementChanges: intelligenceStore.requirementChanges.filter((change) =>
      includedWorkIds.includes(change.workId),
    ),
    sourceComparisons: intelligenceStore.sourceComparisons.filter((comparison) =>
      includedWorkIds.includes(comparison.workId),
    ),
    regressions: intelligenceStore.regressions.filter(
      (regression) =>
        includedWorkIds.includes(regression.currentWorkId) ||
        includedWorkIds.includes(regression.previousWorkId),
    ),
    recommendations: intelligenceStore.recommendations.filter(
      (recommendation) =>
        recommendation.relatedWorkIds.some((id) => includedWorkIds.includes(id)) &&
        recommendation.status === "Open",
    ),
  };
}

export function refreshAnalyticsIntelligence() {
  const works = includedWorks();
  refreshOrganizationalMemory(works);
  runPolicyChecks();
  detectCrossWorkDependencies();
  generateProcessRecommendations();
  persistIntelligenceStore();
  return getAnalyticsSnapshot();
}

export function updateOrganizationalPattern(id: string, status: OrganizationalPattern["status"]) {
  const pattern = intelligenceStore.patterns.find((item) => item.id === id);
  if (!pattern) return undefined;
  pattern.status = status;
  recordIntelligenceActivity(
    "Pattern detected",
    `Pattern ${pattern.pattern} marked ${status}.`,
    [],
  );
  persistIntelligenceStore();
  return pattern;
}

export function createOrganizationPolicy(
  input: Omit<OrganizationPolicy, "id" | "createdDate" | "version" | "history">,
) {
  const policy: OrganizationPolicy = {
    ...input,
    id: secureId("policy"),
    createdDate: nowLabel(),
    version: 1,
    history: [],
  };
  intelligenceStore.policies.unshift(policy);
  recordIntelligenceActivity("Policy created", `Policy created: ${policy.name}`, []);
  persistIntelligenceStore();
  return policy;
}

export function updateOrganizationPolicy(
  policyId: string,
  patch: Partial<
    Pick<OrganizationPolicy, "name" | "rule" | "appliesTo" | "severity" | "enforcementMode">
  >,
  changedBy = "User",
) {
  const policy = intelligenceStore.policies.find((item) => item.id === policyId);
  if (!policy) return undefined;
  const changes = Object.entries(patch)
    .filter(([key, value]) => value !== undefined && value !== policy[key as keyof typeof policy])
    .map(
      ([key, value]) => `${key}: ${String(policy[key as keyof typeof policy])} → ${String(value)}`,
    );
  if (changes.length === 0) return policy;
  Object.assign(policy, patch);
  policy.version += 1;
  policy.history.unshift({
    id: secureId("policy-history"),
    date: nowLabel(),
    change: changes.join("; "),
    by: changedBy,
  });
  recordIntelligenceActivity(
    "Policy created",
    `Policy changed: ${policy.name} version ${policy.version}.`,
    [],
  );
  persistIntelligenceStore();
  return policy;
}

function policyMatchesWork(policy: OrganizationPolicy, work: WorkItem) {
  const scope = normalizePatternText(`${work.title} ${work.description} ${work.request.objective}`);
  return !policy.appliesTo || scope.includes(normalizePatternText(policy.appliesTo));
}

function evaluatePolicy(policy: OrganizationPolicy, work: WorkItem): PolicyCheck {
  const rule = normalizePatternText(policy.rule);
  const sourceRequirement = /source|reference|citation/.test(rule);
  const approvalRequirement = /approval|approved/.test(rule);
  const executiveSummaryRequirement = /executive summary/.test(rule);
  let passed = true;
  let detail = "The recorded Work data satisfies this policy check.";
  if (sourceRequirement) {
    passed = work.files.length > 0 || work.evidence.some((evidence) => evidence.source);
    detail = passed
      ? "At least one source or evidence reference is recorded."
      : "No source or evidence reference is recorded.";
  } else if (approvalRequirement) {
    passed = work.approvals.some((approval) => approval.status === "APPROVED");
    detail = passed ? "An approved record is present." : "No approved record is present.";
  } else if (executiveSummaryRequirement) {
    passed =
      work.requirements.some((requirement) => /executive summary/i.test(requirement.title)) ||
      /executive summary/i.test(work.description);
    detail = passed
      ? "An executive-summary requirement is recorded."
      : "No executive-summary requirement is recorded.";
  } else {
    return {
      id: secureId("policy-check"),
      policyId: policy.id,
      workId: work.id,
      status: "WARNING",
      detail:
        "This policy rule is not machine-evaluable by the local policy checker and requires human review.",
      source: "Organization Policy",
      checkedAt: new Date().toISOString(),
    };
  }
  return {
    id: secureId("policy-check"),
    policyId: policy.id,
    workId: work.id,
    status: passed ? "PASS" : policy.enforcementMode === "Block" ? "BLOCKED" : "WARNING",
    detail,
    source: "Organization Policy",
    checkedAt: new Date().toISOString(),
  };
}

export function runPolicyChecks() {
  const works = includedWorks();
  const checks = intelligenceStore.policies.flatMap((policy) =>
    works
      .filter((work) => policyMatchesWork(policy, work))
      .map((work) => evaluatePolicy(policy, work)),
  );
  intelligenceStore.policyChecks = checks;
  persistIntelligenceStore();
  return checks;
}

export function detectCrossWorkDependencies() {
  const works = includedWorks();
  const dependencies: CrossWorkDependency[] = [];
  for (const sourceWork of works) {
    for (const sourceFile of sourceWork.files) {
      const references = contentReferences(sourceFile.content);
      for (const reference of references) {
        const target = works.find(
          (work) =>
            work.id !== sourceWork.id &&
            work.files.some(
              (file) =>
                file.role === "Final" && file.name.toLowerCase() === reference.toLowerCase(),
            ),
        );
        if (!target) continue;
        dependencies.push({
          id: `cross-work-${sourceWork.id}-${target.id}-${reference}`,
          sourceWorkId: sourceWork.id,
          targetWorkId: target.id,
          dependency: reference,
          status: target.state === "blocked" ? "Potentially blocked" : "Confirmed",
          impact: `The source Work references ${reference}, which is produced by another Work.`,
          evidence: `${sourceFile.name} explicitly references ${reference}.`,
          confidence: "High",
          userConfirmed: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
  intelligenceStore.crossWorkDependencies = dependencies;
  if (dependencies.length > 0) {
    recordIntelligenceActivity(
      "Cross-work dependency detected",
      `${dependencies.length} explicit cross-Work file reference${dependencies.length === 1 ? "" : "s"} detected.`,
      dependencies.flatMap((dependency) => [dependency.sourceWorkId, dependency.targetWorkId]),
    );
  }
  persistIntelligenceStore();
  return dependencies;
}

export function createCrossWorkDependency(
  input: Omit<CrossWorkDependency, "id" | "createdAt" | "confidence" | "userConfirmed">,
) {
  const source = getWork(input.sourceWorkId);
  const target = getWork(input.targetWorkId);
  if (!source || !target || source.id === target.id) return undefined;
  const dependency: CrossWorkDependency = {
    ...input,
    id: secureId("cross-work"),
    confidence: "High",
    userConfirmed: true,
    createdAt: new Date().toISOString(),
  };
  intelligenceStore.crossWorkDependencies.unshift(dependency);
  recordIntelligenceActivity(
    "Cross-work dependency detected",
    `User-confirmed dependency: ${source.title} waits for ${target.title}.`,
    [source.id, target.id],
  );
  persistIntelligenceStore();
  return dependency;
}

export function updateCrossWorkDependencyStatus(id: string, status: CrossWorkDependency["status"]) {
  const dependency = intelligenceStore.crossWorkDependencies.find((item) => item.id === id);
  if (!dependency) return undefined;
  dependency.status = status;
  persistIntelligenceStore();
  return dependency;
}

export function generateChangeImpact(
  workId: string,
  input: Pick<ChangeImpactRecord, "changeType" | "oldValue" | "newValue">,
) {
  const work = getWork(workId);
  if (!work) return undefined;
  const affectedTasks = work.plan
    .filter(
      (task) =>
        input.changeType === "Deadline" ||
        task.relatedRequirementIds?.some((id) =>
          work.requirements.some((requirement) => requirement.id === id),
        ),
    )
    .map((task) => task.id);
  const affectedRequirements = work.requirements
    .filter(
      (requirement) => input.changeType === "Requirement" || requirement.status !== "SATISFIED",
    )
    .map((requirement) => requirement.id);
  const impact: ChangeImpactRecord = {
    id: secureId("change-impact"),
    workId,
    ...input,
    affectedTaskIds: affectedTasks,
    affectedDependencyIds:
      work.planMeta?.dependencies
        .filter(
          (dependency) =>
            affectedTasks.includes(dependency.dependentTaskId) ||
            affectedTasks.includes(dependency.prerequisiteTaskId),
        )
        .map((dependency) => dependency.id) || [],
    affectedRequirementIds: affectedRequirements,
    affectedHandoffIds: (work.handoffPackets || []).map((packet) => packet.id),
    criticalPathChanged:
      input.changeType === "Deadline" &&
      affectedTasks.some((taskId) => work.planMeta?.criticalPathTaskIds.includes(taskId)),
    risk:
      affectedTasks.length >= 4 || affectedRequirements.length >= 3
        ? "High"
        : affectedTasks.length > 0
          ? "Medium"
          : "Low",
    ...(work.planMeta ? { feasibility: work.planMeta.feasibility.status } : {}),
    summary: `${input.changeType} changed from ${input.oldValue || "unknown"} to ${input.newValue || "unknown"}; ${affectedTasks.length} tasks and ${affectedRequirements.length} requirements may be affected.`,
    createdAt: new Date().toISOString(),
  };
  intelligenceStore.changeImpacts.unshift(impact);
  recordIntelligenceActivity("Change impact generated", impact.summary, [workId]);
  persistIntelligenceStore();
  return impact;
}

export function updateWorkDeadline(workId: string, newDeadline: string) {
  const work = getWork(workId);
  if (!work) return undefined;
  const oldDeadline = work.due || work.request.deadline || "Unknown";
  work.due = newDeadline;
  work.request.deadline = newDeadline;
  generateWorkPlan(workId);
  const impact = generateChangeImpact(workId, {
    changeType: "Deadline",
    oldValue: oldDeadline,
    newValue: newDeadline,
  });
  work.activity.unshift({
    id: secureId("act"),
    when: nowLabel(),
    change: `Deadline changed: ${oldDeadline} → ${newDeadline}`,
  });
  persistWorkItems();
  return impact;
}

export function analyzeRequirementChanges(workId: string) {
  const work = getWork(workId);
  if (!work) return [];
  const changes = work.requirements.flatMap((requirement) =>
    (requirement.history || []).map((entry) => ({
      id: `requirement-change-${entry.id}`,
      workId,
      requirementId: requirement.id,
      changeType: entry.reason?.startsWith("Status changed")
        ? ("Status changed" as const)
        : entry.reason?.startsWith("Type changed")
          ? ("Type changed" as const)
          : entry.reason?.startsWith("Priority changed")
            ? ("Priority changed" as const)
            : ("Modified" as const),
      ...(entry.previousWording ? { oldValue: entry.previousWording } : {}),
      newValue: entry.newWording,
      ...(entry.source ? { source: entry.source } : {}),
      impact: `${entry.reason || "Requirement changed"}; related plan tasks and verification may need review.`,
      createdAt: new Date().toISOString(),
    })),
  );
  intelligenceStore.requirementChanges = [
    ...changes,
    ...intelligenceStore.requirementChanges.filter((change) => change.workId !== workId),
  ];
  if (changes.length > 0)
    recordIntelligenceActivity(
      "Requirement changes detected",
      `${changes.length} requirement change${changes.length === 1 ? "" : "s"} recorded.`,
      [workId],
    );
  persistIntelligenceStore();
  return changes;
}

export function compareSourceVersions(
  workId: string,
  previousFileId: string,
  currentFileId: string,
) {
  const work = getWork(workId);
  const previous = work?.files.find((file) => file.id === previousFileId);
  const current = work?.files.find((file) => file.id === currentFileId);
  if (!work || !previous?.content || !current?.content || previous.id === current.id)
    return undefined;
  const previousLines = previous.content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const currentLines = current.content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const previousSet = new Set(previousLines);
  const currentSet = new Set(currentLines);
  const addedLines = currentLines.filter((line) => !previousSet.has(line)).slice(0, 40);
  const removedLines = previousLines.filter((line) => !currentSet.has(line)).slice(0, 40);
  const changedRequirementIds = work.requirements
    .filter((requirement) => {
      const key = normalizePatternText(requirement.title);
      return [...addedLines, ...removedLines].some((line) =>
        normalizePatternText(line).includes(key),
      );
    })
    .map((requirement) => requirement.id);
  const affectedTaskIds = work.plan
    .filter((task) => task.relatedRequirementIds?.some((id) => changedRequirementIds.includes(id)))
    .map((task) => task.id);
  const comparison: SourceComparison = {
    id: secureId("source-comparison"),
    workId,
    previousFileId,
    currentFileId,
    addedLines,
    removedLines,
    changedRequirementIds,
    affectedTaskIds,
    summary: `${addedLines.length} added and ${removedLines.length} removed content line${addedLines.length + removedLines.length === 1 ? "" : "s"}; ${changedRequirementIds.length} requirement${changedRequirementIds.length === 1 ? "" : "s"} and ${affectedTaskIds.length} task${affectedTaskIds.length === 1 ? "" : "s"} linked for review.`,
    createdAt: new Date().toISOString(),
  };
  intelligenceStore.sourceComparisons.unshift(comparison);
  recordIntelligenceActivity("Requirement changes detected", comparison.summary, [workId]);
  persistIntelligenceStore();
  return comparison;
}

export function runRegressionCheck(previousWorkId: string, currentWorkId: string) {
  const previous = getWork(previousWorkId);
  const current = getWork(currentWorkId);
  if (!previous || !current) return undefined;
  const previousByKey = new Map(
    previous.requirements.map((requirement) => [
      normalizePatternText(requirement.title),
      requirement,
    ]),
  );
  const currentByKey = new Map(
    current.requirements.map((requirement) => [
      normalizePatternText(requirement.title),
      requirement,
    ]),
  );
  const expectedRequirementIds = Array.from(previousByKey.values()).map(
    (requirement) => requirement.id,
  );
  const satisfiedRequirementIds = Array.from(currentByKey.values())
    .filter(
      (requirement) =>
        previousByKey.has(normalizePatternText(requirement.title)) &&
        canonicalRequirementStatus(requirement.status) === "SATISFIED",
    )
    .map((requirement) => requirement.id);
  const missingRequirementIds = Array.from(currentByKey.values())
    .filter(
      (requirement) =>
        previousByKey.has(normalizePatternText(requirement.title)) &&
        canonicalRequirementStatus(requirement.status) !== "SATISFIED",
    )
    .map((requirement) => requirement.id);
  const newRequirementIds = Array.from(currentByKey.values())
    .filter((requirement) => !previousByKey.has(normalizePatternText(requirement.title)))
    .map((requirement) => requirement.id);
  const insufficient = previous.requirements.length === 0 || current.requirements.length === 0;
  const status = insufficient
    ? "INSUFFICIENT DATA"
    : missingRequirementIds.length > 0 || newRequirementIds.length > 0
      ? "REGRESSION DETECTED"
      : "PASS";
  const regression: RegressionCheck = {
    id: secureId("regression"),
    previousWorkId,
    currentWorkId,
    recurringBasis:
      previous.templateId && previous.templateId === current.templateId
        ? `Shared template: ${previous.templateId}`
        : "User-selected comparison",
    expectedRequirementIds,
    satisfiedRequirementIds,
    missingRequirementIds,
    newRequirementIds,
    status,
    summary: insufficient
      ? "Not enough requirement data to compare these Work items."
      : `${satisfiedRequirementIds.length} recurring requirements satisfied; ${missingRequirementIds.length} missing and ${newRequirementIds.length} new.`,
    createdAt: new Date().toISOString(),
  };
  intelligenceStore.regressions.unshift(regression);
  recordIntelligenceActivity("Regression detected", regression.summary, [
    previousWorkId,
    currentWorkId,
  ]);
  persistIntelligenceStore();
  return regression;
}

export function generateProcessRecommendations() {
  const snapshot = getAnalyticsSnapshot();
  const recommendations: ProcessRecommendation[] = [];
  const topBlocker = snapshot.blockers[0];
  if (topBlocker && topBlocker.count >= 2) {
    recommendations.push({
      id: `recommendation-blocker-${normalizePatternText(topBlocker.label).replace(/\s+/g, "-")}`,
      title: `Review repeated ${topBlocker.label.toLowerCase()} blockers`,
      evidence: topBlocker.detail,
      frequency: topBlocker.count,
      impact: `Observed across ${topBlocker.count} Work items; delay duration is not inferred without timestamps.`,
      confidence: topBlocker.confidence,
      relatedWorkIds: topBlocker.workIds,
      action: "Review recommendation",
      status: "Open",
      createdAt: new Date().toISOString(),
    });
  }
  const topMissingInformation = snapshot.missingInformation.find((item) => item.count >= 2);
  if (topMissingInformation) {
    recommendations.push({
      id: `recommendation-missing-${normalizePatternText(topMissingInformation.label).replace(/\s+/g, "-")}`,
      title: `Add a checklist for repeated missing information: ${topMissingInformation.label}`,
      evidence: topMissingInformation.detail,
      frequency: topMissingInformation.count,
      impact: `Observed across ${topMissingInformation.count} Work items; no causal claim is made.`,
      confidence: topMissingInformation.confidence,
      relatedWorkIds: topMissingInformation.workIds,
      action: "Create template",
      status: "Open",
      createdAt: new Date().toISOString(),
    });
  }
  const topQualityPattern = snapshot.quality.repeatedQualityPatterns[0];
  if (topQualityPattern) {
    recommendations.push({
      id: `recommendation-quality-${normalizePatternText(topQualityPattern.pattern).replace(/\s+/g, "-")}`,
      title: `Review recurring verification issue: ${topQualityPattern.pattern}`,
      evidence: `Observed in ${topQualityPattern.frequency} Work items.`,
      frequency: topQualityPattern.frequency,
      impact: "Repeated verification failure is recorded; causation is not inferred.",
      confidence: topQualityPattern.confidence,
      relatedWorkIds: topQualityPattern.workIds,
      action: "Review recommendation",
      status: "Open",
      createdAt: new Date().toISOString(),
    });
  }
  const topRequirement = snapshot.repeatedRequirements[0];
  if (topRequirement) {
    recommendations.push({
      id: `recommendation-requirement-${normalizePatternText(topRequirement.label).replace(/\s+/g, "-")}`,
      title: `Review a repeated requirement: ${topRequirement.label}`,
      evidence: `Recorded in ${topRequirement.count} Work items.`,
      frequency: topRequirement.count,
      impact: "A template or policy may help, but no workflow is changed automatically.",
      confidence: topRequirement.confidence,
      relatedWorkIds: topRequirement.workIds,
      action: "Create template",
      status: "Open",
      createdAt: new Date().toISOString(),
    });
  }
  const existingById = new Map(intelligenceStore.recommendations.map((item) => [item.id, item]));
  const newlyObserved = recommendations.filter(
    (recommendation) => !existingById.has(recommendation.id),
  );
  intelligenceStore.recommendations = [
    ...recommendations.map(
      (recommendation) => existingById.get(recommendation.id) || recommendation,
    ),
    ...intelligenceStore.recommendations.filter(
      (existing) => !recommendations.some((item) => item.id === existing.id),
    ),
  ];
  if (newlyObserved.length > 0)
    recordIntelligenceActivity(
      "Process recommendation generated",
      `${newlyObserved.length} new data-backed recommendation${newlyObserved.length === 1 ? "" : "s"} generated.`,
      newlyObserved.flatMap((recommendation) => recommendation.relatedWorkIds),
    );
  persistIntelligenceStore();
  return intelligenceStore.recommendations.filter(
    (recommendation) => recommendation.status === "Open",
  );
}

export function updateProcessRecommendation(id: string, status: ProcessRecommendation["status"]) {
  const recommendation = intelligenceStore.recommendations.find((item) => item.id === id);
  if (!recommendation) return undefined;
  recommendation.status = status;
  recordIntelligenceActivity(
    "Recommendation updated",
    `Recommendation ${recommendation.title} marked ${status}.`,
    recommendation.relatedWorkIds,
  );
  persistIntelligenceStore();
  return recommendation;
}

export function setWorkAnalyticsExcluded(workId: string, excluded: boolean) {
  const work = getWork(workId);
  if (!work) return undefined;
  work.analyticsExcluded = excluded;
  work.activity.unshift({
    id: secureId("act"),
    when: nowLabel(),
    change: `Analytics inclusion ${excluded ? "disabled" : "enabled"}`,
  });
  persistWorkItems();
  return work;
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
  recalculateReadiness(work);

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
  recalculateReadiness(work);
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
  const previousStatus = requirement.status;
  const previousType = requirement.type;
  const previousPriority = requirement.priority;
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
  const stateChanges = [
    patch.status && patch.status !== previousStatus
      ? `Status changed: ${previousStatus} → ${patch.status}`
      : undefined,
    patch.type && patch.type !== previousType
      ? `Type changed: ${previousType || "Unknown"} → ${patch.type}`
      : undefined,
    patch.priority && patch.priority !== previousPriority
      ? `Priority changed: ${previousPriority || "Unknown"} → ${patch.priority}`
      : undefined,
  ].filter((change): change is string => Boolean(change));
  if (stateChanges.length > 0) {
    requirement.history = [
      ...(requirement.history || []),
      ...stateChanges.map((reason) => ({
        id: `requirement-history-${Date.now()}-${reason.slice(0, 8)}`,
        date: nowLabel(),
        newWording: requirement.currentWording || requirement.title,
        changedBy,
        reason,
      })),
    ];
  }
  requirement.modifiedDate = nowLabel();
  recalculateReadiness(work);
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
    .split(/\W+/)
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
    .join("\n");
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
    id: secureId("assignment"),
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
    id: secureId("comment"),
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
  const approval: ApprovalRecord = { ...input, id: secureId("approval"), date: nowLabel() };
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
    id: secureId("message"),
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

export type TemplateRequirementConflict = {
  check: string;
  requirementId: string;
  requirementTitle: string;
  status: ReqStatus;
};

export type TemplateApplicationPreview = {
  templateId: string;
  addedChecks: string[];
  duplicateChecks: string[];
  conflicts: TemplateRequirementConflict[];
};

/**
 * Evaluates a template against the current Work without changing it. A conflict is only reported
 * when the matching existing requirement is explicitly contradictory; the template is never used
 * to overwrite requirements or their status.
 */
export function previewTemplateApplication(
  workId: string,
  templateId: string,
): TemplateApplicationPreview | undefined {
  const work = getWork(workId);
  const template = [...templates, ...userTemplates].find((item) => item.id === templateId);
  if (!work || !template) return undefined;
  const normalized = (value: string) => value.trim().toLocaleLowerCase();
  const addedChecks: string[] = [];
  const duplicateChecks: string[] = [];
  const conflicts: TemplateRequirementConflict[] = [];
  for (const check of template.checks) {
    const matchingRequirement = work.requirements.find(
      (requirement) => normalized(requirement.title) === normalized(check),
    );
    if (!matchingRequirement) {
      addedChecks.push(check);
      continue;
    }
    duplicateChecks.push(check);
    if (["CONTRADICTORY", "conflict"].includes(matchingRequirement.status)) {
      conflicts.push({
        check,
        requirementId: matchingRequirement.id,
        requirementTitle: matchingRequirement.title,
        status: matchingRequirement.status,
      });
    }
  }
  return { templateId, addedChecks, duplicateChecks, conflicts };
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
  const blockingRequirements = work.requirements
    .filter(
      (requirement) =>
        requirement.type === "MANDATORY" ||
        requirement.type === "APPROVAL-REQUIRED" ||
        requirement.priority === "CRITICAL",
    )
    .filter((requirement) =>
      ["MISSING", "CONTRADICTORY", "NEEDS REVIEW"].includes(requirement.status),
    );
  const unresolvedRequirements = work.requirements.filter(
    (requirement) =>
      !["SATISFIED", "WAIVED"].includes(requirement.status) &&
      !blockingRequirements.some((item) => item.id === requirement.id),
  );

  const oldState = work.state;

  if (openCriticalQuestions.length > 0 || blockingRequirements.length > 0) {
    work.state = "blocked";
  } else if (oldState === "done" || oldState === "ready-to-submit") {
    work.state = oldState;
  } else {
    const hasWarnings = work.findings.some((f) => f.status === "open");
    work.state = hasWarnings || unresolvedRequirements.length > 0 ? "ready-with-warnings" : "ready";
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
    version: 1,
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
  template.version = (template.version || 1) + 1;
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
