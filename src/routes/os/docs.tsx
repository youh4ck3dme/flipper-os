import { createFileRoute } from "@tanstack/react-router";
import { Docs } from "@/views/docs";

export const Route = createFileRoute("/os/docs")({
  component: Docs,
});
