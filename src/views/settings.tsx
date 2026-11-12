import { Field, inputClass, PageHeader, Panel } from "@/components/ui";
import { useOs } from "@/lib/store";

export function Settings() {
  const name = useOs((s) => s.name);
  const setName = useOs((s) => s.setName);
  const reset = useOs((s) => s.reset);

  return (
    <>
      <PageHeader eyebrow="Nastavenia" title="Pracovný priestor" />
      <Panel className="max-w-lg space-y-4">
        <Field label="Meno v prehľade">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} maxLength={40} />
        </Field>
        <p className="text-sm text-muted">Dáta ostávajú v tomto prehliadači. Obnovenie vráti ukážkové dealy a leady.</p>
        <button type="button" className="h-11 rounded-xl border border-danger px-4 text-sm text-danger" onClick={() => reset()}>
          Obnoviť demo
        </button>
      </Panel>
    </>
  );
}
