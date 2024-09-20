import { router } from 'expo-router';
import { Animated, Easing, Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useSession } from '../auth/ctx';
import { useEffect, useState } from 'react';
import { userSignUp } from '@/types/auth';
import { LoadingScreen } from './loadingScreen';

export default function SignUp() {
  const { signUp, isLoading } = useSession();
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('thisIsATest');
  const [passwordDup, setPasswordDup] = useState('thisIsATest');
  const [fn, setFn] = useState('test');
  const [ln, setLn] = useState('test');
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0
  const [loadingScreen, setLoadingScreen] = useState(false)

  const userSignUp: userSignUp = {
    email, 
    password,
    firstName: fn,
    lastName: ln,
  };

  const signUpFunc = async () => {
    signUp(userSignUp).then((success)=>{
      if (success){
        router.replace('/');
      }
      else{
        setLoadingScreen(false);
        // error signing in
      }
    });
  }


  useEffect(() => {
    if (isLoading) {
      setLoadingScreen(true)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } 
  }, [isLoading]);

  return (
    <View style={styles.container}>
      {loadingScreen && (
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <LoadingScreen />
        </Animated.View>
      )}
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
          <TouchableOpacity style={styles.button} onPress={signUpFunc}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.back() }}>
            <Text>Back</Text>
          </TouchableOpacity>
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