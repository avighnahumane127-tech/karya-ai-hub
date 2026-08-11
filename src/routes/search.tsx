import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader } from "@/components/primitives";

const title = "Search — Karya AI";
const description = "Search work, requirements, questions, files, evidence, handoffs and templates.";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SearchPage,
});

const scopes = [
  "Work",
  "Requirements",
  "Questions",
  "Files",
  "Evidence",
  "Handoffs",
  "Templates",
];

function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Global Search" subtitle="Search across everything in your account." />

      <label className="mt-8 flex h-11 items-center gap-2.5 rounded-md border border-hairline bg-surface px-3.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search work, requirements, files..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {scopes.map((s) => (
          <span
            key={s}
            className="rounded-md border border-hairline px-2.5 py-1 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <EmptyState
          title={query.trim() ? "No results found." : "No results yet."}
          description="Search covers your work, requirements, questions, files, evidence, handoffs and templates."
        />
      </div>
    </div>
  );
}