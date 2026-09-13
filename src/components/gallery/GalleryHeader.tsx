import { GalleryTabs } from "./GalleryTabs";
import { CategoryNav } from "./CategoryNav";
import { MutationDialog } from "../mutation/MutationDialog";
import { useMutationFailure } from "../../hooks/useMutationFailure";

export function GalleryHeader() {
  const mutation = useMutationFailure();
  return <>
    <section className="gallery-head">
      <div className="gallery-icon" aria-hidden="true">獵</div>
      <div className="gallery-copy">
        <h1>대한민국 헌터 갤러리</h1>
        <p>대한민국 최대 헌터 전문 익명 커뮤니티</p>
        <div className="gallery-meta">운영 20년차 · 현역/업계/일반인 자유게시판</div>
      </div>
      <button className="write-button" onClick={() => mutation.trigger("WRITE_POST")}>글쓰기</button>
    </section>
    <GalleryTabs />
    <CategoryNav />
    <MutationDialog action={mutation.action} onClose={mutation.close} />
  </>;
}
