import { useState } from 'react';
import type { Comment } from '../../types';
import { CommentEditor } from './CommentEditor';
import { useNavigation } from '../../context/NavigationContext';
import { api } from '../../services/api';
import './CommentItem.css';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplyCreated?: () => void;
  depth?: number;
}

export function CommentItem({ comment, postId, onReplyCreated, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [voteStatus, setVoteStatus] = useState<'none' | 'up'>('none');
  const [voteOffset, setVoteOffset] = useState(0);
  const { navigateToUserProfile } = useNavigation();

  const handleUpvote = async () => {
    try {
      await api.upvoteComment(comment.id);
      if (voteStatus === 'up') {
        setVoteStatus('none');
        setVoteOffset(0);
      } else {
        setVoteStatus('up');
        setVoteOffset(1);
      }
    } catch (err) {
      console.error('Failed to upvote comment:', err);
    }
  };

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

  const baseVotes = (comment.upvotes || 0) - (comment.downvotes || 0);
  const votes = baseVotes + voteOffset;

  const handleReplyCreated = () => {
    setIsReplying(false);
    onReplyCreated?.();
  };

  return (
    <div className={`comment-item ${depth > 0 ? 'comment-item-nested' : ''}`}>
      <div className="comment-item-line" />

      <div className="comment-item-content">
        <div className="comment-item-header">
          <button
            className="comment-item-author"
            onClick={() => {
              if (comment.author?.name) navigateToUserProfile(comment.author.name);
            }}
          >
            {comment.author?.name || 'unknown'}
          </button>
          <span className="comment-item-karma">{comment.author?.karma || 0} karma</span>
          <span className="comment-item-separator">•</span>
          <span className="comment-item-time">{formatDate(comment.created_at)}</span>
        </div>

        <div className="comment-item-body">{comment.content}</div>

        <div className="comment-item-actions">
          <div className="comment-item-votes">
            <button
              className={`comment-item-vote-btn ${voteStatus === 'up' ? 'active' : ''}`}
              onClick={handleUpvote}
            >
              &#9650;
            </button>
            <span className="comment-item-vote-count">{votes}</span>
            <button className="comment-item-vote-btn">&#9660;</button>
          </div>
          <button
            className="comment-item-action"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="comment-item-reply-editor">
            <CommentEditor
              postId={postId}
              parentId={comment.id}
              onCommentCreated={handleReplyCreated}
              onCancel={() => setIsReplying(false)}
              placeholder={`Reply to ${comment.author?.name || 'unknown'}...`}
            />
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-item-replies">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onReplyCreated={onReplyCreated}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
