// add eye on password field
// add checkbox

import { router } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useSession } from "@/auth/ctx";
import { useEffect, useState } from "react";
import { useProps } from "../LoadingProp/propsProvider";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import BouncyCheckbox from "react-native-bouncy-checkbox";
export default function SignUp() {
  const { signUp, isLoading, googleSignIn } = useSession();
  const { triggerLoadingScreen, alert } = useProps();
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    triggerLoadingScreen({ isLoading });
  }, [isLoading]);

  const handleSignUp = async () => {
    const userSignUpData = {
      email,
      password,
      birthdate: birthDate,
      fullName: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    if(!email || !password || !birthDate){
      alert("Error", "Please fill out all inputs", "error");
      return;
    }

    if (!isChecked) {
      alert("Error", "Please agree to the terms and services", "error");
      return;
    }

    signUp(userSignUpData).then((success) => {
      if (success) {
        router.replace({
          pathname: "/verificationScreen",
          params: {
            email: userSignUpData.email,
          },
        });
      } else {
        alert("Error", "Email is already in use", "error");
      }
    });
  };

  const gsFunction = () => {
    googleSignIn().then((status) => {
      if (status === "success") {
        router.replace("/");
      } else if (status === "unverified") {
        router.replace("/verificationScreen");
      } else {
        alert("", "Invalid email or password", "error");
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome!</Text>
        <Text style={styles.subHeaderText}>We’re happy to have you</Text>
      </View>

      <View style={styles.inputContainer}>
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
          placeholder="mm/dd/yyyy"
          value={birthDate}
          onChangeText={setBirthDate}
          keyboardType="numeric"
        />
      </View>
      <View
        style={styles.termsContainer}
      >
        <BouncyCheckbox
          fillColor="#F35E43"
          onPress={(isChecked: boolean) => {
            setIsChecked(isChecked);
          }}
        />
        <Text style={styles.termsText}>
          Click to agree to <Text style={styles.link}>terms and services</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.signUpButtonText}>create account</Text>
      </TouchableOpacity>

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={() => gsFunction()}
        style={styles.googleButton}
      />

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push("sign-in/sign-in")}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF6ED",
  },
  headerContainer: {
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 29,
    fontWeight: "700",
    color: "#F98B4E",
    fontFamily: "Avenir Next",
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#2A5D9F",
    fontFamily: "Avenir Next",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8C1A0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: "Avenir Next",
    backgroundColor: "#FFF",
  },
  termsContainer: {
    flexDirection: "row",
    width: "90%",
    marginBottom: 25,
  },
  termsText: {
    width: "85%",
    fontSize: 14,
    color: "#8B4513",
    fontFamily: "Avenir Next",
    textAlign: "left",
  },
  link: {
    color: "#F35E43",
    textDecorationLine: "underline",
  },
  signUpButton: {
    backgroundColor: "#F35E43",
    paddingVertical: 12,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Avenir Next",
  },
  googleButton: {
    width: "90%",
    height: 48,
    marginBottom: 30,
  },
  signInContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
  },
  signInText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Avenir Next",
  },
  signInLink: {
    fontSize: 14,
    color: "#F35E43",
    fontWeight: "700",
    fontFamily: "Avenir Next",
    textDecorationLine: "underline",
  },
});
