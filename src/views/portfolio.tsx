import { useState } from "react";
import { Field, inputClass, Modal, PageHeader } from "@/components/ui";
import { DEAL_STATUSES, eur, type DealStatus } from "@/lib/model";
import { useOs } from "@/lib/store";

export function Portfolio() {
  const assets = useOs((s) => s.assets);
  const query = useOs((s) => s.query);
  const setQuery = useOs((s) => s.setQuery);
  const patchAsset = useOs((s) => s.patchAsset);
  const removeAsset = useOs((s) => s.removeAsset);
  const addAsset = useOs((s) => s.addAsset);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mrr, setMrr] = useState("800");
  const [asking, setAsking] = useState("15000");
  const [stack, setStack] = useState("React");

  const needle = query.trim().toLowerCase();
  const visible = assets.filter((asset) => !needle || asset.name.toLowerCase().includes(needle));

  return (
    <>
      <PageHeader
        eyebrow="Portfólio"
        title="Deal flow"
        action={
          <button
            type="button"
            className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
            onClick={() => setOpen(true)}
          >
            Pridať appku
          </button>
        }
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Hľadať podľa názvu"
        className={inputClass}
      />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {DEAL_STATUSES.map((status) => (
          <section key={status} className="glass w-72 shrink-0 rounded-2xl p-3">
            <header className="mb-3 flex items-center justify-between text-sm">
              <h2 className="font-medium">{status}</h2>
              <span className="text-muted">{visible.filter((a) => a.status === status).length}</span>
            </header>
            <div className="space-y-3">
              {visible
                .filter((asset) => asset.status === status)
                .map((asset) => (
                  <article key={asset.id} className="glass-strong rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium">{asset.name}</h3>
                      <span className="font-mono text-xs text-muted">{asset.health}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{asset.stack}</p>
                    <p className="mt-2 font-mono text-sm">
                      {eur(asset.mrr)} <span className="text-muted">MRR</span>
                    </p>
                    <p className="font-mono text-sm text-muted">{eur(asset.asking)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {DEAL_STATUSES.filter((item) => item !== asset.status).map((next) => (
                        <button
                          key={next}
                          type="button"
                          className="rounded-lg border border-border px-2 py-1 text-xs"
                          onClick={() => patchAsset(asset.id, { status: next })}
                        >
                          {short(next)}
                        </button>
                      ))}
                      <button type="button" className="text-xs text-danger" onClick={() => removeAsset(asset.id)}>
                        Zmazať
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
      <Modal open={open} title="Nová appka" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) return;
            addAsset({
              name: name.trim(),
              mrr: Number(mrr) || 0,
              expenses: 0,
              asking: Number(asking) || 0,
              status: "Sledujem",
              stack: stack.trim() || "n/a",
              health: 70,
            });
            setName("");
            setOpen(false);
          }}
        >
          <Field label="Názov">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="MRR (€)">
            <input className={inputClass} inputMode="numeric" value={mrr} onChange={(e) => setMrr(e.target.value)} />
          </Field>
          <Field label="Cena (€)">
            <input className={inputClass} inputMode="numeric" value={asking} onChange={(e) => setAsking(e.target.value)} />
          </Field>
          <Field label="Stack">
            <input className={inputClass} value={stack} onChange={(e) => setStack(e.target.value)} />
          </Field>
          <button type="submit" className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-fg">
            Uložiť
          </button>
        </form>
      </Modal>
    </>
  );
}

function short(status: DealStatus) {
  if (status === "Due diligence") return "DD";
  if (status === "Predané") return "Exit";
  if (status === "Ponuka") return "Ponuka";
  return "Sledovať";
}
