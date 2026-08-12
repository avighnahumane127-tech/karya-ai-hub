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
export type SourceKind = "confirmed" | "inferred" | "assumption" | "conflict";

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
  title: string;
  explanation: string;
  whyItMatters: string;
  sourceReference?: string;
  recommendedAction: string;
  status: "open" | "resolved" | "overridden";
};

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  state: WorkState;
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
  decisions: { id: string; text: string; source?: string }[];
  assumptions: { id: string; text: string }[];
  issues: Issue[];
  findings: ReadinessFinding[];
  recommendedNextAction: string;
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
    return parsed.map((item) => ({
      ...item,
      evidence: item.evidence || [],
      findings: item.findings || [],
      activity: item.activity || [],
      timeline: item.timeline || [],
      questions: item.questions || [],
      requirements: item.requirements || [],
      fileFindings: item.fileFindings || [],
      verificationRuns: item.verificationRuns || [],
    }));
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
export const handoffs: Handoff[] = [];

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
