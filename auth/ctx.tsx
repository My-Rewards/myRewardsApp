import { useContext, useEffect, createContext, type PropsWithChildren, useState } from 'react';
import { signIn, signUp, fetchAuthSession, signOut, signInWithRedirect, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
import { userSignIn, userSignUp,} from '@/params/auth';
import 'aws-amplify/auth/enable-oauth-listener';
/* 
  Serves to check authentication inclosing the app, each time a new screen is triggered this code is referenced and checks
  to see if the user is still autenticated.
  if not authenticated -> redirect to landing screen
  if authenticated -> return sub to retrieve user info
*/
type UserAttributes = {
  given_name?: string;
  family_name?: string;
  email?: string;
  sub?: string;
  [key: string]: string | undefined;
};

type AuthContextType = {
  signIn: (profile: userSignIn) => Promise<string>;
  signUp: (profile: userSignUp) => Promise<boolean>;
  googleSignIn: () => Promise<string>;
  signOut: () => void;
  userSub: string | null;
  isLoading: boolean;
  userAttributes: UserAttributes | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => 'error',
  signUp: async () => false,
  googleSignIn: async () => 'error',
  signOut: async () => null,
  userSub: null,
  isLoading: false,
  userAttributes: null,
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


const safelyFetchUserAttributes = async (): Promise<UserAttributes | null> => {
  try {
    const attributes = await fetchUserAttributes();
    console.log("Successfully fetched user attributes:", attributes);
    return attributes as UserAttributes;
  } catch (error) {
    console.error("Error fetching user attributes:", error);
    return null;
  }
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [userSub, setUserSub] = useState<string|null>(null);
  const [fetching, setFetching] = useState(false);
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(null);


  const checkUserSession = async () => {
    setFetching(true);

    try {
      const currentSession = await fetchAuthSession();
      console.log("Session: ", currentSession);
      console.log("Credentials: ", currentSession.credentials)
      if(currentSession.tokens?.idToken && currentSession.userSub){
        setUserSub(currentSession.userSub);
        // const attributes = await safelyFetchUserAttributes();
        // setUserAttributes(attributes);
      }else{
        setUserSub(null);
        setUserAttributes(null);
      }
    } catch (error) {
      console.log("Error getting session: ", error);
      setUserSub(null);
      setUserAttributes(null);
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
          
            try {
            const data = await signUp({
              username:profile.email,
              password: profile.password,
              options: {
                userAttributes: {
                  email:profile.email,
                  birthdate:profile.birthdate,
                  given_name:profile.fullName.firstName,
                  family_name:profile.fullName.lastName,
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
        googleSignIn: async() =>{
          try{
            const currentUser = await getCurrentUser().catch(() => null);
            if (currentUser) {
              await signOut();
            }
            await signInWithRedirect({ provider: "Google", options: {preferPrivateSession: true,} });
            await checkUserSession();
            return 'success'
          }catch(error){
            console.log(error)
            return 'error'
          }
        },
        signOut: async () => {
          await signOut();
          setUserSub(null);
        },
        userSub,
        isLoading: fetching,
        userAttributes,
      }}>
      {children}
    </AuthContext.Provider>
  );
}