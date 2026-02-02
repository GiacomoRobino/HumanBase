import { useState, useEffect } from 'react';
import type { Submolt } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function useSubmolts() {
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!isConnected) {
      setSubmolts([]);
      return;
    }

    const fetchSubmolts = async () => {
      setIsLoading(true);
      try {
        const response = await api.getSubmolts();
        // Handle both array and object responses
        const data = Array.isArray(response) ? response : (response as { submolts?: Submolt[] }).submolts ?? [];
        setSubmolts(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch communities';
        showNotification('error', message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmolts();
  }, [isConnected, showNotification]);

  return { submolts, isLoading };
}
