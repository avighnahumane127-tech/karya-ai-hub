import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/primitives";
import { Switch } from "@/components/ui/switch";

const title = "Settings — Karya AI";
const description = "Account, defaults, AI behaviour, privacy and notification preferences.";

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

const sections = [
  {
    label: "Account",
    rows: [
      { title: "Profile", detail: "Riya Sharma · riya@karya.work" },
      { title: "Workspace", detail: "Operations team" },
    ],
  },
  {
    label: "Preferences",
    rows: [
      { title: "Default work type", detail: "Office work" },
      { title: "Default due window", detail: "5 working days" },
    ],
  },
  {
    label: "AI behaviour",
    rows: [
      { title: "Flag assumptions", detail: "Always label inferred information", toggle: true },
      { title: "Ask before interpreting", detail: "Confirm the understanding before planning", toggle: true },
    ],
  },
  {
    label: "Privacy",
    rows: [
      { title: "File retention", detail: "Delete uploads 90 days after handoff" },
      { title: "Delete my data", detail: "Remove all work items and files" },
    ],
  },
  {
    label: "Notifications",
    rows: [
      { title: "Blocked work", detail: "Notify when work becomes blocked", toggle: true },
      { title: "Question answered", detail: "Notify when someone replies", toggle: true },
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
                <div key={r.title} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-sm">{r.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.detail}</p>
                  </div>
                  {"toggle" in r ? (
                    <Switch defaultChecked />
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