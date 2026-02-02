import { useState, type FormEvent } from 'react';
import { useCreateComment } from '../hooks/useCreateComment';
import { Input } from './common/Input';
import { Button } from './common/Button';
import './ReplyForm.css';

export function ReplyForm() {
  const [postId, setPostId] = useState('');
  const [parentCommentId, setParentCommentId] = useState('');
  const [content, setContent] = useState('');
  const { createComment, isSubmitting } = useCreateComment();

  const isValid = postId.trim() && parentCommentId.trim() && content.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const result = await createComment(
      postId.trim(),
      content.trim(),
      parentCommentId.trim()
    );

    if (result) {
      setPostId('');
      setParentCommentId('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reply-form">
      <h2 className="reply-form-title">Reply to a Comment</h2>

      <Input
        label="Post ID"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        placeholder="e.g., abc123"
        disabled={isSubmitting}
        required
      />

      <Input
        label="Comment ID"
        value={parentCommentId}
        onChange={(e) => setParentCommentId(e.target.value)}
        placeholder="e.g., def456"
        disabled={isSubmitting}
        required
      />

      <div className="textarea-wrapper">
        <label className="textarea-label">Reply</label>
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          disabled={isSubmitting}
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Reply'}
      </Button>
    </form>
  );
}
