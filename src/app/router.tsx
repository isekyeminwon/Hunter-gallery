import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "./App";
import { BoardPage } from "../pages/BoardPage";
import { PostPage } from "../pages/PostPage";
import { SearchPage } from "../pages/SearchPage";
import { ConceptPage } from "../pages/ConceptPage";
import { NoticePage } from "../pages/NoticePage";
import { ClassicPage } from "../pages/ClassicPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/board" replace /> },
      { path: "board", element: <BoardPage /> },
      { path: "post/:id", element: <PostPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "concept", element: <ConceptPage /> },
      { path: "notices", element: <NoticePage /> },
      { path: "classic", element: <ClassicPage /> },
      { path: "year/:year", element: <BoardPage /> },
    ],
  },
]);
