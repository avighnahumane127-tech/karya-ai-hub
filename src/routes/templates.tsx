import { useMemo, useState } from "react";

import { EmptyState, PageHeader } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import {
  applyTemplateToWork,
  createUserTemplate,
  deleteUserTemplate,
  recordTemplateUse,
  templates,
  userTemplates,
  workItems,
  type Template,
  type UserTemplate,
} from "@/lib/work";
import { createFileRoute } from "@tanstack/react-router";

const title = "Templates — Karya AI";
const description = "Start common types of work with predefined checking rules.";

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
  const [selectedWorkId, setSelectedWorkId] = useState(
    workItems.find((work) => !work.archived)?.id || "",
  );
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateChecks, setTemplateChecks] = useState("");
  const [notice, setNotice] = useState("");
  const activeWork = useMemo(() => workItems.filter((work) => !work.archived), []);

  const useTemplate = (template: Template | UserTemplate) => {
    if (!selectedWorkId) {
      setNotice("Select an active Work before applying a template.");
      return;
    }
    applyTemplateToWork(selectedWorkId, template.id);
    if ("uses" in template) recordTemplateUse(template.id);
    setNotice(
      `${template.name} applied to ${workItems.find((work) => work.id === selectedWorkId)?.title || "the selected Work"}.`,
    );
  };

  const createTemplate = (event: React.FormEvent) => {
    event.preventDefault();
    const created = createUserTemplate({
      name: templateName,
      description: templateDescription,
      checks: templateChecks
        .split("\n")
        .map((check) => check.trim())
        .filter(Boolean),
    });
    if (!created) {
      setNotice("Add a template name and at least one check.");
      return;
    }
    setTemplateName("");
    setTemplateDescription("");
    setTemplateChecks("");
    setNotice(`Template created: ${created.name}.`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader
        title="Templates"
        subtitle="Start common types of work with predefined checking rules or create a personal template."
      />

      <div className="mt-8 rounded-xl border border-hairline bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-caps">Apply to Work</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Templates add checks to an existing Work; they do not invent a project or mark
              anything complete.
            </p>
          </div>
          {activeWork.length > 0 ? (
            <select
              value={selectedWorkId}
              onChange={(event) => setSelectedWorkId(event.currentTarget.value)}
              className="h-9 min-w-56 rounded-md border border-input bg-background px-3 text-xs"
            >
              {activeWork.map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-muted-foreground">No active Work available.</span>
          )}
        </div>
        {notice ? <p className="mt-3 text-xs text-info">{notice}</p> : null}
      </div>

      <section className="mt-9">
        <h2 className="label-caps">System templates</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={() => useTemplate(template)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={createTemplate}
          className="rounded-xl border border-hairline bg-surface p-5 space-y-4"
        >
          <div>
            <h2 className="label-caps">Create personal template</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Templates stay with your individual account. Add one check per line.
            </p>
          </div>
          <input
            value={templateName}
            onChange={(event) => setTemplateName(event.currentTarget.value)}
            placeholder="Template name"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
          <input
            value={templateDescription}
            onChange={(event) => setTemplateDescription(event.currentTarget.value)}
            placeholder="Description"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
          <textarea
            value={templateChecks}
            onChange={(event) => setTemplateChecks(event.currentTarget.value)}
            placeholder="Audience confirmed\nRequired files collected\nApproval step defined"
            className="min-h-28 w-full rounded-md border border-input bg-background p-3 text-sm"
          />
          <Button type="submit" size="sm">
            Save personal template
          </Button>
        </form>

        <div>
          <h2 className="label-caps">Personal templates</h2>
          {userTemplates.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                title="No personal templates yet."
                description="Create one when you have a repeatable set of Work checks."
              />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {userTemplates.map((template) => (
                <div key={template.id} className="rounded-xl border border-hairline bg-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium">{template.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Used {template.uses} time{template.uses === 1 ? "" : "s"}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                    {template.checks.map((check) => (
                      <li key={check}>• {check}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        deleteUserTemplate(template.id);
                        setNotice(`Deleted template: ${template.name}.`);
                      }}
                    >
                      Delete
                    </Button>
                    <Button size="sm" onClick={() => useTemplate(template)}>
                      Use template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: Template; onUse: () => void }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-hairline bg-surface px-5 py-5">
      <div>
        <h3 className="text-sm font-medium">{template.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{template.description}</p>
        <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          {template.checks.map((check) => (
            <li key={check} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
              {check}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="sm" variant="outline" onClick={onUse}>
          Use template
        </Button>
      </div>
    </div>
  );
}
