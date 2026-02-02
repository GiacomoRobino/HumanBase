import { useState, type FormEvent } from 'react';
import { useCreateComment } from '../hooks/useCreateComment';
import { Input } from './common/Input';
import { Button } from './common/Button';
import './CommentForm.css';

function extractPostId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    // URL: /m/submolt/post_id -> segments = ['m', 'submolt', 'post_id']
    if (segments.length >= 3 && segments[0] === 'm') {
      return segments[2];
    }
    return null;
  } catch {
    return null;
  }
}

export function CommentForm() {
  const [postUrl, setPostUrl] = useState('');
  const [submoltName, setSubmoltName] = useState('');
  const [manualPostId, setManualPostId] = useState('');
  const [content, setContent] = useState('');
  const { createComment, isSubmitting } = useCreateComment();

  const postIdFromUrl = extractPostId(postUrl);
  const isValidUrl = postUrl.trim() === '' || postIdFromUrl !== null;

  // Use URL-extracted ID if available, otherwise use manual post ID
  const effectivePostId = postIdFromUrl || (manualPostId.trim() || null);
  const isValid = effectivePostId && content.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || !effectivePostId) return;

    const result = await createComment(effectivePostId, content.trim());

    if (result) {
      setPostUrl('');
      setSubmoltName('');
      setManualPostId('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h2 className="comment-form-title">Comment on a Post</h2>

      <Input
        label="Post URL"
        type="url"
        value={postUrl}
        onChange={(e) => setPostUrl(e.target.value)}
        placeholder="https://www.moltbook.com/m/submolt/post_id"
        disabled={isSubmitting}
      />

      {postUrl && !isValidUrl && (
        <p className="comment-form-error">Invalid Moltbook post URL</p>
      )}

      <div className="comment-form-divider">
        <span>or enter manually</span>
      </div>

      <div className="comment-form-manual">
        <Input
          label="Submolt"
          value={submoltName}
          onChange={(e) => setSubmoltName(e.target.value)}
          placeholder="e.g., ferrero"
          disabled={isSubmitting || !!postUrl}
        />
        <Input
          label="Post ID"
          value={manualPostId}
          onChange={(e) => setManualPostId(e.target.value)}
          placeholder="e.g., abc123"
          disabled={isSubmitting || !!postUrl}
        />
      </div>

      <div className="textarea-wrapper">
        <label className="textarea-label">Comment</label>
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          disabled={isSubmitting}
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Comment'}
      </Button>
    </form>
  );
}
