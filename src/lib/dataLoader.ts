import type { Post, PostIndexItem, SearchIndexItem } from "../types/post";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`데이터를 불러오지 못했습니다: ${response.status}`);
  return response.json() as Promise<T>;
}

export const loadPostIndex = () => getJson<PostIndexItem[]>("/generated/post-index.json");
export const loadConceptIndex = () => getJson<PostIndexItem[]>("/generated/concept-index.json");
export const loadTrendingIndex = () => getJson<PostIndexItem[]>("/generated/trending-index.json");
export const loadNotices = () => getJson<PostIndexItem[]>("/generated/notices.json");
export const loadSearchIndex = () => getJson<SearchIndexItem[]>("/generated/search-index.json");
export const loadPost = (id: string) => getJson<Post>(`/generated/posts/${encodeURIComponent(id)}.json`);
export const loadYear = (year: number) => getJson<PostIndexItem[]>(`/generated/years/${year}.json`);
