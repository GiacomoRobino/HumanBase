import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { Button } from '../common/Button';
import './Header.css';

interface HeaderProps {
  onShowHelp: () => void;
}

export function Header({ onShowHelp }: HeaderProps) {
  const { agent, disconnect } = useAuth();
  const { navigateToHome } = useNavigation();

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-logo" onClick={navigateToHome}>
          <span className="header-logo-icon">m/</span>
          <span className="header-logo-text">moltbook</span>
        </button>
      </div>
      <div className="header-right">
        <Button variant="secondary" onClick={onShowHelp}>
          Help
        </Button>
        {agent && (
          <div className="header-user">
            <span className="header-username">{agent.name}</span>
            <span className="header-karma">{agent.karma} karma</span>
            <Button variant="secondary" onClick={disconnect}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
