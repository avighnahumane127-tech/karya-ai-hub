import { Paperclip, Plus, ArrowUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Composer for giving Karya AI work. Layout is a plain flex/grid stack so the
 * Attach file / Add context controls and the Send button never overlap.
 */
export function WorkComposer({
  placeholder = "Paste an assignment, brief, email, or instructions...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "rounded-xl border border-hairline bg-surface p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus-within:border-input",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
        <div className="flex shrink-0 items-center gap-2 sm:order-1 sm:self-end">
          <Button type="button" size="sm" variant="outline" className="shrink-0 gap-1.5">
            <Paperclip className="h-3.5 w-3.5" strokeWidth={1.8} />
            Attach file
          </Button>
          <Button type="button" size="sm" variant="outline" className="shrink-0 gap-1.5">
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            Add context
          </Button>
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={placeholder}
          rows={3}
          className="min-w-0 flex-1 resize-none bg-transparent px-1.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground sm:order-2"
        />

        <Button
          type="submit"
          size="icon-sm"
          aria-label="Send"
          disabled={!value.trim()}
          className="shrink-0 self-end sm:order-3"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}