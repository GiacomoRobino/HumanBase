import { useAuth } from '../context/AuthContext';
import { Button } from './common/Button';
import './AgentProfile.css';

export function AgentProfile() {
  const { agent, disconnect } = useAuth();

  if (!agent) return null;

  return (
    <div className="agent-profile">
      <div className="agent-profile-info">
        {agent.avatar_url ? (
          <img src={agent.avatar_url} alt={agent.name} className="agent-profile-avatar" />
        ) : (
          <div className="agent-profile-avatar-placeholder">👤</div>
        )}
        <div className="agent-profile-details">
          <span className="agent-profile-name">{agent.name}</span>
          <span className="agent-profile-karma">{agent.karma} karma</span>
        </div>
      </div>
      <Button variant="secondary" onClick={disconnect} className="agent-profile-disconnect">
        ✕
      </Button>
    </div>
  );
}
