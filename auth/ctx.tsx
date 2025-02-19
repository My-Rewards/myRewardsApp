import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';
import { signIn, signUp, fetchAuthSession, signOut } from 'aws-amplify/auth'
import { userSignIn, userSignUp} from '@/params/auth';

/* 
  Serves to check authentication inclosing the app, each time a new screen is triggered this code is referenced and checks
  to see if the user is still autenticated.
  if not authenticated -> redirect to landing screen
  if authenticated -> return sub to retrieve user info
*/

const AuthContext = createContext<{
  signIn: (profile: userSignIn) => Promise<string>; 
  signUp: (profile: userSignUp) => Promise<boolean>; 
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => 'error',
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

    // REMOVE THIS WHEN DONE TESTING
    setSession('testToken');
    setFetching(false);
    // 

    // UNCOMMENT THIS AFTER TESTING
    // try {
    //   const currentSession = await fetchAuthSession();
    //   if(currentSession.tokens?.idToken && currentSession.userSub){
    //     setSession(currentSession.userSub);
    //   }else{
    //     setSession(null);
    //   }
    // } catch (error) {
    //   setSession(null);
    // } finally {
    //   setFetching(false);
    // }
  };

  // useEffect(() => {
  //   checkUserSession(); 
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (profile:userSignIn) => {
          setFetching(true); 

          // REMOVE THIS AFTER TESTING
          return new Promise((resolve) => {
            setTimeout(() => {
              setFetching(false); 
              checkUserSession();

              resolve('success'); // Return true after the delay
            }, 1000);
          });
          // 
          
          try{
            // is Authenticated
            const userSession = await fetchAuthSession();

            if(userSession && userSession.userSub){
              setFetching(false);
              return 'success';
            }

          }catch(error){
            setFetching(false);
            return 'error';
          }
          try {
            const data = await signIn({
              username:profile.email,
              password: profile.password,
              options: {
                userAttributes: {
                  email:profile.email,
                  'custom:role': 'customer'
                },
                autoSignIn: true
              }
            });

            await checkUserSession();
            
            setFetching(false);

            return data.isSignedIn?'success':'error';
        
          } catch (error) {
            setFetching(false);
            return 'error';
          }
            
        },
        signUp: async (profile:userSignUp) => {
          setFetching(true); 

          // REMOVE WHEN DONE TESTING
          return new Promise((resolve) => {
            setTimeout(() => {
              setFetching(false); 
              resolve(true); // Return true after the delay
            }, 1000);
          });
          // 
          
            try {
            const data = await signUp({
              username:profile.email,
              password: profile.password,
              options: {
                userAttributes: {
                  email:profile.email,
                  'custom:role': 'customer',
                },
              }
            });
            
            setFetching(false); 
            if(!data.userId) return false; else return true;

          } catch (error) {
            console.log(error)
            setFetching(false); 
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