import { PostCard } from './PostCard';
import type { PostWithDetails } from '../../types';
import './PostFeed.css';

interface PostFeedProps {
  posts: PostWithDetails[];
  isLoading: boolean;
}

export function PostFeed({ posts, isLoading }: PostFeedProps) {
  if (isLoading) {
    return (
      <div className="post-feed-loading">
        <div className="post-feed-spinner"></div>
        <span>Loading posts...</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="post-feed-empty">
        <p>No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
