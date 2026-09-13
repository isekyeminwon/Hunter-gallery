export type InternalCategory =
  | "뻘글·잡담"
  | "질문·뉴비"
  | "공략·실무"
  | "갈드컵·랭킹"
  | "사건·속보"
  | "팬덤·방송"
  | "시장·구인"
  | "협회·법·범죄";

export type DisplayCategory =
  | "일반"
  | "질문"
  | "정보"
  | "공략"
  | "사건"
  | "구인"
  | "길드"
  | "방송"
  | "협회";

export type AuthorType = "anonymous" | "fixed" | "admin";
export type DeletedStatus = null | "AUTHOR_DELETED" | "MODERATOR_DELETED" | "POLICY_DELETED" | "MISSING";
export type EventPhase = "NONE" | "PRE" | "BREAKING" | "CONFIRMED" | "AFTERMATH" | "RETROSPECTIVE";
export type AttachmentStatus = "available" | "lost";

export interface Author {
  type: AuthorType;
  name: string;
  ip: string | null;
}

export interface Attachment {
  id: string;
  type: "image";
  src: string | null;
  alt: string | null;
  status: AttachmentStatus;
}

export interface Comment {
  id: string;
  parentId: string | null;
  timestamp: string;
  author: Author;
  content: string;
  deleted: boolean;
}

export interface Post {
  id: string;
  displayNo: number;
  displayNoLabel?: string;
  timestamp: string;
  year: number;
  era: string;
  internalCategory: InternalCategory;
  displayCategory: DisplayCategory;
  event: {
    tag: string | null;
    phase: EventPhase;
    related: boolean;
  };
  title: string;
  author: Author;
  content: string;
  attachments: Attachment[];
  stats: {
    views: number;
    recommend: number;
  };
  flags: {
    notice: boolean;
    concept: boolean;
    classic: boolean;
    deleted: boolean;
    locked: boolean;
  };
  deletedStatus: DeletedStatus;
  comments: Comment[];
  canon: {
    keywords: string[];
    forbiddenKnowledge: string[];
  };
}

export interface Notice extends Omit<Post, "flags"> {
  flags: Post["flags"] & { notice: true };
}

export interface PostIndexItem {
  id: string;
  displayNo: number;
  displayNoLabel?: string;
  timestamp: string;
  year: number;
  internalCategory: InternalCategory;
  displayCategory: DisplayCategory;
  title: string;
  author: Author;
  stats: Post["stats"];
  flags: Post["flags"];
  deletedStatus: DeletedStatus;
  commentCount: number;
  popularityScore: number;
}

export interface SearchIndexItem extends PostIndexItem {
  bodyText: string;
  authorText: string;
  commentText: string;
}

export interface GalleryMaster {
  version: string;
  snapshot: string;
  notices: Notice[];
  posts: Post[];
}
