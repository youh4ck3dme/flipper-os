import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel } from "@/components/ui";
import { eur } from "@/lib/model";
import { useOs } from "@/lib/store";

const MONTHS = ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug"];

export function Dashboard() {
  const name = useOs((s) => s.name);
  const assets = useOs((s) => s.assets);
  const leads = useOs((s) => s.leads);
  const activity = useOs((s) => s.activity);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const live = assets.filter((a) => a.status !== "Predané");
  const sold = assets.filter((a) => a.status === "Predané");
  const value = live.reduce((sum, a) => sum + a.asking, 0);
  const mrr = live.reduce((sum, a) => sum + a.mrr, 0);
  const exits = sold.reduce((sum, a) => sum + a.asking, 0);
  const openLeads = leads.filter((l) => l.stage !== "Prehra" && l.stage !== "Výhra").length;
  const series = MONTHS.map((month, index) => ({
    month,
    mrr: Math.round(mrr * (1 + index * 0.06)),
  }));

  const cards = [
    ["Portfólio", eur(value)],
    ["MRR", eur(mrr)],
    ["Aktívne", String(live.length)],
    ["Exity", eur(exits)],
  ];

  return (
    <>
      <PageHeader eyebrow="Prehľad" title={`Dobrý deň, ${name}`} />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, amount]) => (
          <Panel key={label} className="p-4">
            <p className="text-xs tracking-widest text-muted uppercase">{label}</p>
            <p className="mt-2 font-mono text-2xl font-medium">{amount}</p>
          </Panel>
        ))}
      </section>
      <section className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <Panel>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-medium">Projekcia MRR</h2>
            <p className="text-xs text-muted">+6 % mesačne · {openLeads} otvorených leadov</p>
          </div>
          <div className="h-56">
            {ready ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <XAxis dataKey="month" stroke="#9b96ad" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => eur(Number(value))}
                    contentStyle={{ background: "#12111a", border: "1px solid #2a2738", borderRadius: 12 }}
                    labelStyle={{ color: "#f4f1fb" }}
                  />
                  <Area type="monotone" dataKey="mrr" stroke="#c084fc" fill="#c084fc" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-xl bg-surface-2" />
            )}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-medium">Aktivita</h2>
          <ul className="space-y-3">
            {activity.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <span>{item.text}</span>
                <span className="shrink-0 text-xs text-muted">{item.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </>
  );
}
