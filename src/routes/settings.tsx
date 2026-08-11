import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/primitives";
import { Switch } from "@/components/ui/switch";

const title = "Settings — Karya AI";
const description = "Account, preferences, AI behaviour, privacy and notification settings.";

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
      { title: "Review preferences", detail: "Confirm the understanding before planning", toggle: true },
    ],
  },
  {
    label: "Privacy",
    rows: [
      { title: "File retention", detail: "How long uploads are kept" },
      { title: "Automatic deletion", detail: "Delete files after handoff", toggle: true },
      { title: "Data controls", detail: "Export or delete your data" },
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

function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-14">
      <PageHeader title="Settings" subtitle="How Karya AI works for you." />

      <div className="mt-10 space-y-9">
        {sections.map((s) => (
          <section key={s.label}>
            <h2 className="label-caps">{s.label}</h2>
            <div className="mt-3 divide-y divide-hairline border-y border-hairline">
              {s.rows.map((r) => (
                <div
                  key={r.title}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.detail}</p>
                  </div>
                  {r.toggle ? (
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