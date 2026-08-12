import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/primitives";
import { Switch } from "@/components/ui/switch";
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
      "Files are deleted after processing where technically possible. Backups, providers, or logs may have separate retention.",
  },
  {
    value: "DELETE_AFTER_24_HOURS",
    label: "Delete after 24 hours",
    detail:
      "Files remain available for 24 hours and are then deleted according to the application's deletion system.",
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

  useEffect(() => {
    const saved = window.localStorage.getItem(DEFAULT_RETENTION_KEY) as RetentionPolicy | null;
    if (saved && retentionOptions.some((option) => option.value === saved)) {
      setDefaultRetention(saved);
    }
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
