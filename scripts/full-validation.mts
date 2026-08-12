import assert from "node:assert/strict";

const storage = new Map<string, string>();
(globalThis as any).window = {
  localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  },
};

const workLib = await import("../src/lib/work.ts");
const {
  addApproval,
  addCompletedWorkFile,
  addDecision,
  addEvidence,
  addOpenIssue,
  addWorkComment,
  addWorkItem,
  analyzeFileIntelligence,
  analyzeRequirementChanges,
  applyRetentionPolicy,
  compareSourceVersions,
  createCrossWorkDependency,
  createOrganizationPolicy,
  createShareLink,
  createUserTemplate,
  detectSensitiveData,
  dismissSensitiveFinding,
  generateCommunicationDraft,
  generateHandoffPacket,
  generateProcessRecommendations,
  generateReadinessReport,
  generateRequirementsCSV,
  generateWorkPlanMarkdown,
  getAnalyticsSnapshot,
  getShareSnapshot,
  intelligenceStore,
  markFileAuthority,
  refreshAnalyticsIntelligence,
  removeEvidence,
  revokeShareLink,
  runPolicyChecks,
  runRegressionCheck,
  runVerification,
  setCollaborationEnabled,
  setRetentionPolicy,
  setWorkAnalyticsExcluded,
  updateQuestionAnswer,
  updateRequirement,
  updateWorkDeadline,
  updateWorkFile,
} = workLib;

const work = {
  id: "full-validation-work",
  title: "Supplier recommendation validation",
  description: "Compare supplier proposals and prepare a recommendation.",
  state: "blocked",
  request: {
    objective: "Compare supplier proposals and prepare a recommendation.",
    action: "Compare suppliers",
    outcome: "A recommendation for management",
    deadline: "Friday",
    audience: "Management",
    deliverables: ["Recommendation report", "Risk analysis"],
  },
  requirements: [
    {
      id: "req-sources",
      title: "Include sources",
      status: "MISSING",
      why: "The recommendation must be traceable.",
      evidence: "No supporting evidence recorded.",
      source: { kind: "confirmed", label: "Supplier brief" },
      action: "Add source references.",
      type: "MANDATORY",
      priority: "CRITICAL",
      relatedQuestionIds: ["question-criteria"],
    },
  ],
  evidence: [],
  plan: [],
  questions: [
    {
      id: "question-criteria",
      workId: "full-validation-work",
      workTitle: "Supplier recommendation validation",
      question: "Which pricing sheet should be used?",
      why: "Different pricing inputs can change the recommendation.",
      category: "Scope",
      priority: "MUST ANSWER BEFORE STARTING",
      impact: "Critical",
      status: "Open",
      createdDate: "Aug 12, 2026",
      relatedRequirementIds: ["req-sources"],
      relatedDependencyIds: [],
      relatedRiskIds: [],
      relatedFindingIds: [],
      state: "must",
    },
  ],
  files: [
    {
      id: "brief-v1",
      name: "brief.pdf",
      role: "Source",
      type: "application/pdf",
      content:
        "Review supplier proposals. Contact: buyer@example.com. Key: sk-test-1234567890abcdef1234567890abcdef.",
    },
    {
      id: "brief-v2",
      name: "brief-v2.pdf",
      role: "Source",
      type: "application/pdf",
      content: "Review supplier proposals. Include sources and warranty terms.",
    },
    {
      id: "duplicate-source",
      name: "copy.pdf",
      role: "Source",
      type: "application/pdf",
      content: "Review supplier proposals. Include sources and warranty terms.",
    },
    {
      id: "final-candidate",
      name: "final.pdf",
      role: "Source",
      type: "application/pdf",
      content: "Approved final",
    },
    {
      id: "final2-candidate",
      name: "final2.pdf",
      role: "Source",
      type: "application/pdf",
      content: "Approved final 2",
    },
    {
      id: "approved-candidate",
      name: "approved.pdf",
      role: "Source",
      type: "application/pdf",
      content: "Approved source",
    },
  ],
  fileFindings: [],
  verificationRuns: [],
  verify: [],
  timeline: [],
  activity: [
    { id: "created", when: "Aug 12, 2026", title: "Created", detail: "Validation fixture" },
  ],
  decisions: [],
  decisionHistory: [],
  openIssues: [],
  handoffPackets: [],
  assignments: [],
  comments: [],
  approvals: [],
  communicationDrafts: [],
  sensitiveFindings: [],
  securityEvents: [],
  reports: [],
  assumptions: [],
  issues: [],
  findings: [],
  recommendedNextAction: "Answer the pricing question before starting.",
};

const checks: Record<string, boolean> = {};
const pass = (name: string, condition: unknown) => {
  assert.equal(Boolean(condition), true, name);
  checks[name] = true;
};

