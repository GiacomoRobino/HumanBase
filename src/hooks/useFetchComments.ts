import { useState, useEffect, useCallback } from 'react';
import type { Comment, CommentsResponse } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useFetchComments(postId?: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchComments = useCallback(async (id?: string): Promise<CommentsResponse | null> => {
    const targetId = id || postId;
    if (!targetId) return null;

    setIsLoading(true);
    try {
      const data = await api.getComments(targetId);
      const commentsList = data.comments ?? [];
      setComments(commentsList);
      setPostTitle(data.post_title ?? '');
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch comments';
      showNotification('error', message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [postId, showNotification]);

  const clearComments = () => {
    setComments([]);
    setPostTitle('');
  };

  const refetch = useCallback(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId, fetchComments]);

  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
  }, [postId, fetchComments]);

  return { comments, postTitle, fetchComments, clearComments, isLoading, refetch };
}
