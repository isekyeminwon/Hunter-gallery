import { useEffect, useState } from "react";
import { loadSearchIndex } from "../lib/dataLoader";
import type { SearchIndexItem } from "../types/post";

export function useSearchIndex() {
  const [rows, setRows] = useState<SearchIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadSearchIndex().then(setRows).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  return { rows, loading, error };
}
