import { useState } from 'react';
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
          <div className="sidebar-submolts">
            {isLoading ? (
              <div className="sidebar-loading">Loading...</div>
            ) : (
              <>
                {submolts.map((submolt) => (
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
