import { Slot, Stack} from 'expo-router';
import { SessionProvider } from '../auth/ctx';
import React from 'react';

export default function Root() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name={'landingScreen'}
         options={{
          headerShown:false
          }} />

        <Stack.Screen name={'sign-in'} 
        options={{
          headerShown:false
          }} />

        <Stack.Screen name={'sign-up'} 
        options={{
          headerShown:false
          }} />
        
        <Stack.Screen name={'(app)'} 
        options={{
          headerShown:false,
          animation:'none'
          }} />
      </Stack>
    </SessionProvider>
  );
}
