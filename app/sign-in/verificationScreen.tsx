import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Pressable,
} from "react-native";
import Svg, { Path, G, ClipPath, Rect, SvgXml } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import * as auth from "aws-amplify/auth";
import { router } from "expo-router";
import { useProps } from "../LoadingProp/propsProvider";
import { BackButton } from "@/assets/images/MR-logos";

export default function VerificationScreen() {
  const { email } = useLocalSearchParams();

  const { triggerLoadingScreen, alert } = useProps();

  const [verificationCode, setVerificationCode] = useState(Array(6).fill(null));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    countDown();
  }, []);

  useEffect(() => {
    triggerLoadingScreen({ isLoading: verifying });
  }, [verifying]);

  useEffect(() => {
    if (verificationCode.every((digit) => digit !== null)) {
      sendVerification();
    }
  }, [verificationCode]);

  const handleChange = (value: string, index: number) => {
    const code = [...verificationCode];
    code[index] = value.slice(-1);
    setVerificationCode(code);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace") {
      const updatedCode = [...verificationCode];
      if (!updatedCode[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        updatedCode[index - 1] = "";
      } else {
        updatedCode[index] = "";
      }
      setVerificationCode(updatedCode);
    }
  };

  const sendVerification = async () => {
    setVerifying(true);
    const codeString = verificationCode.join("");
    await auth
      .confirmSignUp({
        username: email.toLocaleString(),
        confirmationCode: codeString,
      })
      .then(() => {
        setVerifying(false);
        router.replace("../app/(app)/tabs.tsx");
      })
      .catch((error: Error) => {
        setVerifying(false);
        if (error.name === "ResourceNotFoundException") {
          alert("Invalid Code", "please try again or resend code", "error");
        } else {
          console.log("An error occurred:", error.name);
        }
      });
  };

  const resend = async () => {
    if (resendCooldown) return;

    setVerificationCode(Array(6).fill(null));
    try {
      console.log("Resending code to:", email);
      await auth.resendSignUpCode({
        username: Array.isArray(email) ? email[0] : email,
      });
    } catch (error) {
      console.error("Error resending code:", error);
    }
    countDown();
  };

  const countDown = () => {
    setCountdown(30);
    setResendCooldown(true);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setResendCooldown(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.page}>
      <SafeAreaView />
      <Pressable
        style={styles.backButtonContainer}
        onPress={() => router.back()}
      >
        <SvgXml xml={BackButton} fill={styles.backButton.color} />
      </Pressable>
      <Svg width="100%" height="10%" viewBox="0 0 109 86" fill="none">
        <G clipPath="url(#clip0_167_224)">
          <Path
            d="M91.7978 86H13.1566C5.90167 86 0 80.128 0 72.9095V16.8073C0 9.58883 5.90167 3.7168 13.1566 3.7168H67.6625C69.7393 3.7168 71.4215 5.39051 71.4215 7.45694C71.4215 9.52337 69.7393 11.1971 67.6625 11.1971H13.1566C10.0483 11.1971 7.51805 13.7147 7.51805 16.8073V72.9095C7.51805 76.0021 10.0483 78.5197 13.1566 78.5197H91.7978C94.906 78.5197 97.4363 76.0021 97.4363 72.9095V40.8845C97.4363 38.8181 99.1185 37.1444 101.195 37.1444C103.272 37.1444 104.954 38.8181 104.954 40.8845V72.9095C104.954 80.128 99.0527 86 91.7978 86Z"
            fill="#F35E43"
          />
          <Path
            d="M52.6263 52.3386C51.8111 52.3386 50.9958 52.0768 50.3192 51.5508L16.488 25.3698C14.8481 24.1029 14.5544 21.7512 15.8278 20.1219C17.1035 18.4926 19.4646 18.1981 21.1022 19.4651L52.6592 43.8859L70.7988 30.2624C72.4552 29.0188 74.8139 29.3461 76.0638 30.9941C77.3137 32.6421 76.9848 34.989 75.3285 36.2326L54.8888 51.5836C54.2192 52.0862 53.4204 52.3386 52.624 52.3386H52.6263Z"
            fill="#F35E43"
          />
          <Path
            d="M93.9639 26.1576C100.186 26.1576 105.229 21.1393 105.229 14.9489C105.229 8.75844 100.186 3.74011 93.9639 3.74011C87.7423 3.74011 82.6986 8.75844 82.6986 14.9489C82.6986 21.1393 87.7423 26.1576 93.9639 26.1576Z"
            fill="#F35E43"
          />
          <Path
            d="M93.9757 29.8978C85.6776 29.8978 78.9513 23.2053 78.9513 14.9489C78.9513 6.69253 85.6776 0 93.9757 0C102.274 0 109 6.69253 109 14.9489C108.993 23.2029 102.271 29.8908 93.9757 29.8978ZM93.9757 7.48029C89.8243 7.47328 86.4529 10.8184 86.4459 14.9489C86.4388 19.0794 89.8008 22.4339 93.9522 22.4409C98.1035 22.4479 101.475 19.1028 101.482 14.9723C101.482 14.9676 101.482 14.9653 101.482 14.9606C101.482 10.8347 98.1223 7.48731 93.9757 7.48029Z"
            fill="#F35E43"
          />
        </G>
        <ClipPath id="clip0_167_224">
          <Rect width="109" height="86" fill="white" />
        </ClipPath>
      </Svg>
      <View style={styles.inputContainer}>
        {verificationCode.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={({ nativeEvent }) =>
              handleBackspace(nativeEvent.key, index)
            }
          />
        ))}
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>A verification email was sent to </Text>
          <Text style={styles.highlight}>{email}.</Text>
          <Text style={styles.text}> You can check your inbox</Text>
        </View>
        <TouchableOpacity onPress={() => resend()} disabled={resendCooldown}>
          <Text style={styles.highlight}>
            {resendCooldown
              ? `Resend again in ${countdown} seconds`
              : "Didn't receive a code? Send again."}
          </Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFFBF6",
    gap: 20,
  },
  backButtonContainer: {
    position: "absolute",
    top: 75,
    left: 20,
  },
  backButton: {
    color: "#F98B4E",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  input: {
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  text: {
    color: "#7F513A",
    fontSize: 17,
  },
  highlight: {
    color: "#F98B4E",
    fontSize: 17,
  },
  textContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    gap: 15,
  },
});
