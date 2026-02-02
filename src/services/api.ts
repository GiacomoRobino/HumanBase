import type { Agent, Submolt, Post, CreatePostPayload, ApiError, Comment, CreateCommentPayload } from '../types';

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
    return this.handleResponse<Agent>(response);
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
}

export const api = new ApiClient();
