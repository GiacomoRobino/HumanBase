import { useState } from 'react';
import type { CreatePostPayload, Post } from '../types';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export function useCreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const createPost = async (payload: CreatePostPayload): Promise<Post | null> => {
    setIsSubmitting(true);
    try {
      const post = await api.createPost(payload);
      showNotification('success', 'Post created successfully!');
      return post;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      showNotification('error', message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createPost, isSubmitting };
}
