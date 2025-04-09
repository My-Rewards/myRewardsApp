import { BackButton } from "@/assets/images/MR-logos";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useProps } from "../LoadingProp/propsProvider";
import { localData } from "@/app-data/appData";
import { verifyEmailFn } from "@/app-data/validation/verifyEmailFn";
const reset_message =
  "To reset your password enter the email associated with your account below:";

export default function verifyEmail() {
  const [email, setEmail] = useState("");
  const [buttonColor, setButtonColor] = useState("#FBC19F");
  const { alert } = useProps();
  const {profile} = localData();
  useEffect(() => {
    if (email !== "") {
      setButtonColor("#F98B4E");
    } else {
      setButtonColor("#FBC19F");
    }
  }, [email]);

  const verifyEmail = async () => {
   await verifyEmailFn(email, alert, "forgot-password/forgot-password", profile ?? null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Text style={styles.title}>Verify your email</Text>
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()}>
          <SvgXml xml={BackButton} fill={styles.backButton.color} />
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text}>{reset_message}</Text>
        <TextInput
          placeholder="Enter email"
          style={styles.inputBox}
          onChangeText={setEmail}
          autoCapitalize="none"
        ></TextInput>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          disabled={buttonColor === "#FBC19F"}
          onPress={verifyEmail}
        >
          <Text style={styles.buttonText}>Verify email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
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
    marginTop: 5,
    borderRadius: 10,
    fontFamily: "Avenir Next",
    fontSize: 15,
    color: "#7F513A",
  },
  button: {
    marginTop: 50,
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
});
