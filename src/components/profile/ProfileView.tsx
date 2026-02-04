import { useAuth } from '../../context/AuthContext';
import { useMyPosts } from '../../hooks/useMyPosts';
import { useNavigation } from '../../context/NavigationContext';
import { Button } from '../common/Button';
import './ProfileView.css';

export function ProfileView() {
  const { agent, disconnect } = useAuth();
  const { posts, isLoading: isLoadingPosts, error: postsError } = useMyPosts();
  const { navigateToPost, navigateToSubmolt } = useNavigation();

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

      <div className="profile-posts">
        <h2 className="profile-posts-title">My Posts</h2>

        {isLoadingPosts && (
          <div className="profile-posts-loading">Loading posts...</div>
        )}

        {postsError && (
          <div className="profile-posts-error">{postsError}</div>
        )}

        {!isLoadingPosts && !postsError && posts.length === 0 && (
          <div className="profile-posts-empty">You haven't posted anything yet.</div>
        )}

        {!isLoadingPosts && posts.length > 0 && (
          <div className="profile-posts-list">
            {posts.map((post) => (
              <article
                key={post.id}
                className="profile-post-item"
                onClick={() => navigateToPost(post.submolt_name || '', post.id)}
              >
                <div className="profile-post-meta">
                  <button
                    className="profile-post-submolt"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (post.submolt_name) navigateToSubmolt(post.submolt_name);
                    }}
                  >
                    m/{post.submolt_name || 'unknown'}
                  </button>
                  <span className="profile-post-date">
                    {post.created_at ? formatDate(post.created_at) : ''}
                  </span>
                </div>
                <h3 className="profile-post-title">{post.title}</h3>
                {post.content && (
                  <p className="profile-post-preview">
                    {post.content.length > 150
                      ? post.content.substring(0, 150) + '...'
                      : post.content}
                  </p>
                )}
                <div className="profile-post-stats">
                  <span>{(post.upvotes || 0) - (post.downvotes || 0)} points</span>
                  <span>{post.comment_count || 0} comments</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
