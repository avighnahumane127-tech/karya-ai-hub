import { Link, useRouterState } from "@tanstack/react-router";
import {
  CircleHelp,
  Bell,
  MessageSquareText,
  LayoutList,
  Plus,
  HelpCircle,
  ArrowLeftRight,
  LayoutTemplate,
  Settings,
  Search,
  Menu,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import mark from "@/assets/karya-mark.png";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { searchResults } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navGroups = [
  [
    { label: "AI Work Chat", to: "/", icon: MessageSquareText },
    { label: "My Work", to: "/work", icon: LayoutList },
    { label: "Add Work", to: "/add", icon: Plus },
  ],
  [
    { label: "Questions", to: "/questions", icon: HelpCircle },
    { label: "Handoffs", to: "/handoffs", icon: ArrowLeftRight },
  ],
  [{ label: "Templates", to: "/templates", icon: LayoutTemplate }],
];

function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-5">
      {navGroups.map((group, i) => (
        <div key={i} className="space-y-0.5">
          {i > 0 ? <div className="mb-5 h-px bg-hairline" /> : null}
          {group.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive(pathname, item.to)
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={mark} alt="" width={20} height={20} className="h-5 w-5" />
      <span className="text-sm font-medium tracking-tight">Karya AI</span>
    </Link>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search your work..." />
      <CommandList>
        <CommandEmpty>Nothing matched that.</CommandEmpty>
        <CommandGroup heading="Results">
          {searchResults.map((r) => (
            <CommandItem key={r.id} value={`${r.title} ${r.context}`} asChild>
              <Link to={r.to} onClick={() => setOpen(false)} className="flex flex-col items-start gap-0.5">
                <span className="text-sm">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.context}</span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

const mobileNav = [
  { label: "Chat", to: "/", icon: MessageSquareText },
  { label: "My Work", to: "/work", icon: LayoutList },
  { label: "Add", to: "/add", icon: Plus },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const contextLabel =
    pathname === "/"
      ? "AI Work Chat"
      : pathname.startsWith("/work/")
        ? "My Work"
        : pathname.startsWith("/work")
          ? "My Work"
          : pathname.startsWith("/add")
            ? "Add Work"
            : pathname.startsWith("/questions")
              ? "Questions"
              : pathname.startsWith("/handoffs")
                ? "Handoffs"
                : pathname.startsWith("/templates")
                  ? "Templates"
                  : pathname.startsWith("/settings")
                    ? "Settings"
                    : "Karya AI";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-[232px] flex-col border-r border-hairline px-3 py-5 lg:flex">
        <div className="px-2.5 pb-6">
          <Wordmark />
        </div>
        <NavList />
        <div className="mt-4 border-t border-hairline pt-4">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              isActive(pathname, "/settings")
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
          >
            <Settings className="h-4 w-4" strokeWidth={1.6} />
            Settings
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[232px]">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline bg-background/85 px-4 py-2.5 backdrop-blur md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)_auto] md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] px-3 py-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="px-2.5 pb-6">
                  <Wordmark />
                </div>
                <NavList onNavigate={() => setMenuOpen(false)} />
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 flex items-center gap-2.5 border-t border-hairline px-2.5 pt-4 text-sm text-muted-foreground"
                >
                  <Settings className="h-4 w-4" strokeWidth={1.6} />
                  Settings
                </Link>
              </SheetContent>
            </Sheet>
            <span className="truncate text-sm text-muted-foreground">{contextLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-md border border-hairline bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-input md:flex"
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span className="truncate">Search work, requirements, files...</span>
          </button>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Help">
              <CircleHelp className="h-4 w-4" strokeWidth={1.6} />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
              <Bell className="h-4 w-4" strokeWidth={1.6} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-warn" />
            </Button>
            <span className="ml-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-medium">
              RS
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-hairline bg-background/95 backdrop-blur lg:hidden">
        {mobileNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]",
              isActive(pathname, item.to) ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5" strokeWidth={1.6} />
            {item.label}
          </Link>
        ))}
      </nav>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}