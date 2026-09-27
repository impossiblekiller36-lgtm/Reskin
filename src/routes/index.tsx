import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/app/workspace";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Workspace />;
}
