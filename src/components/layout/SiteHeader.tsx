import { useState } from "react";
import { Link } from "react-router-dom";
import { galleryConfig } from "../../data/galleryConfig";
import { MutationDialog } from "../mutation/MutationDialog";
import { useMutationFailure } from "../../hooks/useMutationFailure";
import { UsageGuideModal } from "./UsageGuideModal";

export function SiteHeader() {
  const mutation = useMutationFailure();
  const [guideOpen, setGuideOpen] = useState(false);

  return <>
    <header className="site-header">
      <Link className="site-logo" to="/board">
        <span className="site-logo-mark">H</span>
        <span>{galleryConfig.fullName}</span>
      </Link>
      <div className="site-actions">
        <button onClick={() => mutation.trigger("LOGIN")}>로그인</button>
        <span className="divider">|</span>
        <button onClick={() => mutation.trigger("REGISTER")}>회원가입</button>
        <span className="divider">|</span>
        <button className="guide-trigger" type="button" onClick={() => setGuideOpen(true)}>이용안내</button>
      </div>
    </header>
    <UsageGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    <MutationDialog action={mutation.action} onClose={mutation.close} />
  </>;
}
