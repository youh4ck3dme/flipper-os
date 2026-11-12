export type DealStatus = "Sledujem" | "Due diligence" | "Ponuka" | "Predané";
export type LeadStage = "Nový" | "Kontakt" | "Rokovanie" | "Výhra" | "Prehra";

export type Asset = {
  id: string;
  name: string;
  mrr: number;
  expenses: number;
  asking: number;
  status: DealStatus;
  stack: string;
  health: number;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  stage: LeadStage;
  value: number;
};

export type Listing = {
  id: string;
  name: string;
  price: number;
  mrr: number;
  category: string;
  stack: string;
};

export type Audit = {
  id: string;
  url: string;
  name: string;
  health: number;
  mrr: number;
  low: number;
  high: number;
  multiple: number;
  stack: string[];
  risks: string[];
  note: string;
};

export type Activity = { id: string; text: string; when: string };

export const DEAL_STATUSES: DealStatus[] = ["Sledujem", "Due diligence", "Ponuka", "Predané"];
export const LEAD_STAGES: LeadStage[] = ["Nový", "Kontakt", "Rokovanie", "Výhra", "Prehra"];

export const seedAssets: Asset[] = [
  { id: "a1", name: "Slotly", mrr: 1860, expenses: 240, asking: 42000, status: "Ponuka", stack: "React · Supabase", health: 82 },
  { id: "a2", name: "FakturaMini", mrr: 940, expenses: 80, asking: 16000, status: "Due diligence", stack: "Next.js", health: 74 },
  { id: "a3", name: "Northwind Maps", mrr: 3100, expenses: 410, asking: 89000, status: "Sledujem", stack: "MapLibre · TS", health: 68 },
  { id: "a4", name: "Lumen Notes", mrr: 520, expenses: 40, asking: 11000, status: "Predané", stack: "PWA", health: 91 },
  { id: "a5", name: "Packeta Desk", mrr: 1280, expenses: 150, asking: 27000, status: "Sledujem", stack: "Vite · Stripe", health: 77 },
  { id: "a6", name: "Quiet CRM", mrr: 2100, expenses: 260, asking: 54000, status: "Ponuka", stack: "React", health: 88 },
];

export const seedLeads: Lead[] = [
  { id: "l1", name: "Petra Horváthová", company: "Studio Nila", stage: "Rokovanie", value: 18000 },
  { id: "l2", name: "Martin Kováč", company: "Pixelworks", stage: "Kontakt", value: 9000 },
  { id: "l3", name: "Ada Klein", company: "Klein Digital", stage: "Nový", value: 24000 },
  { id: "l4", name: "Lucia Benedik", company: "Benedik s.r.o.", stage: "Výhra", value: 12000 },
  { id: "l5", name: "Jonas Weber", company: "Weber Apps", stage: "Prehra", value: 7000 },
];

export const listings: Listing[] = [
  { id: "m1", name: "Harbor Inbox", price: 36000, mrr: 1450, category: "SaaS", stack: "Rails" },
  { id: "m2", name: "Kite Forms", price: 22000, mrr: 980, category: "PWA", stack: "React" },
  { id: "m3", name: "Ledger Leaf", price: 51000, mrr: 2400, category: "SaaS", stack: "Go" },
  { id: "m4", name: "Night Shift", price: 8400, mrr: 310, category: "Nástroj", stack: "Python" },
  { id: "m5", name: "Orchard Menu", price: 15000, mrr: 620, category: "PWA", stack: "Vue" },
  { id: "m6", name: "Signal Bench", price: 47000, mrr: 1980, category: "SaaS", stack: "TypeScript" },
  { id: "m7", name: "Paper Route", price: 12000, mrr: 540, category: "Obsah", stack: "Astro" },
  { id: "m8", name: "Voxel Desk", price: 28000, mrr: 1100, category: "Nástroj", stack: "Rust" },
];

export const seedActivity: Activity[] = [
  { id: "v1", text: "Quiet CRM posunutý do stavu Ponuka.", when: "dnes 09:40" },
  { id: "v2", text: "Nový audit: tailwindlabs/tailwindcss.", when: "včera 18:12" },
  { id: "v3", text: "Lumen Notes označený ako predaný.", when: "včera 11:05" },
  { id: "v4", text: "Lead Studio Nila prešiel do rokovania.", when: "po 16:22" },
];

export function eur(n: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

const STACKS = ["React", "TypeScript", "Vite", "Supabase", "Tailwind", "Postgres", "Stripe", "PWA"];

export function simulateAudit(url: string): Audit {
  const clean = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
  const h = hash(clean.toLowerCase());
  const health = 58 + (h % 38);
  const mrr = 420 + (h % 70) * 45;
  const multiple = 16 + (h % 14);
  const name = clean.split("/").filter(Boolean).pop() || "repo";
  const stack = [STACKS[h % STACKS.length], STACKS[(h >> 3) % STACKS.length], STACKS[(h >> 8) % STACKS.length]].filter(
    (item, index, all) => all.indexOf(item) === index,
  );
  const risks: string[] = [];
  if (health < 72) risks.push("Testy pokrývajú len časť kritických ciest.");
  if (mrr < 1500) risks.push("MRR je stále krehké — kupujúci bude chcieť zľavu za koncentráciu.");
  if ((h & 3) === 0) risks.push("Závislosť na jednom platebnom providerovi.");
  if (risks.length === 0) risks.push("Žiadny kritický blokér. Riziko je skôr v retencii, nie v kóde.");
  const note =
    health >= 80
      ? "Zdravý produkt. Dá sa ísť do ponuky bez hlbokého prepisu."
      : "Kúpiteľné, ale cena má reflektovať dlh na kvalite.";
  return {
    id: `audit-${h.toString(16)}`,
    url: clean,
    name,
    health,
    mrr,
    low: mrr * (multiple - 4),
    high: mrr * (multiple + 5),
    multiple,
    stack,
    risks,
    note,
  };
}

export function repoName(url: string) {
  return url.trim().replace(/\.git$/, "").replace(/\/$/, "").split("/").filter(Boolean).pop() || "repo";
}
