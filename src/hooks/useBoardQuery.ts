import { useEffect, useMemo, useState } from "react";
import { loadPostIndex } from "../lib/dataLoader";
import type { PostIndexItem, DisplayCategory } from "../types/post";

export function useBoardQuery(category?: DisplayCategory) {
  const [rows, setRows] = useState<PostIndexItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadPostIndex()
      .then((data) => alive && setRows(data))
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(
    () => category ? rows.filter((row) => row.displayCategory === category) : rows,
    [rows, category],
  );

  return { rows: filtered, loading, error };
}
