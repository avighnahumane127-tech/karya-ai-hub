import { createFileRoute } from "@tanstack/react-router";

import { ComparisonSection, UseCaseSwitcher } from "@/components/landing-visuals";
import { PublicFooter, PublicNav } from "@/components/public-layout";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/use-cases")({
  head: () => ({
    meta: [
      { title: "Use cases — Karya AI" },
      {
        name: "description",
        content:
          "Karya AI works wherever assignments arrive unclear — office work, client projects, research, reports, websites, and handoffs.",
      },
    ],
  }),
  component: UseCasesPage,
});

function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Header */}
      <div className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Use cases</p>
            <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Any work that arrives unclear.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Karya AI adapts to the type of work — but the core process is always the same:
              understand the request, identify what's missing, plan the path, verify the result.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Switcher */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Work types</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              See how Karya AI adapts to different contexts.
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <UseCaseSwitcher />
          </Reveal>
        </div>
      </section>

      {/* Context cards */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Where it fits</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">Works wherever assignments arrive.</h2>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Office work",
                  examples: ["Reports", "Presentations", "Briefings", "Internal analysis"],
                  desc: "Assignments arrive via email, chat, or verbal instruction — often incomplete. Karya AI extracts the actual requirements and flags what's missing.",
                },
                {
                  title: "Client work",
                  examples: ["Proposals", "Deliverables", "Scoped projects", "Reviews"],
                  desc: "Client briefs are often vague or change during the project. Karya AI tracks requirement changes and verifies the final result against the original brief.",
                },
                {
                  title: "Research",
                  examples: ["Literature reviews", "Competitive analysis", "Market research"],
                  desc: "Research assignments arrive with unclear scope. Karya AI extracts what must be covered and what evidence is required.",
                },
                {
                  title: "Reports",
                  examples: ["Financial reports", "Status updates", "Technical summaries"],
                  desc: "Reports have implicit requirements — accuracy, completeness, audience alignment. Karya AI verifies each one explicitly.",
                },
                {
                  title: "Websites",
                  examples: ["New builds", "Redesigns", "Content updates"],
                  desc: "Web briefs contain ambiguous requirements. Karya AI clarifies scope, content requirements, and completion criteria before a single line is written.",
                },
                {
                  title: "Handoffs",
                  examples: ["Project transitions", "Staff changes", "Client handovers"],
                  desc: "Handoffs fail when the state of work is unclear. Karya AI produces a structured packet showing what was done, what's open, and what happens next.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-hairline bg-surface p-5 space-y-3">
                  <p className="text-sm font-medium">{card.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.examples.map((ex) => (
                      <span
                        key={ex}
                        className="rounded-full border border-hairline bg-muted/30 px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">A different category</p>
            <h2 className="text-2xl tracking-tight sm:text-3xl">
              Not a task manager. Not a document analyzer. Not a chatbot.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Karya AI is an AI system for understanding, preparing, planning, verifying, and
              handing off real work.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ComparisonSection />
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
