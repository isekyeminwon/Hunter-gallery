import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import ads from "../../data/ads.json";
import type { Ad, AdSlot } from "../../types/ad";

const slotOrder: AdSlot[] = ["header-banner", "right-sidebar", "post-inline"];
const AdSelectionContext = createContext<Partial<Record<AdSlot, Ad>>>({});

function hash(input: string) {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function chooseAds(pathname: string) {
  const active = (ads as Ad[]).filter((ad) => ad.active);
  const used = new Set<string>();
  const selected: Partial<Record<AdSlot, Ad>> = {};

  for (const slot of slotOrder) {
    const candidates = active
      .filter((ad) => ad.slot.includes(slot))
      .sort((a, b) => hash(`${pathname}:${slot}:${a.id}`) - hash(`${pathname}:${slot}:${b.id}`));
    const unique = candidates.find((ad) => !used.has(ad.id));
    const ad = unique;
    if (ad) {
      selected[slot] = ad;
      used.add(ad.id);
    }
  }
  return selected;
}

export function AdProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const selection = useMemo(() => chooseAds(pathname), [pathname]);
  return <AdSelectionContext.Provider value={selection}>{children}</AdSelectionContext.Provider>;
}

export function useAd(slot: AdSlot) {
  return useContext(AdSelectionContext)[slot] ?? null;
}
