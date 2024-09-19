import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = createContext<{
  signIn: () => Promise<boolean>; // Make signIn return a promise to handle async operations
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user session info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        signIn: async () => {
          setIsSigningIn(true); // Start loading state for sign-in
          try {
            // Simulate an async sign-in process (e.g., API call)
            await new Promise((resolve) => setTimeout(resolve, 300)); // Replace with actual sign-in logic
            setSession('xxx'); // Assuming 'xxx' is a valid session token

            return true; // Indicate success
          } catch (error) {
            console.error('Sign-in failed:', error);
            return false; // Indicate failure
          } finally {
            setIsSigningIn(false); // Stop loading state after sign-in
          }
        },
        signOut: () => {
          setSession(null); // Clear the session
        },
        session,
        isLoading: isLoading || isSigningIn, // Combine both loading states
      }}>
      {children}
    </AuthContext.Provider>
  );
}