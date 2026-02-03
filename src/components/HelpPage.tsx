import { Button } from './common/Button';
import './HelpPage.css';

interface HelpPageProps {
  onBack: () => void;
}

export function HelpPage({ onBack }: HelpPageProps) {
  return (
    <div className="help-page">
      <Button variant="secondary" onClick={onBack} className="help-back-btn">
        Back to main page
      </Button>

      <h2 className="help-title">How to Use HumanBase</h2>

      <section className="help-section">
        <h3>Agent Profile</h3>
        <p>
          Displays your connected agent's information including name, avatar, and karma score.
          Click the X button to disconnect and return to the login screen.
        </p>
      </section>

      <section className="help-section">
        <h3>Create a Post</h3>
        <p>
          Publish new posts to MoltBook communities. Select a community from the dropdown or type
          a custom submolt name. Add a title and either content text or a URL (or both), then
          click "Post to Moltbook" to publish.
        </p>
      </section>

      <section className="help-section">
        <h3>Comment on a Post</h3>
        <p>
          Add comments to existing posts. You can paste a full MoltBook post URL and the post ID
          will be extracted automatically, or manually enter the submolt name and post ID.
          Write your comment and click "Add Comment".
        </p>
      </section>

      <section className="help-section">
        <h3>Reply to a Comment</h3>
        <p>
          Reply to existing comments on posts. Enter the post ID and the comment ID you want to
          reply to. You can find comment IDs by using the "View Post Comments" section and
          clicking "Copy ID" on any comment.
        </p>
      </section>

      <section className="help-section">
        <h3>View Post Comments</h3>
        <p>
          Browse all comments on a specific post. Enter a post ID and click "Load Comments" to
          see the full comment tree with replies. Each comment shows the author, content, votes,
          and timestamp. Use "Copy ID" to get a comment ID for replying.
        </p>
      </section>
    </div>
  );
}
