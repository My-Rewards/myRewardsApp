import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

function ForgotPassword() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const textNotificationBox = `We sent a password reset code by email to test*****@ufl.com. Enter it below to reset your password.`

  useEffect(() => {
  }, [code, password, confirmPassword]);

  const handleResetPassword = () => {
    // if(password == confirmPassword){
    //     console.log("Passwords match");
    // }
    router.push('/password-reset-success');
  };

  return (
    <View style={styles.container}>
    <SafeAreaView/>
      <Text style={styles.title}>Reset password</Text>
      <View style={styles.formContainer}>
      <Text style={styles.text}>{textNotificationBox}</Text>
      <View style={styles.inputBoxContainer}>
        <Text style={styles.text}>Code</Text>
        <TextInput
            style={styles.inputBox}
            value={code}
            onChangeText={setCode}
            placeholder="Enter code"
        />
        <Text style={styles.text}>New Password</Text>
        <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter new password"
            secureTextEntry
        />
        <Text style={styles.text}>Confirm Password</Text>
        <TextInput
            style={styles.inputBox}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <Link href="/sign-in" style={styles.link}>Return to sign in</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F6F1', 
        height: '100%',
    },
    formContainer: {
        padding: 30,
    },
    inputBoxContainer: {
        marginTop: 20,
    },
    title: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Avenir Next',
        color: '#F98B4E',
    },
    text: {
        fontFamily: 'Avenir Next',
        color: '#7F513A',
        fontSize: 15,
        marginBottom: 5,
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#7F513A',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        fontFamily: 'Avenir Next',
        fontSize: 15,
        color: '#7F513A'
    },
    button: {
        marginTop: 50,
        backgroundColor: '#F35E43',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFBF6',
        fontFamily: 'Avenir Next',
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 130,
        color: '#F98B4E',
        textAlign: 'center',
        fontFamily: 'Avenir Next',
        textDecorationLine: 'underline',
    },
});

export default ForgotPassword;