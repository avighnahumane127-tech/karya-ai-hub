import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { handoffs, type Handoff } from "@/lib/work";

const title = "Handoffs — Karya AI";
const description = "Work moving between you and other people, with what is still unresolved.";

export const Route = createFileRoute("/handoffs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HandoffsPage,
});

function HandoffRows({ items }: { items: Handoff[] }) {
  return (
    <div className="mt-3 divide-y divide-hairline border-y border-hairline">
      {items.map((h) => (
        <div key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium">{h.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{h.person}</p>
            {h.remainingIssues ? (
              <p className="mt-2 text-xs text-warn">{h.remainingIssues}</p>
            ) : null}
            {h.nextAction ? (
              <p className="mt-1 text-xs text-muted-foreground">Next: {h.nextAction}</p>
            ) : null}
          </div>
          <StatusPill tone={h.remainingIssues ? "warn" : "info"}>{h.status}</StatusPill>
        </div>
      ))}
    </div>
  );
}

const sections: { label: string; filter: (h: Handoff) => boolean }[] = [
  { label: "Needs attention", filter: (h) => Boolean(h.remainingIssues) },
  { label: "Incoming", filter: (h) => h.direction === "incoming" },
  { label: "Outgoing", filter: (h) => h.direction === "outgoing" },
  { label: "Completed", filter: (h) => h.status === "Completed" },
];

function HandoffsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Handoffs" subtitle="Work moving between you and other people." />

      {handoffs.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No handoffs yet."
            description="When work is passed to or from someone, it appears here with its unresolved issues and files."
          />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {sections.map((s) => {
            const items = handoffs.filter(s.filter);
            if (items.length === 0) return null;
            return (
              <section key={s.label}>
                <h2 className="label-caps">{s.label}</h2>
                <HandoffRows items={items} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}