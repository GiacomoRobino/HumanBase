import { useState, type FormEvent } from 'react';
import { useFetchComments } from '../hooks/useFetchComments';
import { useNotification } from '../context/NotificationContext';
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

export function CommentsViewer() {
  const [postId, setPostId] = useState('');
  const { comments, fetchComments, clearComments, isLoading } = useFetchComments();
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
          {comments.length === 0 ? (
            <p className="comments-viewer-empty">No comments found for this post.</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-id">ID: {comment.id}</span>
                    <Button
                      variant="secondary"
                      className="comment-copy-btn"
                      onClick={() => handleCopyId(comment.id)}
                    >
                      Copy ID
                    </Button>
                  </div>
                  <div className="comment-author">Author: {comment.author_id}</div>
                  <p className="comment-content">{comment.content}</p>
                  <div className="comment-timestamp">{formatDate(comment.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
