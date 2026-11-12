import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/views/landing";

export const Route = createFileRoute("/")({
  component: Landing,
});
