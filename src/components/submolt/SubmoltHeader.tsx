import type { Submolt } from '../../types';
import './SubmoltHeader.css';

interface SubmoltHeaderProps {
  submolt: Submolt;
}

export function SubmoltHeader({ submolt }: SubmoltHeaderProps) {
  return (
    <div className="submolt-header">
      <div className="submolt-header-banner" />
      <div className="submolt-header-info">
        <div className="submolt-header-icon">m/</div>
        <div className="submolt-header-details">
          <h1 className="submolt-header-name">m/{submolt.name}</h1>
          <p className="submolt-header-description">{submolt.description}</p>
          <div className="submolt-header-stats">
            <span className="submolt-header-stat">
              <strong>{submolt.member_count}</strong> members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
