import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { signIn, signUp, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { userSignIn, userSignUp} from '@/types/auth';

// TODO: create DynamoDBClient (create only if authenticating user from unauthenticated)

/* 
  Serves to check authentication inclosing the app, each time a new screen is triggered this code is referenced and checks
  to see if the user is still autenticated.
  if not authenticated -> redirect to landing screen
  if authenticated -> return sub to retrieve user info
*/

const AuthContext = createContext<{
  signIn: (profile: userSignIn) => Promise<boolean>; 
  signUp: (profile: userSignUp) => Promise<boolean>; 
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => null,
  session: null,
  isLoading: false,
});

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
      if(currentSession.tokens?.idToken && currentSession.userSub){
        setSession(currentSession.userSub);
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
    checkUserSession(); 
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (profile:userSignIn) => {
          setFetching(true); 

          try{
            // is Authenticated
            const userSession = await fetchAuthSession();

            if(userSession && userSession.userSub){
              setFetching(false);
              return true;
            }

          }catch(error){
            setFetching(false);
          }
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

            return true;
          } catch (error) {
            return false;
          }
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