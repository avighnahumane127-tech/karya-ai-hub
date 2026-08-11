// Types describing WorkReady / Karya AI work items.
// No user, project or activity data is fabricated here: real data only ever
// arrives from the user, so every collection below starts genuinely empty.

export type WorkState = "blocked" | "waiting" | "ready" | "verify" | "clarify" | "done";
export type ReqStatus = "complete" | "partial" | "missing" | "conflict";
export type StepStatus = "blocked" | "ready" | "waiting" | "not-started" | "done";
export type SourceKind = "confirmed" | "inferred" | "assumption" | "conflict";

export type Source = { kind: SourceKind; label: string };

export type Issue = { id: string; problem: string; detail: string; action: string };

export type Requirement = {
  id: string;
  title: string;
  status: ReqStatus;
  why: string;
  evidence: string;
  source: Source;
  action: string;
};

export type PlanStep = { id: string; title: string; status: StepStatus; note?: string };

export type Question = {
  id: string;
  question: string;
  why: string;
  state: "must" | "waiting" | "resolved";
  person?: string;
  priority?: string;
  workId: string;
  workTitle: string;
};

export type WorkFile = {
  id: string;
  name: string;
  role: "Source" | "Working file" | "Final" | "Missing";
  meta?: string;
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

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  state: WorkState;
  due?: string;
  requirements: Requirement[];
  plan: PlanStep[];
  questions: Question[];
  files: WorkFile[];
  verify: VerifyCheck[];
};

export const stateLabels: Record<WorkState, string> = {
  blocked: "Blocked",
  waiting: "Waiting",
  ready: "Ready to start",
  verify: "Ready for verification",
  clarify: "Needs clarification",
  done: "Completed",
};

/** Real work items. Empty until the user adds work. */
export const workItems: WorkItem[] = [];

/** Questions raised on real work. */
export const questions: Question[] = [];

/** Handoffs on real work. */
export const handoffs: Handoff[] = [];

/** Notifications from real events. */
export const notifications: { id: string; text: string; when: string }[] = [];

export function getWork(id: string): WorkItem | undefined {
  return workItems.find((w) => w.id === id);
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