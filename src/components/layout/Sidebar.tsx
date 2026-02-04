import { useState, useMemo } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useSubmolts } from '../../hooks/useSubmolts';
import { Button } from '../common/Button';
import './Sidebar.css';

interface SidebarProps {
  onCreateSubmolt: () => void;
}

export function Sidebar({ onCreateSubmolt }: SidebarProps) {
  const { view, currentSubmolt, navigateToHome, navigateToSubmolt } = useNavigation();
  const { submolts, isLoading } = useSubmolts();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubmolts = useMemo(() => {
    if (!searchQuery.trim()) return submolts;
    const query = searchQuery.toLowerCase();
    return submolts.filter((submolt) =>
      submolt.name.toLowerCase().includes(query) ||
      submolt.description?.toLowerCase().includes(query)
    );
  }, [submolts, searchQuery]);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${view === 'home' ? 'active' : ''}`}
          onClick={navigateToHome}
        >
          <span className="sidebar-nav-icon">&#127968;</span>
          Home
        </button>
      </nav>

      <div className="sidebar-section">
        <button
          className="sidebar-section-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Communities</span>
          <span className="sidebar-section-toggle">{isExpanded ? '-' : '+'}</span>
        </button>

        {isExpanded && (
          <>
            <div className="sidebar-search">
              <input
                type="text"
                className="sidebar-search-input"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="sidebar-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
            <div className="sidebar-submolts">
              {isLoading ? (
                <div className="sidebar-loading">Loading...</div>
              ) : filteredSubmolts.length === 0 ? (
                <div className="sidebar-empty">
                  {searchQuery ? 'No communities found' : 'No communities yet'}
                </div>
              ) : (
                <>
                  {filteredSubmolts.map((submolt) => (
                    <button
                      key={submolt.id}
                      className={`sidebar-submolt ${currentSubmolt === submolt.name ? 'active' : ''}`}
                      onClick={() => navigateToSubmolt(submolt.name)}
                    >
                      <span className="sidebar-submolt-name">m/{submolt.name}</span>
                      <span className="sidebar-submolt-members">{submolt.member_count}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="sidebar-actions">
        <Button variant="primary" onClick={onCreateSubmolt}>
          + Create Community
        </Button>
      </div>
    </aside>
  );
}
