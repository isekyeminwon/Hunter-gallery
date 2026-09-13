import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadPost, loadPostIndex } from "../lib/dataLoader";
import type { Post, PostIndexItem } from "../types/post";
import { PostHeader } from "../components/post/PostHeader";
import { PostBody } from "../components/post/PostBody";
import { AttachmentGallery } from "../components/post/AttachmentGallery";
import { ReactionButton } from "../components/post/ReactionButton";
import { PostInlineAd } from "../components/ads/PostInlineAd";
import { CommentList } from "../components/comments/CommentList";
import { CommentComposer } from "../components/comments/CommentComposer";
import { PostMiniList } from "../components/post/PostMiniList";
import { MutationDialog } from "../components/mutation/MutationDialog";
import { useMutationFailure } from "../hooks/useMutationFailure";
import { EmptyState } from "../components/common/EmptyState";

function surroundingRows(index: PostIndexItem[], currentId: string, size = 9) {
  const current = index.findIndex((row) => row.id === currentId);
  if (current < 0) return index.slice(0, size);
  const half = Math.floor(size / 2);
  const maxStart = Math.max(0, index.length - size);
  const start = Math.max(0, Math.min(current - half, maxStart));
  return index.slice(start, start + size);
}

export function PostPage() {
  const { id = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [mini, setMini] = useState<PostIndexItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutationFailure();

  useEffect(() => {
    setPost(null); setError(null);
    Promise.all([loadPost(id), loadPostIndex()])
      .then(([p, index]) => { setPost(p); setMini(surroundingRows(index, id)); })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <EmptyState>{error}</EmptyState>;
  if (!post) return <div className="loading">게시글을 불러오는 중...</div>;

  return <>
    <div className="post-nav"><Link to="/board">‹ 목록으로</Link><button onClick={() => mutation.trigger("REPORT")}>신고</button></div>
    <section className="post-card">
      <PostHeader post={post} />
      <PostBody post={post} />
      {!post.deletedStatus && <AttachmentGallery attachments={post.attachments} />}
      {!post.flags.notice && <ReactionButton recommend={post.stats.recommend} />}
    </section>
    <PostInlineAd />
    {post.deletedStatus ? (
      <section className="comments-section"><div className="no-comments">삭제된 게시글의 댓글 기록은 제공되지 않습니다.</div></section>
    ) : (
      <>
        <CommentList comments={post.comments} />
        <CommentComposer />
      </>
    )}
    <PostMiniList rows={mini} currentId={id} />
    <MutationDialog action={mutation.action} onClose={mutation.close} />
  </>;
}
