import { Link, createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useState } from "react";

import { PageHeader, SourceTag } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const title = "Add Work — Karya AI";
const description = "Drop files or paste instructions and Karya AI will work out what is being asked.";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AddWork,
});

const kinds = [
  "Office work",
  "Client work",
  "Research",
  "Report",
  "Presentation",
  "Design",
  "Website",
  "Data",
  "Other",
];

function AddWork() {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-16">
      <PageHeader
        title="Add Work"
        subtitle={`Step ${step} of 3`}
      />

      {step === 1 ? (
        <div className="mt-9">
          <h2 className="text-lg font-medium">Give us the work</h2>
          <div className="mt-4 rounded-lg border border-dashed border-hairline bg-surface px-6 py-12 text-center">
            <Upload className="mx-auto h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
            <p className="mt-3 text-sm">Drop files here or paste instructions</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, images, spreadsheets, ZIP</p>
          </div>
          <Textarea
            placeholder="Or paste the assignment, brief or email here..."
            className="mt-3 min-h-28 border-hairline bg-surface"
          />
          <div className="mt-5 flex justify-end">
            <Button size="sm" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-9">
          <h2 className="text-lg font-medium">What kind of work is this?</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            This decides which checks are applied.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors",
                  kind === k
                    ? "border-foreground/40 bg-accent font-medium"
                    : "border-hairline text-muted-foreground hover:border-input hover:text-foreground",
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setKind("I don't know")}
            className="mt-4 block text-sm text-muted-foreground underline underline-offset-4"
          >
            I don't know — work it out for me
          </button>
          <div className="mt-8 flex justify-between">
            <Button size="sm" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button size="sm" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-9">
          <h2 className="text-lg font-medium">Here's what I understood</h2>
          <div className="mt-4 space-y-4 rounded-lg border border-hairline bg-surface px-5 py-5">
            <p className="text-sm leading-relaxed">
              You need to compare three supplier proposals on price, delivery time and warranty, and
              recommend one supplier for management approval by Friday.
            </p>
            <div className="space-y-2 border-t border-hairline pt-4">
              <SourceTag kind="confirmed" label="supplier-brief.pdf · Page 1" />
              <SourceTag kind="conflict" label="manager-email.pdf · Page 1 — deadline differs" />
              <SourceTag kind="assumption" label="An executive summary is expected" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to="/work/$workId" params={{ workId: "supplier-recommendation" }}>
                Looks right
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}