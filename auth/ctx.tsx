import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { signIn, signUp, fetchAuthSession, signOut, signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import { userSignIn, userSignUp,} from '@/params/auth';
import 'aws-amplify/auth/enable-oauth-listener';
/* 
  Serves to check authentication inclosing the app, each time a new screen is triggered this code is referenced and checks
  to see if the user is still autenticated.
  if not authenticated -> redirect to landing screen
  if authenticated -> return sub to retrieve user info
*/

const AuthContext = createContext<{
  signIn: (profile: userSignIn) => Promise<string>; 
  signUp: (profile: userSignUp) => Promise<boolean>; 
  googleSignIn: ()=> Promise<string>,
  signOut: () => void;
  userSub: string|null;
  isLoading: boolean;
}>({
  signIn: async () => 'error',
  signUp: async () => false,
  googleSignIn: async () => 'error',
  signOut: async () => null,
  userSub: null,
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
  const [userSub, setUserSub] = useState<string|null>(null);
  const [fetching, setFetching] = useState(false);

  const checkUserSession = async () => {
    setFetching(true);

    // REMOVE THIS WHEN DONE TESTING
    setUserSub('mockSub');
    setFetching(false);
    // 

  //   // UNCOMMENT THIS AFTER TESTING
  //   try {
  //     const currentSession = await fetchAuthSession();
  //     if(currentSession.tokens?.idToken && currentSession.userSub){
  //       setUserSub(currentSession.userSub);
  //     }else{
  //       setUserSub(null);
  //     }
  //   } catch (error) {
  //     setUserSub(null);
  //   } finally {
  //     setFetching(false);
  //   }
  };

  // useEffect(() => {
  //   checkUserSession(); 
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (profile:userSignIn) => {
          setFetching(true); 

          // // REMOVE THIS AFTER TESTING
          // return new Promise((resolve) => {
          //   setTimeout(() => {
          //     setFetching(false); 
          //     checkUserSession();

          //     resolve('success');
          //   }, 1000);
          // });
          // // 
          
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

          // // REMOVE WHEN DONE TESTING
          // return new Promise((resolve) => {
          //   setTimeout(() => {
          //     setFetching(false); 
          //     resolve(true); // Return true after the delay
          //   }, 1000);
          // });
          // // 
          
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
        isLoading: fetching
      }}>
      {children}
    </AuthContext.Provider>
  );
}