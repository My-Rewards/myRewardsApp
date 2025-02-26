import { Redirect, Stack, Tabs } from 'expo-router';
import React from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';
import { color_pallete } from '@/constants/Colors';

export default function ProfileStack() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="editProfilePage" options={{ headerShown: false }} />
    </Stack>
  );
}