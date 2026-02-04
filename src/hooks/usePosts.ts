import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import type { PostWithDetails } from '../types';

interface UsePostsOptions {
  submolt?: string;
  sort?: string;
  limit?: number;
  autoFetch?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { submolt, sort = 'hot', limit = 25, autoFetch = true } = options;
  const [posts, setPosts] = useState<PostWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (submolt) {
        response = await api.getSubmoltFeed(submolt, { sort, limit });
      } else {
        response = await api.getPosts({ sort, limit });
      }
      setPosts(response.posts || []);
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to fetch posts'
      );
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [submolt, sort, limit, showNotification]);

  useEffect(() => {
    if (autoFetch) {
      fetchPosts();
    }
  }, [autoFetch, fetchPosts]);

  return { posts, isLoading, refetch: fetchPosts };
}
