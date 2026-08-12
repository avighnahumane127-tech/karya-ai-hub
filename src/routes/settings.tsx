import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createEnvironmentTemplate, integrationCategories } from "@/lib/integration-config";
import {
  getIntegrationEnvironmentPreview,
  type IntegrationEnvironmentPreview,
} from "@/lib/integration-status";
import type { RetentionPolicy } from "@/lib/work";

const title = "Settings — Karya AI";
const description =
  "Account, preferences, AI behaviour, security, privacy and notification settings.";
const DEFAULT_RETENTION_KEY = "karya-ai-default-retention";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SettingsPage,
});

type Row = { title: string; detail: string; toggle?: boolean };
const sections: { label: string; rows: Row[] }[] = [
  {
    label: "Account",
    rows: [
      { title: "Profile", detail: "Not signed in" },
      { title: "Account information", detail: "Sign in to manage your account" },
    ],
  },
  {
    label: "Preferences",
    rows: [
      { title: "Default work type", detail: "Not set" },
      { title: "Date format", detail: "Not set" },
      { title: "Interface preferences", detail: "Density and layout" },
    ],
  },
  {
    label: "AI behaviour",
    rows: [
      { title: "Assumption handling", detail: "Label anything that was inferred", toggle: true },
      { title: "Confidence display", detail: "Show how certain each finding is", toggle: true },
      { title: "Source display", detail: "Show where each requirement came from", toggle: true },
      {
        title: "Review preferences",
        detail: "Confirm the understanding before planning",
        toggle: true,
      },
    ],
  },
  {
    label: "Notifications",
    rows: [
      { title: "Questions", detail: "When a question needs an answer", toggle: true },
      { title: "Deadlines", detail: "When a deadline is approaching", toggle: true },
      { title: "Handoffs", detail: "When work is handed to you", toggle: true },
      { title: "Reviews", detail: "When work is reviewed", toggle: true },
    ],
  },
];

const retentionOptions: { value: RetentionPolicy; label: string; detail: string }[] = [
  {
    value: "DELETE_IMMEDIATELY",
    label: "Delete immediately",
    detail:
      "Locally stored Work file content is removed after initial processing, leaving an unavailable file record. This client does not control provider, backup, or log retention.",
  },
  {
    value: "DELETE_AFTER_24_HOURS",
    label: "Delete after 24 hours",
    detail:
      "Locally stored Work file content is scheduled for removal after 24 hours and is enforced the next time this client loads after the deadline. It is not a background deletion service.",
  },
  {
    value: "KEEP",
    label: "Keep",
    detail:
      "Files remain associated with the Work until you delete them or another applicable retention rule applies.",
  },
];

