import { useState } from "react";
import { inputClass, PageHeader, Panel } from "@/components/ui";
import { eur, listings } from "@/lib/model";
import { useOs } from "@/lib/store";

const CATS = ["Všetko", "SaaS", "PWA", "Nástroj", "Obsah"];

export function Market() {
  const query = useOs((s) => s.query);
  const setQuery = useOs((s) => s.setQuery);
  const addAsset = useOs((s) => s.addAsset);
  const assets = useOs((s) => s.assets);
  const [cat, setCat] = useState("Všetko");
  const needle = query.trim().toLowerCase();
  const rows = listings.filter((item) => {
    const okCat = cat === "Všetko" || item.category === cat;
    const okName = !needle || item.name.toLowerCase().includes(needle);
    return okCat && okName;
  });

  return (
    <>
      <PageHeader eyebrow="Trh" title="Ponuky na kúpu" />
      <input className={inputClass} value={query} placeholder="Hľadať listing" onChange={(e) => setQuery(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {CATS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCat(item)}
            className={
              item === cat
                ? "h-10 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg"
                : "glass h-10 rounded-full px-4 text-sm text-muted"
            }
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((item) => {
          const owned = assets.some((asset) => asset.name === item.name);
          const multiple = item.mrr ? Math.round((item.price / item.mrr) * 10) / 10 : 0;
          return (
            <Panel key={item.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-xs text-muted">
                    {item.category} · {item.stack}
                  </p>
                </div>
                <p className="font-mono text-sm">{multiple}×</p>
              </div>
              <p className="font-mono text-2xl">{eur(item.price)}</p>
              <p className="text-sm text-muted">{eur(item.mrr)} MRR</p>
              <button
                type="button"
                disabled={owned}
                className="glass mt-auto h-11 rounded-xl text-sm font-medium disabled:opacity-50"
                onClick={() =>
                  addAsset({
                    name: item.name,
                    mrr: item.mrr,
                    expenses: Math.round(item.mrr * 0.12),
                    asking: item.price,
                    status: "Sledujem",
                    stack: item.stack,
                    health: 75,
                  })
                }
              >
                {owned ? "Už v portfóliu" : "Pridať do portfólia"}
              </button>
            </Panel>
          );
        })}
      </div>
      {rows.length === 0 ? <p className="text-sm text-muted">Nič nesedí filtru.</p> : null}
    </>
  );
}
