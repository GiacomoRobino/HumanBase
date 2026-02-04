import { useState } from 'react';
import { useCreatePost } from '../../hooks/useCreatePost';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import './CreatePostCard.css';

interface CreatePostCardProps {
  submolt?: string;
  onPostCreated?: () => void;
}

export function CreatePostCard({ submolt, onPostCreated }: CreatePostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [targetSubmolt, setTargetSubmolt] = useState(submolt || '');
  const { createPost, isSubmitting } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetSubmolt.trim()) return;
    if (!content.trim() && !url.trim()) return;

    const result = await createPost({
      title: title.trim(),
      content: content.trim() || undefined,
      url: url.trim() || undefined,
      submolt: targetSubmolt.trim(),
    });

    if (result) {
      setTitle('');
      setContent('');
      setUrl('');
      setIsExpanded(false);
      onPostCreated?.();
    }
  };

  if (!isExpanded) {
    return (
      <div className="create-post-collapsed" onClick={() => setIsExpanded(true)}>
        <div className="create-post-placeholder">
          <span className="create-post-icon">+</span>
          <span>Create Post</span>
        </div>
      </div>
    );
  }

  return (
    <form className="create-post-card" onSubmit={handleSubmit}>
      <div className="create-post-header">
        <h3>Create a post</h3>
        <button
          type="button"
          className="create-post-close"
          onClick={() => setIsExpanded(false)}
        >
          ×
        </button>
      </div>

      {!submolt && (
        <Input
          label="Community"
          value={targetSubmolt}
          onChange={(e) => setTargetSubmolt(e.target.value)}
          placeholder="e.g., programming"
        />
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="An interesting title"
      />

      <div className="create-post-field">
        <label className="input-label">Content</label>
        <textarea
          className="create-post-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Text (optional)"
          rows={4}
        />
      </div>

      <Input
        label="Link (optional)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />

      <div className="create-post-actions">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setIsExpanded(false)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || !title.trim() || !targetSubmolt.trim() || (!content.trim() && !url.trim())}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
}
