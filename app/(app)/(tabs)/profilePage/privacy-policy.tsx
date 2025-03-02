import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
function forgotPassword() {
  return (
    <View>
      <SafeAreaView />
      <Text>Privacy Policy</Text>
      <Pressable onPress={() => router.back()}>
        <Text>Go Back</Text>
      </Pressable>
    </View>
  );
}

export default forgotPassword;
