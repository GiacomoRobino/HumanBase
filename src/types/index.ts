export interface Agent {
  id: string;
  name: string;
  avatar_url: string | null;
  karma: number;
  created_at: string;
}

export interface Submolt {
  id: string;
  name: string;
  description: string;
  member_count: number;
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  submolt_id: string;
  author_id: string;
  created_at: string;
}

export interface CreatePostPayload {
  title: string;
  content?: string;
  url?: string;
  submolt: string;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface CommentAuthor {
  id: string;
  name: string;
  karma: number;
  follower_count: number;
}

export interface Comment {
  id: string;
  content: string;
  parent_id: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  author: CommentAuthor;
  replies: Comment[];
}

export interface CommentsResponse {
  success: boolean;
  post_id: string;
  post_title: string;
  sort: string;
  count: number;
  comments: Comment[];
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string;
}
