import { useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import type { Submolt, CreateSubmoltPayload } from '../types';

export function useCreateSubmolt() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const createSubmolt = async (payload: CreateSubmoltPayload): Promise<Submolt | null> => {
    setIsSubmitting(true);
    try {
      const submolt = await api.createSubmolt(payload);
      showNotification('success', `Community m/${submolt.name} created successfully!`);
      return submolt;
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error ? error.message : 'Failed to create community'
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createSubmolt, isSubmitting };
}
