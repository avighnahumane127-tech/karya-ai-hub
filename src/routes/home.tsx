import { Link, createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader } from "@/components/primitives";
import { WorkComposer } from "@/components/work-composer";
import { Button } from "@/components/ui/button";
import { handoffs, questions, workItems } from "@/lib/work";

const title = "Home — Karya AI";
const description = "See what needs your attention across your work, questions and handoffs.";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const blocked = workItems.filter((w) => w.state === "blocked");
  const waiting = workItems.filter((w) => w.state === "waiting");
  const openQuestions = questions.filter((q) => q.state !== "resolved");
  const attentionHandoffs = handoffs.filter((h) => h.remainingIssues);
  const nothing =
    workItems.length === 0 &&
    openQuestions.length === 0 &&
    attentionHandoffs.length === 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="Home"
        subtitle="What needs your attention."
        action={
          <Button size="sm" asChild>
            <Link to="/add">Add Work</Link>
          </Button>
        }
      />

      <div className="mt-9">
        <p className="label-caps">Quick add work</p>
        <div className="mt-3">
          <WorkComposer placeholder="Paste an assignment, brief, email or instructions..." />
        </div>
      </div>

      {nothing ? (
        <div className="mt-10">
          <EmptyState
            title="Nothing needs your attention yet."
            description="Add an assignment, brief, document or task and Karya AI will work out what it requires."
            action={
              <Button size="sm" asChild>
                <Link to="/add">Add Work</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="label-caps">Blocked</h2>
            <div className="mt-3">
              {blocked.length === 0 ? (
                <p className="text-sm text-muted-foreground">No blocked work.</p>
              ) : (
                <ul className="divide-y divide-hairline border-y border-hairline">
                  {blocked.map((w) => (
                    <li key={w.id} className="py-4 text-sm">
                      <Link to="/work/$workId" params={{ workId: w.id }}>
                        {w.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          <section>
            <h2 className="label-caps">Waiting for someone</h2>
            <div className="mt-3">
              {waiting.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing is waiting.</p>
              ) : (
                <ul className="divide-y divide-hairline border-y border-hairline">
                  {waiting.map((w) => (
                    <li key={w.id} className="py-4 text-sm">
                      <Link to="/work/$workId" params={{ workId: w.id }}>
                        {w.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}