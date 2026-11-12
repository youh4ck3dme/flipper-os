import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedActivity,
  seedAssets,
  seedLeads,
  type Activity,
  type Asset,
  type Audit,
  type DealStatus,
  type Lead,
  type LeadStage,
} from "@/lib/model";

type State = {
  name: string;
  query: string;
  notice: string | null;
  assets: Asset[];
  leads: Lead[];
  audits: Audit[];
  activity: Activity[];
  setName: (name: string) => void;
  setQuery: (query: string) => void;
  clearNotice: () => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  patchAsset: (id: string, patch: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  addLead: (lead: Omit<Lead, "id">) => void;
  moveLead: (id: string, stage: LeadStage) => void;
  removeLead: (id: string) => void;
  saveAudit: (audit: Audit) => void;
  reset: () => void;
};

function stamp(): string {
  return new Intl.DateTimeFormat("sk-SK", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

let seq = 0;
function nid(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${seq}`;
}

const fresh = () => ({
  name: "Erik",
  query: "",
  notice: null as string | null,
  assets: seedAssets,
  leads: seedLeads,
  audits: [] as Audit[],
  activity: seedActivity,
});

export const useOs = create<State>()(
  persist(
    (set) => ({
      ...fresh(),
      setName: (name) => set({ name }),
      setQuery: (query) => set({ query }),
      clearNotice: () => set({ notice: null }),
      addAsset: (asset) =>
        set((s) => ({
          assets: [{ ...asset, id: nid("a") }, ...s.assets],
          notice: `${asset.name} je v portfóliu.`,
          activity: [{ id: nid("v"), text: `Pridané aktívum ${asset.name}.`, when: stamp() }, ...s.activity].slice(0, 12),
        })),
      patchAsset: (id, patch) =>
        set((s) => ({
          assets: s.assets.map((a) => (a.id === id ? { ...a, ...patch } : a)),
          activity:
            patch.status
              ? [
                  {
                    id: nid("v"),
                    text: `${s.assets.find((a) => a.id === id)?.name ?? "Aktívum"} → ${patch.status as DealStatus}.`,
                    when: stamp(),
                  },
                  ...s.activity,
                ].slice(0, 12)
              : s.activity,
        })),
      removeAsset: (id) =>
        set((s) => ({
          assets: s.assets.filter((a) => a.id !== id),
          notice: "Aktívum odstránené.",
        })),
      addLead: (lead) =>
        set((s) => ({
          leads: [{ ...lead, id: nid("l") }, ...s.leads],
          notice: `Lead ${lead.name} pridaný.`,
          activity: [{ id: nid("v"), text: `Nový lead ${lead.company}.`, when: stamp() }, ...s.activity].slice(0, 12),
        })),
      moveLead: (id, stage) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)),
        })),
      removeLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      saveAudit: (audit) =>
        set((s) => ({
          audits: [audit, ...s.audits.filter((a) => a.url !== audit.url)].slice(0, 6),
          notice: `Audit ${audit.name} uložený.`,
          activity: [{ id: nid("v"), text: `Audit ${audit.name}: zdravie ${audit.health}.`, when: stamp() }, ...s.activity].slice(0, 12),
        })),
      reset: () => set({ ...fresh(), notice: "Demo dáta obnovené." }),
    }),
    {
      name: "flipper-os-v1",
      skipHydration: true,
      partialize: (s) => ({
        name: s.name,
        assets: s.assets,
        leads: s.leads,
        audits: s.audits,
        activity: s.activity,
      }),
    },
  ),
);
