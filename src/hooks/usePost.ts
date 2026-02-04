import { useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import type { PostWithDetails } from '../types';

export function usePost(postId: string | null) {
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchPost = useCallback(async () => {
    if (!postId) {
      setPost(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.getPost(postId);
      setPost(response.post);
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to fetch post'
      );
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [postId, showNotification]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, isLoading, refetch: fetchPost };
}
