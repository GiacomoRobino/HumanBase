import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { PostWithDetails } from '../types';

export function useMyPosts() {
  const { agent } = useAuth();
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!agent?.name) {
      setPosts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getAgentProfile(agent.name);
      setPosts(response.recentPosts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [agent?.name]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, error, refetch: fetchPosts };
}
