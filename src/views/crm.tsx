import { useState } from "react";
import { Field, inputClass, Modal, PageHeader } from "@/components/ui";
import { eur, LEAD_STAGES, type LeadStage } from "@/lib/model";
import { useOs } from "@/lib/store";

export function Crm() {
  const leads = useOs((s) => s.leads);
  const moveLead = useOs((s) => s.moveLead);
  const addLead = useOs((s) => s.addLead);
  const removeLead = useOs((s) => s.removeLead);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("10000");

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Kupujúci"
        action={
          <button type="button" className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg" onClick={() => setOpen(true)}>
            Nový lead
          </button>
        }
      />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {LEAD_STAGES.map((stage) => (
          <section key={stage} className="glass w-64 shrink-0 rounded-2xl p-3">
            <h2 className="mb-3 text-sm font-medium">
              {stage}
              <span className="ml-2 text-muted">{leads.filter((l) => l.stage === stage).length}</span>
            </h2>
            <div className="space-y-3">
              {leads
                .filter((lead) => lead.stage === stage)
                .map((lead) => (
                  <article key={lead.id} className="glass-strong rounded-xl p-3">
                    <h3 className="text-sm font-medium">{lead.name}</h3>
                    <p className="text-xs text-muted">{lead.company}</p>
                    <p className="mt-2 font-mono text-sm">{eur(lead.value)}</p>
                    <label className="mt-3 block text-xs text-muted">
                      Stav
                      <select
                        className="mt-1 h-10 w-full rounded-lg border border-border bg-bg px-2 text-sm text-fg"
                        value={lead.stage}
                        onChange={(event) => moveLead(lead.id, event.target.value as LeadStage)}
                      >
                        {LEAD_STAGES.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                    <button type="button" className="mt-2 text-xs text-danger" onClick={() => removeLead(lead.id)}>
                      Odstrániť
                    </button>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
      <Modal open={open} title="Nový lead" onClose={() => setOpen(false)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim() || !company.trim()) return;
            addLead({ name: name.trim(), company: company.trim(), value: Number(value) || 0, stage: "Nový" });
            setName("");
            setCompany("");
            setOpen(false);
          }}
        >
          <Field label="Meno">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Firma">
            <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} required />
          </Field>
          <Field label="Hodnota (€)">
            <input className={inputClass} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} />
          </Field>
          <button type="submit" className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-fg">
            Pridať
          </button>
        </form>
      </Modal>
    </>
  );
}
