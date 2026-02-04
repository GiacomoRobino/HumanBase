import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMyPosts } from '../../hooks/useMyPosts';
import { useNavigation } from '../../context/NavigationContext';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import type { Agent, PostWithDetails, ProfileComment } from '../../types';
import './ProfileView.css';

export function ProfileView() {
  const { agent: currentAgent, disconnect } = useAuth();
  const { currentProfileUsername, navigateToPost, navigateToSubmolt } = useNavigation();
  const { posts: myPosts, isLoading: isLoadingMyPosts, error: myPostsError } = useMyPosts();

  const [profileAgent, setProfileAgent] = useState<Agent | null>(null);
  const [profilePosts, setProfilePosts] = useState<PostWithDetails[]>([]);
  const [profileComments, setProfileComments] = useState<ProfileComment[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [myComments, setMyComments] = useState<ProfileComment[]>([]);
  const [isLoadingMyComments, setIsLoadingMyComments] = useState(false);
  const [myCommentsError, setMyCommentsError] = useState<string | null>(null);

  const isOwnProfile = !currentProfileUsername || currentProfileUsername === currentAgent?.name;

  useEffect(() => {
    if (currentProfileUsername && currentProfileUsername !== currentAgent?.name) {
      setIsLoadingProfile(true);
      setProfileError(null);
      api.getAgentProfile(currentProfileUsername)
        .then(({ agent, recentPosts, recentComments }) => {
          setProfileAgent(agent);
          setProfilePosts(recentPosts);
          setProfileComments(recentComments);
        })
        .catch((err) => {
          setProfileError(err.message || 'Failed to load profile');
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [currentProfileUsername, currentAgent?.name]);

  useEffect(() => {
    if (isOwnProfile && currentAgent?.name) {
      setIsLoadingMyComments(true);
      setMyCommentsError(null);
      api.getAgentProfile(currentAgent.name)
        .then(({ recentComments }) => {
          setMyComments(recentComments);
        })
        .catch((err) => {
          setMyCommentsError(err.message || 'Failed to load comments');
        })
        .finally(() => {
          setIsLoadingMyComments(false);
        });
    }
  }, [isOwnProfile, currentAgent?.name]);

  const agent = isOwnProfile ? currentAgent : profileAgent;
  const posts = isOwnProfile ? myPosts : profilePosts;
  const isLoadingPosts = isOwnProfile ? isLoadingMyPosts : isLoadingProfile;
  const postsError = isOwnProfile ? myPostsError : profileError;

  const comments = isOwnProfile ? myComments : profileComments;
  const isLoadingComments = isOwnProfile ? isLoadingMyComments : isLoadingProfile;
  const commentsError = isOwnProfile ? myCommentsError : profileError;

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

  const getSubmoltName = (post: PostWithDetails) => {
    return post.submolt_name || (typeof post.submolt === 'object' && post.submolt?.name) || (typeof post.submolt === 'string' ? post.submolt : undefined);
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
            {posts.map((post) => {
              const submoltName = getSubmoltName(post);
              return (
              <article
                key={post.id}
                className="profile-post-item"
                onClick={() => navigateToPost(submoltName || '', post.id)}
              >
                <div className="profile-post-meta">
                  <button
                    className="profile-post-submolt"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (submoltName) navigateToSubmolt(submoltName);
                    }}
                  >
                    m/{submoltName || 'unknown'}
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
              );
            })}
          </div>
        )}
      </div>

      <div className="profile-comments">
        <h2 className="profile-comments-title">{isOwnProfile ? 'My Comments' : 'Comments'}</h2>

        {isLoadingComments && (
          <div className="profile-comments-loading">Loading comments...</div>
        )}

        {commentsError && (
          <div className="profile-comments-error">{commentsError}</div>
        )}

        {!isLoadingComments && !commentsError && comments.length === 0 && (
          <div className="profile-comments-empty">
            {isOwnProfile ? "You haven't commented yet." : "This user hasn't commented yet."}
          </div>
        )}

        {!isLoadingComments && comments.length > 0 && (
          <div className="profile-comments-list">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="profile-comment-item"
                onClick={() => navigateToPost(comment.submolt_name || '', comment.post_id)}
              >
                <div className="profile-comment-meta">
                  <span className="profile-comment-context">
                    on <span className="profile-comment-post-title">{comment.post_title}</span>
                  </span>
                  {comment.submolt_name && (
                    <>
                      <span className="profile-comment-separator">•</span>
                      <button
                        className="profile-comment-submolt"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (comment.submolt_name) navigateToSubmolt(comment.submolt_name);
                        }}
                      >
                        m/{comment.submolt_name}
                      </button>
                    </>
                  )}
                  <span className="profile-comment-separator">•</span>
                  <span className="profile-comment-date">
                    {comment.created_at ? formatDate(comment.created_at) : ''}
                  </span>
                </div>
                <p className="profile-comment-content">
                  {comment.content.length > 200
                    ? comment.content.substring(0, 200) + '...'
                    : comment.content}
                </p>
                <div className="profile-comment-stats">
                  <span>{(comment.upvotes || 0) - (comment.downvotes || 0)} points</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
