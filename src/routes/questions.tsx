import { Link, createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { questions } from "@/lib/mock-data";

const title = "Questions — Karya AI";
const description = "Everything that is waiting on an answer, and who it is waiting on.";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: QuestionsPage,
});

const sections = [
  { key: "must", label: "Needs my attention" },
  { key: "waiting", label: "Waiting for others" },
  { key: "resolved", label: "Resolved" },
] as const;

function QuestionsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Questions" subtitle="What is waiting on an answer." />

      {questions.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No unresolved questions."
            description="You're not waiting on anyone."
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-10">
        {sections.map((section) => {
          const items = questions.filter((q) => q.state === section.key);
          if (items.length === 0) return null;
          return (
            <section key={section.key}>
              <h2 className="label-caps">{section.label}</h2>
              <div className="mt-3 divide-y divide-hairline border-y border-hairline">
                {items.map((q) => (
                  <div key={q.id} className="py-5">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{q.question}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{q.why}</p>
                      </div>
                      {section.key === "must" ? (
                        <StatusPill tone="warn">Must answer</StatusPill>
                      ) : section.key === "waiting" ? (
                        <StatusPill tone="info">Sent</StatusPill>
                      ) : (
                        <StatusPill tone="ready">Resolved</StatusPill>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                      <Link
                        to="/work/$workId"
                        params={{ workId: q.workId }}
                        className="underline-offset-4 hover:underline"
                      >
                        {q.workTitle}
                      </Link>
                      {q.person ? <span>· {q.person}</span> : null}
                      {q.age ? <span>· {q.age}</span> : null}
                      {section.key !== "resolved" ? (
                        <Button size="sm" variant="outline" className="ml-auto">
                          Generate message
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}