import { createFileRoute } from "@tanstack/react-router";

import { WorkChat } from "@/components/work-chat";

const title = "AI Work Chat — Karya AI";
const description =
  "Give Karya AI a messy assignment, brief or document and find out what is missing, what is blocked and what to do first.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return <WorkChat />;
}
