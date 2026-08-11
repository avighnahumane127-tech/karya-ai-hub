export type WorkState = "blocked" | "waiting" | "ready" | "verify" | "clarify" | "done";

export type ReqStatus = "complete" | "partial" | "missing" | "conflict";
export type StepStatus = "blocked" | "ready" | "waiting" | "not-started" | "done";
export type SourceKind = "confirmed" | "inferred" | "assumption" | "conflict";

export type Source = { kind: SourceKind; label: string };

export type Issue = {
  id: string;
  problem: string;
  detail: string;
  action: string;
};

export type Requirement = {
  id: string;
  title: string;
  status: ReqStatus;
  why: string;
  evidence: string;
  source: Source;
  action: string;
};

export type PlanStep = {
  id: string;
  title: string;
  status: StepStatus;
  note?: string;
};

export type Question = {
  id: string;
  question: string;
  why: string;
  state: "must" | "waiting" | "resolved";
  person?: string;
  age?: string;
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

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  state: WorkState;
  stateLabel: string;
  metaLine: string;
  due?: string;
  readiness: string;
  readinessNote: string;
  understanding: string;
  nextAction: { title: string; detail: string };
  issues: Issue[];
  canDo: string[];
  dontDo: string[];
  requirements: Requirement[];
  plan: PlanStep[];
  files: WorkFile[];
  verify: { status: "READY" | "NOT READY" | "NOT YET"; note: string; checks: VerifyCheck[] };
  handoff: {
    requested: string;
    complete: string[];
    remains: string[];
    decisions: string[];
    files: string[];
    risks: string[];
    nextPerson: string;
  };
};

export const stateLabels: Record<WorkState, string> = {
  blocked: "Blocked",
  waiting: "Waiting",
  ready: "Ready to start",
  verify: "Ready for verification",
  clarify: "Needs clarification",
  done: "Completed",
};

