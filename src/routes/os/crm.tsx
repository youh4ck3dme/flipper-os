import { createFileRoute } from "@tanstack/react-router";
import { Crm } from "@/views/crm";

export const Route = createFileRoute("/os/crm")({
  component: Crm,
});
