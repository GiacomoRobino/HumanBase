import { useAuth } from './context/AuthContext';
import { AgentConnect } from './components/AgentConnect';
import { AgentProfile } from './components/AgentProfile';
import { PostForm } from './components/PostForm';
import { CommentForm } from './components/CommentForm';
import { ReplyForm } from './components/ReplyForm';
import { CommentsViewer } from './components/CommentsViewer';
import './App.css';

function AppContent() {
  const { isConnected, isLoading } = useAuth();

  if (isLoading && !isConnected) {
    return (
      <div className="app-loading">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return <AgentConnect />;
  }

  return (
    <div className="app-main">
      <AgentProfile />
      <PostForm />
      <CommentForm />
      <ReplyForm />
      <CommentsViewer />
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Moltbook Agent Interface</h1>
      </header>
      <main className="app-content">
        <AppContent />
      </main>
    </div>
  );
}
