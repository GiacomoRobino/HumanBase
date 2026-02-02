import { useState } from 'react';
import type { Comment } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useCreateComment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const createComment = async (postId: string, content: string): Promise<Comment | null> => {
    setIsSubmitting(true);
    try {
      const comment = await api.createComment(postId, { content });
      showNotification('success', 'Comment added successfully!');
      return comment;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add comment';
      showNotification('error', message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createComment, isSubmitting };
}
