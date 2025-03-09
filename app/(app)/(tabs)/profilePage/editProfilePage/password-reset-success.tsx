import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { checkmark } from "@/assets/images/MR-logos";
import { router } from "expo-router";

function passwordResetSuccess() {
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.checkmarkContainer}>
        <SvgXml xml={checkmark} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Password reset success!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/profilePage")}
        >
          <Text style={styles.buttonText}>return to profile page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F6F1",
    padding: 30,
  },
  checkmarkContainer: {
    marginTop: 150,
  },
  textContainer: {
    marginTop: 30,
  },
  text: {
    fontFamily: "Avenir Next",
    color: "#F98B4E",
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  button: {
    marginTop: 50,
    backgroundColor: "#F35E43",
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
export default passwordResetSuccess;
