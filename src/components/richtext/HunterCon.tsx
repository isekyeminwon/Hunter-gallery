import emoticons from "../../data/emoticons.json";
import type { Emoticon } from "../../types/emoticon";

const map = new Map((emoticons as Emoticon[]).map((item) => [item.slug, item]));

export function HunterCon({ slug }: { slug: string }) {
  const item = map.get(slug);
  if (!item) return <span className="unknown-con">{`{{con:${slug}}}`}</span>;
  return <img className="hunter-con" src={item.src} alt={item.alt} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />;
}
