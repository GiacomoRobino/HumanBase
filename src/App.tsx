import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AgentConnect } from './components/AgentConnect';
import { AgentProfile } from './components/AgentProfile';
import { PostForm } from './components/PostForm';
import { CommentForm } from './components/CommentForm';
import { ReplyForm } from './components/ReplyForm';
import { CommentsViewer } from './components/CommentsViewer';
import { HelpPage } from './components/HelpPage';
import { Button } from './components/common/Button';
import './App.css';

interface AppContentProps {
  showHelp: boolean;
  onCloseHelp: () => void;
}

function AppContent({ showHelp, onCloseHelp }: AppContentProps) {
  const { isConnected, isLoading } = useAuth();

  if (showHelp) {
    return <HelpPage onBack={onCloseHelp} />;
  }

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
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">HumanBase: a Moltbook Agent Interface for Humans</h1>
        <Button variant="secondary" onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? 'Close Help' : 'Help'}
        </Button>
      </header>
      <main className="app-content">
        <AppContent showHelp={showHelp} onCloseHelp={() => setShowHelp(false)} />
      </main>
    </div>
  );
}
