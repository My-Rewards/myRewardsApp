import { router } from 'expo-router';
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../auth/ctx';
import { userSignIn } from '@/params/auth';
import { useEffect, useState } from 'react';
import { useProps } from './LoadingProp/propsProvider';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

// Sign Up + Sign In button currently mocking signing In to not exceed amplify 50 sign up daily limit for free tier

export default function SignIn() {
  const { signIn, isLoading } = useSession();
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('thisIsATest');
  const [loadingScreen, setLoadingScreen] = useState(false);
  const { triggerLoadingScreen, alert } = useProps();

  const userSignIn: userSignIn = { email, password };

  useEffect(()=>{
    triggerLoadingScreen({isLoading})
  }, [isLoading])

  const signInFunc = async () => {
    signIn(userSignIn).then((status) => {
      if (status === 'success') {
        router.replace('/');
      } else if (status === 'unverified'){
        router.replace('/verificationScreen')
      }
        else {
        setLoadingScreen(false)
        alert('Invalid Credentials', 'Please try again', 'error')
      }
    });
  };

  return (
    <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>Sign In</Text>
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
          <TouchableOpacity style={styles.button} onPress={signInFunc}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.replace('/sign-up') }}>
            <Text>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
          <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={() => {console.log('sign in with google')}}
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
  },
});
