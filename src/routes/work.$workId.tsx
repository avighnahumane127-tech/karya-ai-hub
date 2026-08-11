import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { EmptyState, PageHeader } from "@/components/primitives";
import { WorkTabPanel, workTabs, type WorkTab } from "@/components/work-tabs";
import { Button } from "@/components/ui/button";
import { getWork } from "@/lib/work";
import { cn } from "@/lib/utils";

const title = "Work — Karya AI";
const description = "Overview, requirements, plan, questions, files, verification and handoff.";

export const Route = createFileRoute("/work/$workId")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: WorkDetail,
});

function WorkDetail() {
  const { workId } = Route.useParams();
  const work = getWork(workId);
  const [tab, setTab] = useState<WorkTab>("Overview");

  if (!work) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
        <PageHeader title="Work" subtitle="This work item isn't available." />
        <div className="mt-9">
          <EmptyState
            title="No work yet."
            description="Add an assignment, brief, document, or task to get started."
            action={
              <Button size="sm" asChild>
                <Link to="/add">Add Work</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title={work.title} subtitle={work.description} />

      <div className="mt-7 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <div className="flex min-w-max gap-1 border-b border-hairline">
          {workTabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
                tab === t
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <WorkTabPanel work={work} tab={tab} />
      </div>
    </div>
  );
}