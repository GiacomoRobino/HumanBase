import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { useSubmolts } from '../../hooks/useSubmolts';
import { api } from '../../services/api';
import { Button } from '../common/Button';
import type { Submolt } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  onCreateSubmolt: () => void;
}

export function Sidebar({ onCreateSubmolt }: SidebarProps) {
  const { view, currentSubmolt, navigateToHome, navigateToSubmolt } = useNavigation();
  const { submolts, isLoading } = useSubmolts();
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteSubmolt, setRemoteSubmolt] = useState<Submolt | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const filteredSubmolts = useMemo(() => {
    if (!searchQuery.trim()) return submolts;
    const query = searchQuery.toLowerCase();
    return submolts.filter((submolt) =>
      submolt.name.toLowerCase().includes(query) ||
      submolt.description?.toLowerCase().includes(query)
    );
  }, [submolts, searchQuery]);

  // Check if query matches any local submolt exactly
  const hasExactLocalMatch = useMemo(() => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return submolts.some((s) => s.name.toLowerCase() === query);
  }, [submolts, searchQuery]);

  // Search remote API for submolt
  const searchRemote = useCallback(async (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setRemoteSubmolt(null);
      return;
    }

    // Check if already in local list (exact match)
    const alreadyLocal = submolts.some((s) => s.name.toLowerCase() === trimmedQuery);
    if (alreadyLocal) {
      setRemoteSubmolt(null);
      return;
    }

    setIsSearching(true);
    try {
      const submolt = await api.getSubmolt(trimmedQuery);
      // Double check it's not in local list by id
      const existsLocal = submolts.some((s) => s.id === submolt.id || s.name.toLowerCase() === submolt.name.toLowerCase());
      setRemoteSubmolt(existsLocal ? null : submolt);
    } catch {
      setRemoteSubmolt(null);
    } finally {
      setIsSearching(false);
    }
  }, [submolts]);

  // Debounced remote search - always search when query changes
  useEffect(() => {
    setRemoteSubmolt(null);

    if (!searchQuery.trim()) {
      return;
    }

    const timeoutId = setTimeout(() => {
      searchRemote(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchRemote]);

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

                  {/* Remote search result */}
                  {remoteSubmolt && (
                    <div className="sidebar-remote-section">
                      <span className="sidebar-remote-label">Found on server:</span>
                      <button
                        className={`sidebar-submolt ${currentSubmolt === remoteSubmolt.name ? 'active' : ''}`}
                        onClick={() => navigateToSubmolt(remoteSubmolt.name)}
                      >
                        <span className="sidebar-submolt-name">m/{remoteSubmolt.name}</span>
                        <span className="sidebar-submolt-members">{remoteSubmolt.member_count}</span>
                      </button>
                    </div>
                  )}

                  {/* Searching indicator */}
                  {isSearching && (
                    <div className="sidebar-searching">Searching server...</div>
                  )}

                  {/* Empty state */}
                  {filteredSubmolts.length === 0 && !remoteSubmolt && !isSearching && (
                    <div className="sidebar-empty">
                      {searchQuery ? 'No communities found locally' : 'No communities yet'}
                    </div>
                  )}

                  {/* Go to community directly */}
                  {searchQuery.trim() && !remoteSubmolt && !isSearching && !hasExactLocalMatch && (
                    <button
                      className="sidebar-go-direct"
                      onClick={() => navigateToSubmolt(searchQuery.trim().toLowerCase())}
                    >
                      Go to m/{searchQuery.trim().toLowerCase()}
                    </button>
                  )}
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
