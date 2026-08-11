import { ArrowRight, Check, AlertTriangle, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Static product demonstrations. These are illustrations of the product, not user data. */

export function DemoTag() {
  return (
    <span className="label-caps absolute right-3 top-3 rounded bg-muted px-1.5 py-0.5">
      Product example
    </span>
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

const findings = [
  { icon: AlertTriangle, tone: "text-warn", text: "Missing source document" },
  { icon: AlertTriangle, tone: "text-blocked", text: "Conflicting deadline" },
  { icon: AlertTriangle, tone: "text-warn", text: "Approval criteria unspecified" },
];

const nextSteps = [
  "Confirm evaluation criteria",
  "Review source files",
  "Compare requirements",
];

export function ReadinessPreview() {
  return (
    <Panel className="p-6">
      <DemoTag />
      <p className="label-caps">Work readiness</p>
      <p className="mt-3 text-lg">Needs clarification</p>

      <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
        {findings.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-sm">
            <f.icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", f.tone)} strokeWidth={1.8} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="label-caps">Next steps</p>
        <ol className="mt-3 space-y-2 text-sm">
          {nextSteps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}

export function EvidenceChain({
  requirement,
  evidence,
  status,
}: {
  requirement: string;
  evidence: string[];
  status: "Complete" | "Missing";
}) {
  return (
    <Panel>
      <p className="label-caps">Requirement</p>
      <p className="mt-2 text-sm font-medium">{requirement}</p>

      <div className="my-4 h-6 w-px bg-hairline" />

      <p className="label-caps">Evidence</p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {evidence.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>

      <div className="my-4 h-6 w-px bg-hairline" />

      <p className="label-caps">Status</p>
      <p
        className={cn(
          "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          status === "Complete" ? "bg-ready-soft text-ready" : "bg-blocked-soft text-blocked",
        )}
      >
        {status === "Complete" ? (
          <Check className="h-3 w-3" strokeWidth={2.2} />
        ) : (
          <X className="h-3 w-3" strokeWidth={2.2} />
        )}
        {status}
      </p>
    </Panel>
  );
}

export function FlowStep({ label, last }: { label: string; last?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="whitespace-nowrap rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm">
        {label}
      </span>
      {last ? null : (
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
      )}
    </div>
  );
}