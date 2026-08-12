import { Search } from "lucide-react";
import { useState } from "react";

import { EmptyState, PageHeader } from "@/components/primitives";
import { workItems } from "@/lib/work";
import { Link, createFileRoute } from "@tanstack/react-router";

const title = "Search — Karya AI";
const description = "Search work, requirements, questions, files, decisions and templates.";

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

function SearchPage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const activeWork = workItems.filter((w) => !w.archived);

  const matchedWorks = activeWork.filter(
    (w) =>
      w.title.toLowerCase().includes(trimmed) ||
      w.description.toLowerCase().includes(trimmed) ||
      w.request.objective.toLowerCase().includes(trimmed),
  );

  const matchedReqs = activeWork.flatMap((w) =>
    w.requirements
      .filter(
        (r) =>
          r.title.toLowerCase().includes(trimmed) ||
          String(r.status).toLowerCase().includes(trimmed) ||
          r.source.label.toLowerCase().includes(trimmed) ||
          (r.sourceLocation || "").toLowerCase().includes(trimmed),
      )
      .map((r) => ({ workId: w.id, workTitle: w.title, req: r })),
  );

  const matchedFiles = activeWork.flatMap((w) =>
    w.files
      .filter((f) => f.name.toLowerCase().includes(trimmed))
      .map((f) => ({ workId: w.id, workTitle: w.title, file: f })),
  );

  const matchedEvidence = activeWork.flatMap((w) =>
    w.evidence
      .filter(
        (e) =>
          e.description.toLowerCase().includes(trimmed) ||
          e.type.toLowerCase().includes(trimmed) ||
          (e.source || "").toLowerCase().includes(trimmed),
      )
      .map((evidence) => ({ workId: w.id, workTitle: w.title, evidence })),
  );

  const matchedQuestions = activeWork.flatMap((w) =>
    w.questions
      .filter((q) => q.question.toLowerCase().includes(trimmed))
      .map((q) => ({ workId: w.id, workTitle: w.title, question: q })),
  );

  const matchedDecisions = activeWork.flatMap((w) =>
    w.decisions
      .filter((d) => d.text.toLowerCase().includes(trimmed))
      .map((d) => ({ workId: w.id, workTitle: w.title, decision: d })),
  );

  const hasResults =
    trimmed.length > 0 &&
    (matchedWorks.length > 0 ||
      matchedReqs.length > 0 ||
      matchedFiles.length > 0 ||
      matchedEvidence.length > 0 ||
      matchedQuestions.length > 0 ||
      matchedDecisions.length > 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Global Search" subtitle="Search across everything in your account." />

      <label className="mt-8 flex h-11 items-center gap-2.5 rounded-md border border-hairline bg-surface px-3.5">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search work, requirements, files, questions..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          autoFocus
        />
      </label>

      <div className="mt-8">
        {!trimmed ? (
          <EmptyState
            title="No search query entered."
            description="Type a keyword to search across work items, requirements, files, questions, and decisions."
          />
        ) : !hasResults ? (
          <EmptyState
            title="No results found."
            description={`No matches found for "${query}". Try searching for another term.`}
          />
        ) : (
          <div className="space-y-8">
            {matchedWorks.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Work ({matchedWorks.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedWorks.map((w) => (
                    <Link
                      key={w.id}
                      to="/work/$workId"
                      params={{ workId: w.id }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <p className="text-sm font-medium">{w.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {w.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {matchedReqs.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Requirements ({matchedReqs.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedReqs.map(({ workId, workTitle, req }) => (
                    <Link
                      key={req.id}
                      to="/work/$workId"
                      params={{ workId }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{req.title}</p>
                        <span className="text-xs text-muted-foreground">{workTitle}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{req.why}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {matchedFiles.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Files ({matchedFiles.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedFiles.map(({ workId, workTitle, file }) => (
                    <Link
                      key={file.id}
                      to="/work/$workId"
                      params={{ workId }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{file.name}</p>
                        <span className="text-xs text-muted-foreground">{workTitle}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{file.type || file.role}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {matchedEvidence.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Evidence ({matchedEvidence.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedEvidence.map(({ workId, workTitle, evidence }) => (
                    <Link
                      key={evidence.id}
                      to="/work/$workId"
                      params={{ workId }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{evidence.description}</p>
                        <span className="text-xs text-muted-foreground">{workTitle}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {evidence.type} · {evidence.confidence} ·{" "}
                        {evidence.source || "Source unavailable."}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {matchedQuestions.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Questions ({matchedQuestions.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedQuestions.map(({ workId, workTitle, question }) => (
                    <Link
                      key={question.id}
                      to="/work/$workId"
                      params={{ workId }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{question.question}</p>
                        <span className="text-xs text-muted-foreground">{workTitle}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{question.why}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {matchedDecisions.length > 0 ? (
              <div>
                <p className="label-caps mb-3">Decisions ({matchedDecisions.length})</p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline bg-surface">
                  {matchedDecisions.map(({ workId, workTitle, decision }) => (
                    <Link
                      key={decision.id}
                      to="/work/$workId"
                      params={{ workId }}
                      className="block p-4 hover:bg-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{decision.text}</p>
                        <span className="text-xs text-muted-foreground">{workTitle}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
