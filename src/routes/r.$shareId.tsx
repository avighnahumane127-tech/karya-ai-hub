import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { PublicNav } from "@/components/public-layout";
import { getShareSnapshot } from "@/lib/work";

const title = "Shared Readiness — Karya AI";
const description = "A read-only Karya AI readiness snapshot.";

export const Route = createFileRoute("/r/$shareId")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SharedReadiness,
});

function SharedReadiness() {
  const { shareId } = Route.useParams();
  const snapshot = getShareSnapshot(shareId);

  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-2xl px-5 py-12 md:px-8 md:py-16">
        {!snapshot ? (
          <EmptyState
            title="This shared report is no longer available."
            description="The link may have been revoked, or this browser does not have access to the local Work data that created it."
          />
        ) : (
          <div className="space-y-8">
            <PageHeader title={snapshot.title} subtitle="Read-only Karya AI readiness snapshot." />
            <div className="rounded-xl border border-hairline bg-surface p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="label-caps">Readiness</p>
                <StatusPill
                  tone={
                    snapshot.status === "READY TO SUBMIT" || snapshot.status === "Ready"
                      ? "ready"
                      : snapshot.status === "NOT READY" || snapshot.status === "Blocked"
                        ? "blocked"
                        : "warn"
                  }
                >
                  {snapshot.status}
                </StatusPill>
              </div>
              <div>
                <p className="label-caps">Summary</p>
                <p className="mt-2 text-sm leading-relaxed">{snapshot.summary}</p>
              </div>
              <div>
                <p className="label-caps">Requirements</p>
                <p className="mt-2 text-sm">{snapshot.requirementsSummary}</p>
              </div>
              <div>
                <p className="label-caps">Critical issues</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {snapshot.criticalIssues.length > 0 ? (
                    snapshot.criticalIssues.map((issue) => <li key={issue}>{issue}</li>)
                  ) : (
                    <li>No critical issues recorded.</li>
                  )}
                </ul>
              </div>
              <div>
                <p className="label-caps">Verification</p>
                <p className="mt-2 text-sm leading-relaxed">{snapshot.verificationSummary}</p>
              </div>
              <div>
                <p className="label-caps">Next steps</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {snapshot.nextSteps.length > 0 ? (
                    snapshot.nextSteps.map((step) => <li key={step}>{step}</li>)
                  ) : (
                    <li>No next steps recorded.</li>
                  )}
                </ul>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Snapshot generated {new Date(snapshot.generatedAt).toLocaleString()}. This page
              intentionally excludes private workspace navigation, comments, decisions, credentials,
              and source files. Server-backed public sharing and expiration are not enabled in this
              client.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