addWorkItem(work);
pass(
  "work persists to local storage",
  JSON.parse(storage.get("karya-ai-work-items") || "[]").some(
    (item: WorkItem) => item.id === work.id,
  ),
);
analyzeFileIntelligence(work.id);
pass(
  "file intelligence detects identical duplicate",
  work.fileFindings.some((finding) => finding.type === "exact-duplicate"),
);
pass(
  "file intelligence does not choose newest filename",
  ["final.pdf", "final2.pdf", "approved.pdf"].every(
    (name) => work.files.find((file) => file.name === name)?.authorityStatus !== "Authoritative",
  ),
);
pass(
  "file intelligence analyzes source inventory",
  (workLib.getWork(work.id)?.files || []).every((file) => file.processingStatus),
);
markFileAuthority(work.id, "brief-v2", "Authoritative", "Validation user");
updateWorkFile(work.id, "brief-v2", { versionLabel: "v2", versionFamily: "brief" });
pass(
  "authority and file metadata persist",
  workLib.getWork(work.id)?.files.find((file) => file.id === "brief-v2")?.authorityStatus ===
    "Authoritative",
);

const findings = detectSensitiveData(work.id);
pass("sensitive data is detected", findings.length >= 2);
pass(
  "sensitive previews are masked",
  findings.every(
    (finding) =>
      !finding.maskedPreview.includes("buyer@example.com") &&
      !finding.maskedPreview.includes("sk-test-1234567890abcdef1234567890abcdef"),
  ),
);
dismissSensitiveFinding(work.id, findings[0]?.id || "missing");
pass(
  "sensitive finding dismissal persists",
  workLib.getWork(work.id)?.sensitiveFindings.some((finding) => finding.status === "Dismissed"),
);

updateQuestionAnswer(work.id, "question-criteria", "Use Q3 pricing.", "User confirmation");
pass(
  "question answer preserves missing-requirement blocker",
  workLib.getWork(work.id)?.state === "blocked",
);
pass("question answer propagates to plan", (workLib.getWork(work.id)?.plan.length || 0) > 0);
const plannedTasks = workLib.getWork(work.id)?.plan || [];
const plannedTaskIds = new Set(plannedTasks.map((task) => task.id));
pass(
  "plan dependencies reference existing tasks",
  plannedTasks.every((task) =>
    task.dependencies.every((dependencyId) => plannedTaskIds.has(dependencyId)),
  ),
);
pass(
  "plan records critical path",
  (workLib.getWork(work.id)?.planMeta?.criticalPathTaskIds.length || 0) > 0,
);
pass(
  "plan exposes parallel-work opportunities",
  (workLib.getWork(work.id)?.planMeta?.parallelGroups.length || 0) > 0,
);
updateRequirement(work.id, "req-sources", { status: "SATISFIED", priority: "HIGH" });
addEvidence(work.id, {
  type: "File",
  description: "Q3 pricing and supplier source material",
  source: "brief-v2.pdf",
  sourceReference: "brief-v2.pdf",
  sourceLocation: "Page 1",
  relatedRequirementIds: ["req-sources"],
  confidence: "STRONG EVIDENCE",
  confidenceReason: "User-provided source evidence for the requirement.",
  addedBy: "USER-PROVIDED EVIDENCE",
  verificationState: "Unverified",
});
pass("evidence resolves readiness blocker", workLib.getWork(work.id)?.state !== "blocked");
pass(
  "evidence links to requirement",
  (workLib.getWork(work.id)?.requirements[0]?.relatedEvidenceIds?.length || 0) > 0,
);
pass(
  "requirement history records status change",
  (workLib.getWork(work.id)?.requirements[0]?.history?.length || 0) > 0,
);
addApproval(work.id, {
  relatedObjectType: "requirement",
  relatedObjectId: "req-sources",
  reviewer: "Manager",
  status: "APPROVED",
  comment: "Approved",
});
addDecision(work.id, "Use Q3 pricing", "Confirmed by user");
addOpenIssue(work.id, {
  issue: "Waiting for client approval",
  severity: "High",
  description: "Approval is outstanding.",
  status: "Open",
  nextAction: "Request approval.",
});
setCollaborationEnabled(work.id, true);
addWorkComment(work.id, {
  author: "Reviewer",
  text: "Please review sources.",
  relatedObjectType: "work",
  relatedObjectId: work.id,
});
pass("collaboration records comment", (workLib.getWork(work.id)?.comments.length || 0) === 1);

