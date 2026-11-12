import { PageHeader, Panel } from "@/components/ui";

const BLOCKS = [
  {
    title: "Ako čítať audit",
    body: "Zdravie je 0–100. Pod 70 ber cenu ako strop, nie ako férovú. Násobok MRR je orientačný pás, nie ponuka banky.",
  },
  {
    title: "Portfólio",
    body: "Sledujem = radar. Due diligence = pozeráš kód a čísla. Ponuka = máš číslo. Predané = exit, ráta sa do súčtu, nie do živého MRR.",
  },
  {
    title: "Trh",
    body: "Listing pridáš jedným ťuknutím. Ak už v kanbane je, tlačidlo ostane tiché, aby si nemal duplicity.",
  },
  {
    title: "Čo toto demo nerobí",
    body: "Nelezie na GitHub naživo a neposiela maily. Čísla auditu sú deterministický model z URL, aby náhľad fungoval bez kľúčov.",
  },
];

export function Docs() {
  return (
    <>
      <PageHeader eyebrow="Dokumentácia" title="Ako s OS pracovať" />
      <div className="grid gap-3 md:grid-cols-2">
        {BLOCKS.map((block) => (
          <Panel key={block.title}>
            <h2 className="font-medium">{block.title}</h2>
            <p className="mt-2 text-sm text-muted">{block.body}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
