import { createFileRoute } from "@tanstack/react-router";
import { Market } from "@/views/market";

export const Route = createFileRoute("/os/market")({
  component: Market,
});
