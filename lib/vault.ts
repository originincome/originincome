export type VaultCategory = "Business" | "Sales" | "Marketing" | "Dokumente" | "Origin AI";

export type VaultAsset = {
  id: string;
  title: string;
  category: VaultCategory;
  type: string;
  status: "prepared" | "draft" | "saved";
  journey: string;
  mission: number;
  createdAt: string;
  updatedAt: string;
  content?: string;
  source?: "mission" | "origin-ai" | "manual";
};

export type BusinessDNA = {
  journey: string;
  niche: string;
  targetGroup: string;
  coreProblem: string;
  outcome: string;
  positioning: string;
  language: string;
  tone: string;
};

export const VAULT_STORAGE_KEY = "origin_business_vault_v1033";
export const DNA_STORAGE_KEY = "origin_business_dna_v1033";

export function loadVault(): VaultAsset[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(VAULT_STORAGE_KEY) || "[]") as VaultAsset[]; } catch { return []; }
}

export function saveVault(items: VaultAsset[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(items));
}

export function upsertVaultAsset(asset: VaultAsset) {
  const items = loadVault();
  const index = items.findIndex(x => x.id === asset.id);
  if (index >= 0) items[index] = { ...items[index], ...asset, updatedAt: new Date().toISOString() };
  else items.unshift(asset);
  saveVault(items);
  return items;
}

export function loadBusinessDNA(): BusinessDNA {
  const fallback: BusinessDNA = { journey:"", niche:"", targetGroup:"", coreProblem:"", outcome:"", positioning:"", language:"Deutsch", tone:"Klar, professionell, direkt" };
  if (typeof window === "undefined") return fallback;
  try { return { ...fallback, ...(JSON.parse(localStorage.getItem(DNA_STORAGE_KEY) || "{}") as Partial<BusinessDNA>) }; } catch { return fallback; }
}

export function saveBusinessDNA(dna: BusinessDNA) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DNA_STORAGE_KEY, JSON.stringify(dna));
}
