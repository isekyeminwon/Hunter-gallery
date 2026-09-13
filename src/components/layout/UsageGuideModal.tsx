import { useEffect } from "react";

interface UsageGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function UsageGuideModal({ open, onClose }: UsageGuideModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="guide-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="guide-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-guide-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="guide-head">
          <div>
            <span className="guide-kicker">대한민국 헌터 갤러리</span>
            <h2 id="gallery-guide-title">갤러리 이용안내</h2>
          </div>
          <button className="guide-close" type="button" onClick={onClose} aria-label="이용안내 닫기">×</button>
        </header>

        <div className="guide-scroll">
          <p className="guide-lead">
            대한민국 헌터 갤러리는 헌터·게이트·길드·현장 정보와 관련된 자유로운 의견 교환을 위한 게시판입니다.
            게시물과 댓글의 내용은 작성자에게 책임이 있으며, 이용자는 타인의 권리와 현장 안전을 침해하지 않는 범위에서 서비스를 이용해야 합니다.
          </p>

          <section className="guide-section">
            <h3>1. 게시물과 작성자의 책임</h3>
            <ul>
              <li>작성한 글·댓글·이미지의 책임은 작성자에게 있습니다.</li>
              <li>타인의 저작물, 사진, 방송 캡처 등을 사용할 때에는 권리 침해가 발생하지 않도록 주의해야 합니다.</li>
              <li>타인을 사칭하거나 개인정보·연락처·거주지 등 식별정보를 무단으로 공개하는 게시물은 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section className="guide-section">
            <h3>2. 삭제·이용 제한 대상</h3>
            <p>다음에 해당하는 게시물은 예고 없이 삭제, 검색 제외 또는 접근 제한될 수 있습니다.</p>
            <ul>
              <li>불법 거래, 사기, 악성코드, 불법 프로그램 등 위법행위를 알선하거나 조장하는 내용</li>
              <li>명예훼손, 협박, 반복적인 괴롭힘, 심각한 혐오·차별 또는 타인의 권리를 침해하는 내용</li>
              <li>성착취물, 불법촬영물 등 법령상 유통이 금지된 정보</li>
              <li>동일·유사 게시물의 반복 등록, 광고 도배, 외부 채널로의 상업적 유도 등 정상적인 게시판 이용을 방해하는 행위</li>
              <li>재난·안전과 관련해 사실로 오인될 정도로 조작된 정보를 고의로 유포해 피해를 발생시키는 행위</li>
            </ul>
          </section>

          <section className="guide-section">
            <h3>3. 헌터·게이트 관련 특별 안내</h3>
            <ul>
              <li>진행 중인 공략의 실시간 위치, 통제선 우회 경로, 구조 인력의 이동 동선 등 현장 안전을 해칠 수 있는 정보는 제한될 수 있습니다.</li>
              <li>헌터 본인의 동의 없는 실명·주소·가족관계·연락처 등 과도한 신상정보 게시를 금지합니다.</li>
              <li>미확인 게이트 등급, 실종·사망 정보, 길드 내부자료 등은 사실 확인 전 단정적으로 유포하지 마십시오.</li>
              <li>공략대·짐꾼 구인글은 보수, 집결 정보, 예상 위험도, 보험 여부 등 기본 조건을 명확히 기재하는 것을 권장합니다.</li>
              <li>마석·장비·공략권 등 규제 대상 거래를 우회하거나 명의를 빌리는 행위는 운영상 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section className="guide-section">
            <h3>4. 신고와 임시조치</h3>
            <ul>
              <li>권리 침해, 불법정보, 개인정보 노출 또는 현장 안전을 위협하는 게시물은 신고 기능을 이용할 수 있습니다.</li>
              <li>사실관계 확인이 필요한 경우 검토 기간 동안 해당 게시물의 노출이 임시로 제한될 수 있습니다.</li>
              <li>신고가 접수되었다는 사실만으로 모든 게시물이 삭제되는 것은 아닙니다.</li>
            </ul>
          </section>

          <section className="guide-section">
            <h3>5. 커뮤니티 이용</h3>
            <ul>
              <li>갤러리 주제와 관계없는 글도 허용되지만 반복적인 도배와 분란 목적의 게시물은 정리될 수 있습니다.</li>
              <li>게시물의 추천수·조회수·댓글수는 내용의 정확성을 보증하지 않습니다.</li>
              <li>현장 판단이 필요한 사안은 커뮤니티 게시물보다 헌터협회 및 관계기관의 공식 안내를 우선해 주십시오.</li>
            </ul>
          </section>

          <p className="guide-footnote">
            운영 기준은 서비스 환경과 관련 법령의 변경에 따라 조정될 수 있습니다.
          </p>
        </div>

        <footer className="guide-actions">
          <button type="button" onClick={onClose}>확인</button>
        </footer>
      </section>
    </div>
  );
}
