import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { signIn, signUp, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { userSignIn, userSignUp} from '@/types/auth';

const AuthContext = createContext<{
  signIn: (profile: userSignIn) => Promise<boolean>; 
  signUp: (profile: userSignUp) => Promise<boolean>; 
  signOut: () => void;
  validSession: () => Promise<boolean>; 
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => null,
  validSession: async () => false,
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
  const [session, setSession] = useState<string|null>();
  const [fetching, setFetching] = useState(false);

  const checkUserSession = async () => {
    setFetching(true);
    try {
      const currentSession = await fetchAuthSession();
      if(currentSession.tokens?.idToken){
        setSession(currentSession.tokens?.idToken.toString());
      }else{
        setSession(null);
      }
    } catch (error) {
      setSession(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    checkUserSession(); // Run on component mount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (profile:userSignIn) => {
          setFetching(true); 

          try {
            const data = await signIn({
              username:profile.email,
              password: profile.password,
              options: {
                userAttributes: {
                  email:profile.email,
                },
                autoSignIn: true
              }
            });

            await checkUserSession();
            
            setFetching(false);
            
            return data.isSignedIn;
        
          } catch (error) {
            console.log('error signing up:', error);
            setFetching(false);

            return false;

          }
        },

        signUp: async (profile:userSignUp) => {
            try {
            // Simulate an async sign-in process (e.g., API call)
            const data = await signUp({
              username:profile.email,
              password: profile.password,
              options: {
                userAttributes: {
                  email:profile.email,
                },
              }
            });

            console.log(data)

            if(!data.userId) return false;

            // Creating User Data

            return true;
          } catch (error) {

            console.error('Sign-in failed:', error);
            return false;

          }
        },
        validSession:async () =>{
          checkUserSession();
          return session !== null;
        },
        signOut: () => {
          signOut();
          setSession(null);
        },
        session,
        isLoading: fetching
      }}>
      {children}
    </AuthContext.Provider>
  );
}