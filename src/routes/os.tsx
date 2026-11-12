import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/os")({
  component: OsLayout,
});

function OsLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
