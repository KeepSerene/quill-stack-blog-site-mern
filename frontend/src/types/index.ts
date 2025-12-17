/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

export interface UserDocument {
  _id: string;
  role: "admin" | "user";
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    gitHub?: string;
    linkedIn?: string;
    x?: string;
    instagram?: string;
    meta?: string;
    youTube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlogDocument {
  _id: string;
  title: string;
  author: UserDocument;
  content: string;
  slug: string;
  banner: {
    width: number;
    height: number;
    url: string;
    publicId: string;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: "draft" | "published";
  publishedAt: string;
  editedAt: string;
}

export interface CommentDocument {
  _id: string;
  content: string;
  user: UserDocument | string; // can be populated or just an ID
  blog: BlogDocument | string; // can be populated or just an ID
  likeCount: number;
  replies: CommentDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// T = The data type (e.g., BlogDocument)
// K = The key name (e.g., "blogs")
export type PaginatedResponse<T, K extends string> = {
  message: string;
  data: {
    pagination: PaginationMeta;
  } & {
    [key in K]: T[]; // this adds, e.g., "blogs": Blog[] dynamically
  };
};

// Express validator validation error type
export type Location = "body" | "params" | "query" | "headers" | "cookies";

export type FieldValidationError = {
  type: "field";
  location: Location;
  path: string;
  value?: string;
  message: string;
};

export type ErrorCode =
  | "AlreadyLiked"
  | "ValidationError"
  | "AuthenticationError"
  | "AuthorizationError"
  | "NotFound"
  | "ServerError";

export type ValidationError = {
  code: ErrorCode;
  errors: Record<string, FieldValidationError>;
};

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
};

export interface ActionResponse<T = unknown> {
  ok: boolean;
  error?: ValidationError | ErrorResponse;
  data?: T;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: Pick<UserDocument, "username" | "email" | "role">;
}

export interface CreateBlogResponse {
  message: string;
  blog: BlogDocument;
}
