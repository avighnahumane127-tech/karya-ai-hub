import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronLeft, MessageSquareText, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";

import { StatusPill } from "@/components/primitives";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Files,
  Handoff,
  Overview,
  Plan,
  Requirements,
  Verify,
  WorkQuestions,
} from "@/components/work-tabs";
import { WorkChat } from "@/components/work-chat";
import { getWork, type WorkItem } from "@/lib/mock-data";
import { stateTone } from "@/routes/work.index";
import { cn } from "@/lib/utils";

const tabs = [
  "overview",
  "requirements",
  "plan",
  "questions",
  "files",
  "verify",
  "handoff",
] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/work/$workId")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const tab = search['tab'];
    return typeof tab === "string" && (tabs as readonly string[]).includes(tab)
      ? { tab: tab as Tab }
      : {};
  },
  loader: ({ params }) => {
    const work = getWork(params.workId);
    if (!work) throw notFound();
    return { work };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — Karya AI" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.work.title} — Karya AI`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.work.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.work.description },
      ],
    };
  },
  component: WorkDetail,
});

function WorkDetail() {
  const { work } = Route.useLoaderData() as { work: WorkItem };
  const search = Route.useSearch();
  const [tab, setTab] = useState<Tab>(search.tab ?? "overview");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-8 md:py-12">
      <Link
        to="/work"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        My Work
      </Link>

      <header className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-medium tracking-tight">{work.title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{work.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill tone={stateTone[work.state]}>{work.stateLabel}</StatusPill>
            <span className="text-xs text-muted-foreground">{work.metaLine}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button size="sm" variant="outline" onClick={() => setChatOpen(true)}>
            <MessageSquareText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask Karya</span>
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Share">
            <Share2 className="h-4 w-4" strokeWidth={1.6} />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="More">
            <MoreHorizontal className="h-4 w-4" strokeWidth={1.6} />
          </Button>
        </div>
      </header>

      <p className="mt-6 border-l-2 border-hairline pl-3 text-sm text-muted-foreground">
        {work.readinessNote}
      </p>

      <nav className="mt-8 flex gap-x-4 gap-y-2 overflow-x-auto border-b border-hairline pb-2.5 text-sm">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 capitalize transition-colors",
              tab === t
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "overview" ? <Overview work={work} onTab={(t) => setTab(t as Tab)} /> : null}
        {tab === "requirements" ? <Requirements work={work} /> : null}
        {tab === "plan" ? <Plan work={work} /> : null}
        {tab === "questions" ? <WorkQuestions work={work} /> : null}
        {tab === "files" ? <Files work={work} /> : null}
        {tab === "verify" ? <Verify work={work} /> : null}
        {tab === "handoff" ? <Handoff work={work} /> : null}
      </div>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
          <SheetTitle className="border-b border-hairline px-5 py-3 text-sm font-medium">
            Ask Karya AI
          </SheetTitle>
          <WorkChat />
        </SheetContent>
      </Sheet>
    </div>
  );
}