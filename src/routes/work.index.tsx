import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader, StatusPill, type Tone } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { workItems, type WorkState } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const title = "My Work — Karya AI";
const description =
  "Everything you're currently working on, with what needs attention shown first.";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MyWork,
});

export const stateTone: Record<WorkState, Tone> = {
  blocked: "blocked",
  waiting: "warn",
  clarify: "warn",
  ready: "ready",
  verify: "info",
  done: "neutral",
};

const filters = ["All", "Needs attention", "Active", "Waiting", "Completed"] as const;

function MyWork() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const items = workItems.filter((w) => {
    const matchesQuery =
      !query ||
      (w.title + w.description).toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Needs attention"
          ? w.state === "blocked" || w.state === "clarify"
          : filter === "Active"
            ? w.state === "ready" || w.state === "verify"
            : filter === "Waiting"
              ? w.state === "waiting"
              : w.state === "done";
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="My Work"
        subtitle="Everything you're currently working on."
        action={
          <Button size="sm" asChild>
            <Link to="/add">Add Work</Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2 py-1 transition-colors",
                filter === f
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative sm:w-52">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md border border-hairline bg-surface pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-input"
          />
        </div>
      </div>

      <div className="mt-6 divide-y divide-hairline border-y border-hairline">
        {items.map((w) => (
          <Link
            key={w.id}
            to="/work/$workId"
            params={{ workId: w.id }}
            className="block px-1 py-6 transition-colors hover:bg-accent/40"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h3 className="text-[15px] font-medium">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.description}</p>
              </div>
              <StatusPill tone={stateTone[w.state]}>{w.stateLabel}</StatusPill>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{w.metaLine}</p>
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing here yet."
            description="Add an assignment or brief and Karya AI will turn it into a clear plan."
            action={
              <Button size="sm" asChild>
                <Link to="/add">Add Work</Link>
              </Button>
            }
          />
        </div>
      ) : null}
    </div>
  );
}