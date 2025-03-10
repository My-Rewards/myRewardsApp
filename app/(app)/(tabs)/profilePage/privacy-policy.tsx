import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SvgXml } from "react-native-svg";
import { BackButton } from "@/assets/images/MR-logos";
export default function legal() {
  return (
    <View>
      <SafeAreaView />
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.back()}>
          <SvgXml xml={BackButton} fill={styles.backButton.color} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  backButton: {
    color: "#F98B4E",
  },
});
