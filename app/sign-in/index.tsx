import { router } from "expo-router";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSession } from "@/auth/ctx";
import { useEffect, useState } from "react";
import { useProps } from "../LoadingProp/propsProvider";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

export default function SignIn() {
  const { signIn, isLoading, googleSignIn } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { triggerLoadingScreen, alert } = useProps();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    triggerLoadingScreen({ isLoading });
  }, [isLoading]);

  const signInFunc = async () => {
    if (emailRegex.test(email) && password) {
      await signIn({ email, password }).then((status) => {
        if (status === "DONE") {
          router.replace("/");
        } else if (status === "CONFIRM_SIGN_UP") {
          router.replace({
            pathname: "sign-in/verificationScreen",
            params: {
              email: email,
            },
          });
        } else {
          alert("", "Invalid email or password", "error");
        }
      });
    } else {
      alert("", "Please fill out all Inputs", "error");
    }
  };

  const gsFunction = async () => {
    await googleSignIn().then((status) => {
      if (status === "success") {
        router.replace("/");
      } else if (status === "unverified") {
        router.replace("sign-in/verificationScreen");
      } else {
        alert("", "Invalid email or password", "error");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "/path/to/MyRewardsLogo.png" }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.headerText}>Login to your account</Text>
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
      <TouchableOpacity
        onPress={() => router.push("../forgot-password/verify-email")}
      >
        <Text style={styles.forgotPassword}>Forgot password? Click here</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={signInFunc}>
        <Text style={styles.signInButtonText}>sign in</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or sign in with</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={() => gsFunction()}
        style={styles.googleButton}
      />
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("sign-in/sign-up")}>
          <Text style={styles.signUpLink}>Sign up</Text>
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
    backgroundColor: "#F8F6F1",
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6B4A",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Avenir Next",
  },
  input: {
    height: 50,
    width: "90%",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Avenir Next",
    backgroundColor: "#FFF",
  },
  forgotPassword: {
    color: "#FF6B4A",
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  signInButton: {
    backgroundColor: "#FF6B4A",
    paddingVertical: 12,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Avenir Next",
    textTransform: "lowercase", // Matches lowercase text from design
  },
  orText: {
    color: "#666",
    fontSize: 14,
    marginVertical: 15,
  },
  googleButton: {
    width: "90%",
    height: 48,
    marginBottom: 30,
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signUpText: {
    color: "#666",
    fontSize: 14,
  },
  signUpLink: {
    color: "#FF6B4A",
    fontSize: 14,
    textDecorationLine: "underline", // Underline to match design
  },
});
