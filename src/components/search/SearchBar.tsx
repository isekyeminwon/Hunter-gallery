import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  initialQuery?: string;
  initialScope?: string;
  preserve?: Record<string, string | null | undefined>;
}

export function SearchBar({ initialQuery = "", initialScope = "titleBody", preserve = {} }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState(initialScope);
  const navigate = useNavigate();

  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => setScope(initialScope), [initialScope]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(preserve).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("q", query.trim());
    params.set("scope", scope);
    params.delete("page");
    navigate(`/search?${params.toString()}`);
  };

  return <form className="search-bar" onSubmit={submit}>
    <select aria-label="검색 범위" value={scope} onChange={(e) => setScope(e.target.value)}>
      <option value="titleBody">제목+본문</option>
      <option value="title">제목</option>
      <option value="author">작성자</option>
      <option value="comments">댓글</option>
    </select>
    <input aria-label="검색어" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="검색어를 입력하세요" />
    <button type="submit">검색</button>
  </form>;
}
