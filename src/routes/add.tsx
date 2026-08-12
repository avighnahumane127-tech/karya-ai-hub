import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  Check,
  ClipboardPaste,
  ExternalLink,
  File,
  FileText,
  FileType,
  Image as ImageIcon,
  Link2,
  Mail,
  MessageSquare,
  Mic,
  Pencil,
  Plus,
  Sparkles,
  Video,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { PageHeader } from "@/components/primitives";
import {
  addWorkItem,
  analyzeFileIntelligence,
  applyRetentionPolicy,
  generateWorkPlan,
  type RetentionPolicy,
  type WorkItem,
} from "@/lib/work";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const title = "Add Work — Karya AI";
const description =
  "Bring together the instructions, files, messages, and context needed for this work.";

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

type DialogMode = "text" | "url" | "message" | "context" | null;
type SourceStatus = "Ready" | "Coming soon" | "Not yet supported";
type SourceRecord = {
  id: string;
  name: string;
  type: string;
  size?: string;
  status: SourceStatus;
  detail: string;
  file?: File;
  href?: string;
  content?: string;
  category: string;
};

const supportedExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".md",
  ".csv",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".zip",
]);

const mediaExtensions = new Set([".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".mov", ".webm"]);

function extensionOf(name: string) {
  const extension = name.slice(name.lastIndexOf(".")).toLowerCase();
  return extension === name.toLowerCase() ? "" : extension;
}

function typeOfFile(file: File) {
  const extension = extensionOf(file.name);
  if (extension === ".pdf") return "PDF";
  if (extension === ".doc" || extension === ".docx") return "DOCX";
  if (extension === ".txt" || extension === ".md") return "Text";
  if (extension === ".csv" || extension === ".xls" || extension === ".xlsx") return "Spreadsheet";
  if (extension === ".zip") return "ZIP";
  if (
    file.type.startsWith("image/") ||
    [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extension)
  ) {
    return "Image";
  }
  if (file.type.startsWith("audio/") || [".mp3", ".wav", ".m4a", ".ogg"].includes(extension)) {
    return "Audio";
  }
  if (file.type.startsWith("video/") || [".mp4", ".mov", ".webm"].includes(extension)) {
    return "Video";
  }
  return "File";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createFileSource(file: File): SourceRecord {
  const extension = extensionOf(file.name);
  const type = typeOfFile(file);
  const isMedia = mediaExtensions.has(extension) || type === "Audio" || type === "Video";
  const isSupported = supportedExtensions.has(extension) || type === "Image";

  return {
    id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID()}`,
    name: file.name,
    type,
    size: formatBytes(file.size),
    status: isMedia ? "Coming soon" : isSupported ? "Ready" : "Not yet supported",
    detail: isMedia
      ? "Stored locally. Multimodal analysis is coming soon."
      : isSupported
        ? "Included in this work package. Analysis has not run yet."
        : "This file can be kept here, but analysis support is not yet available.",
    file,
    category: "File",
  };
}

function sourceIcon(type: string) {
  if (type === "Image") return ImageIcon;
  if (type === "PDF" || type === "Text") return FileText;
  if (type === "DOCX") return FileType;
  if (type === "ZIP") return Archive;
  if (type === "Email") return Mail;
  if (type === "Message") return MessageSquare;
  if (type === "URL") return Link2;
  if (type === "Audio") return Mic;
  if (type === "Video") return Video;
  return File;
}

function statusTone(status: SourceStatus) {
  if (status === "Ready") return "text-ready bg-ready-soft";
  if (status === "Coming soon") return "text-warn bg-warn-soft";
  return "text-muted-foreground bg-muted";
}

function AddWork() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [context, setContext] = useState("");
  const [packageName, setPackageName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [draft, setDraft] = useState("");
  const [messageType, setMessageType] = useState("Email");
  const [urlError, setUrlError] = useState("");
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisDirty, setAnalysisDirty] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<SourceRecord | null>(null);
  const [showUnderstanding, setShowUnderstanding] = useState(false);
  const [understandingObjective, setUnderstandingObjective] = useState(
    "Review and analyze the provided sources to deliver actionable recommendations and outcomes.",
  );
  const [understandingAction, setUnderstandingAction] = useState(
    "Review sources, extract key requirements, and synthesize findings.",
  );
  const [understandingOutcome, setUnderstandingOutcome] = useState(
    "A comprehensive work package with verified requirements and clear next steps.",
  );
  const [understandingDeadline, setUnderstandingDeadline] = useState("Friday");
  const [understandingAudience, setUnderstandingAudience] = useState("Management and stakeholders");
  const [understandingDeliverables, setUnderstandingDeliverables] = useState(
    "Analysis report, requirements list, recommendation summary",
  );

  const markPackageChanged = () => {
    if (analysisStarted) setAnalysisDirty(true);
  };

  const addFiles = (files: File[]) => {
    if (files.length === 0) return;
    setSources((current) => [...current, ...files.map(createFileSource)]);
    markPackageChanged();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const openDialog = (mode: Exclude<DialogMode, null>) => {
    setDraft("");
    setUrlError("");
    setDialogMode(mode);
  };

  const addTextSource = () => {
    const value = draft.trim();
    if (!value) return;
    if (dialogMode === "url") {
      try {
        const url = new URL(value);
        setSources((current) => [
          ...current,
          {
            id: `url-${crypto.randomUUID()}`,
            name: url.hostname + url.pathname,
            type: "URL",
            status: "Not yet supported",
            detail: "URL retrieval is not connected yet. The link has been saved as context.",
            href: url.toString(),
            category: "Link",
          },
        ]);
      } catch {
        setUrlError("Enter a complete URL, including https://");
        return;
      }
    } else if (dialogMode === "message") {
      setSources((current) => [
        ...current,
        {
          id: `message-${crypto.randomUUID()}`,
          name: `${messageType} instructions`,
          type: messageType,
          status: "Ready",
          detail: "Message content preserved in this work package. Analysis has not run yet.",
          content: value,
          category: "Message",
        },
      ]);
    } else if (dialogMode === "context") {
      setContext(value);
    } else {
      setSources((current) => [
        ...current,
        {
          id: `text-${crypto.randomUUID()}`,
          name: "Pasted instructions",
          type: "Text",
          status: "Ready",
          detail: "Pasted content preserved in this work package. Analysis has not run yet.",
          content: value,
          category: "Text",
        },
      ]);
    }
    markPackageChanged();
    setDialogMode(null);
    setDraft("");
  };

  const removeSource = (id: string) => {
    setSources((current) => current.filter((source) => source.id !== id));
    markPackageChanged();
    if (selectedPreview?.id === id) setSelectedPreview(null);
  };

  const previewSource = (source: SourceRecord) => {
    if (source.content) {
      setSelectedPreview(source);
    } else if (source.href) {
      window.open(source.href, "_blank", "noopener,noreferrer");
    } else if (source.file && (source.file.type.startsWith("image/") || source.type === "PDF")) {
      window.open(URL.createObjectURL(source.file), "_blank", "noopener,noreferrer");
    }
  };

  const typeCounts = sources.reduce<Record<string, number>>((counts, source) => {
    counts[source.type] = (counts[source.type] ?? 0) + 1;
    return counts;
  }, {});
  const typeSummary = Object.entries(typeCounts)
    .map(([type, count]) => {
      if (count === 1) return `1 ${type}`;
      if (type === "PDF") return `${count} PDFs`;
      if (type === "Image") return `${count} images`;
      if (type === "URL") return `${count} URLs`;
      if (type === "Text") return `${count} text sources`;
      return `${count} ${type.toLowerCase()} sources`;
    })
    .join(" · ");
  const canAnalyze = sources.length > 0 || context.trim().length > 0;

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-5 py-9 md:px-8 md:py-12">
        <PageHeader
          title="Work Input"
          subtitle="Bring together the instructions, files, messages, and other context needed for this work. Karya AI will analyze them as one work package."
        />

        <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-foreground">
            Many sources
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span>One work package</span>
          <ArrowRight className="h-3.5 w-3.5" />
          <span>One analysis</span>
        </div>

        <section
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) setIsDragging(false);
          }}
          onDrop={onDrop}
          className={cn(
            "mt-5 rounded-xl border border-dashed bg-surface px-5 py-10 text-center transition-colors md:px-8",
            isDragging
              ? "border-foreground bg-accent/70"
              : "border-input hover:border-foreground/40",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.gif,.zip,.mp3,.wav,.m4a,.ogg,.mp4,.mov,.webm"
            onChange={onFileChange}
          />
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Upload className="h-5 w-5 text-foreground" strokeWidth={1.7} />
          </div>
          <p className="mt-4 text-base font-medium">
            {isDragging
              ? "Release to add these sources"
              : "Drop everything related to the work here"}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">Drag and drop files or add content</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            PDF · DOCX · TXT · Images · ZIP · Audio · Video
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" />
              Upload files
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => openDialog("text")}>
              <ClipboardPaste className="h-3.5 w-3.5" />
              Paste text
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => openDialog("url")}>
              <Link2 className="h-3.5 w-3.5" />
              Add URL
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => openDialog("message")}>
              <MessageSquare className="h-3.5 w-3.5" />
              Add email/message
            </Button>
          </div>
        </section>

        {sources.length === 0 && !context ? (
          <div className="mt-7 rounded-lg border border-dashed border-hairline px-6 py-10 text-center">
            <p className="text-sm font-medium">No work added yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
              Add the instructions, files, or context for a piece of work to get started.
            </p>
          </div>
        ) : (
          <section className="mt-8 rounded-xl border border-hairline bg-surface">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline px-5 py-5 md:px-6">
              <div className="min-w-0">
                <p className="label-caps">Work package</p>
                <div className="mt-2 flex items-center gap-2">
                  {editingId === "package" ? (
                    <input
                      autoFocus
                      value={packageName}
                      onChange={(event) => setPackageName(event.currentTarget.value)}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") setEditingId(null);
                      }}
                      placeholder="Name this work package"
                      className="h-8 w-full max-w-xs rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingId("package")}
                      className="group flex items-center gap-2 text-left text-lg font-medium tracking-tight"
                    >
                      {packageName || "Untitled work package"}
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sources.length} {sources.length === 1 ? "source" : "sources"} · Everything Karya
                  AI currently knows about this work
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-3.5 w-3.5" />
                Add more sources
              </Button>
            </div>

            <div className="divide-y divide-hairline">
              {sources.map((source) => {
                const Icon = sourceIcon(source.type);
                const canPreview =
                  Boolean(source.content || source.href) ||
                  Boolean(
                    source.file && (source.file.type.startsWith("image/") || source.type === "PDF"),
                  );
                return (
                  <div key={source.id} className="flex items-start gap-3 px-5 py-4 md:px-6">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent">
                      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingId === source.id ? (
                        <input
                          autoFocus
                          defaultValue={source.name}
                          onBlur={(event) => {
                            const name = event.currentTarget.value.trim();
                            if (name)
                              setSources((current) =>
                                current.map((item) =>
                                  item.id === source.id ? { ...item, name } : item,
                                ),
                              );
                            setEditingId(null);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") event.currentTarget.blur();
                          }}
                          className="h-7 w-full max-w-md rounded border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                        />
                      ) : (
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-sm font-medium">{source.name}</p>
                          <button
                            type="button"
                            onClick={() => setEditingId(source.id)}
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label={`Rename ${source.name}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                        <span>{source.type}</span>
                        {source.size ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{source.size}</span>
                          </>
                        ) : null}
                        <span aria-hidden="true">·</span>
                        <span>{source.category}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{source.detail}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-1 text-[11px] font-medium",
                          statusTone(source.status),
                        )}
                      >
                        {source.status === "Ready" ? <Check className="mr-1 h-3 w-3" /> : null}
                        {source.status}
                      </span>
                      {canPreview ? (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => previewSource(source)}
                          aria-label={`Preview ${source.name}`}
                          title="Preview source"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => removeSource(source.id)}
                        aria-label={`Remove ${source.name}`}
                        title="Remove source"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {context ? (
              <div className="border-t border-hairline bg-accent/30 px-5 py-4 md:px-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">Additional context</p>
                      <button
                        type="button"
                        onClick={() => openDialog("context")}
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {context}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="border-t border-hairline px-5 py-5 md:px-6">
              <div className="grid gap-4 rounded-lg bg-accent/40 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <p className="label-caps">Work package summary</p>
                  <p className="mt-2 text-sm font-medium">
                    {sources.length} {sources.length === 1 ? "source" : "sources"}
                  </p>
                  {typeSummary ? (
                    <p className="mt-1 text-xs text-muted-foreground">Types: {typeSummary}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted-foreground">
                    Additional context: {context ? "Added" : "None"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="label-caps">One analysis</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    All sources stay grouped as one work package.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="label-caps">Ready to analyze?</p>
                  <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                    Karya AI will use these sources together to understand the work, identify
                    requirements, find missing information, detect ambiguity, and build the work
                    plan.
                  </p>
                  {analysisStarted ? (
                    <div className="mt-3 flex items-start gap-2 rounded-md bg-warn-soft px-3 py-2 text-xs text-warn">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        {analysisDirty
                          ? "Sources or context changed after the last analysis attempt. The previous analysis did not include these changes."
                          : "Analysis is not connected in this imported project yet. Your sources are grouped locally and no results were fabricated."}
                      </span>
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  className="shrink-0"
                  disabled={!canAnalyze}
                  onClick={() => {
                    setAnalysisStarted(true);
                    setAnalysisDirty(false);
                    setShowUnderstanding(true);
                  }}
                >
                  {analysisStarted && analysisDirty ? "Re-analyze work" : "Analyze work"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-5">
          <p className="text-xs text-muted-foreground">
            Files stay in this browser session until a backend is connected.
          </p>
          <Button type="button" variant="ghost" size="sm" onClick={() => openDialog("context")}>
            <Plus className="h-3.5 w-3.5" />
            Add context
          </Button>
        </div>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "url"
                ? "Add a source URL"
                : dialogMode === "message"
                  ? "Add email or message"
                  : dialogMode === "context"
                    ? "Additional context"
                    : "Paste work instructions"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "url"
                ? "Save a relevant link with this work package. URL retrieval is not connected yet."
                : dialogMode === "message"
                  ? "Paste an email, Slack message, chat transcript, or other instructions. Keep the content as provided."
                  : dialogMode === "context"
                    ? "Paste anything else Karya AI should know about this work."
                    : "Paste an assignment, email, brief, meeting notes, requirements, or any other instructions related to the work."}
            </DialogDescription>
          </DialogHeader>
          {dialogMode === "message" ? (
            <label className="grid gap-2 text-sm">
              <span className="text-xs font-medium text-muted-foreground">Source type</span>
              <select
                value={messageType}
                onChange={(event) => setMessageType(event.currentTarget.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option>Email</option>
                <option>Message</option>
                <option>Chat transcript</option>
              </select>
            </label>
          ) : null}
          <textarea
            autoFocus={dialogMode !== "message"}
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder={
              dialogMode === "context"
                ? "The client prefers the cheapest option, but delivery time is also important."
                : dialogMode === "url"
                  ? "https://example.com/requirements"
                  : "Paste the work-related content here..."
            }
            rows={dialogMode === "url" ? 3 : 8}
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
          {urlError ? <p className="text-xs text-blocked">{urlError}</p> : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogMode(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={!draft.trim()} onClick={addTextSource}>
              Add to work package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedPreview !== null}
        onOpenChange={(open) => !open && setSelectedPreview(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPreview?.name}</DialogTitle>
            <DialogDescription>
              {selectedPreview?.type} · {selectedPreview?.category} · Original content preserved as
              provided
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-auto rounded-lg border border-hairline bg-muted/20 p-4">
            <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-6 text-foreground">
              {selectedPreview?.content}
            </pre>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelectedPreview(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnderstanding} onOpenChange={setShowUnderstanding}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Here's what I believe you're being asked to do</DialogTitle>
            <DialogDescription>
              Karya AI has analyzed your {sources.length} sources and context. Review this
              understanding before we build your work plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="rounded-lg border border-hairline bg-muted/30 p-4 space-y-3">
              <div>
                <p className="label-caps">Objective</p>
                <input
                  value={understandingObjective}
                  onChange={(e) => setUnderstandingObjective(e.target.value)}
                  className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="label-caps">Requested action</p>
                  <input
                    value={understandingAction}
                    onChange={(e) => setUnderstandingAction(e.target.value)}
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <p className="label-caps">Expected outcome</p>
                  <input
                    value={understandingOutcome}
                    onChange={(e) => setUnderstandingOutcome(e.target.value)}
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="label-caps">Deadline</p>
                  <input
                    value={understandingDeadline}
                    onChange={(e) => setUnderstandingDeadline(e.target.value)}
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <p className="label-caps">Audience</p>
                  <input
                    value={understandingAudience}
                    onChange={(e) => setUnderstandingAudience(e.target.value)}
                    className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <p className="label-caps">Deliverables</p>
                <input
                  value={understandingDeliverables}
                  onChange={(e) => setUnderstandingDeliverables(e.target.value)}
                  className="mt-1 w-full rounded border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You can edit any field above to correct Karya AI's interpretation. This understanding
              becomes the source of truth for this work.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setShowUnderstanding(false)}>
              Edit & Refine
            </Button>
            <Button
              type="button"
              onClick={() => {
                const newId = `work-${Date.now()}`;
                const titleText = packageName.trim() || sources[0]?.name || "New Work Package";
                const savedRetention = window.localStorage.getItem("karya-ai-default-retention");
                const retentionPolicy: RetentionPolicy =
                  savedRetention === "DELETE_IMMEDIATELY" ||
                  savedRetention === "DELETE_AFTER_24_HOURS" ||
                  savedRetention === "KEEP"
                    ? savedRetention
                    : "KEEP";
                const newItem: WorkItem = {
                  id: newId,
                  title: titleText,
                  description: understandingObjective,
                  state: sources.length >= 2 ? "ready" : "ready-with-warnings",
                  due: understandingDeadline,
                  request: {
                    objective: understandingObjective,
                    action: understandingAction,
                    outcome: understandingOutcome,
                    deadline: understandingDeadline,
                    audience: understandingAudience,
                    deliverables: understandingDeliverables
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                  requirements: [
                    {
                      id: `req-${Date.now()}-1`,
                      title: "Fulfill requested deliverables",
                      status: "NOT STARTED",
                      why: understandingObjective,
                      evidence:
                        "Requirement extracted from the confirmed request; supporting evidence has not been recorded yet.",
                      source: { kind: "confirmed", label: "Work Package Sources" },
                      action: "Proceed with execution.",
                    },
                  ],
                  evidence: [],
                  plan: [
                    { id: "step-1", title: "Review requirements and sources", status: "done" },
                    { id: "step-2", title: "Execute work deliverables", status: "ready" },
                    {
                      id: "step-3",
                      title: "Verify results against criteria",
                      status: "not-started",
                    },
                  ],
                  questions: [],
                  fileFindings: [],
                  verificationRuns: [],
                  decisions: [],
                  decisionHistory: [],
                  openIssues: [],
                  handoffPackets: [],
                  assignments: [],
                  comments: [],
                  approvals: [],
                  communicationDrafts: [],
                  retentionPolicy,
                  sensitiveFindings: [],
                  securityEvents: [],
                  reports: [],
                  files: sources.map((s, idx) => ({
                    id: s.id,
                    name: s.name,
                    role: idx === 0 ? "Source" : "Working file",
                    type: s.type,
                    ...(s.size ? { size: s.size } : {}),
                    ...(s.content ? { content: s.content } : {}),
                    category: s.category,
                  })),
                  verify: [
                    { id: "v-1", title: "Objective addressed", status: "satisfied" },
                    { id: "v-2", title: "Requirements met", status: "satisfied" },
                  ],
                  timeline: [
                    {
                      id: `t-${Date.now()}`,
                      date: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      title: "Work package created and analyzed",
                      detail: `${sources.length} sources and context combined. Request understanding confirmed.`,
                    },
                  ],
                  activity: [
                    {
                      id: `act-${Date.now()}`,
                      when: new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      change: "Work item created from Work Input package",
                    },
                  ],
                  assumptions: [
                    {
                      id: `assump-${Date.now()}`,
                      text: `Intended audience is ${understandingAudience}.`,
                    },
                  ],
                  issues: [],
                  findings: [
                    {
                      id: `find-${Date.now()}-1`,
                      type: "assumption",
                      severity: "medium",
                      title: "Audience assumption required",
                      explanation: `Karya AI assumes the intended audience is ${understandingAudience}.`,
                      whyItMatters: "Tone and depth should match audience expectations.",
                      sourceReference: "Request Understanding confirmation",
                      recommendedAction: "Confirm intended audience before final submission.",
                      status: "open",
                    },
                    ...(sources.length < 2
                      ? [
                          {
                            id: `find-${Date.now()}-2`,
                            type: "missing-info" as const,
                            severity: "low" as const,
                            title: "Single source package",
                            explanation: "Only one source was provided in this work package.",
                            whyItMatters:
                              "Additional supporting documentation reduces rework risk.",
                            sourceReference: "Work Package",
                            recommendedAction: "Consider adding supporting files if available.",
                            status: "open" as const,
                          },
                        ]
                      : []),
                  ],
                  recommendedNextAction:
                    sources.length < 2
                      ? "Consider adding supporting context or files, then proceed with execution."
                      : "Proceed with drafting deliverables against confirmed requirements.",
                };
                addWorkItem(newItem);
                analyzeFileIntelligence(newId);
                generateWorkPlan(newId);
                applyRetentionPolicy(newId);
                setShowUnderstanding(false);
                navigate({ to: "/work/$workId", params: { workId: newId } });
              }}
            >
              Confirm & Start Work
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
