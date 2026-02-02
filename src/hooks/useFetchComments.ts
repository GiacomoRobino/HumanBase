import { useState } from 'react';
import type { Comment } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useFetchComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchComments = async (postId: string): Promise<Comment[] | null> => {
    setIsLoading(true);
    try {
      const data = await api.getComments(postId);
      const commentsList = Array.isArray(data) ? data : [];
      setComments(commentsList);
      return commentsList;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch comments';
      showNotification('error', message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearComments = () => {
    setComments([]);
  };

  return { comments, fetchComments, clearComments, isLoading };
}
