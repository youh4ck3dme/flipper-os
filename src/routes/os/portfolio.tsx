import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/views/portfolio";

export const Route = createFileRoute("/os/portfolio")({
  component: Portfolio,
});
