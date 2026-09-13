import type { Post } from "../../types/post";
import { formatFullDate } from "../../lib/date";

export function PostHeader({ post }: { post: Post }) {
  const author = post.author.type === "anonymous" ? `${post.author.name}(${post.author.ip})` : post.author.name;
  return <header className="post-header">
    <div className="post-title-line"><span className="category-badge">{post.displayCategory}</span><h2>{post.title}</h2></div>
    <div className="post-meta">
      <span>{author}</span>
      <span>{formatFullDate(post.timestamp)}</span>
      <span>조회 {post.stats.views.toLocaleString("ko-KR")}</span>
      <span>추천 {post.stats.recommend.toLocaleString("ko-KR")}</span>
    </div>
  </header>;
}
