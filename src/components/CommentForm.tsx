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
  const [content, setContent] = useState('');
  const { createComment, isSubmitting } = useCreateComment();

  const postId = extractPostId(postUrl);
  const isValidUrl = postUrl.trim() === '' || postId !== null;
  const isValid = postId && content.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || !postId) return;

    const result = await createComment(postId, content.trim());

    if (result) {
      setPostUrl('');
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
        required
      />

      {postUrl && !isValidUrl && (
        <p className="comment-form-error">Invalid Moltbook post URL</p>
      )}

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
