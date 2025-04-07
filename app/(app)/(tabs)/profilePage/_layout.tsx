import { Redirect, Stack, Tabs } from "expo-router";
import React from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { color_pallete } from "@/constants/Colors";

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Profile</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="editProfilePage"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: true,
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Forgot Password</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="privacy-policy"
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
        name="legal"
        options={{
          headerShown: true,
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Legal</Text>
            </View>
          ),
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
