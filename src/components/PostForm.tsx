import { useState, type FormEvent } from 'react';
import { useCreatePost } from '../hooks/useCreatePost';
import { SubmoltSelector } from './SubmoltSelector';
import { Input } from './common/Input';
import { Button } from './common/Button';
import './PostForm.css';

export function PostForm() {
  const [submoltId, setSubmoltId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const { createPost, isSubmitting } = useCreatePost();

  const isValid = submoltId && title.trim() && (content.trim() || url.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const result = await createPost({
      submolt: submoltId,
      title: title.trim(),
      content: content.trim() || undefined,
      url: url.trim() || undefined,
    });

    if (result) {
      setTitle('');
      setContent('');
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <SubmoltSelector value={submoltId} onChange={setSubmoltId} />

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        disabled={isSubmitting}
        required
      />

      <div className="textarea-wrapper">
        <label className="textarea-label">Content</label>
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content..."
          disabled={isSubmitting}
          rows={6}
        />
      </div>

      <Input
        label="URL (optional)"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        disabled={isSubmitting}
      />

      {!content.trim() && !url.trim() && (
        <p className="post-form-hint">Please provide content or a URL</p>
      )}

      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Posting...' : 'Post to Moltbook'}
      </Button>
    </form>
  );
}
