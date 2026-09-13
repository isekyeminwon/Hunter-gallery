export type AdSlot = "header-banner" | "right-sidebar" | "post-inline";

export interface Ad {
  id: string;
  slot: AdSlot[];
  brand: string;
  headline: string;
  subline?: string;
  image?: string | null;
  active: boolean;
}
