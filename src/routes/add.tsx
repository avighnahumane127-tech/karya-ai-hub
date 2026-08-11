import { createFileRoute } from "@tanstack/react-router";
import {
  Upload,
  FileText,
  FileType,
  Image as ImageIcon,
  Archive,
  Mail,
  MessageSquare,
  Link2,
  Mic,
  Video,
} from "lucide-react";

import { PageHeader } from "@/components/primitives";
import { WorkComposer } from "@/components/work-composer";

const title = "Add Work — Karya AI";
const description = "Give Karya AI the work: paste instructions or add files, emails and links.";

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

const inputs = [
  { label: "PDF", icon: FileText },
  { label: "DOCX", icon: FileType },
  { label: "Image", icon: ImageIcon },
  { label: "ZIP / folder", icon: Archive },
  { label: "Email", icon: Mail },
  { label: "Chat message", icon: MessageSquare },
  { label: "URL", icon: Link2 },
  { label: "Voice", icon: Mic },
  { label: "Video", icon: Video },
];

function AddWork() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 md:px-8 md:py-16">
      <PageHeader title="Add Work" subtitle="Give us the work. We'll work out what it requires." />

      <div className="mt-9 rounded-lg border border-dashed border-hairline bg-surface px-6 py-12 text-center">
        <Upload className="mx-auto h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
        <p className="mt-3 text-sm">Drop files here, or paste the request below</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Nothing is analyzed until you provide the work.
        </p>
      </div>

      <div className="mt-4">
        <WorkComposer placeholder="Paste the assignment, brief, email or instructions..." />
      </div>

      <div className="mt-8 border-t border-hairline pt-6">
        <p className="label-caps">Ways to add work</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {inputs.map((i) => (
            <button
              key={i.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-input hover:text-foreground"
            >
              <i.icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              {i.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}