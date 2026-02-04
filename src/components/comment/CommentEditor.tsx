import { useState } from 'react';
import { useCreateComment } from '../../hooks/useCreateComment';
import { Button } from '../common/Button';
import './CommentEditor.css';

interface CommentEditorProps {
  postId: string;
  parentId?: string;
  onCommentCreated?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentEditor({
  postId,
  parentId,
  onCommentCreated,
  onCancel,
  placeholder = 'What are your thoughts?',
}: CommentEditorProps) {
  const [content, setContent] = useState('');
  const { createComment, isSubmitting } = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const result = await createComment(postId, {
      content: content.trim(),
      parent_id: parentId,
    });

    if (result) {
      setContent('');
      onCommentCreated?.();
    }
  };

  return (
    <form className="comment-editor" onSubmit={handleSubmit}>
      <textarea
        className="comment-editor-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="comment-editor-actions">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}