const communication = generateCommunicationDraft(work.id, "Clarification", "Professional", "Short");
pass(
  "communication draft uses current Work",
  Boolean(communication?.text.includes("No unresolved clarification item")),
);
const handoff = generateHandoffPacket(work.id);
pass("handoff packet is generated", Boolean(handoff));
const readinessReport = generateReadinessReport(work.id);
const workPlanReport = generateWorkPlanMarkdown(work.id);
const requirementsCsv = generateRequirementsCSV(work.id);
pass(
  "readiness report uses actual Work title",
  Boolean(readinessReport?.markdown.includes(work.title)),
);
pass(
  "readiness report contains real Markdown line breaks",
  Boolean(readinessReport?.markdown.includes("\n## What was requested")),
);
pass(
  "work plan report is Markdown",
  Boolean(workPlanReport?.markdown.includes("# Karya AI Work Plan")),
);
pass(
  "requirements export contains actual requirement",
  Boolean(requirementsCsv?.markdown.includes("Include sources")),
);
pass(
  "requirements export contains real CSV rows",
  Boolean((requirementsCsv?.markdown.split("\n").length || 0) > 1),
);

const comparison = compareSourceVersions(work.id, "brief-v1", "brief-v2");
pass(
  "source comparison records added content",
  Boolean(comparison && comparison.addedLines.length > 0),
);
analyzeRequirementChanges(work.id);
pass(
  "requirement changes are available",
  intelligenceStore.requirementChanges.some((change) => change.workId === work.id),
);
const impact = updateWorkDeadline(work.id, "Wednesday");
pass("deadline change creates impact", Boolean(impact));
const policy = createOrganizationPolicy({
  name: "Sources required",
  rule: "Every report must include sources.",
  scope: "INDIVIDUAL",
  appliesTo: "",
  severity: "Warning",
  enforcementMode: "Require review",
  createdBy: "Validation",
});
pass("policy persists", Boolean(policy));
pass(
  "policy check runs against Work",
  runPolicyChecks().some((check) => check.policyId === policy?.id),
);
const otherWork: WorkItem = {
  ...work,
  id: "full-validation-other",
  title: "Asset production",
  state: "done",
  files: [
    { id: "other-final", name: "brand-assets.pdf", role: "Final", content: "Approved assets" },
  ],
  questions: [],
  requirements: [],
};
addWorkItem(otherWork);
const dependency = createCrossWorkDependency({
  sourceWorkId: work.id,
  targetWorkId: otherWork.id,
  dependency: "brand-assets.pdf",
  status: "Confirmed",
  impact: "Supplier report needs brand assets.",
  evidence: "User confirmation",
});
pass("cross-work dependency persists", Boolean(dependency));
const regression = runRegressionCheck(otherWork.id, work.id);
pass(
  "regression check returns a factual status",
  regression?.status === "PASS" ||
    regression?.status === "REGRESSION DETECTED" ||
    regression?.status === "INSUFFICIENT DATA",
);
const analytics = refreshAnalyticsIntelligence();
pass("analytics is derived from real Work records", analytics.includedWorkIds.includes(work.id));
pass("advanced pattern/intelligence refresh completes", analytics.generatedAt.length > 0);
const template = createUserTemplate({
  name: "Validation template",
  description: "Fixture template",
  checks: ["Include sources"],
});
pass("personal template persists", Boolean(template));
setWorkAnalyticsExcluded(work.id, true);
pass("analytics exclusion removes Work", !getAnalyticsSnapshot().includedWorkIds.includes(work.id));
setWorkAnalyticsExcluded(work.id, false);

const share = createShareLink(work.id);
pass("share link creates a snapshot", Boolean(share && getShareSnapshot(share?.token || "")));
revokeShareLink(work.id);
pass("revoked share link is inaccessible", getShareSnapshot(share?.token || "") === undefined);

const verificationFile = addCompletedWorkFile(work.id, {
  name: "final.pdf",
  type: "application/pdf",
  source: "Validation upload",
});
pass("completed output file is added", verificationFile?.role === "Final");
if (verificationFile)
  updateWorkFile(work.id, verificationFile.id, {
    content: "Include sources Q3 pricing recommendation",
  });
const verification = runVerification(work.id);
pass(
  "verification matches readable output",
  verification?.requirementResults[0]?.status === "SATISFIED",
);
pass("verification produces a final status", Boolean(verification?.finalStatus));
removeEvidence(work.id, workLib.getWork(work.id)?.evidence[0]?.id || "missing");
pass("evidence removal keeps Work valid", Boolean(workLib.getWork(work.id)));
setRetentionPolicy(work.id, "DELETE_IMMEDIATELY");
pass(
  "immediate retention removes local file content",
  workLib.getWork(work.id)?.files.filter((file) => file.role !== "Missing").length === 0,
);
pass(
  "retention marks dependent review state",
  workLib
    .getWork(work.id)
    ?.requirements.some(
      (requirement) => requirement.status === "NEEDS REVIEW" || requirement.status === "MISSING",
    ),
);
workLib.archiveWork(work.id);
pass("archive changes Work state", workLib.getWork(work.id)?.archived === true);
workLib.restoreWork(work.id);
pass("restore changes Work state", workLib.getWork(work.id)?.archived === false);

console.log(JSON.stringify({ passed: Object.keys(checks).length, checks }, null, 2));
