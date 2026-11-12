import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Calculator,
  Kanban,
  LayoutDashboard,
  Radar,
  Settings,
  Users,
} from "lucide-react";
import { Mark } from "@/components/mark";
import { cn } from "@/lib/cn";
import { useOs } from "@/lib/store";

const NAV = [
  { to: "/os", label: "Prehľad", icon: LayoutDashboard, exact: true },
  { to: "/os/portfolio", label: "Portfólio", icon: Kanban, exact: false },
  { to: "/os/valuation", label: "Audit", icon: Calculator, exact: false },
  { to: "/os/market", label: "Trh", icon: Radar, exact: false },
  { to: "/os/crm", label: "CRM", icon: Users, exact: false },
  { to: "/os/docs", label: "Docs", icon: BookOpen, exact: false },
  { to: "/os/settings", label: "Nastavenia", icon: Settings, exact: false },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const name = useOs((s) => s.name);
  const notice = useOs((s) => s.notice);
  const clearNotice = useOs((s) => s.clearNotice);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="glass-strong hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col">
        <Link to="/" className="flex items-center gap-3 px-4 py-5">
          <Mark />
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Flipper OS</span>
            <span className="block text-xs text-muted">Command center</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted",
                  active && "glass font-medium text-fg",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-4 py-4 text-xs text-muted">Workspace · {name}</p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="glass-strong sticky top-0 z-20 flex h-14 items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <Mark className="size-8 rounded-lg" />
            <span className="text-sm font-semibold">Flipper OS</span>
          </Link>
          <p className="hidden text-sm text-muted md:block">Digitálne aktíva · živé demo</p>
          <p className="text-sm font-medium">{name}</p>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 pb-28 md:pb-8">{children}</main>
      </div>

      <nav className="glass-strong fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl md:hidden">
        {NAV.slice(0, 5).map((item) => {
          const active = item.exact ? path === item.to : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-16 flex-col items-center justify-center gap-1 text-xs text-muted",
                active && "text-primary",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {notice ? (
        <button
          type="button"
          onClick={clearNotice}
          className="glass fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 text-sm md:bottom-6"
        >
          {notice}
        </button>
      ) : null}
    </div>
  );
}
