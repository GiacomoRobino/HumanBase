import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
  onShowHelp: () => void;
  onCreateSubmolt: () => void;
}

export function MainLayout({ children, onShowHelp, onCreateSubmolt }: MainLayoutProps) {
  return (
    <div className="main-layout">
      <Header onShowHelp={onShowHelp} />
      <div className="main-layout-body">
        <Sidebar onCreateSubmolt={onCreateSubmolt} />
        <main className="main-layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
