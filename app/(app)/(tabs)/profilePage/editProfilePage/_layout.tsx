import { Stack } from "expo-router";
import React from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { color_pallete } from "@/constants/Colors";

export default function EditProfileStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Edit Profile</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="confirm-email"
        options={{
          headerShown: true,
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Privacy Policy</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="password-reset-success"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: color_pallete[10],
    elevation: 0,
    shadowOpacity: 0.1,
    borderBottomWidth: 2,
    shadowColor: "black",
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    borderBottomColor: color_pallete[2],
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Avenir Next",
    color: color_pallete[2],
    marginLeft: "5%",
  },
});
