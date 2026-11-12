import { createFileRoute } from "@tanstack/react-router";
import { Valuation } from "@/views/valuation";

export const Route = createFileRoute("/os/valuation")({
  component: Valuation,
});
