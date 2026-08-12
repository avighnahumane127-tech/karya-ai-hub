export type SourceStatus = "Ready" | "Coming soon" | "Not yet supported";

export type WorkInputSource = {
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

export type QuickWorkDraft = {
  prompt: string;
  context: string;
  files: File[];
};

export const supportedFileExtensions = new Set([
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

export const mediaFileExtensions = new Set([
  ".mp3",
  ".wav",
  ".m4a",
  ".ogg",
  ".mp4",
  ".mov",
  ".webm",
]);

export const acceptedFileTypes = [...supportedFileExtensions, ...mediaFileExtensions].join(",");

let stagedQuickWorkDraft: QuickWorkDraft | null = null;

export function extensionOf(name: string) {
  const extension = name.slice(name.lastIndexOf(".")).toLowerCase();
  return extension === name.toLowerCase() ? "" : extension;
}

export function typeOfFile(file: File) {
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

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileSelectionError(file: File): string | null {
  if (file.size === 0) return `${file.name} is empty and cannot be added.`;
  const extension = extensionOf(file.name);
  const type = typeOfFile(file);
  const supported =
    supportedFileExtensions.has(extension) ||
    mediaFileExtensions.has(extension) ||
    type === "Image";
  return supported ? null : `${file.name} is not a supported file type.`;
}

export function createFileSource(file: File): WorkInputSource {
  const extension = extensionOf(file.name);
  const type = typeOfFile(file);
  const isMedia = mediaFileExtensions.has(extension) || type === "Audio" || type === "Video";
  const isSupported = supportedFileExtensions.has(extension) || type === "Image";

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

/**
 * Holds File objects only during the same in-browser transition from Home to Work Input.
 * The draft is intentionally not placed in localStorage, URL parameters, or a server request.
 */
export function stageQuickWorkDraft(draft: QuickWorkDraft) {
  stagedQuickWorkDraft = draft;
}

export function consumeQuickWorkDraft() {
  const draft = stagedQuickWorkDraft;
  stagedQuickWorkDraft = null;
  return draft;
}
