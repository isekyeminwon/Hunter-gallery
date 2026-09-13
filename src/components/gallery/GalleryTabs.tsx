import { NavLink } from "react-router-dom";
import { galleryConfig } from "../../data/galleryConfig";
export function GalleryTabs() {
  return <nav className="gallery-tabs" aria-label="게시판 탭">
    {galleryConfig.tabs.map((tab) => <NavLink key={tab.to} to={tab.to} className={({isActive}) => isActive ? "active" : undefined}>{tab.label}</NavLink>)}
  </nav>;
}
