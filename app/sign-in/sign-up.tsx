import { router } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSession } from "@/auth/ctx";
import { useEffect, useState } from "react";
import { useProps } from "../LoadingProp/propsProvider";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { signUpSchema } from "@/constants/validationTypes";
import { ZodError } from "zod";
export default function SignUp() {
  const { signUp, isLoading, googleSignIn } = useSession();
  const { triggerLoadingScreen, alert } = useProps();
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const userSignUpData = {
    email,
    password,
    birthdate: "",
    fullName: {
      firstName: firstName,
      lastName: lastName,
    },
  };

  useEffect(() => {
    triggerLoadingScreen({ isLoading });
  }, [isLoading]);

  const validateInputs = () => {
    if (!email || !password || !firstName || !lastName) {
      alert("", "Please fill out all inputs", "error");
      return false;
    }
    try {
      signUpSchema.parse({
        email,
        password,
        fullname: {
          firstName,
          lastName,
        },
      });

      if (!isChecked) {
        alert("", "Please agree to the terms and services", "error");
        return false;
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const message = error.errors[0].message;
        alert("", message, "error");
        return false;
      }
    }
  };

  const handleSignUp = async () => {
    const isValidated = validateInputs();
    if (isValidated) {
      await signUp(userSignUpData).then((success) => {
        if (success) {
          router.replace({
            pathname: "sign-in/verificationScreen",
            params: {
              email: userSignUpData.email,
            },
          });
        } else {
          alert("", "Email is already in use. Try logging in instead", "error");
        }
      });
    }
  };

  const gsFunction = async () => {
    await googleSignIn().then((status) => {
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
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.lastInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {password.length < 8 && (
          <Text style={styles.passwordText}>
            *Password must contain at least 8 characters
          </Text>
        )}
        {/* {!/[A-Z]/.test(password) && (
          <Text style={styles.passwordText}>
            *Password must contain at least one uppercase letter
          </Text>
        )}
        {!/[0-9]/.test(password) && (
          <Text style={styles.passwordText}>
            *Password must contain at least one number
          </Text>
        )}
        {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
          <Text style={styles.passwordText}>
            *Password must contain at least one special character
          </Text>
        )} */}
      </View>
      <View style={styles.termsContainer}>
        <View>
          <BouncyCheckbox
            fillColor="#F35E43"
            onPress={(isChecked: boolean) => {
              setIsChecked(isChecked);
            }}
          />
        </View>
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
      <View style={styles.otherOptionContainer}>
        <Text style={styles.otherOptionText}>Or sign up with</Text>
      </View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={() => gsFunction()}
        style={styles.googleButton}
      />

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.back()}>
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
    backgroundColor: "#F8F6F1",
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
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 25,
  },
  termsText: {
    fontSize: 12,
    color: "#8B4513",
    fontFamily: "Avenir Next",
    textAlign: "left",
    alignSelf: "center",
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
    fontSize: 16,
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
  passwordText: {
    fontFamily: "Avenir Next",
    color: "#8B4513",
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 8, 
  },
  lastInput: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8C1A0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "Avenir Next",
    backgroundColor: "#FFF",
  },
  otherOptionContainer: {
    marginBottom: 10,
  },
  otherOptionText: {  
    fontFamily: "Avenir Next",
    fontSize: 12,
    color: "#8B4513",
  }
});
