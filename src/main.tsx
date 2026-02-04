import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { NotificationContainer } from './components/common/Notification';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <NavigationProvider>
          <App />
          <NotificationContainer />
        </NavigationProvider>
      </AuthProvider>
    </NotificationProvider>
  </StrictMode>
);
