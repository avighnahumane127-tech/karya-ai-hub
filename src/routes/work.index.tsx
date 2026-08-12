import { Search, Archive as ArchiveIcon } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { stateLabels, workItems, archiveWork, restoreWork, type WorkState } from "@/lib/work";
import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";

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
  { key: "all", label: "All Active" },
  { key: "active", label: "In Progress" },
  { key: "blocked", label: "Blocked" },
  { key: "waiting", label: "Waiting" },
  { key: "done", label: "Completed" },
  { key: "archived", label: "Archived" },
] as const;

function MyWorkPage() {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [, setRerender] = useState(0);

  const items = workItems.filter((w) => {
    const matchesQuery =
      w.title.toLowerCase().includes(query.trim().toLowerCase()) ||
      w.description.toLowerCase().includes(query.trim().toLowerCase());

    if (!matchesQuery) return false;

    if (filter === "archived") return Boolean(w.archived);
    if (w.archived) return false;

    if (filter === "all") return true;
    if (filter === "active")
      return w.state === "in-progress" || w.state === "ready" || w.state === "ready-with-warnings";
    if (filter === "blocked") return w.state === "blocked" || w.state === "clarify";
    if (filter === "waiting") return w.state === "waiting";
    if (filter === "done") return w.state === "done";
    return true;
  });

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
            title={filter === "archived" ? "No archived work." : "No work yet."}
            description={
              filter === "archived"
                ? "Archived work items will appear here."
                : "Add an assignment, brief, document, or task to get started."
            }
            action={
              filter !== "archived" ? (
                <Button size="sm" asChild>
                  <Link to="/add">Add Work</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="divide-y divide-hairline border-y border-hairline">
            {items.map((w) => (
              <div key={w.id} className="flex items-start justify-between gap-4 py-5">
                <Link
                  to="/work/$workId"
                  params={{ workId: w.id }}
                  className="min-w-0 flex-1 hover:opacity-80 transition-opacity"
                >
                  <p className="truncate text-sm font-medium">{w.title}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{w.description}</p>
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill
                    tone={w.state === "done" ? "ready" : w.state === "blocked" ? "blocked" : "info"}
                  >
                    {stateLabels[w.state]}
                  </StatusPill>
                  {w.archived ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        restoreWork(w.id);
                        setRerender((n) => n + 1);
                      }}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        archiveWork(w.id);
                        setRerender((n) => n + 1);
                      }}
                      title="Archive work"
                    >
                      <ArchiveIcon className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
