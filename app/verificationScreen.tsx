import { useSession } from "@/auth/ctx";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, AppState, AppStateStatus, Button} from "react-native"
import { userSignIn } from '@/params/auth';
import { useProps } from "./LoadingProp/propsProvider";

export default function verificationScreen(){
    const [appState, setAppState] = useState(AppState.currentState);
    const { signIn, isLoading } = useSession();
    const { triggerLoadingScreen, alert } = useProps();

    const router = useRouter();
    const params = useLocalSearchParams();
    const { email, password } = params; 

    const emailString = Array.isArray(email) ? email[0] : email;
    const passwordString = Array.isArray(password) ? password[0] : password;

    const userSignIn: userSignIn = { email:emailString, password:passwordString };

    useEffect(()=>{
        sendVerification();
    },[])

    useEffect(()=>{
        triggerLoadingScreen({isLoading});
    },[isLoading])


    useEffect(() => {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {

        // app came to foreground
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            signIn(userSignIn).then((status) => {
                if (status === 'success') {
                router.replace('/');
                } else {
                showAlert("Authentication Failed");
                router.replace('/')
                }
            });
        }
  
        setAppState(nextAppState);
      };
  
      const subscription = AppState.addEventListener('change', handleAppStateChange);
  
      return () => {
        subscription.remove();
      };
    }, [appState]);

    function sendVerification(){
        // -- sned verification email --
    }
    
    return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
        <Text>An Email Verification was sent to xxxx@gmail.com</Text>
        <Button title="resend Verification" onPress={()=>{sendVerification()}}/>
    </View>
    )

}

function showAlert(arg0: string) {
    throw new Error("Function not implemented.");
}