export const workItems: WorkItem[] = [
  {
    id: "supplier-recommendation",
    title: "Supplier Recommendation",
    description: "Compare three supplier proposals and recommend one.",
    state: "blocked",
    stateLabel: "Blocked",
    metaLine: "3 issues · 2 questions · Due Friday",
    due: "Friday",
    readiness: "BLOCKED",
    readinessNote: "3 issues prevent reliable progress.",
    understanding:
      "You need to compare three supplier proposals and recommend one supplier for management approval by Friday.",
    nextAction: {
      title: "Confirm the supplier evaluation criteria.",
      detail: "Without weighting for price, delivery and warranty, any ranking is arbitrary.",
    },
    issues: [
      {
        id: "i1",
        problem: "Evaluation criteria are missing",
        detail:
          "The brief asks you to compare suppliers but does not specify how price, delivery time and warranty should be weighted.",
        action: "Ask the requester to confirm the weighting.",
      },
      {
        id: "i2",
        problem: "One proposal is missing",
        detail: "Proposal C is referenced in the brief but was never uploaded.",
        action: "Request Proposal C from procurement.",
      },
      {
        id: "i3",
        problem: "Deadline conflict",
        detail: "The manager email says Thursday while the brief says Friday.",
        action: "Confirm which date is binding.",
      },
    ],
    canDo: [
      "Check the proposals already received",
      "Build the comparison structure",
      "Identify missing information",
    ],
    dontDo: ["Finalize the recommendation", "Submit the report"],
    requirements: [
      {
        id: "r1",
        title: "Compare all three suppliers",
        status: "partial",
        why: "Two of three proposals are available. Proposal C has not been received.",
        evidence: "Proposal-A.pdf, Proposal-B.pdf",
        source: { kind: "confirmed", label: "supplier-brief.pdf · Page 1" },
        action: "Request Proposal C",
      },
      {
        id: "r2",
        title: "Include delivery cost in the comparison",
        status: "complete",
        why: "Delivery cost appears in both received proposals and in the working sheet.",
        evidence: "supplier-comparison-v2.xlsx · Sheet 1",
        source: { kind: "confirmed", label: "supplier-brief.pdf · Page 2" },
        action: "No action needed",
      },
      {
        id: "r3",
        title: "Provide vendor references",
        status: "missing",
        why: "No vendor references were found in the uploaded materials.",
        evidence: "None found.",
        source: { kind: "confirmed", label: "supplier-brief.pdf · Page 2" },
        action: "Request references",
      },
      {
        id: "r4",
        title: "Submit by Friday",
        status: "conflict",
        why: "The brief states Friday. The manager email states Thursday end of day.",
        evidence: "manager-email.pdf · Page 1",
        source: { kind: "conflict", label: "manager-email.pdf · Page 1" },
        action: "Confirm the binding deadline",
      },
      {
        id: "r5",
        title: "Weight price, delivery and warranty",
        status: "missing",
        why: "The weighting was never stated, so the ranking cannot be defended.",
        evidence: "None found.",
        source: { kind: "inferred", label: "Inferred from comparison request" },
        action: "Ask for the weighting",
      },
      {
        id: "r6",
        title: "Include an executive summary",
        status: "missing",
        why: "Management reports in this workspace always open with a one-page summary.",
        evidence: "None found.",
        source: { kind: "assumption", label: "Based on previous reports" },
        action: "Write the summary last",
      },
    ],
    plan: [
      { id: "p1", title: "Confirm evaluation criteria", status: "blocked", note: "Waiting on weighting" },
      { id: "p2", title: "Validate proposals", status: "ready" },
      { id: "p3", title: "Normalize pricing", status: "waiting", note: "Waiting for Proposal C" },
      { id: "p4", title: "Compare suppliers", status: "not-started" },
      { id: "p5", title: "Draft recommendation", status: "not-started" },
      { id: "p6", title: "Management review", status: "not-started" },
    ],
    files: [
      { id: "f1", name: "Proposal-A.pdf", role: "Source", meta: "Received 12 Aug" },
      { id: "f2", name: "Proposal-B.pdf", role: "Source", meta: "Received 12 Aug" },
      { id: "f3", name: "Proposal-C.pdf", role: "Missing", meta: "Referenced in the brief" },
      { id: "f4", name: "supplier-brief.pdf", role: "Source", meta: "Original request" },
      { id: "f5", name: "supplier-comparison-v2.xlsx", role: "Working file", meta: "Edited yesterday" },
    ],
    verify: {
      status: "NOT READY",
      note: "2 requirements are unresolved.",
      checks: [
        { id: "v1", title: "Missing executive summary", status: "missing", note: "No summary section found in the draft." },
        {
          id: "v2",
          title: "Recommendation does not cite Proposal B",
          status: "review",
          note: "The conclusion references only Proposal A.",
        },
        { id: "v3", title: "Delivery cost included for each supplier", status: "satisfied" },
        { id: "v4", title: "Comparison covers every received proposal", status: "satisfied" },
        { id: "v5", title: "Deliverable format matches the request", status: "satisfied" },
      ],
    },
    handoff: {
      requested:
        "A written comparison of three supplier proposals with one recommended supplier for management approval.",
      complete: [
        "Proposals A and B fully reviewed",
        "Delivery and warranty terms extracted",
        "Comparison structure agreed",
      ],
      remains: ["Proposal C has not been received", "Executive summary not written"],
      decisions: [
        "Pricing normalized to 12-month total cost",
        "Warranty scored on coverage length, not claim process",
      ],
      files: ["supplier-comparison-v2.xlsx", "supplier-brief.pdf"],
      risks: ["Deadline is disputed between Thursday and Friday", "No vendor references collected"],
      nextPerson:
        "The ranking depends on a weighting that was never confirmed. Do not present the ranking as final until procurement confirms how price, delivery and warranty should be weighted.",
    },
  },
  {
    id: "website-redesign",
    title: "Website Redesign",
    description: "Prepare website for client approval.",
    state: "waiting",
    stateLabel: "Waiting",
    metaLine: "Waiting for final product photos",
    due: "26 Aug",
    readiness: "WAITING",
    readinessNote: "One external dependency is holding the work.",
    understanding:
      "You need to finish the redesigned marketing pages and present them to the client for sign-off once the final product photography arrives.",
    nextAction: {
      title: "Chase the final product photos.",
      detail: "Five product pages cannot be completed without them.",
    },
    issues: [
      {
        id: "i1",
        problem: "Product photos not delivered",
        detail: "The client agreed to send 14 photos. Nine have arrived.",
        action: "Send a reminder with the missing list.",
      },
    ],
    canDo: ["Finish the layout and copy", "Prepare the approval walkthrough"],
    dontDo: ["Publish the product pages"],
    requirements: [
      {
        id: "r1",
        title: "All pages responsive on mobile",
        status: "complete",
        why: "Checked across the six templates in the build.",
        evidence: "review-notes.md",
        source: { kind: "confirmed", label: "redesign-brief.pdf · Page 3" },
        action: "No action needed",
      },
      {
        id: "r2",
        title: "Final product photography in place",
        status: "partial",
        why: "9 of 14 photos received.",
        evidence: "assets/photos",
        source: { kind: "confirmed", label: "client-email.pdf · Page 1" },
        action: "Request the remaining 5 photos",
      },
      {
        id: "r3",
        title: "Client approval recorded in writing",
        status: "missing",
        why: "Approval has not been requested yet.",
        evidence: "None found.",
        source: { kind: "inferred", label: "Inferred from approval request" },
        action: "Prepare the approval email",
      },
    ],
    plan: [
      { id: "p1", title: "Finalize page layouts", status: "done" },
      { id: "p2", title: "Copy review", status: "ready" },
      { id: "p3", title: "Insert product photography", status: "waiting", note: "Waiting for 5 photos" },
      { id: "p4", title: "Client walkthrough", status: "not-started" },
    ],
    files: [
      { id: "f1", name: "redesign-brief.pdf", role: "Source" },
      { id: "f2", name: "client-email.pdf", role: "Source" },
      { id: "f3", name: "product-photos-batch-1.zip", role: "Working file", meta: "9 images" },
    ],
    verify: {
      status: "NOT YET",
      note: "Upload the finished pages when you're ready.",
      checks: [],
    },
    handoff: {
      requested: "A redesigned marketing site ready for client sign-off.",
      complete: ["Six templates built", "Copy reviewed on all non-product pages"],
      remains: ["Five product photos outstanding", "Client approval not yet requested"],
      decisions: ["Product grid limited to three columns for readability"],
      files: ["redesign-brief.pdf"],
      risks: ["Approval may slip if photos arrive late in the week"],
      nextPerson: "Photography is the only blocker. Everything else is review-ready.",
    },
  },
  {
    id: "quarterly-management-report",
    title: "Quarterly Management Report",
    description: "Create quarterly management report.",
    state: "ready",
    stateLabel: "Ready to start",
    metaLine: "All required inputs available",
    due: "3 Sep",
    readiness: "READY TO START",
    readinessNote: "Everything needed to begin is available.",
    understanding:
      "You need to produce the Q3 management report covering revenue, headcount and delivery performance, in the standard board format.",
    nextAction: {
      title: "Draft the revenue section.",
      detail: "All three source exports are complete and current.",
    },
    issues: [],
    canDo: ["Draft every section", "Build the charts from the exports"],
    dontDo: [],
    requirements: [
      {
        id: "r1",
        title: "Cover revenue, headcount and delivery",
        status: "complete",
        why: "All three source exports were provided.",
        evidence: "q3-exports.xlsx",
        source: { kind: "confirmed", label: "report-request.pdf · Page 1" },
        action: "No action needed",
      },
      {
        id: "r2",
        title: "Use the standard board template",
        status: "complete",
        why: "Template located in the workspace.",
        evidence: "board-template.docx",
        source: { kind: "confirmed", label: "report-request.pdf · Page 2" },
        action: "No action needed",
      },
    ],
    plan: [
      { id: "p1", title: "Draft revenue section", status: "ready" },
      { id: "p2", title: "Draft headcount section", status: "ready" },
      { id: "p3", title: "Delivery performance", status: "not-started" },
      { id: "p4", title: "Board review", status: "not-started" },
    ],
    files: [
      { id: "f1", name: "report-request.pdf", role: "Source" },
      { id: "f2", name: "q3-exports.xlsx", role: "Source" },
      { id: "f3", name: "board-template.docx", role: "Source" },
    ],
    verify: { status: "NOT YET", note: "Nothing to verify yet.", checks: [] },
    handoff: {
      requested: "The Q3 management report in the standard board format.",
      complete: ["Source data collected and validated"],
      remains: ["All sections still to be written"],
      decisions: [],
      files: ["q3-exports.xlsx"],
      risks: [],
      nextPerson: "Inputs are complete and current. Writing can start immediately.",
    },
  },
  {
    id: "marketing-presentation",
    title: "Marketing Presentation",
    description: "Present the autumn campaign plan to the leadership team.",
    state: "verify",
    stateLabel: "Ready for verification",
    metaLine: "Final deck uploaded · 1 check pending",
    due: "Tomorrow",
    readiness: "READY FOR VERIFICATION",
    readinessNote: "The finished deck is uploaded and waiting on a final check.",
    understanding:
      "You need a 12-slide deck covering the autumn campaign plan, budget and expected reach, for the leadership meeting tomorrow.",
    nextAction: {
      title: "Run verification on the final deck.",
      detail: "One requirement still needs a reviewer's eye.",
    },
    issues: [],
    canDo: ["Run the verification checks", "Prepare speaker notes"],
    dontDo: ["Send the deck before verification passes"],
    requirements: [
      {
        id: "r1",
        title: "Include the campaign budget",
        status: "complete",
        why: "Budget table appears on slide 7.",
        evidence: "autumn-campaign-final.pptx · Slide 7",
        source: { kind: "confirmed", label: "campaign-brief.pdf · Page 1" },
        action: "No action needed",
      },
      {
        id: "r2",
        title: "State expected reach per channel",
        status: "partial",
        why: "Reach is given in total, not per channel.",
        evidence: "autumn-campaign-final.pptx · Slide 9",
        source: { kind: "confirmed", label: "campaign-brief.pdf · Page 2" },
        action: "Split reach by channel",
      },
    ],
    plan: [
      { id: "p1", title: "Build the deck", status: "done" },
      { id: "p2", title: "Internal review", status: "done" },
      { id: "p3", title: "Verify against the brief", status: "ready" },
      { id: "p4", title: "Send to leadership", status: "not-started" },
    ],
    files: [
      { id: "f1", name: "campaign-brief.pdf", role: "Source" },
      { id: "f2", name: "autumn-campaign-final.pptx", role: "Final", meta: "Uploaded today" },
      { id: "f3", name: "autumn-campaign-v4.pptx", role: "Working file" },
    ],
    verify: {
      status: "NOT READY",
      note: "1 requirement needs review.",
      checks: [
        { id: "v1", title: "Expected reach is not split per channel", status: "review", note: "Slide 9 shows a single total." },
        { id: "v2", title: "Budget table present", status: "satisfied" },
        { id: "v3", title: "Deck length within 12 slides", status: "satisfied" },
      ],
    },
    handoff: {
      requested: "A 12-slide autumn campaign presentation for leadership.",
      complete: ["Deck built and internally reviewed"],
      remains: ["Reach breakdown per channel"],
      decisions: ["Budget presented gross, not net of agency fees"],
      files: ["autumn-campaign-final.pptx"],
      risks: ["Reach figures come from last year's benchmarks"],
      nextPerson: "One slide needs a per-channel reach split before this goes out.",
    },
  },
  {
    id: "client-onboarding",
    title: "Client Onboarding",
    description: "Onboard Nordwind Logistics onto the service plan.",
    state: "clarify",
    stateLabel: "Needs clarification",
    metaLine: "2 questions · Scope unclear",
    due: "Next week",
    readiness: "NEEDS CLARIFICATION",
    readinessNote: "The scope of the first phase is not agreed.",
    understanding:
      "You need to onboard Nordwind Logistics: collect account details, configure their plan and run a kickoff session.",
    nextAction: {
      title: "Confirm what phase one includes.",
      detail: "The contract and the kickoff notes describe different scopes.",
    },
    issues: [
      {
        id: "i1",
        problem: "Phase one scope is contradictory",
        detail: "The contract lists two locations. The kickoff notes mention five.",
        action: "Confirm the number of locations in phase one.",
      },
      {
        id: "i2",
        problem: "No named account owner",
        detail: "No single contact has been confirmed on the client side.",
        action: "Ask for a named owner.",
      },
    ],
    canDo: ["Prepare the onboarding checklist", "Draft the kickoff agenda"],
    dontDo: ["Configure locations", "Schedule training"],
    requirements: [
      {
        id: "r1",
        title: "Confirm phase one locations",
        status: "conflict",
        why: "Contract says two locations, kickoff notes say five.",
        evidence: "nordwind-contract.pdf · Page 4",
        source: { kind: "conflict", label: "kickoff-notes.docx · Page 1" },
        action: "Confirm with the client",
      },
      {
        id: "r2",
        title: "Named account owner on file",
        status: "missing",
        why: "No owner recorded in the onboarding materials.",
        evidence: "None found.",
        source: { kind: "assumption", label: "Standard onboarding requirement" },
        action: "Request a named owner",
      },
    ],
    plan: [
      { id: "p1", title: "Clarify phase one scope", status: "blocked", note: "Conflicting sources" },
      { id: "p2", title: "Prepare onboarding checklist", status: "ready" },
      { id: "p3", title: "Configure the account", status: "not-started" },
      { id: "p4", title: "Kickoff session", status: "not-started" },
    ],
    files: [
      { id: "f1", name: "nordwind-contract.pdf", role: "Source" },
      { id: "f2", name: "kickoff-notes.docx", role: "Source" },
    ],
    verify: { status: "NOT YET", note: "Nothing to verify yet.", checks: [] },
    handoff: {
      requested: "Nordwind Logistics onboarded onto the service plan.",
      complete: ["Contract reviewed"],
      remains: ["Phase one scope unconfirmed", "No account owner named"],
      decisions: [],
      files: ["nordwind-contract.pdf"],
      risks: ["Configuring five locations instead of two would triple the setup effort"],
      nextPerson: "Do not configure anything until the location count is confirmed in writing.",
    },
  },
];

