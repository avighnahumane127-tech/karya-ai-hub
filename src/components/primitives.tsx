import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Tone = "ready" | "warn" | "blocked" | "info" | "neutral";

const toneClasses: Record<Tone, string> = {
  ready: "bg-ready-soft text-ready",
  warn: "bg-warn-soft text-warn",
  blocked: "bg-blocked-soft text-blocked",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-muted-foreground",
};

export function StatusPill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}

export function SourceTag({
  kind,
  label,
  onClick,
}: {
  kind: "confirmed" | "inferred" | "assumption" | "conflict" | "unknown";
  label?: string;
  onClick?: () => void;
}) {
  const map: Record<"confirmed" | "inferred" | "assumption" | "conflict" | "unknown", Tone> = {
    confirmed: "neutral",
    inferred: "info",
    assumption: "warn",
    conflict: "blocked",
    unknown: "neutral",
  };
  const words: Record<"confirmed" | "inferred" | "assumption" | "conflict" | "unknown", string> = {
    confirmed: "Confirmed",
    inferred: "Inferred",
    assumption: "Assumption",
    conflict: "Conflict",
    unknown: "Unknown",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex max-w-full items-center gap-2 text-left text-xs text-muted-foreground"
    >
      <span className={cn("rounded px-1.5 py-0.5 text-[11px] font-medium", toneClasses[map[kind]])}>
        {words[kind]}
      </span>
      {label ? (
        <span className="truncate underline-offset-4 group-hover:underline">{label}</span>
      ) : null}
    </button>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-medium tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="label-caps">{children}</h2>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-hairline px-6 py-14 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Rows({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-hairline border-y border-hairline">{children}</div>;
}
