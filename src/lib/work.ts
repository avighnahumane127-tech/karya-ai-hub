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
export type StepStatus = "blocked" | "ready" | "waiting" | "not-started" | "done";
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

export type PlanStep = { id: string; title: string; status: StepStatus; note?: string };

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

export type WorkFile = {
  id: string;
  name: string;
  role: "Source" | "Working file" | "Final" | "Missing";
  meta?: string;
  type?: string;
  size?: string;
  content?: string;
  category?: string;
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
  plan: PlanStep[];
  questions: Question[];
  files: WorkFile[];
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

  // Recalculate readiness (simulated)
  recalculateReadiness(work);
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