export const getWork = (id: string) => workItems.find((w) => w.id === id);

export const questions: Question[] = [
  {
    id: "q1",
    question: "Should delivery time be weighted equally with price?",
    why: "The ranking changes depending on the weighting.",
    state: "must",
    workId: "supplier-recommendation",
    workTitle: "Supplier Recommendation",
    age: "2 days",
  },
  {
    id: "q2",
    question: "Is the deadline Thursday or Friday?",
    why: "The brief and the manager email disagree.",
    state: "must",
    workId: "supplier-recommendation",
    workTitle: "Supplier Recommendation",
    age: "2 days",
  },
  {
    id: "q3",
    question: "Does phase one cover two locations or five?",
    why: "Setup effort roughly triples with five.",
    state: "must",
    workId: "client-onboarding",
    workTitle: "Client Onboarding",
    age: "1 day",
  },
  {
    id: "q4",
    question: "When will the remaining five product photos arrive?",
    why: "Five product pages cannot be completed without them.",
    state: "waiting",
    person: "Lena Brandt, client",
    age: "3 days",
    workId: "website-redesign",
    workTitle: "Website Redesign",
  },
  {
    id: "q5",
    question: "Can procurement forward Proposal C?",
    why: "The comparison is incomplete without it.",
    state: "waiting",
    person: "Ahmed Karimi, procurement",
    age: "1 day",
    workId: "supplier-recommendation",
    workTitle: "Supplier Recommendation",
  },
  {
    id: "q6",
    question: "Should the report use gross or net budget figures?",
    why: "Answered: gross, excluding agency fees.",
    state: "resolved",
    person: "Marta Vogel, marketing lead",
    age: "5 days",
    workId: "marketing-presentation",
    workTitle: "Marketing Presentation",
  },
];

