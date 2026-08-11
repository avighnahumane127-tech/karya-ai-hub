import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, StatusPill } from "@/components/primitives";
import { handoffs } from "@/lib/mock-data";

const title = "Handoffs — Karya AI";
const description = "Work coming to you, work you sent on, and handoffs with unresolved issues.";

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

function HandoffRows({ items }: { items: typeof handoffs }) {
  return (
    <div className="mt-3 divide-y divide-hairline border-y border-hairline">
      {items.map((h) => (
        <div key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium">{h.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {h.person} · {h.when}
            </p>
            {h.needsAttention ? (
              <p className="mt-2 text-xs text-warn">{h.needsAttention}</p>
            ) : null}
          </div>
          <StatusPill tone={h.needsAttention ? "warn" : h.status === "Accepted" ? "ready" : "info"}>
            {h.status}
          </StatusPill>
        </div>
      ))}
    </div>
  );
}

function HandoffsPage() {
  const needsAttention = handoffs.filter((h) => h.needsAttention);
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Handoffs" subtitle="Work moving between you and other people." />

      <div className="mt-10 space-y-10">
        {needsAttention.length > 0 ? (
          <section>
            <h2 className="label-caps">Needs attention</h2>
            <HandoffRows items={needsAttention} />
          </section>
        ) : null}
        <section>
          <h2 className="label-caps">Incoming</h2>
          <HandoffRows items={handoffs.filter((h) => h.direction === "incoming")} />
        </section>
        <section>
          <h2 className="label-caps">Outgoing</h2>
          <HandoffRows items={handoffs.filter((h) => h.direction === "outgoing")} />
        </section>
      </div>
    </div>
  );
}