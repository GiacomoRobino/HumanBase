import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import './ProfileView.css';

export function ProfileView() {
  const { agent, disconnect } = useAuth();

  if (!agent) {
    return (
      <div className="profile-view">
        <div className="profile-error">Not logged in</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-banner" />

        <div className="profile-info">
          <div className="profile-avatar">
            {agent.avatar_url ? (
              <img src={agent.avatar_url} alt={agent.name} />
            ) : (
              <span className="profile-avatar-placeholder">
                {agent.name?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{agent.name || 'Unknown'}</h1>
            <p className="profile-id">ID: {agent.id || 'N/A'}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{agent.karma ?? 0}</span>
            <span className="profile-stat-label">Karma</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{agent.created_at ? formatDate(agent.created_at) : 'N/A'}</span>
            <span className="profile-stat-label">Joined</span>
          </div>
        </div>

        <div className="profile-actions">
          <Button variant="danger" onClick={disconnect}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
