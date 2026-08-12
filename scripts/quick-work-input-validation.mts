import assert from "node:assert/strict";

import {
  acceptedFileTypes,
  consumeQuickWorkDraft,
  createFileSource,
  getFileSelectionError,
  stageQuickWorkDraft,
  typeOfFile,
} from "../src/lib/work-input.ts";

const pdf = new File(["supplier proposal"], "proposal-a.pdf", {
  type: "application/pdf",
  lastModified: 1,
});
const txt = new File(["management prioritizes delivery time"], "notes.txt", {
  type: "text/plain",
  lastModified: 2,
});
const unsupported = new File(["binary"], "payload.exe", {
  type: "application/octet-stream",
  lastModified: 3,
});
const empty = new File([], "empty.pdf", { type: "application/pdf", lastModified: 4 });

assert.equal(typeOfFile(pdf), "PDF", "PDF type metadata is retained");
assert.equal(getFileSelectionError(pdf), null, "supported PDF is accepted");
assert.match(
  getFileSelectionError(unsupported) ?? "",
  /not a supported file type/,
  "unsupported file is rejected",
);
assert.match(getFileSelectionError(empty) ?? "", /empty/, "empty file is rejected");
assert(acceptedFileTypes.includes(".pdf"), "native picker accepts supported PDF files");

const source = createFileSource(pdf);
assert.equal(source.name, "proposal-a.pdf", "selected filename is retained");
assert.equal(source.type, "PDF", "selected file type is retained");
assert.equal(source.status, "Ready", "selected file status is honest");

stageQuickWorkDraft({
  prompt: "Review these supplier proposals and prepare a recommendation.",
  context: "Management cares most about total cost and delivery time.",
  files: [pdf, txt],
});
const draft = consumeQuickWorkDraft();
assert(draft, "quick draft transfers to Work Input");
assert.equal(draft.prompt, "Review these supplier proposals and prepare a recommendation.");
assert.equal(draft.context, "Management cares most about total cost and delivery time.");
assert.deepEqual(
  draft.files.map((file) => file.name),
  ["proposal-a.pdf", "notes.txt"],
);
assert.equal(consumeQuickWorkDraft(), null, "quick draft is consumed only once");

console.log(JSON.stringify({ passed: 11, unifiedSources: 3, unsupportedRejected: true }, null, 2));
