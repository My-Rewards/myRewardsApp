import { useSession } from "@/auth/ctx";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, AppState, AppStateStatus, StyleSheet, TouchableOpacity, SafeAreaView} from "react-native"
import { userSignIn } from '@/params/auth';
import { useProps } from "./LoadingProp/propsProvider";
import Svg, { Path, G, ClipPath, Rect } from "react-native-svg";

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
        // send verification email
        console.log('sending verification')
    }
    
    return(
    <View style={styles.page}>
        <SafeAreaView/>
            <Svg width="100%" height="10%" viewBox="0 0 109 86" fill="none">
                <G clipPath="url(#clip0_167_224)">
                    <Path d="M91.7978 86H13.1566C5.90167 86 0 80.128 0 72.9095V16.8073C0 9.58883 5.90167 3.7168 13.1566 3.7168H67.6625C69.7393 3.7168 71.4215 5.39051 71.4215 7.45694C71.4215 9.52337 69.7393 11.1971 67.6625 11.1971H13.1566C10.0483 11.1971 7.51805 13.7147 7.51805 16.8073V72.9095C7.51805 76.0021 10.0483 78.5197 13.1566 78.5197H91.7978C94.906 78.5197 97.4363 76.0021 97.4363 72.9095V40.8845C97.4363 38.8181 99.1185 37.1444 101.195 37.1444C103.272 37.1444 104.954 38.8181 104.954 40.8845V72.9095C104.954 80.128 99.0527 86 91.7978 86Z" fill="#F35E43" />
                    <Path d="M52.6263 52.3386C51.8111 52.3386 50.9958 52.0768 50.3192 51.5508L16.488 25.3698C14.8481 24.1029 14.5544 21.7512 15.8278 20.1219C17.1035 18.4926 19.4646 18.1981 21.1022 19.4651L52.6592 43.8859L70.7988 30.2624C72.4552 29.0188 74.8139 29.3461 76.0638 30.9941C77.3137 32.6421 76.9848 34.989 75.3285 36.2326L54.8888 51.5836C54.2192 52.0862 53.4204 52.3386 52.624 52.3386H52.6263Z" fill="#F35E43" />
                    <Path d="M93.9639 26.1576C100.186 26.1576 105.229 21.1393 105.229 14.9489C105.229 8.75844 100.186 3.74011 93.9639 3.74011C87.7423 3.74011 82.6986 8.75844 82.6986 14.9489C82.6986 21.1393 87.7423 26.1576 93.9639 26.1576Z" fill="#F35E43" />
                    <Path d="M93.9757 29.8978C85.6776 29.8978 78.9513 23.2053 78.9513 14.9489C78.9513 6.69253 85.6776 0 93.9757 0C102.274 0 109 6.69253 109 14.9489C108.993 23.2029 102.271 29.8908 93.9757 29.8978ZM93.9757 7.48029C89.8243 7.47328 86.4529 10.8184 86.4459 14.9489C86.4388 19.0794 89.8008 22.4339 93.9522 22.4409C98.1035 22.4479 101.475 19.1028 101.482 14.9723C101.482 14.9676 101.482 14.9653 101.482 14.9606C101.482 10.8347 98.1223 7.48731 93.9757 7.48029Z" fill="#F35E43" />
                </G>
                <ClipPath id="clip0_167_224">
                    <Rect width="109" height="86" fill="white" />
                </ClipPath>
            </Svg>
            <View style={styles.mainContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>A verification Email was sent to </Text>
                    <Text style={styles.highlight}>xxxx@gmail.com.</Text>
                    <Text style={styles.text}> You can check your inbox</Text>
                </View>
                <TouchableOpacity onPress={()=>{sendVerification()}}> 
                    <Text style={styles.highlight}>Didn't receieve a code? Send again.</Text> 
                </TouchableOpacity>
            </View>
        <SafeAreaView/>
    </View>
    )
}

function showAlert(arg0: string) {
    throw new Error("Function not implemented.");
}


const styles = StyleSheet.create({
    text:{
        color:'#7F513A',
        fontSize:17,
    },
    highlight:{
        color:'#F98B4E',
        fontSize:17
    },
    textContainer:{
        display:'flex', 
        flexWrap:'wrap', 
        flexDirection: 'row', 
        justifyContent:'center',
        alignItems: 'center',
        padding: 20
    },
    page:{
        flex: 1, 
        justifyContent:'space-evenly', 
        alignItems: 'center', 
        backgroundColor:'#FFFBF6',
        gap:20
    },
    mainContainer:{
        justifyContent:'center',
        alignItems: 'center',
        display:'flex',
        gap:15
    }
})