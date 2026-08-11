import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader } from "@/components/primitives";
import { workItems } from "@/lib/work";

const title = "Insights — Karya AI";
const description = "Patterns in your work: blockers, missing information and rework.";

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

const groups = [
  {
    label: "Work insights",
    items: [
      "Work completed",
      "Work blocked",
      "Work waiting",
      "Average completion time",
      "Questions resolved",
      "Rework",
    ],
  },
  {
    label: "Process insights",
    items: [
      "Common missing information",
      "Common ambiguities",
      "Frequent requirement failures",
      "Version conflicts",
      "Causes of rework",
    ],
  },
  {
    label: "Recommendations",
    items: [
      "Workflow improvements",
      "Repeated blockers",
      "Template recommendations",
      "Process optimization",
    ],
  },
];

function InsightsPage() {
  const hasData = workItems.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Insights" subtitle="What your work keeps getting stuck on." />

      <div className="mt-10">
        <EmptyState
          title={hasData ? "Not enough data yet." : "No insights yet."}
          description="Insights will appear as you complete more work."
        />
      </div>

      <div className="mt-10 space-y-8">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="label-caps">{g.label}</h2>
            <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
              {g.items.map((i) => (
                <li
                  key={i}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 text-sm"
                >
                  <span className="min-w-0 truncate text-muted-foreground">{i}</span>
                  <span className="text-xs text-muted-foreground">—</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}