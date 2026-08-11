import { createFileRoute } from "@tanstack/react-router";

import {
  AIChatDemo,
  FeatureArchitecture,
  MultiFormatInput,
  SourceBackedDemo,
  WorkspaceSection,
} from "@/components/landing-visuals";
import { PublicFooter, PublicNav } from "@/components/public-layout";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Product — Karya AI" },
      {
        name: "description",
        content:
          "Karya AI's complete capability set — understand, prepare, plan, verify, and hand off any piece of work.",
      },
    ],
  }),
  component: ProductPage,
});

function SH({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="label-caps mb-3">{eyebrow}</p>
      <h2 className="text-2xl tracking-tight sm:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  );
}

function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Header */}
      <div className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <Reveal>
            <p className="label-caps mb-3">Product</p>
            <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              AI that follows the work
              <br />
              <span className="text-muted-foreground">from start to finish.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Six capabilities built around the lifecycle of real work — not a collection of
              disconnected AI features.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Accepts any format */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SH
              eyebrow="Input"
              title="Works with any format you already use."
              text="Paste a brief, drag in PDFs, forward an email, drop a folder. Karya AI processes whatever you have."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <MultiFormatInput />
          </Reveal>
        </div>
      </section>

      {/* AI Work Chat */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SH
              eyebrow="AI Work Chat"
              title="Ask about the work. Get grounded answers."
              text="Karya AI's chat understands current work, files, requirements, decisions, and history — and shows exactly where each answer comes from."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <AIChatDemo />
          </Reveal>
        </div>
      </section>

      {/* Source-backed */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SH
              eyebrow="Source-backed AI"
              title="Every finding traces back to something real."
              text="Karya AI links each requirement, gap, and finding to the source document, page, or message that produced it. No black box."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <SourceBackedDemo />
          </Reveal>
        </div>
      </section>

      {/* Feature architecture */}
      <section className="border-b border-hairline">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SH
              eyebrow="Capabilities"
              title="Six stages. One connected system."
              text="Every capability maps to a stage of the work lifecycle. Nothing is disconnected."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <FeatureArchitecture />
          </Reveal>
        </div>
      </section>

      {/* Workspace */}
      <section className="border-b border-hairline bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <Reveal>
            <SH
              eyebrow="Workspace"
              title="Organized around readiness, not checkboxes."
              text="My Work shows what needs attention. Templates encode reusable structures. Work History preserves every decision and requirement change."
            />
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <WorkspaceSection />
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
