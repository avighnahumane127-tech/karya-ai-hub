import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { stateLabels, workItems, type WorkState } from "@/lib/work";
import { cn } from "@/lib/utils";

const title = "My Work — Karya AI";
const description = "Everything you are working on, with what needs attention shown first.";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MyWorkPage,
});

const filters = [
  { key: "all", label: "All Work" },
  { key: "active", label: "Active" },
  { key: "attention", label: "Needs Attention" },
  { key: "blocked", label: "Blocked" },
  { key: "waiting", label: "Waiting" },
  { key: "done", label: "Completed" },
] as const;

const matches: Record<string, (s: WorkState) => boolean> = {
  all: () => true,
  active: (s) => s !== "done",
  attention: (s) => s === "clarify" || s === "blocked",
  blocked: (s) => s === "blocked",
  waiting: (s) => s === "waiting",
  done: (s) => s === "done",
};

function MyWorkPage() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const items = workItems.filter(
    (w) =>
      (matches[filter] ?? matches["all"]!)(w.state) &&
      w.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="My Work"
        subtitle="Your work items and where each one stands."
        action={
          <Button size="sm" asChild>
            <Link to="/add">Add Work</Link>
          </Button>
        }
      />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition-colors",
              filter === f.key
                ? "border-foreground/30 bg-accent font-medium"
                : "border-hairline text-muted-foreground hover:border-input hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <label className="mt-4 flex h-9 items-center gap-2 rounded-md border border-hairline bg-surface px-3">
        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.7} />
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search your work..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            title="No work yet."
            description="Add an assignment, brief, document, or task to get started."
            action={
              <Button size="sm" asChild>
                <Link to="/add">Add Work</Link>
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-hairline border-y border-hairline">
            {items.map((w) => (
              <Link
                key={w.id}
                to="/work/$workId"
                params={{ workId: w.id }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{w.title}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{w.description}</p>
                </div>
                <StatusPill tone={w.state === "done" ? "ready" : "info"}>
                  {stateLabels[w.state]}
                </StatusPill>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}