export type Handoff = {
  id: string;
  title: string;
  person: string;
  direction: "incoming" | "outgoing";
  status: string;
  needsAttention?: string;
  when: string;
};

export const handoffs: Handoff[] = [
  {
    id: "h1",
    title: "Autumn campaign deck",
    person: "From Marta Vogel",
    direction: "incoming",
    status: "Awaiting your review",
    when: "Today",
  },
  {
    id: "h2",
    title: "Nordwind onboarding pack",
    person: "From Ahmed Karimi",
    direction: "incoming",
    status: "Scope unconfirmed",
    needsAttention: "Phase one scope contradicts the contract",
    when: "Yesterday",
  },
  {
    id: "h3",
    title: "Supplier comparison draft",
    person: "To Jonas Weiss",
    direction: "outgoing",
    status: "Sent, 2 open risks",
    needsAttention: "Deadline conflict not yet resolved",
    when: "2 days ago",
  },
  {
    id: "h4",
    title: "Website copy review",
    person: "To Lena Brandt",
    direction: "outgoing",
    status: "Accepted",
    when: "Last week",
  },
];

export const templates = [
  { id: "t1", name: "Research", description: "Gather and validate sources before drawing conclusions.", checks: 9 },
  { id: "t2", name: "Report", description: "Structured written report with a required summary.", checks: 12 },
  { id: "t3", name: "Presentation", description: "Deck work with an audience and a decision to support.", checks: 8 },
  { id: "t4", name: "Website", description: "Build or redesign pages with client sign-off.", checks: 14 },
  { id: "t5", name: "Supplier comparison", description: "Compare offers against agreed weighted criteria.", checks: 11 },
  { id: "t6", name: "Client onboarding", description: "Collect details, configure and run a kickoff.", checks: 10 },
  { id: "t7", name: "Data analysis", description: "Clean, analyse and state assumptions explicitly.", checks: 13 },
  { id: "t8", name: "School assignment", description: "Meet stated criteria and citation requirements.", checks: 7 },
];

export const searchResults = [
  {
    id: "s1",
    title: "Executive summary",
    context: "Requirement · Supplier Recommendation",
    to: "/work/supplier-recommendation",
  },
  {
    id: "s2",
    title: "Executive summary",
    context: "Mentioned in report.pdf · Page 4",
    to: "/work/supplier-recommendation",
  },
  { id: "s3", title: "Proposal-C.pdf", context: "File · Missing · Supplier Recommendation", to: "/work/supplier-recommendation" },
  {
    id: "s4",
    title: "Is the deadline Thursday or Friday?",
    context: "Question · Supplier Recommendation",
    to: "/questions",
  },
  { id: "s5", title: "Website Redesign", context: "Work · Waiting for final product photos", to: "/work/website-redesign" },
  { id: "s6", title: "Phase one locations", context: "Requirement · Client Onboarding", to: "/work/client-onboarding" },
];