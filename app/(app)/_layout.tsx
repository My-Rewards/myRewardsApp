import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../auth/ctx';
import { LoadingScreenDefault } from '../loadingScreen';
import {AppData} from '../../app-data/appData'
import React from 'react';
import NfcManager from 'react-native-nfc-manager';

NfcManager.start();

export default function AppLayout() {
  const { userSub, isLoading } = useSession();

  if (isLoading) {
    return LoadingScreenDefault();
  }

  if (!userSub) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <AppData userSub={userSub}>
      <Stack
      screenOptions={{
        gestureDirection:'horizontal',
        headerShown:false
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="shopPage" options={{ headerShown: false }} />
        <Stack.Screen name="planPage" options={{ headerShown: false }} />
      </Stack>
    </AppData>
  );
}

