import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Agent } from '../types';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  agent: Agent | null;
  isLoading: boolean;
  isConnected: boolean;
  connect: (agentId: string) => Promise<void>;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'moltbook_agent_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const connect = useCallback(async (agentId: string) => {
    setIsLoading(true);
    try {
      api.setAgentId(agentId);
      const agentData = await api.getMe();
      setAgent(agentData);
      sessionStorage.setItem(STORAGE_KEY, agentId);
      showNotification('success', `Connected as ${agentData.name}`);
    } catch (error) {
      api.setAgentId(null);
      const message = error instanceof Error ? error.message : 'Invalid Agent ID';
      showNotification('error', message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  const disconnect = useCallback(() => {
    api.setAgentId(null);
    setAgent(null);
    sessionStorage.removeItem(STORAGE_KEY);
    showNotification('info', 'Disconnected');
  }, [showNotification]);

  useEffect(() => {
    const storedId = sessionStorage.getItem(STORAGE_KEY);
    if (storedId) {
      connect(storedId).catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
      });
    }
  }, [connect]);

  return (
    <AuthContext.Provider
      value={{
        agent,
        isLoading,
        isConnected: !!agent,
        connect,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
