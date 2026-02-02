import { useState, type FormEvent } from 'react';
import { useFetchComments } from '../hooks/useFetchComments';
import { useNotification } from '../context/NotificationContext';
import type { Comment } from '../types';
import { Input } from './common/Input';
import { Button } from './common/Button';
import './CommentsViewer.css';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface CommentCardProps {
  comment: Comment;
  depth?: number;
  onCopyId: (id: string) => void;
}

function CommentCard({ comment, depth = 0, onCopyId }: CommentCardProps) {
  return (
    <div className={`comment-card ${depth > 0 ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <span className="comment-id">ID: {comment.id}</span>
        <Button
          variant="secondary"
          className="comment-copy-btn"
          onClick={() => onCopyId(comment.id)}
        >
          Copy ID
        </Button>
      </div>
      <div className="comment-author">
        Author: {comment.author.name} (karma: {comment.author.karma})
      </div>
      <p className="comment-content">{comment.content}</p>
      <div className="comment-footer">
        <span className="comment-votes">
          +{comment.upvotes} / -{comment.downvotes}
        </span>
        <span className="comment-timestamp">{formatDate(comment.created_at)}</span>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onCopyId={onCopyId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentsViewer() {
  const [postId, setPostId] = useState('');
  const { comments, postTitle, fetchComments, clearComments, isLoading } = useFetchComments();
  const { showNotification } = useNotification();
  const [hasFetched, setHasFetched] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!postId.trim()) return;

    const result = await fetchComments(postId.trim());
    if (result !== null) {
      setHasFetched(true);
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      showNotification('success', 'Comment ID copied!');
    } catch {
      showNotification('error', 'Failed to copy ID');
    }
  };

  const handleClear = () => {
    setPostId('');
    clearComments();
    setHasFetched(false);
  };

  return (
    <div className="comments-viewer">
      <h2 className="comments-viewer-title">View Post Comments</h2>

      <form onSubmit={handleSubmit} className="comments-viewer-form">
        <Input
          label="Post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
          placeholder="Enter post ID"
          disabled={isLoading}
        />
        <div className="comments-viewer-actions">
          <Button type="submit" disabled={!postId.trim() || isLoading}>
            {isLoading ? 'Loading...' : 'Load Comments'}
          </Button>
          {hasFetched && (
            <Button type="button" variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </form>

      {hasFetched && (
        <div className="comments-viewer-results">
          {postTitle && (
            <div className="comments-viewer-post-title">
              Post: {postTitle}
            </div>
          )}
          {comments.length === 0 ? (
            <p className="comments-viewer-empty">No comments found for this post.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onCopyId={handleCopyId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
