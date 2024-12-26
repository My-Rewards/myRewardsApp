import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../auth/ctx';
import { LoadingScreenDefault } from '../loadingScreen';
import {AppData} from '../../app-data/appData'
import React from 'react';
import NfcManager from 'react-native-nfc-manager';

NfcManager.start();

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return LoadingScreenDefault();
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }
  

  return (
    <AppData>
      <Stack
      screenOptions={{
        gestureDirection:'horizontal',
        headerShown:false
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="shopPage" options={{ headerShown: false }} />
      </Stack>
    </AppData>
  );
}

