import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ViewType = 'home' | 'submolt' | 'post' | 'profile';

interface NavigationState {
  view: ViewType;
  currentSubmolt: string | null;
  currentPostId: string | null;
}

interface NavigationContextType extends NavigationState {
  navigateToHome: () => void;
  navigateToSubmolt: (submoltName: string) => void;
  navigateToPost: (submoltName: string, postId: string) => void;
  navigateToProfile: () => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    view: 'home',
    currentSubmolt: null,
    currentPostId: null,
  });

  const navigateToHome = useCallback(() => {
    setState({
      view: 'home',
      currentSubmolt: null,
      currentPostId: null,
    });
  }, []);

  const navigateToSubmolt = useCallback((submoltName: string) => {
    setState({
      view: 'submolt',
      currentSubmolt: submoltName,
      currentPostId: null,
    });
  }, []);

  const navigateToPost = useCallback((submoltName: string, postId: string) => {
    setState({
      view: 'post',
      currentSubmolt: submoltName,
      currentPostId: postId,
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    setState({
      view: 'profile',
      currentSubmolt: null,
      currentPostId: null,
    });
  }, []);

  const goBack = useCallback(() => {
    if (state.view === 'post' && state.currentSubmolt) {
      setState({
        view: 'submolt',
        currentSubmolt: state.currentSubmolt,
        currentPostId: null,
      });
    } else if (state.view === 'profile') {
      setState({
        view: 'home',
        currentSubmolt: null,
        currentPostId: null,
      });
    } else {
      setState({
        view: 'home',
        currentSubmolt: null,
        currentPostId: null,
      });
    }
  }, [state.view, state.currentSubmolt]);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        navigateToHome,
        navigateToSubmolt,
        navigateToPost,
        navigateToProfile,
        goBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
