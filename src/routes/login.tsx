import { Link, createFileRoute } from "@tanstack/react-router";

import logo from "@/assets/karya-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const title = "Log in — Karya AI";
const description = "Log in to Karya AI to see what your work requires before you start.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-14">
      <div className="w-full max-w-sm">
        <Link to="/">
          <img src={logo} alt="Karya AI" className="h-8 w-auto" style={{ filter: "invert(1)" }} />
        </Link>

        <h1 className="mt-8 text-2xl tracking-tight">Log in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accounts aren't connected yet. You can still explore the interface.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-7 space-y-3">
          <Input type="email" placeholder="Email address" className="bg-surface" />
          <Input type="password" placeholder="Password" className="bg-surface" />
          <Button type="submit" className="w-full" disabled>
            Log in
          </Button>
        </form>

        <div className="mt-6 border-t border-hairline pt-5">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/home">Continue to the app</Link>
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="underline underline-offset-4">
              Back to the homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}