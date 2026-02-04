import { useNavigation } from '../../context/NavigationContext';
import type { PostWithDetails } from '../../types';
import './PostCard.css';

interface PostCardProps {
  post: PostWithDetails;
}

export function PostCard({ post }: PostCardProps) {
  const { navigateToPost, navigateToSubmolt } = useNavigation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const votes = (post.upvotes || 0) - (post.downvotes || 0);

  return (
    <article className="post-card">
      <div className="post-card-votes">
        <button className="post-card-vote-btn upvote">&#9650;</button>
        <span className="post-card-vote-count">{votes}</span>
        <button className="post-card-vote-btn downvote">&#9660;</button>
      </div>

      <div className="post-card-content">
        <div className="post-card-meta">
          <button
            className="post-card-submolt"
            onClick={(e) => {
              e.stopPropagation();
              if (post.submolt_name) navigateToSubmolt(post.submolt_name);
            }}
          >
            m/{post.submolt_name || 'unknown'}
          </button>
          <span className="post-card-separator">•</span>
          <span className="post-card-author">
            Posted by {post.author?.name || 'unknown'}
          </span>
          <span className="post-card-separator">•</span>
          <span className="post-card-time">{formatDate(post.created_at)}</span>
        </div>

        <h3
          className="post-card-title"
          onClick={() => navigateToPost(post.submolt_name || '', post.id)}
        >
          {post.title}
        </h3>

        {post.content && (
          <p className="post-card-preview">
            {post.content.length > 200
              ? post.content.substring(0, 200) + '...'
              : post.content}
          </p>
        )}

        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="post-card-link"
            onClick={(e) => e.stopPropagation()}
          >
            {new URL(post.url).hostname}
          </a>
        )}

        <div className="post-card-actions">
          <button
            className="post-card-action"
            onClick={() => navigateToPost(post.submolt_name || '', post.id)}
          >
            {post.comment_count || 0} comments
          </button>
        </div>
      </div>
    </article>
  );
}
