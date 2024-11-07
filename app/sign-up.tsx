import { router } from 'expo-router';
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useSession } from '../auth/ctx';
import { useEffect, useState } from 'react';
import { userSignUp } from '@/params/auth';
import { useProps } from './LoadingProp/propsProvider';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

// Sign Up + Sign In button currently mocking signing In to not exceed amplify 50 sign up daily limit for free tier

export default function SignUp() {
  const { signUp, isLoading } = useSession();
  const { triggerLoadingScreen, alert } = useProps();
  
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('thisIsATest');
  const [passwordDup, setPasswordDup] = useState('thisIsATest');
  const [fn, setFn] = useState('test');
  const [ln, setLn] = useState('test');


  useEffect(()=>{
    triggerLoadingScreen({isLoading})
  }, [isLoading])

  const userSignUpData: userSignUp = {
    email: email, 
    password: password,
    firstName: fn,
    lastName: ln,
  };


  const signUpFunc = async () => {
    signUp(userSignUpData).then((success)=>{
       if (success){
        router.replace({
          pathname: '/verificationScreen',
          params: {
            email: userSignUpData.email,
            password: userSignUpData.password
          }
        });
       }
       else{
          alert('Invalid Email', ` ${email} is already in use`, 'error')
        }
     });
  }

  return (
    <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Password Confirmation"
            value={passwordDup}
            onChangeText={setPasswordDup}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={signUpFunc} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{ router.replace('/sign-in') }} disabled={isLoading}>
            <Text>Already have an Account? Sign In</Text>
          </TouchableOpacity>
          <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={() => {console.log('sign Up with google')}}
      />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  contentContainer:{
    flex:1, 
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
});