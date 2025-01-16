import { router } from 'expo-router';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSession } from '../auth/ctx';
import { useEffect, useState } from 'react';
import { useProps } from './LoadingProp/propsProvider';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function SignUp() {
  const { signUp, isLoading } = useSession();
  const { triggerLoadingScreen, alert } = useProps();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDup, setPasswordDup] = useState('');

  useEffect(() => {
    triggerLoadingScreen({ isLoading });
  }, [isLoading]);

  const userSignUpData = {
    email: 'test@gmail.com',
    password: 'Testing@123',
    birthdate: '1990-01-01',
    fullName: {
      firstName:'John',
      lastName:'Doe'
    }
  };

  const signUpFunc = async () => {
    signUp(userSignUpData).then((success) => {
      if (success) {
        router.replace({
          pathname: '/verificationScreen',
          params: {
            email: userSignUpData.email,
          },
        });
      } else {
        alert('Invalid Email', `${email} is already in use`, 'error');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <Text style={styles.titleText}>Welcome!</Text>
        
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

        <TouchableOpacity onPress={() => { /* Navigate to forgot password */ }}>
          <Text style={styles.linkText}>Forgot password? Click here</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={signUpFunc} disabled={isLoading}>
          <Text style={styles.signInButtonText}>sign in</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or sign in with</Text>
        
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => { console.log('sign in with Google'); }}
        />

        <TouchableOpacity onPress={() => { router.back() }}>
          <Text style={styles.footerText}>Already have an account? <Text style={styles.signUpLinkText}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3ED',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 30, 
  },
  titleText: {
    fontSize: 29,
    fontWeight: '700',
    lineHeight: 39.61,
    textAlign: 'center',
    color: '#F98B4E',
    fontFamily: 'Avenir Next',
    marginBottom: 20,  
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#D8C1A0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10, // Spacing between email and password boxes
  },
  linkText: {
    color: '#F98B4E',
    textAlign: 'left', // Align text to the left
    width: '100%',
    marginTop: 5,      // Space between password input and "Forgot password?" link
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#F35E43',
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Avenir Next'
  },
  orText: {
    color: '#F98B4E',
    marginVertical: 10,
  },
  footerText: {
    color: '#F35E43',
    fontFamily: 'Avenir Next',
    marginTop: 20,
  },
  signUpLinkText: {
    color: '#F98B4E',
    fontWeight: 'bold',
  },
});