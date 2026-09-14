import type { AdSlot as Slot } from "../../types/ad";
import { useAd } from "./AdProvider";

export function AdSlot({ slot }: { slot: Slot }) {
  const ad = useAd(slot);
  if (!ad) return null;
  return (
    <aside
    className={`ad ad-${slot}${ad.image ? " has-image" : ""}`}
    aria-label="광고">
      <div className="ad-kicker">AD</div>
      {ad.image && (
        <img
          src={ad.image}
          alt={`${ad.brand} 광고`}
          className="ad-image"
          loading="lazy"
        />
      )}
      <div className="ad-copy">
        <div className="ad-brand">{ad.brand}</div>
        <strong>{ad.headline}</strong>
        {ad.subline && <span>{ad.subline}</span>}
      </div>
    </aside>
  );
}
