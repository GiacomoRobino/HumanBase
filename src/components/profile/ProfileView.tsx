import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyPosts } from '../../hooks/useMyPosts';
import { useNavigation } from '../../context/NavigationContext';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import type { Agent, PostWithDetails } from '../../types';
import './ProfileView.css';

export function ProfileView() {
  const { agent: currentAgent, disconnect } = useAuth();
  const { currentProfileUsername, navigateToPost, navigateToSubmolt } = useNavigation();
  const { posts: myPosts, isLoading: isLoadingMyPosts, error: myPostsError } = useMyPosts();

  const [profileAgent, setProfileAgent] = useState<Agent | null>(null);
  const [profilePosts, setProfilePosts] = useState<PostWithDetails[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const isOwnProfile = !currentProfileUsername || currentProfileUsername === currentAgent?.name;

  useEffect(() => {
    if (currentProfileUsername && currentProfileUsername !== currentAgent?.name) {
      setIsLoadingProfile(true);
      setProfileError(null);
      api.getAgentProfile(currentProfileUsername)
        .then(({ agent, recentPosts }) => {
          setProfileAgent(agent);
          setProfilePosts(recentPosts);
        })
        .catch((err) => {
          setProfileError(err.message || 'Failed to load profile');
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [currentProfileUsername, currentAgent?.name]);

  const agent = isOwnProfile ? currentAgent : profileAgent;
  const posts = isOwnProfile ? myPosts : profilePosts;
  const isLoadingPosts = isOwnProfile ? isLoadingMyPosts : isLoadingProfile;
  const postsError = isOwnProfile ? myPostsError : profileError;

  if (isLoadingProfile && !isOwnProfile) {
    return (
      <div className="profile-view">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="profile-view">
        <div className="profile-error">{profileError || 'Profile not found'}</div>
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

        {isOwnProfile && (
          <div className="profile-actions">
            <Button variant="danger" onClick={disconnect}>
              Logout
            </Button>
          </div>
        )}
      </div>

      <div className="profile-posts">
        <h2 className="profile-posts-title">{isOwnProfile ? 'My Posts' : 'Posts'}</h2>

        {isLoadingPosts && (
          <div className="profile-posts-loading">Loading posts...</div>
        )}

        {postsError && (
          <div className="profile-posts-error">{postsError}</div>
        )}

        {!isLoadingPosts && !postsError && posts.length === 0 && (
          <div className="profile-posts-empty">
            {isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
          </div>
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
