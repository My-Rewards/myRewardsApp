import {Stack} from 'expo-router';
import { SessionProvider } from '../auth/ctx';
import React from 'react';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';

export default function Root() {

  Amplify.configure(amplifyconfig);

  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name={'landingScreen'}
         options={{
          headerShown:false,
          animation:'fade'
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
          animation:'fade'
          }} />
      </Stack>
    </SessionProvider>
  );
}
