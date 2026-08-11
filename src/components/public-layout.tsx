import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/karya-logo-processed.png";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Product", to: "/product" },
  { label: "How it works", to: "/how-it-works" },
  { label: "Use cases", to: "/use-cases" },
  { label: "Verification", to: "/verification" },
];

export function KaryaWordmark({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Karya AI"
      className={className ?? "h-9 w-auto"}
      style={{ filter: "brightness(0)" }}
    />
  );
}

export function PublicNav({ backTo }: { backTo?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <KaryaWordmark />
        </Link>

        {/* Nav links — only on non-legal pages */}
        {!backTo && (
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  pathname === link.to
                    ? "font-medium text-foreground"
                    : "transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          {backTo ? (
            <Link
              to={backTo as "/"}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back
            </Link>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/home">
                  Try Karya AI
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {open && !backTo && (
        <div className="border-t border-hairline px-5 py-3 text-sm md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-1.5 text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block py-1.5 text-muted-foreground"
          >
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">© 2026 AUSPPA</p>
          <p className="text-xs text-muted-foreground/60">Built for learners, by learners</p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <Link to="/terms-of-use" className="transition-colors hover:text-foreground">
            Terms of Use
          </Link>
          <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <a href="mailto:hello@karya.ai" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
