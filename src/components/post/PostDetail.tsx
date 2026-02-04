import { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { usePost } from '../../hooks/usePost';
import { useFetchComments } from '../../hooks/useFetchComments';
import { api } from '../../services/api';
import { CommentThread } from '../comment/CommentThread';
import { CommentEditor } from '../comment/CommentEditor';
import './PostDetail.css';

interface PostDetailProps {
  postId: string;
}

export function PostDetail({ postId }: PostDetailProps) {
  const { goBack, navigateToSubmolt, navigateToUserProfile } = useNavigation();
  const { post, isLoading: isLoadingPost } = usePost(postId);
  const { comments, isLoading: isLoadingComments, refetch: refetchComments } = useFetchComments(postId);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up' | 'down'>('none');
  const [voteOffset, setVoteOffset] = useState(0);

  const handleUpvote = async () => {
    try {
      await api.upvotePost(postId);
      if (voteStatus === 'up') {
        setVoteStatus('none');
        setVoteOffset(0);
      } else {
        setVoteStatus('up');
        setVoteOffset(voteStatus === 'down' ? 2 : 1);
      }
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleDownvote = async () => {
    try {
      await api.downvotePost(postId);
      if (voteStatus === 'down') {
        setVoteStatus('none');
        setVoteOffset(0);
      } else {
        setVoteStatus('down');
        setVoteOffset(voteStatus === 'up' ? -2 : -1);
      }
    } catch (err) {
      console.error('Failed to downvote:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoadingPost) {
    return (
      <div className="post-detail-loading">
        <div className="post-detail-spinner"></div>
        <span>Loading post...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-error">
        <p>Post not found</p>
        <button onClick={goBack}>Go back</button>
      </div>
    );
  }

  const baseVotes = (post.upvotes || 0) - (post.downvotes || 0);
  const votes = baseVotes + voteOffset;

  return (
    <div className="post-detail">
      <button className="post-detail-back" onClick={goBack}>
        ← Back
      </button>

      <article className="post-detail-content">
        <div className="post-detail-votes">
          <button
            className={`post-detail-vote-btn upvote ${voteStatus === 'up' ? 'active' : ''}`}
            onClick={handleUpvote}
          >
            &#9650;
          </button>
          <span className="post-detail-vote-count">{votes}</span>
          <button
            className={`post-detail-vote-btn downvote ${voteStatus === 'down' ? 'active' : ''}`}
            onClick={handleDownvote}
          >
            &#9660;
          </button>
        </div>

        <div className="post-detail-main">
          <div className="post-detail-meta">
            <button
              className="post-detail-submolt"
              onClick={() => post.submolt_name && navigateToSubmolt(post.submolt_name)}
            >
              m/{post.submolt_name || 'unknown'}
            </button>
            <span className="post-detail-separator">•</span>
            <button
              className="post-detail-author"
              onClick={() => post.author?.name && navigateToUserProfile(post.author.name)}
            >
              Posted by {post.author?.name || 'unknown'}
            </button>
            <span className="post-detail-separator">•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          <h1 className="post-detail-title">{post.title}</h1>

          {post.content && (
            <div className="post-detail-body">{post.content}</div>
          )}

          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="post-detail-link"
            >
              {post.url}
            </a>
          )}
        </div>
      </article>

      <div className="post-detail-comments">
        <h2 className="post-detail-comments-title">
          Comments ({comments?.length || 0})
        </h2>

        <CommentEditor postId={postId} onCommentCreated={refetchComments} />

        {isLoadingComments ? (
          <div className="post-detail-loading">Loading comments...</div>
        ) : comments && comments.length > 0 ? (
          <CommentThread
            comments={comments}
            postId={postId}
            onReplyCreated={refetchComments}
          />
        ) : (
          <div className="post-detail-no-comments">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
