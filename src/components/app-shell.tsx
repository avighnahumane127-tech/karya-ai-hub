import { Link, useRouterState } from "@tanstack/react-router";
import {
  CircleHelp,
  Bell,
  Home,
  LayoutList,
  Plus,
  HelpCircle,
  ArrowLeftRight,
  LayoutTemplate,
  BarChart3,
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
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { notifications } from "@/lib/work";
import { cn } from "@/lib/utils";

const navGroups: { label: string; items: { label: string; to: string; icon: typeof Home }[] }[] = [
  {
    label: "Main",
    items: [
      { label: "Home", to: "/home", icon: Home },
      { label: "My Work", to: "/work", icon: LayoutList },
      { label: "Add Work", to: "/add", icon: Plus },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { label: "Questions", to: "/questions", icon: HelpCircle },
      { label: "Handoffs", to: "/handoffs", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Templates", to: "/templates", icon: LayoutTemplate },
      { label: "Insights", to: "/insights", icon: BarChart3 },
    ],
  },
];

/** Routes rendered outside the app chrome. */
const publicRoutes = ["/", "/login", "/privacy-policy", "/terms-of-use"];

function usePathname() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(to + "/");
}

const itemClass = (active: boolean) =>
  cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
    active
      ? "bg-accent font-medium text-foreground"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-6">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-0.5">
          <p className="label-caps px-2.5 pb-1.5">{group.label}</p>
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={itemClass(isActive(pathname, item.to))}
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
    <Link to="/home" className="flex items-center gap-2">
      <img src={mark} alt="" width={20} height={20} className="h-5 w-5" />
      <span className="text-sm font-medium tracking-tight">Karya AI</span>
    </Link>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search work, requirements, files..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}

const mobileNav = [
  { label: "Home", to: "/home", icon: Home },
  { label: "My Work", to: "/work", icon: LayoutList },
  { label: "Add", to: "/add", icon: Plus },
  { label: "Questions", to: "/questions", icon: HelpCircle },
  { label: "Handoffs", to: "/handoffs", icon: ArrowLeftRight },
];

const contextLabels: [string, string][] = [
  ["/home", "Home"],
  ["/work", "My Work"],
  ["/add", "Add Work"],
  ["/questions", "Questions"],
  ["/handoffs", "Handoffs"],
  ["/templates", "Templates"],
  ["/insights", "Insights"],
  ["/search", "Global Search"],
  ["/settings", "Settings"],
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

  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  const contextLabel =
    contextLabels.find(([to]) => isActive(pathname, to))?.[1] ?? "Karya AI";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] flex-col border-r border-hairline px-3 py-5 lg:flex">
        <div className="px-2.5 pb-7">
          <Wordmark />
        </div>
        <NavList />
        <div className="mt-6 space-y-0.5 border-t border-hairline pt-4">
          <Link to="/settings" className={itemClass(isActive(pathname, "/settings"))}>
            <Settings className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            Settings
          </Link>
          <button type="button" onClick={() => setSearchOpen(true)} className={itemClass(false)}>
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.6} />
            Search
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[240px]">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline bg-background/85 px-4 py-2.5 backdrop-blur md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)_auto] md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[268px] overflow-y-auto px-3 py-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="px-2.5 pb-7">
                  <Wordmark />
                </div>
                <NavList onNavigate={() => setMenuOpen(false)} />
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="mt-6 flex items-center gap-2.5 border-t border-hairline px-2.5 pt-4 text-sm text-muted-foreground"
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                  <Bell className="h-4 w-4" strokeWidth={1.6} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-4">
                <p className="label-caps">Notifications</p>
                {notifications.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Nothing new.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {notifications.map((n) => (
                      <li key={n.id} className="text-sm">
                        {n.text}
                        <span className="block text-xs text-muted-foreground">{n.when}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="ml-1.5 shrink-0" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>
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
            <item.icon className="h-4 w-4" strokeWidth={1.6} />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}