function SettingsPage() {
  const [defaultRetention, setDefaultRetention] = useState<RetentionPolicy>("KEEP");
  const [environmentPreview, setEnvironmentPreview] =
    useState<IntegrationEnvironmentPreview | null>(null);
  const [environmentPreviewError, setEnvironmentPreviewError] = useState("");
  const [environmentPreviewLoading, setEnvironmentPreviewLoading] = useState(true);
  const [templateCopied, setTemplateCopied] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(DEFAULT_RETENTION_KEY) as RetentionPolicy | null;
    if (saved && retentionOptions.some((option) => option.value === saved)) {
      setDefaultRetention(saved);
    }
  }, []);

  const refreshEnvironmentPreview = () => {
    setEnvironmentPreviewLoading(true);
    setEnvironmentPreviewError("");
    void getIntegrationEnvironmentPreview()
      .then((result) => setEnvironmentPreview(result))
      .catch(() => {
        setEnvironmentPreview(null);
        setEnvironmentPreviewError(
          "The server preview is unavailable. Secret values were not requested or stored in this browser.",
        );
      })
      .finally(() => setEnvironmentPreviewLoading(false));
  };

  useEffect(() => {
    refreshEnvironmentPreview();
  }, []);

  const updateDefaultRetention = (policy: RetentionPolicy) => {
    setDefaultRetention(policy);
    window.localStorage.setItem(DEFAULT_RETENTION_KEY, policy);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Settings" subtitle="How Karya AI works for you." />
      <div className="mt-10 space-y-9">
        {sections.slice(0, 3).map((section) => (
          <section key={section.label}>
            <h2 className="label-caps">{section.label}</h2>
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {section.rows.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm">{row.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{row.detail}</p>
                  </div>
                  {row.toggle ? (
                    <Switch />
                  ) : (
                    <span className="text-xs text-muted-foreground">Edit</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="label-caps">API keys &amp; secret variables</h2>
          <div className="mt-3 space-y-5 rounded-xl border border-hairline bg-surface p-5">
            <div className="rounded-lg border border-warn/40 bg-warn/5 p-4">
              <p className="text-sm font-medium">Server-only configuration</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Insert API keys and secret variables in your deployment secret manager or an ignored
                <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>
                file. Karya AI never asks this browser to store or display secret values, and
                secrets must not use the{" "}
                <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">VITE_</code>
                prefix.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Environment template</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A blank, tracked template is available at{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.example</code>. Fill
                    the local copy on the server or hosting platform, never in this page.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard?.writeText(createEnvironmentTemplate());
                    setTemplateCopied(true);
                    window.setTimeout(() => setTemplateCopied(false), 1800);
                  }}
                >
                  {templateCopied ? "Template copied" : "Copy blank template"}
                </Button>
              </div>
              <textarea
                readOnly
                value={createEnvironmentTemplate()}
                aria-label="Blank server environment template"
                className="mt-3 min-h-40 w-full rounded-md border border-input bg-background p-3 font-mono text-[11px] text-muted-foreground"
              />
            </div>

            <div className="border-t border-hairline pt-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Configuration preview</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This preview returns only whether a server variable is present. It never returns
                    key values.
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={refreshEnvironmentPreview}>
                  Refresh preview
                </Button>
              </div>
              {environmentPreviewLoading ? (
                <p className="mt-4 text-xs text-muted-foreground">Checking server configuration…</p>
              ) : environmentPreviewError ? (
                <p className="mt-4 rounded-md border border-warn/40 bg-warn/5 p-3 text-xs text-muted-foreground">
                  {environmentPreviewError}
                </p>
              ) : environmentPreview?.previewEnabled ? (
                <div className="mt-4 space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Presence preview enabled for this server. Values remain server-only.
                  </p>
                  {integrationCategories.map((category) => {
                    const variables = environmentPreview.variables.filter(
                      (variable) => variable.category === category,
                    );
                    return (
                      <div key={category}>
                        <p className="label-caps">{category}</p>
                        <div className="mt-2 divide-y divide-hairline rounded-md border border-hairline">
                          {variables.map((variable) => (
                            <div
                              key={variable.key}
                              className="grid gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                            >
                              <div className="min-w-0">
                                <p className="text-xs font-medium">{variable.label}</p>
                                <p className="mt-0.5 break-all font-mono text-[11px] text-muted-foreground">
                                  {variable.key}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Required for {variable.requiredFor}.
                                </p>
                              </div>
                              <span
                                className={`w-fit rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${
                                  variable.configured
                                    ? "bg-ready/10 text-ready"
                                    : "bg-warn/10 text-warn"
                                }`}
                              >
                                {variable.configured ? "Configured" : "Missing"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 rounded-md border border-hairline bg-muted/30 p-3 text-xs text-muted-foreground">
                  Presence preview is disabled. Set{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    KARYA_ENABLE_SECRET_PREVIEW=true
                  </code>
                  on the server only when you need a local configuration check.
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="label-caps">Security &amp; Privacy</h2>
          <div className="mt-3 space-y-5 rounded-xl border border-hairline bg-surface p-5">
            <div>
              <p className="text-sm font-medium">File retention</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This is the default for newly created Work items. A Work can have its own retention
                setting.
              </p>
              <select
                value={defaultRetention}
                onChange={(event) =>
                  updateDefaultRetention(event.currentTarget.value as RetentionPolicy)
                }
                className="mt-3 h-9 w-full rounded-md border border-input bg-background px-2 text-sm sm:max-w-xs"
              >
                {retentionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-muted-foreground">
                {retentionOptions.find((option) => option.value === defaultRetention)?.detail}
              </p>
            </div>

            <div className="border-t border-hairline pt-5">
              <p className="text-sm font-medium">How your data is used</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Uploaded content is processed to provide Karya AI's work-understanding, planning,
                requirements, evidence, verification, and related features. The final provider and
                model-training policy should be reviewed in the Privacy Policy before relying on it.
              </p>
              <a
                href="/privacy-policy"
                className="mt-2 inline-block text-sm underline underline-offset-4"
              >
                View Privacy Policy
              </a>
            </div>

            <div className="border-t border-hairline pt-5">
              <p className="text-sm font-medium">Sensitive data</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Work files with available text content can be scanned for potential contact details,
                financial patterns, credentials, and other sensitive patterns. Detection is a
                warning, not a certainty, and previews are masked. Redaction is not currently
                implemented.
              </p>
            </div>

            <div className="border-t border-hairline pt-5">
              <p className="text-sm font-medium">Account security</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Account, session, password, and team authorization controls are not connected in
                this client.
              </p>
              <span className="mt-2 inline-block text-xs text-muted-foreground">Not available</span>
            </div>

            <div className="border-t border-hairline pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Private processing</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Dedicated infrastructure, organization-controlled storage, and private AI
                    processing are planned for a future version.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {sections.slice(3).map((section) => (
          <section key={section.label}>
            <h2 className="label-caps">{section.label}</h2>
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {section.rows.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm">{row.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{row.detail}</p>
                  </div>
                  {row.toggle ? (
                    <Switch />
                  ) : (
                    <span className="text-xs text-muted-foreground">Edit</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
