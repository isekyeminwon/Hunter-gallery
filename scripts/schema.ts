import { z } from "zod";

const authorSchema = z.object({
  type: z.enum(["anonymous", "fixed", "admin"]),
  name: z.string().min(1),
  ip: z.string().nullable(),
});

const attachmentSchema = z.object({
  id: z.string().min(1),
  type: z.literal("image"),
  src: z.string().nullable(),
  alt: z.string().nullable(),
  status: z.enum(["available", "lost"]),
});

const commentSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().nullable(),
  timestamp: z.string().datetime({ offset: true }),
  author: authorSchema,
  content: z.string(),
  deleted: z.boolean(),
});

const postSchema = z.object({
  id: z.string().min(1),
  displayNo: z.number().int().nonnegative(),
  displayNoLabel: z.string().min(1).max(20).optional(),
  timestamp: z.string().datetime({ offset: true }),
  year: z.number().int().min(2022).max(2042),
  era: z.string().min(1),
  internalCategory: z.enum([
    "뻘글·잡담",
    "질문·뉴비",
    "공략·실무",
    "갈드컵·랭킹",
    "사건·속보",
    "팬덤·방송",
    "시장·구인",
    "협회·법·범죄",
  ]),
  displayCategory: z.enum(["일반", "질문", "정보", "공략", "사건", "구인", "길드", "방송", "협회"]),
  event: z.object({
    tag: z.string().nullable(),
    phase: z.enum(["NONE", "PRE", "BREAKING", "CONFIRMED", "AFTERMATH", "RETROSPECTIVE"]),
    related: z.boolean(),
  }),
  title: z.string().min(1),
  author: authorSchema,
  content: z.string(),
  attachments: z.array(attachmentSchema),
  stats: z.object({
    views: z.number().int().nonnegative(),
    recommend: z.number().int().nonnegative(),
  }),
  flags: z.object({
    notice: z.boolean(),
    concept: z.boolean(),
    classic: z.boolean(),
    deleted: z.boolean(),
    locked: z.boolean(),
  }),
  deletedStatus: z.enum(["AUTHOR_DELETED", "MODERATOR_DELETED", "POLICY_DELETED", "MISSING"]).nullable(),
  comments: z.array(commentSchema),
  canon: z.object({
    keywords: z.array(z.string()),
    forbiddenKnowledge: z.array(z.string()),
  }),
});

export const masterSchema = z.object({
  version: z.string(),
  snapshot: z.literal("2042-09-17"),
  notices: z.array(postSchema),
  posts: z.array(postSchema),
});

export type ParsedMaster = z.infer<typeof masterSchema>;
