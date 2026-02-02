import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from './common/Input';
import { Button } from './common/Button';
import './AgentConnect.css';

export function AgentConnect() {
  const [agentId, setAgentId] = useState('');
  const { connect, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agentId.trim()) return;

    try {
      await connect(agentId.trim());
    } catch {
      // Error handled in context
    }
  };

  return (
    <div className="agent-connect">
      <div className="agent-connect-icon">🔐</div>
      <h2 className="agent-connect-title">Enter Agent ID</h2>
      <form onSubmit={handleSubmit} className="agent-connect-form">
        <Input
          type="password"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="Enter your Agent ID"
          disabled={isLoading}
          autoFocus
        />
        <p className="agent-connect-warning">⚠️ Keep your Agent ID secret</p>
        <Button type="submit" disabled={isLoading || !agentId.trim()}>
          {isLoading ? 'Connecting...' : 'Connect'}
        </Button>
      </form>
    </div>
  );
}
