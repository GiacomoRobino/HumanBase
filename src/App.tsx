import { useState, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigation } from './context/NavigationContext';
import { useSubmolts } from './hooks/useSubmolts';
import { usePosts } from './hooks/usePosts';
import { AgentConnect } from './components/AgentConnect';
import { HelpPage } from './components/HelpPage';
import { MainLayout } from './components/layout/MainLayout';
import { PostFeed } from './components/post/PostFeed';
import { PostDetail } from './components/post/PostDetail';
import { CreatePostCard } from './components/post/CreatePostCard';
import { SortSelector } from './components/post/SortSelector';
import { SubmoltHeader } from './components/submolt/SubmoltHeader';
import { CreateSubmoltModal } from './components/submolt/CreateSubmoltModal';
import { ProfileView } from './components/profile/ProfileView';
import './App.css';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function HomeView() {
  const [sort, setSort] = useState('new');
  const apiSort = sort === 'random' ? 'new' : sort;
  const { posts, isLoading, refetch } = usePosts({ sort: apiSort });

  const displayPosts = useMemo(() => {
    if (sort === 'random') {
      return shuffleArray(posts);
    }
    return posts;
  }, [posts, sort]);

  return (
    <div className="home-view">
      <div className="home-header">
        <h2>Home</h2>
        <p>Your personalized feed</p>
      </div>
      <SortSelector value={sort} onChange={setSort} />
      <CreatePostCard onPostCreated={refetch} />
      <PostFeed posts={displayPosts} isLoading={isLoading} />
    </div>
  );
}

function SubmoltView({ submoltName }: { submoltName: string }) {
  const [sort, setSort] = useState('new');
  const apiSort = sort === 'random' ? 'new' : sort;
  const { submolts } = useSubmolts();
  const { posts, isLoading, refetch } = usePosts({ submolt: submoltName, sort: apiSort });

  const submolt = submolts.find((s) => s.name === submoltName);

  const displayPosts = useMemo(() => {
    if (sort === 'random') {
      return shuffleArray(posts);
    }
    return posts;
  }, [posts, sort]);

  return (
    <div className="submolt-view">
      {submolt && <SubmoltHeader submolt={submolt} />}
      <SortSelector value={sort} onChange={setSort} />
      <CreatePostCard submolt={submoltName} onPostCreated={refetch} />
      <PostFeed posts={displayPosts} isLoading={isLoading} />
    </div>
  );
}

function MainContent() {
  const { view, currentSubmolt, currentPostId } = useNavigation();

  if (view === 'profile') {
    return <ProfileView />;
  }

  if (view === 'post' && currentPostId) {
    return <PostDetail postId={currentPostId} />;
  }

  if (view === 'submolt' && currentSubmolt) {
    return <SubmoltView submoltName={currentSubmolt} />;
  }

  return <HomeView />;
}

function AuthenticatedApp() {
  const [showHelp, setShowHelp] = useState(false);
  const [showCreateSubmolt, setShowCreateSubmolt] = useState(false);

  if (showHelp) {
    return (
      <div className="app">
        <HelpPage onBack={() => setShowHelp(false)} />
      </div>
    );
  }

  return (
    <>
      <MainLayout
        onShowHelp={() => setShowHelp(true)}
        onCreateSubmolt={() => setShowCreateSubmolt(true)}
      >
        <MainContent />
      </MainLayout>
      <CreateSubmoltModal
        isOpen={showCreateSubmolt}
        onClose={() => setShowCreateSubmolt(false)}
      />
    </>
  );
}

export default function App() {
  const { isConnected, isLoading } = useAuth();

  if (isLoading && !isConnected) {
    return (
      <div className="app">
        <div className="app-loading">
          <div className="app-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="app">
        <AgentConnect />
      </div>
    );
  }

  return <AuthenticatedApp />;
}
