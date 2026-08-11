import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/work";

const title = "Templates — Karya AI";
const description = "Start common types of work with the right checks already defined.";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="Templates"
        subtitle="Start common types of work with predefined checking rules."
      />

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex flex-col justify-between rounded-lg border border-hairline bg-surface px-5 py-5"
          >
            <div>
              <h3 className="text-sm font-medium">{t.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                {t.checks.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <Button size="sm" variant="outline">
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}