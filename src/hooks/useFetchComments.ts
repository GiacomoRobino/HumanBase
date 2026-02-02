import { useState } from 'react';
import type { Comment, CommentsResponse } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useFetchComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [postTitle, setPostTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchComments = async (postId: string): Promise<CommentsResponse | null> => {
    setIsLoading(true);
    try {
      const data = await api.getComments(postId);
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
  };

  const clearComments = () => {
    setComments([]);
    setPostTitle('');
  };

  return { comments, postTitle, fetchComments, clearComments, isLoading };
}
