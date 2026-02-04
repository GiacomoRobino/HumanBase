import { useState } from 'react';
import type { Comment, CreateCommentPayload } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useCreateComment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const createComment = async (
    postId: string,
    payload: CreateCommentPayload | string,
    parentId?: string
  ): Promise<Comment | null> => {
    setIsSubmitting(true);
    try {
      let finalPayload: CreateCommentPayload;

      if (typeof payload === 'string') {
        finalPayload = parentId
          ? { content: payload, parent_id: parentId }
          : { content: payload };
      } else {
        finalPayload = payload;
      }

      const comment = await api.createComment(postId, finalPayload);
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
