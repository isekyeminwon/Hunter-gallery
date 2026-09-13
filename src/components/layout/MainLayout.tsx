import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { Footer } from "./Footer";
import { RightSidebar } from "./RightSidebar";
import { HeaderBanner } from "../ads/HeaderBanner";
import { AdProvider } from "../ads/AdProvider";
import { GalleryHeader } from "../gallery/GalleryHeader";

export function MainLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const isPostDetail = location.pathname.startsWith("/post/");

  return <AdProvider>
    <div className="page-shell">
      <SiteHeader />
      <div className={`page-inner${isPostDetail ? " post-detail-page" : ""}`}>
        <GalleryHeader />
        <HeaderBanner />
        <div className="content-grid">
          <main className="main-column">{children}</main>
          <RightSidebar />
        </div>
      </div>
      <Footer />
    </div>
  </AdProvider>;
}
