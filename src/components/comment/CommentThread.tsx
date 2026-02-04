import type { Comment } from '../../types';
import { CommentItem } from './CommentItem';
import './CommentThread.css';

interface CommentThreadProps {
  comments: Comment[];
  postId: string;
  onReplyCreated?: () => void;
}

export function CommentThread({ comments, postId, onReplyCreated }: CommentThreadProps) {
  return (
    <div className="comment-thread">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onReplyCreated={onReplyCreated}
        />
      ))}
    </div>
  );
}
