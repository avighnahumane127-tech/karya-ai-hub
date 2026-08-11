import { Link } from "@tanstack/react-router";
import { FileText, FileType, Image as ImageIcon, Archive, Paperclip } from "lucide-react";
import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { SourceTag, StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { getWork } from "@/lib/mock-data";

const suggestions = [
  "Can I start this?",
  "What's missing?",
  "What should I ask?",
  "What should I do first?",
  "Check this before I submit",
  "Prepare a handoff",
];

const fileKinds = [
  { label: "PDF", icon: FileText },
  { label: "DOCX", icon: FileType },
  { label: "Image", icon: ImageIcon },
  { label: "ZIP", icon: Archive },
];

type Turn = { role: "user" | "assistant"; text?: string };

const work = getWork("supplier-recommendation")!;

function AssistantAnswer() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-base font-medium">This work is blocked</h3>
          <StatusPill tone="blocked">3 issues</StatusPill>
        </div>
        <p className="text-sm text-muted-foreground">
          There are 3 issues that should be resolved before you begin.
        </p>
      </div>

      <ol className="space-y-4">
        {work.issues.map((issue, i) => (
          <li key={issue.id} className="flex gap-3">
            <span className="mt-0.5 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium">{issue.problem}</p>
              <p className="text-sm text-muted-foreground">{issue.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="label-caps">You can still do</p>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {work.canDo.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ready" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-caps">Don't do yet</p>
          <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
            {work.dontDo.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blocked" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-hairline bg-surface px-4 py-3">
        <p className="text-sm">
          Deadline: <span className="font-medium">Friday</span> — the manager email says Thursday.
        </p>
        <SourceTag kind="conflict" label="manager-email.pdf · Page 1" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link to="/work/$workId" params={{ workId: work.id }}>
            Resolve issues
          </Link>
        </Button>
        <Button size="sm" variant="outline">
          Generate questions
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to="/work/$workId" params={{ workId: work.id }} search={{ tab: "requirements" }}>
            View requirements
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ContextPanel() {
  return (
    <aside className="hidden w-[248px] shrink-0 border-l border-hairline px-5 py-6 xl:block">
      <p className="label-caps">Current work</p>
      <Link
        to="/work/$workId"
        params={{ workId: work.id }}
        className="mt-2 block text-sm font-medium underline-offset-4 hover:underline"
      >
        {work.title}
      </Link>
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="label-caps">Status</dt>
          <dd className="mt-1.5">
            <StatusPill tone="blocked">Blocked · 3 issues</StatusPill>
          </dd>
        </div>
        <div>
          <dt className="label-caps">Due</dt>
          <dd className="mt-1.5">Friday</dd>
        </div>
      </dl>
    </aside>
  );
}

export function WorkChat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTurns((t) => [...t, { role: "user", text: trimmed }]);
    setValue("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setTurns((t) => [...t, { role: "assistant" }]);
    }, 900);
  };

  const composer = (
    <PromptInput
      onSubmit={(_message, event) => {
        event.preventDefault();
        send(value);
      }}
      className="border-hairline bg-surface"
    >
      <PromptInputTextarea
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Paste an assignment, brief, email, or instructions..."
        className="min-h-24"
      />
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton>
            <Paperclip className="h-4 w-4" strokeWidth={1.7} />
            Attach file
          </PromptInputButton>
          <PromptInputButton>Add context</PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit status={thinking ? "submitted" : "ready"} disabled={!value.trim()} />
      </PromptInputFooter>
    </PromptInput>
  );

  if (turns.length === 0 && !thinking) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-2xl flex-col justify-center px-5 py-14">
        <h1 className="text-3xl font-medium tracking-tight sm:text-[2.1rem]">
          What are you working on?
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Give Karya AI an assignment, brief, document, or messy set of instructions. We'll figure
          out what needs to happen.
        </p>

        <div className="mt-8">{composer}</div>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
          <span className="text-xs text-muted-foreground">Add files</span>
          {fileKinds.map((f) => (
            <button
              key={f.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-input hover:text-foreground"
            >
              <f.icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 border-t border-hairline pt-5">
          <p className="text-xs text-muted-foreground">What can I ask?</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <div className="flex min-w-0 flex-1 flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="mx-auto w-full max-w-2xl px-5 py-8">
            {turns.map((turn, i) => (
              <Message from={turn.role} key={i} className="mb-8">
                <MessageContent>
                  {turn.role === "user" ? (
                    <p className="whitespace-pre-wrap">{turn.text}</p>
                  ) : (
                    <AssistantAnswer />
                  )}
                </MessageContent>
              </Message>
            ))}
            {thinking ? <Shimmer className="text-sm">Reading your work...</Shimmer> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <div className="sticky bottom-0 border-t border-hairline bg-background/90 px-5 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-2xl">{composer}</div>
        </div>
      </div>
      <ContextPanel />
    </div>
  );
}