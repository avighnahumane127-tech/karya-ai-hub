import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { EmptyState, PageHeader, StatusPill, type Tone } from "@/components/primitives";
import {
  createCrossWorkDependency,
  createOrganizationPolicy,
  getAnalyticsSnapshot,
  getWork,
  intelligenceStore,
  refreshAnalyticsIntelligence,
  runPolicyChecks,
  runRegressionCheck,
  type AnalyticsFilters,
  type AnalyticsRankedItem,
  type AnalyticsSnapshot,
  type CrossWorkDependency,
  type ProcessRecommendation,
  type WorkItem,
  updateCrossWorkDependencyStatus,
  updateProcessRecommendation,
  updateWorkDeadline,
  workItems,
} from "@/lib/work";

const title = "Insights — Karya AI";
const description =
  "Traceable analytics and operational patterns derived from your recorded Work history.";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: InsightsPage,
});

const statusOptions: { value: AnalyticsFilters["status"]; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ready", label: "Ready" },
  { value: "ready-with-warnings", label: "Ready with warnings" },
  { value: "blocked", label: "Blocked" },
  { value: "clarify", label: "Needs clarification" },
  { value: "in-progress", label: "In progress" },
  { value: "waiting", label: "Waiting" },
  { value: "ready-to-submit", label: "Ready to submit" },
  { value: "done", label: "Completed" },
  { value: "review", label: "Review" },
];

function InsightsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({ status: "ALL", templateId: "ALL" });
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot>(() => getAnalyticsSnapshot(filters));
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<AnalyticsRankedItem | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState("");
  const [message, setMessage] = useState("");

  const load = (refresh = false) => {
    if (refresh) setRefreshing(true);
    if (refresh) refreshAnalyticsIntelligence();
    setSnapshot(getAnalyticsSnapshot(filters));
    if (refresh) setRefreshing(false);
  };

  useEffect(() => {
    setSnapshot(getAnalyticsSnapshot(filters));
  }, [filters]);

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const results: { title: string; detail: string; workIds: string[] }[] = [];
    const add = (item: { title: string; detail: string; workIds?: string[] }) => {
      if (`${item.title} ${item.detail}`.toLowerCase().includes(needle)) {
        results.push({ title: item.title, detail: item.detail, workIds: item.workIds || [] });
      }
    };
    snapshot.blockers.forEach((item) =>
      add({ title: item.label, detail: item.detail, workIds: item.workIds }),
    );
    snapshot.missingInformation.forEach((item) =>
      add({ title: item.label, detail: item.detail, workIds: item.workIds }),
    );
    snapshot.repeatedRequirements.forEach((item) =>
      add({ title: item.label, detail: item.detail, workIds: item.workIds }),
    );
    snapshot.patterns.forEach((pattern) =>
      add({ title: pattern.pattern, detail: pattern.evidence, workIds: [] }),
    );
    snapshot.recommendations.forEach((recommendation) =>
      add({
        title: recommendation.title,
        detail: recommendation.evidence,
        workIds: recommendation.relatedWorkIds,
      }),
    );
    return results.slice(0, 12);
  }, [query, snapshot]);

  const templateOptions = Array.from(
    new Map(
      workItems
        .filter((work) => work.templateId)
        .map((work) => [work.templateId as string, work.templateId as string]),
    ).values(),
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="Insights"
        subtitle="What your recorded Work history shows, and what it does not yet establish."
        action={
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="rounded-md border border-input px-3 py-2 text-xs font-medium hover:bg-accent disabled:opacity-50"
          >
            {refreshing ? "Refreshing…" : "Refresh intelligence"}
          </button>
        }
      />

      <div className="mt-5 rounded-lg border border-hairline bg-accent/30 px-4 py-3 text-xs text-muted-foreground">
        Scope: <span className="font-medium text-foreground">Individual</span> · local Work items
        included only · archived or excluded Work is omitted · no organization-wide or team-wide
        claims are made in this client.
      </div>

      <section className="mt-6 rounded-xl border border-hairline bg-surface p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-xs text-muted-foreground">
            From
            <input
              type="date"
              value={filters.from || ""}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFilters((current) => {
                  if (value) return { ...current, from: value };
                  const { from: _from, ...rest } = current;
                  return rest;
                });
              }}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            To
            <input
              type="date"
              value={filters.to || ""}
              onChange={(event) => {
                const value = event.currentTarget.value;
                setFilters((current) => {
                  if (value) return { ...current, to: value };
                  const { to: _to, ...rest } = current;
                  return rest;
                });
              }}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            Status
            <select
              value={filters.status || "ALL"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.currentTarget.value as Exclude<
                    AnalyticsFilters["status"],
                    undefined
                  >,
                }))
              }
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            Work type / template
            <select
              value={filters.templateId || "ALL"}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  templateId: event.currentTarget.value || "ALL",
                }))
              }
              className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              <option value="ALL">All types</option>
              {templateOptions.map((templateId) => (
                <option key={templateId} value={templateId}>
                  {templateId}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setFilters({ status: "ALL", templateId: "ALL" })}
            className="h-9 rounded-md px-3 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading
          title="Overview"
          detail="Counts are calculated from the included Work records."
        />
        {snapshot.hasData ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Metric label="Work included" value={snapshot.overview.totalWork} />
            <Metric label="Completed" value={snapshot.overview.completed} tone="ready" />
            <Metric label="Blocked" value={snapshot.overview.blocked} tone="blocked" />
            <Metric label="Waiting" value={snapshot.overview.waiting} tone="warn" />
            <Metric
              label="Verification runs"
              value={snapshot.overview.verificationOutcomes.reduce(
                (sum, item) => sum + item.count,
                0,
              )}
            />
          </div>
        ) : (
          <NotEnoughData />
        )}
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <RankedList
            title="Verification outcomes"
            items={snapshot.overview.verificationOutcomes}
            onSelect={setSelectedItem}
          />
          <RankedList
            title="Completed over time"
            items={snapshot.overview.completedOverTime}
            onSelect={setSelectedItem}
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <DataNote
            label="Completion timing"
            value={
              snapshot.overview.completionTiming.unavailable > 0
                ? "Not enough deadline timestamps yet."
                : `${snapshot.overview.completionTiming.withinDeadline} within deadline · ${snapshot.overview.completionTiming.afterDeadline} after deadline`
            }
          />
          <DataNote
            label="Average completion duration"
            value={snapshot.overview.averageCompletionDuration}
          />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Work Bottlenecks"
          detail="A blocker is counted only when its structured Work data supports the category."
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <RankedList
            title="Common blockers"
            items={snapshot.blockers}
            onSelect={setSelectedItem}
          />
          <div className="rounded-xl border border-hairline bg-surface p-4">
            <p className="label-caps">Clarification count</p>
            <p className="mt-2 text-2xl font-medium">{snapshot.clarifications.averagePerWork}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Average questions per included Work.
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <SummaryRow label="Before starting" value={snapshot.clarifications.beforeStarting} />
              <SummaryRow
                label="During execution"
                value={snapshot.clarifications.duringExecution}
              />
              <SummaryRow
                label="Waiting for response"
                value={snapshot.clarifications.waitingForResponse}
              />
              <SummaryRow label="Resolved" value={snapshot.clarifications.resolved} />
              <SummaryRow
                label="Average resolution"
                value={snapshot.clarifications.averageResolutionTime}
              />
            </div>
          </div>
          <DataNote label="Handoff delays" value={snapshot.handoffDelays.detail} />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Requirements"
          detail="Repeated items are shown only when they occur in at least two Work items."
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <RankedList
            title="Repeated requirements"
            items={snapshot.repeatedRequirements}
            onSelect={setSelectedItem}
          />
          <RankedList
            title="Requirement failures"
            items={snapshot.requirementFailures}
            onSelect={setSelectedItem}
          />
          <RankedList
            title="Common missing information"
            items={snapshot.missingInformation}
            onSelect={setSelectedItem}
          />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading title="Quality" detail="No arbitrary single quality score is calculated." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DataNote label="First-pass satisfaction" value={snapshot.quality.firstPassSatisfied} />
          <DataNote
            label="Requirements with revisions"
            value={snapshot.quality.requirementsNeedingRevision}
          />
          <DataNote label="Evidence coverage" value={snapshot.quality.evidenceCoverage} />
          <DataNote
            label="Unresolved verification findings"
            value={snapshot.quality.verificationFailures}
          />
        </div>
        <div className="mt-3">
          <RankedQualityList patterns={snapshot.quality.repeatedQualityPatterns} />
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Organizational Memory"
          detail="Known recurring patterns, not mandatory policies. Pattern frequency is based on actual Work requirements."
        />
        <div className="space-y-3">
          {snapshot.patterns.length === 0 ? (
            <NotEnoughData text="A pattern needs repeated Work evidence before it is shown." />
          ) : (
            snapshot.patterns.map((pattern) => (
              <div key={pattern.id} className="rounded-xl border border-hairline bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{pattern.pattern}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{pattern.evidence}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone="info">{pattern.confidence} confidence</StatusPill>
                    <StatusPill tone="neutral">{pattern.status}</StatusPill>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Sources: {pattern.sources.join(", ") || "Unknown"} · Last observed:{" "}
                  {pattern.lastObserved} · Scope: {pattern.scope}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Policy Checking"
          detail="Policies are local user-created rules in this client. They are not organization-wide authorization controls."
        />
        <PolicyPanel snapshot={snapshot} onChanged={() => load(true)} />
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Change Intelligence"
          detail="Changes are recorded only through explicit actions or existing requirement history."
        />
        <ChangePanel onChanged={() => load(true)} />
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Cross-Work Dependencies"
          detail="Dependencies require explicit file evidence or user confirmation. Similar names alone are not enough."
        />
        <DependencyPanel snapshot={snapshot} onChanged={() => load(true)} />
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Regression Checking"
          detail="Compare two actual Work records and preserve the resulting check in local history."
        />
        <RegressionPanel onChanged={() => load(true)} />
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Recommendations"
          detail="Recommendations are data-backed observations. They never silently change templates or policies."
        />
        <RecommendationPanel
          recommendations={snapshot.recommendations}
          onChanged={() => load(true)}
        />
      </section>

      <section className="mt-10">
        <SectionHeading
          title="Intelligence Search"
          detail="Searches the currently included analytics and saved pattern/recommendation records."
        />
        <div className="rounded-xl border border-hairline bg-surface p-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="What keeps blocking our work?"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          {query.trim() ? (
            <div className="mt-4 space-y-2">
              {searchResults.length === 0 ? (
                <NotEnoughData text="No matching recorded pattern or Work evidence." />
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={`${result.title}-${index}`}
                    className="rounded-lg border border-hairline p-3"
                  >
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{result.detail}</p>
                    {result.workIds.length > 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Affected Work:{" "}
                        {result.workIds.map((id) => getWork(id)?.title || id).join(", ")}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </section>

      {selectedItem ? (
        <div className="fixed inset-x-4 bottom-4 z-20 mx-auto max-w-2xl rounded-xl border border-hairline bg-surface p-4 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-caps">Recorded evidence</p>
              <p className="mt-1 text-sm font-medium">{selectedItem.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{selectedItem.detail}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Observed in {selectedItem.count} Work item{selectedItem.count === 1 ? "" : "s"}:{" "}
                {selectedItem.workIds.map((id) => getWork(id)?.title || id).join(", ") ||
                  "No direct Work link recorded."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      {message ? <p className="mt-5 text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-medium">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <p className="label-caps">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-2xl font-medium">{value}</p>
        {typeof value === "number" ? (
          <StatusPill tone={tone}>
            {tone === "neutral"
              ? "Recorded"
              : tone === "ready"
                ? "Done"
                : tone === "blocked"
                  ? "Blocked"
                  : "Waiting"}
          </StatusPill>
        ) : null}
      </div>
    </div>
  );
}

function DataNote({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <p className="label-caps">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function NotEnoughData({ text = "Not enough data yet." }: { text?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-surface p-5 text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function RankedList({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: AnalyticsRankedItem[];
  onSelect: (item: AnalyticsRankedItem) => void;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <p className="label-caps">{title}</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Not enough data yet.</p>
      ) : (
        <div className="mt-3 divide-y divide-hairline">
          {items.slice(0, 8).map((item) => (
            <button
              key={`${title}-${item.label}`}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-start justify-between gap-3 py-3 text-left first:pt-0 last:pb-0 hover:bg-accent/30"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{item.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{item.detail}</span>
              </span>
              <span className="shrink-0 text-sm font-medium">{item.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RankedQualityList({
  patterns,
}: {
  patterns: AnalyticsSnapshot["quality"]["repeatedQualityPatterns"];
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <p className="label-caps">Repeated quality issues</p>
      {patterns.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Not enough repeated verification data yet.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {patterns.map((pattern) => (
            <div key={pattern.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{pattern.pattern}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Observed in {pattern.frequency} Work items · {pattern.provenance}
                </p>
              </div>
              <StatusPill tone={pattern.severity === "High" ? "blocked" : "warn"}>
                {pattern.confidence} confidence
              </StatusPill>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PolicyPanel({
  snapshot,
  onChanged,
}: {
  snapshot: AnalyticsSnapshot;
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [rule, setRule] = useState("");
  const [severity, setSeverity] = useState<"Informational" | "Warning" | "Blocking">("Warning");
  const [mode, setMode] = useState<"Observe" | "Require review" | "Block">("Require review");
  const create = () => {
    if (!name.trim() || !rule.trim()) return;
    createOrganizationPolicy({
      name: name.trim(),
      rule: rule.trim(),
      scope: "INDIVIDUAL",
      appliesTo: "",
      severity,
      enforcementMode: mode,
      createdBy: "User",
    });
    setName("");
    setRule("");
    runPolicyChecks();
    onChanged();
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
        <p className="label-caps">Create local policy</p>
        <input
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          placeholder="Policy name"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
        <input
          value={rule}
          onChange={(event) => setRule(event.currentTarget.value)}
          placeholder="Every external report must include sources."
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={severity}
            onChange={(event) => setSeverity(event.currentTarget.value as typeof severity)}
            className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option>Informational</option>
            <option>Warning</option>
            <option>Blocking</option>
          </select>
          <select
            value={mode}
            onChange={(event) => setMode(event.currentTarget.value as typeof mode)}
            className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option>Observe</option>
            <option>Require review</option>
            <option>Block</option>
          </select>
        </div>
        <button
          type="button"
          onClick={create}
          className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
          disabled={!name.trim() || !rule.trim()}
        >
          Create policy
        </button>
      </div>
      <div className="rounded-xl border border-hairline bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="label-caps">Policy checks</p>
          <span className="text-xs text-muted-foreground">
            {intelligenceStore.policies.length} policy
            {intelligenceStore.policies.length === 1 ? "" : "ies"}
          </span>
        </div>
        {snapshot.policyChecks.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No policy checks recorded yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {snapshot.policyChecks.slice(0, 12).map((check) => (
              <div key={check.id} className="rounded-lg border border-hairline p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {intelligenceStore.policies.find((policy) => policy.id === check.policyId)
                      ?.name || "Policy"}
                  </p>
                  <StatusPill
                    tone={
                      check.status === "PASS"
                        ? "ready"
                        : check.status === "BLOCKED"
                          ? "blocked"
                          : "warn"
                    }
                  >
                    {check.status}
                  </StatusPill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {check.detail} · Work: {getWork(check.workId)?.title || check.workId}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChangePanel({ onChanged }: { onChanged: () => void }) {
  const [workId, setWorkId] = useState("");
  const [deadline, setDeadline] = useState("");
  const update = () => {
    if (!workId || !deadline.trim()) return;
    updateWorkDeadline(workId, deadline.trim());
    setDeadline("");
    onChanged();
  };
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Work
          <select
            value={workId}
            onChange={(event) => setWorkId(event.currentTarget.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          >
            <option value="">Select Work</option>
            {workItems
              .filter((work) => !work.archived)
              .map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          New deadline
          <input
            value={deadline}
            onChange={(event) => setDeadline(event.currentTarget.value)}
            placeholder="Wednesday"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={update}
          disabled={!workId || !deadline.trim()}
          className="h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          Record deadline change
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        This explicitly updates the selected Work, recalculates its plan, and stores an impact
        record. No change is made without this action.
      </p>
    </div>
  );
}

function DependencyPanel({
  snapshot,
  onChanged,
}: {
  snapshot: AnalyticsSnapshot;
  onChanged: () => void;
}) {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [dependency, setDependency] = useState("");
  const create = () => {
    if (!sourceId || !targetId || !dependency.trim()) return;
    createCrossWorkDependency({
      sourceWorkId: sourceId,
      targetWorkId: targetId,
      dependency: dependency.trim(),
      status: "Confirmed",
      impact: "User-confirmed cross-Work dependency.",
      evidence: "User confirmation",
    });
    setDependency("");
    onChanged();
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
        <p className="label-caps">Confirm dependency</p>
        <select
          value={sourceId}
          onChange={(event) => setSourceId(event.currentTarget.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="">Waiting Work</option>
          {workItems
            .filter((work) => !work.archived)
            .map((work) => (
              <option key={work.id} value={work.id}>
                {work.title}
              </option>
            ))}
        </select>
        <select
          value={targetId}
          onChange={(event) => setTargetId(event.currentTarget.value)}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="">Producing Work</option>
          {workItems
            .filter((work) => !work.archived)
            .map((work) => (
              <option key={work.id} value={work.id}>
                {work.title}
              </option>
            ))}
        </select>
        <input
          value={dependency}
          onChange={(event) => setDependency(event.currentTarget.value)}
          placeholder="Brand assets"
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
        <button
          type="button"
          onClick={create}
          disabled={!sourceId || !targetId || !dependency.trim() || sourceId === targetId}
          className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          Confirm dependency
        </button>
      </div>
      <div className="rounded-xl border border-hairline bg-surface p-4">
        <p className="label-caps">Detected and confirmed dependencies</p>
        {snapshot.crossWorkDependencies.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No explicit cross-Work dependency is recorded.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {snapshot.crossWorkDependencies.map((dependency) => (
              <DependencyRow key={dependency.id} dependency={dependency} onChanged={onChanged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DependencyRow({
  dependency,
  onChanged,
}: {
  dependency: CrossWorkDependency;
  onChanged: () => void;
}) {
  const source = getWork(dependency.sourceWorkId)?.title || dependency.sourceWorkId;
  const target = getWork(dependency.targetWorkId)?.title || dependency.targetWorkId;
  return (
    <div className="rounded-lg border border-hairline p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          {source} waits for {target}
        </p>
        <StatusPill
          tone={
            dependency.status === "Blocked" || dependency.status === "Potentially blocked"
              ? "warn"
              : dependency.status === "Resolved"
                ? "ready"
                : "info"
          }
        >
          {dependency.status}
        </StatusPill>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {dependency.dependency} · {dependency.evidence} · {dependency.confidence} confidence
      </p>
      <select
        value={dependency.status}
        onChange={(event) => {
          updateCrossWorkDependencyStatus(
            dependency.id,
            event.currentTarget.value as CrossWorkDependency["status"],
          );
          onChanged();
        }}
        className="mt-2 h-8 rounded-md border border-input bg-background px-2 text-xs"
      >
        <option>Potentially blocked</option>
        <option>Confirmed</option>
        <option>Blocked</option>
        <option>Resolved</option>
      </select>
    </div>
  );
}

function RegressionPanel({ onChanged }: { onChanged: () => void }) {
  const [previousId, setPreviousId] = useState("");
  const [currentId, setCurrentId] = useState("");
  const compare = () => {
    if (!previousId || !currentId || previousId === currentId) return;
    runRegressionCheck(previousId, currentId);
    onChanged();
  };
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-muted-foreground">
          Previous Work
          <select
            value={previousId}
            onChange={(event) => setPreviousId(event.currentTarget.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Select Work</option>
            {workItems
              .filter((work) => !work.archived)
              .map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Current Work
          <select
            value={currentId}
            onChange={(event) => setCurrentId(event.currentTarget.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">Select Work</option>
            {workItems
              .filter((work) => !work.archived)
              .map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title}
                </option>
              ))}
          </select>
        </label>
        <button
          type="button"
          onClick={compare}
          disabled={!previousId || !currentId || previousId === currentId}
          className="h-9 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
        >
          Run regression check
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        The comparison reports expected, missing, and new requirements. It does not assume two
        similar Work items are recurring without an explicit comparison.
      </p>
    </div>
  );
}

function RecommendationPanel({
  recommendations,
  onChanged,
}: {
  recommendations: ProcessRecommendation[];
  onChanged: () => void;
}) {
  return (
    <div className="space-y-3">
      {recommendations.length === 0 ? (
        <NotEnoughData text="No data-backed process recommendation is available yet." />
      ) : (
        recommendations.map((recommendation) => (
          <div key={recommendation.id} className="rounded-xl border border-hairline bg-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{recommendation.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{recommendation.evidence}</p>
              </div>
              <StatusPill tone={recommendation.confidence === "High" ? "ready" : "warn"}>
                {recommendation.confidence} confidence
              </StatusPill>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Frequency: {recommendation.frequency} Work items · Impact: {recommendation.impact}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  updateProcessRecommendation(recommendation.id, "Accepted");
                  onChanged();
                }}
                className="rounded-md border border-input px-3 py-1.5 text-xs hover:bg-accent"
              >
                Accept for review
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProcessRecommendation(recommendation.id, "Dismissed");
                  onChanged();
                }}
                className="rounded-md border border-input px-3 py-1.5 text-xs hover:bg-accent"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProcessRecommendation(recommendation.id, "Snoozed");
                  onChanged();
                }}
                className="rounded-md border border-input px-3 py-1.5 text-xs hover:bg-accent"
              >
                Snooze
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
