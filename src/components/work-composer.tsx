import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowUp, FileText, Paperclip, Plus, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  acceptedFileTypes,
  formatBytes,
  getFileSelectionError,
  stageQuickWorkDraft,
  typeOfFile,
} from "@/lib/work-input";
import { cn } from "@/lib/utils";

/**
 * The Home composer collects prompt, files, and context together, then transfers the full draft
 * to the established Work Input workflow. File objects are kept only in-memory for the same-tab
 * handoff and are never represented as uploaded until a backend is connected.
 */
export function WorkComposer({
  placeholder = "Paste an assignment, brief, email, or instructions...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [context, setContext] = useState("");
  const [contextDraft, setContextDraft] = useState("");
  const [contextOpen, setContextOpen] = useState(false);
  const [selectionError, setSelectionError] = useState("");

  const addFiles = (files: File[]) => {
    const accepted: File[] = [];
    const errors: string[] = [];
    const knownFiles = new Set(
      selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );

    for (const file of files) {
      const fileError = getFileSelectionError(file);
      const fingerprint = `${file.name}-${file.size}-${file.lastModified}`;
      if (fileError) {
        errors.push(fileError);
      } else if (knownFiles.has(fingerprint)) {
        errors.push(`${file.name} is already selected.`);
      } else {
        knownFiles.add(fingerprint);
        accepted.push(file);
      }
    }

    if (accepted.length > 0) setSelectedFiles((current) => [...current, ...accepted]);
    setSelectionError(errors.join(" "));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = "";
  };

  const submitWork = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = value.trim();
    const additionalContext = context.trim();

    if (!prompt && selectedFiles.length === 0 && !additionalContext) {
      setSelectionError(
        "Add instructions, a supported file, or context before starting a Work package.",
      );
      return;
    }

    stageQuickWorkDraft({ prompt, context: additionalContext, files: selectedFiles });
    navigate({ to: "/add" });
  };

  return (
    <>
      <form
        onSubmit={submitWork}
        className={cn(
          "rounded-xl border border-hairline bg-surface p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus-within:border-input",
          className,
        )}
      >
        <textarea
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder={placeholder}
          rows={4}
          className="min-h-28 w-full resize-none bg-transparent px-1.5 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground"
        />

        {selectedFiles.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2 border-t border-hairline pt-3">
            {selectedFiles.map((file) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex max-w-full items-center gap-2 rounded-md border border-hairline bg-accent/35 px-2.5 py-1.5 text-xs"
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  {typeOfFile(file)} · {formatBytes(file.size)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() =>
                    setSelectedFiles((current) =>
                      current.filter(
                        (selected) =>
                          `${selected.name}-${selected.size}-${selected.lastModified}` !==
                          `${file.name}-${file.size}-${file.lastModified}`,
                      ),
                    )
                  }
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {context.trim() ? (
          <div className="mt-2 rounded-md border border-hairline bg-accent/25 px-3 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium">Additional context</p>
                <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                  {context}
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove additional context"
                onClick={() => setContext("")}
                className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : null}

        {selectionError ? (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-warn/40 bg-warn/5 px-3 py-2 text-xs text-muted-foreground">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" />
            <span>{selectionError}</span>
          </div>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-hairline pt-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedFileTypes}
              onChange={onFileChange}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-3.5 w-3.5" strokeWidth={1.8} />
              Attach file
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5"
              onClick={() => {
                setContextDraft(context);
                setContextOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
              Add context
            </Button>
          </div>
          <Button
            type="submit"
            size="icon-sm"
            aria-label="Start Work package"
            disabled={!value.trim() && selectedFiles.length === 0 && !context.trim()}
            className="shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-4 text-muted-foreground">
          Files are selected locally and grouped with your instructions and context in one Work
          Package. They are not uploaded to an external service by this client.
        </p>
      </form>

      <Dialog open={contextOpen} onOpenChange={setContextOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add context</DialogTitle>
            <DialogDescription>
              Add background, constraints, previous decisions, requirements, or notes to this Work
              Package.
            </DialogDescription>
          </DialogHeader>
          <textarea
            autoFocus
            value={contextDraft}
            onChange={(event) => setContextDraft(event.currentTarget.value)}
            placeholder="Add anything Karya AI should know about this work..."
            rows={8}
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setContextOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!contextDraft.trim()}
              onClick={() => {
                setContext(contextDraft.trim());
                setContextOpen(false);
              }}
            >
              Add to Work Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
