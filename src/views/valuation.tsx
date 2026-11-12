import { useEffect, useState } from "react";
import { inputClass, PageHeader, Panel } from "@/components/ui";
import { eur, simulateAudit, type Audit } from "@/lib/model";
import { useOs } from "@/lib/store";

const GITHUB = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i;

export function Valuation() {
  const audits = useOs((s) => s.audits);
  const saveAudit = useOs((s) => s.saveAudit);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState<Audit | null>(null);

  useEffect(() => {
    if (!current && audits[0]) setCurrent(audits[0]);
  }, [audits, current]);

  return (
    <>
      <PageHeader eyebrow="Valuation lab" title="Audit repozitára" />
      <div className="grid gap-3 lg:grid-cols-[1fr_18rem]">
        <Panel className="space-y-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!GITHUB.test(url.trim())) {
                setError("Zadaj platnú GitHub URL.");
                return;
              }
              setError("");
              setBusy(true);
              const next = url.trim();
              window.setTimeout(() => {
                const audit = simulateAudit(next);
                setCurrent(audit);
                saveAudit(audit);
                setBusy(false);
              }, 900);
            }}
          >
            <input
              className={inputClass}
              value={url}
              placeholder="https://github.com/org/repo"
              onChange={(event) => setUrl(event.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-60"
            >
              {busy ? "Analyzujem" : "Magic audit"}
            </button>
          </form>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {current ? <Report audit={current} /> : <p className="text-sm text-muted">Zatiaľ žiadny report. Spusti prvý audit.</p>}
        </Panel>
        <Panel>
          <h2 className="mb-3 text-sm font-medium">História</h2>
          {audits.length === 0 ? (
            <p className="text-sm text-muted">Uložené audity sa objavia tu.</p>
          ) : (
            <ul className="space-y-2">
              {audits.map((audit) => (
                <li key={audit.id}>
                  <button type="button" className="w-full rounded-xl bg-surface-2 px-3 py-2 text-left" onClick={() => setCurrent(audit)}>
                    <span className="block text-sm font-medium">{audit.name}</span>
                    <span className="font-mono text-xs text-muted">
                      {audit.health} · {eur(audit.low)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function Report({ audit }: { audit: Audit }) {
  return (
    <div className="space-y-4 border-t border-border pt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{audit.name}</p>
          <p className="font-mono text-4xl font-medium">{audit.health}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">modelované MRR {eur(audit.mrr)}</p>
          <p className="font-mono text-lg">
            {eur(audit.low)} – {eur(audit.high)}
          </p>
          <p className="text-xs text-muted">{audit.multiple}×</p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-accent" style={{ width: `${audit.health}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {audit.stack.map((item) => (
          <span key={item} className="rounded-full border border-border px-2 py-1 text-xs">
            {item}
          </span>
        ))}
      </div>
      <p className="text-sm">{audit.note}</p>
      <ul className="space-y-1 text-sm text-muted">
        {audit.risks.map((risk) => (
          <li key={risk}>{risk}</li>
        ))}
      </ul>
    </div>
  );
}
