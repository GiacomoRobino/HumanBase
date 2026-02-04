import type {
  Agent,
  Submolt,
  Post,
  CreatePostPayload,
  ApiError,
  Comment,
  CreateCommentPayload,
  CommentsResponse,
  CreateSubmoltPayload,
  PostsResponse,
  PostResponse,
  SubmoltDetails,
  PostWithDetails,
  ProfileComment
} from '../types';

const BASE_URL = 'https://www.moltbook.com/api/v1';

class ApiClient {
  private agentId: string | null = null;

  setAgentId(id: string | null) {
    this.agentId = id;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.agentId) {
      headers['Authorization'] = `Bearer ${this.agentId}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Error',
        message: response.statusText,
      }));
      throw new Error(error.message || error.error || 'Request failed');
    }
    return response.json();
  }

  async getMe(): Promise<Agent> {
    const response = await fetch(`${BASE_URL}/agents/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<Agent | { success: boolean; agent: Agent }>(response);
    // Handle both wrapped and unwrapped response formats
    if ('agent' in data) {
      return data.agent;
    }
    return data;
  }

  async getSubmolts(): Promise<Submolt[] | { submolts: Submolt[] }> {
    const response = await fetch(`${BASE_URL}/submolts`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Submolt[] | { submolts: Submolt[] }>(response);
  }

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Post>(response);
  }

  async createComment(postId: string, payload: CreateCommentPayload): Promise<Comment> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Comment>(response);
  }

  async getComments(postId: string): Promise<CommentsResponse> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<CommentsResponse>(response);
  }

  async getPosts(params?: { sort?: string; limit?: number; submolt?: string }): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.submolt) searchParams.append('submolt', params.submolt);

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/posts${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<PostsResponse>(response);
  }

  async getPost(postId: string): Promise<PostResponse> {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<PostResponse>(response);
  }

  async getSubmolt(submoltName: string): Promise<SubmoltDetails> {
    const response = await fetch(`${BASE_URL}/submolts/${submoltName}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<SubmoltDetails | { success: boolean; submolt: SubmoltDetails }>(response);
    // Handle both wrapped and unwrapped response formats
    if ('submolt' in data) {
      return data.submolt;
    }
    return data;
  }

  async getSubmoltFeed(submoltName: string, params?: { sort?: string; limit?: number }): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/submolts/${submoltName}/feed${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<PostsResponse>(response);
  }

  async createSubmolt(payload: CreateSubmoltPayload): Promise<Submolt> {
    const response = await fetch(`${BASE_URL}/submolts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Submolt>(response);
  }

  async upvotePost(postId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/upvote`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async downvotePost(postId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/posts/${postId}/downvote`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async upvoteComment(commentId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/comments/${commentId}/upvote`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async getAgentProfile(agentName: string): Promise<{ agent: Agent; recentPosts: PostWithDetails[]; recentComments: ProfileComment[] }> {
    const response = await fetch(`${BASE_URL}/agents/profile?name=${encodeURIComponent(agentName)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<{ success: boolean; agent: Agent; recentPosts: PostWithDetails[]; recentComments: ProfileComment[] }>(response);
    return { agent: data.agent, recentPosts: data.recentPosts || [], recentComments: data.recentComments || [] };
  }

  async subscribe(submoltName: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/submolts/${submoltName}/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }

  async unsubscribe(submoltName: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/submolts/${submoltName}/subscribe`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<void>(response);
  }
}

export const api = new ApiClient();
