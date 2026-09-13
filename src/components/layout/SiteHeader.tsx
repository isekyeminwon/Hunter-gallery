import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { galleryConfig } from "../../data/galleryConfig";
import { MutationDialog } from "../mutation/MutationDialog";
import { useMutationFailure } from "../../hooks/useMutationFailure";
import { UsageGuideModal } from "./UsageGuideModal";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function SiteHeader() {
  const mutation = useMutationFailure();
  const [guideOpen, setGuideOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}&scope=titleBody`);
  };

  return <>
    <header className="site-header">
      <Link className="site-logo" to="/board">
        <span className="site-logo-mark">H</span>
        <span>{galleryConfig.fullName}</span>
      </Link>

      <form className="header-search" onSubmit={submitSearch} role="search">
        <span aria-hidden="true">⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="게이트, 헌터, 길드, 사건 검색"
          aria-label="통합 검색"
        />
      </form>

      <div className="site-actions">
        <button onClick={() => mutation.trigger("LOGIN")}>로그인</button>
        <button onClick={() => mutation.trigger("REGISTER")}>회원가입</button>
        <button className="guide-trigger" type="button" onClick={() => setGuideOpen(true)}>이용안내</button>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          title={theme === "dark" ? "라이트 모드" : "다크 모드"}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
    <UsageGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    <MutationDialog action={mutation.action} onClose={mutation.close} />
  </>;
}
