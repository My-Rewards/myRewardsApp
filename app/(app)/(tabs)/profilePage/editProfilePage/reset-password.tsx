import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useProps } from "@/app/LoadingProp/propsProvider";
import { BackButton } from "@/assets/images/MR-logos";
import { SvgXml } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { ZodError } from "zod";
import { verifyPasswordSchema } from "@/app-data/validation/validationTypes";
import { confirmResetPassword } from "aws-amplify/auth";
import { resetPasswordFn } from "@/app-data/validation/resetPasswordFn";
function ForgotPassword() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonColor, setButtonColor] = useState("#FBC19F");
  const params = useLocalSearchParams();
  const email = params.email;
  const textNotificationBox = `We sent a password reset code by email to ${email}. Enter it below to reset your password.`;
  const { alert, triggerLoadingScreen } = useProps();
  const successRoute = "profilePage/editProfilePage/password-reset-success";
  useEffect(() => {
    if (password !== "" && confirmPassword !== "" && code !== "") {
      setButtonColor("#F98B4E");
    } else {
      setButtonColor("#FBC19F");
    }
  }, [password, confirmPassword, code]);

  const handleResetPassword = async () => {
    await resetPasswordFn(
      email,
      password,
      confirmPassword,
      code,
      alert,
      successRoute,
      (isLoading: boolean) => triggerLoadingScreen({ isLoading })
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()}>
          <SvgXml xml={BackButton} fill={styles.backButton.color} />
        </Pressable>
      </View>
      <View style={styles.topTextContainer}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.text}>{textNotificationBox}</Text>
      </View>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.text}>Code</Text>
          <TextInput
            style={styles.inputBox}
            value={code}
            onChangeText={setCode}
            placeholder="Enter code"
          />
        </View>
        <View>
          <Text style={styles.text}>New Password</Text>
          <TextInput
            style={styles.inputBox}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter new password"
            secureTextEntry
          />
          {password.length < 8 && (
            <Text style={styles.passwordText}>
              *Password must contain at least 8 characters
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.text}>Confirm Password</Text>
          <TextInput
            style={styles.inputBox}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleResetPassword}
          disabled={buttonColor === "#FBC19F"}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F6F1",
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  backButtonContainer: {
    position: "absolute",
    top: 75,
    left: 20,
  },
  backButton: {
    color: "#F98B4E",
  },
  topTextContainer: {
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  title: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Avenir Next",
    color: "#F98B4E",
  },
  text: {
    fontFamily: "Avenir Next",
    color: "#7F513A",
    fontSize: 15,
    marginBottom: 5,
    padding: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#7F513A",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontFamily: "Avenir Next",
    fontSize: 15,
    color: "#7F513A",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    padding: 20,
    marginBottom: 36,
  },
  button: {
    marginTop: 100,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFBF6",
    fontFamily: "Avenir Next",
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 50,
    color: "#F98B4E",
    textAlign: "center",
    fontFamily: "Avenir Next",
    textDecorationLine: "underline",
  },
  passwordText: {
    fontFamily: "Avenir Next",
    color: "#8B4513",
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 10,
  },
});

export default ForgotPassword;
