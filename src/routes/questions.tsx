import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clipboard, MessageSquare, Send } from "lucide-react";

import { EmptyState, PageHeader, StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { questions, type Question, type QuestionPriority } from "@/lib/work";
import { cn } from "@/lib/utils";

const title = "Questions — Karya AI";
const description = "Questions that need answers before work can safely proceed.";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: QuestionsPage,
});

function QuestionsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [selectedTone, setSelectedMessageTone] = useState("Professional");

  const activeQuestions = questions.filter((q) => q.state !== "resolved");
  const resolvedQuestions = questions.filter((q) => q.state === "resolved");

  const priorities: QuestionPriority[] = [
    "MUST ANSWER BEFORE STARTING",
    "CAN ANSWER LATER",
    "OPTIONAL",
  ];

  const generateAskMessage = (qs: Question[]) => {
    setIsGenerating(true);
    setTimeout(() => {
      const qList = qs
        .map((q, i) => `${i + 1}. ${q.question} (Project: ${q.workTitle})`)
        .join("\n");
      const msg = `Hi, I'm currently working on several projects and need clarification on a few items:\n\n${qList}\n\nCould you please provide your input when you have a moment? Thank you!`;
      setGeneratedMessage(msg);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8 md:py-14">
      <div className="flex items-center justify-between">
        <PageHeader title="Questions" subtitle="Clarifications needed across all your work." />
        {activeQuestions.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => generateAskMessage(activeQuestions)}>
            <Send className="mr-2 h-3.5 w-3.5" />
            Ask Boss/Client
          </Button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No unanswered questions."
            description="Questions appear when Karya AI finds something that must be clarified on your work."
          />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {priorities.map((priority) => {
            const items = activeQuestions.filter((q) => q.priority === priority);
            if (items.length === 0) return null;

            return (
              <section key={priority} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3
                    className={cn(
                      "text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded",
                      priority === "MUST ANSWER BEFORE STARTING"
                        ? "bg-blocked-soft text-blocked"
                        : priority === "CAN ANSWER LATER"
                          ? "bg-warn-soft text-warn"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {priority}
                  </h3>
                  <div className="h-px flex-1 bg-hairline" />
                </div>

                <div className="divide-y divide-hairline border-y border-hairline">
                  {items.map((q) => (
                    <div key={q.id} className="py-6">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{q.why}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <Link
                              to="/work/$workId"
                              params={{ workId: q.workId }}
                              className="text-[10px] text-muted-foreground uppercase font-medium hover:text-foreground underline underline-offset-4"
                            >
                              Project: {q.workTitle}
                            </Link>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">
                              Impact: {q.impact}
                            </span>
                          </div>
                        </div>
                        <StatusPill
                          tone={priority === "MUST ANSWER BEFORE STARTING" ? "blocked" : "warn"}
                        >
                          {q.status}
                        </StatusPill>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {resolvedQuestions.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-ready-soft text-ready">
                  Resolved
                </h3>
                <div className="h-px flex-1 bg-hairline" />
              </div>
              <div className="divide-y divide-hairline border-y border-hairline opacity-70">
                {resolvedQuestions.map((q) => (
                  <div key={q.id} className="py-6">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium leading-relaxed line-through">
                          {q.question}
                        </p>
                        <p className="text-xs text-muted-foreground">Answered: {q.answer}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <Link
                            to="/work/$workId"
                            params={{ workId: q.workId }}
                            className="text-[10px] text-muted-foreground uppercase font-medium hover:text-foreground"
                          >
                            Project: {q.workTitle}
                          </Link>
                        </div>
                      </div>
                      <StatusPill tone="ready">Resolved</StatusPill>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <Dialog open={!!generatedMessage} onOpenChange={(open) => !open && setGeneratedMessage("")}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ask Boss / Client</DialogTitle>
            <DialogDescription>Drafted message for all active clarifications.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground">Tone:</span>
              {["Professional", "Direct", "Friendly", "Urgent", "Formal"].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedMessageTone(tone)}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border transition-colors",
                    selectedTone === tone
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-hairline hover:border-muted-foreground",
                  )}
                >
                  {tone}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                className="w-full min-h-[250px] p-4 rounded-lg border border-hairline bg-muted/20 text-sm leading-relaxed font-sans outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                variant="ghost"
                size="icon-xs"
                className="absolute top-2 right-2"
                onClick={() => navigator.clipboard.writeText(generatedMessage)}
              >
                <Clipboard className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneratedMessage("")}>
              Close
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedMessage);
                setGeneratedMessage("");
              }}
            >
              <Check className="mr-2 h-3.5 w-3.5" />
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
