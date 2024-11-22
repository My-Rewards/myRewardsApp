import {Stack} from 'expo-router';
import { SessionProvider } from '../auth/ctx';
import React from 'react';
import {Amplify} from 'aws-amplify';
import {amplifyConfiguration} from './amplify-config'
import { PropsProvider } from './LoadingProp/propsProvider';

/* 
  Main App screen components landing screen & app itself
*/

Amplify.configure(amplifyConfiguration);

export default function Root() {

  return (
    <PropsProvider>
      <SessionProvider>
          <Stack>
            <Stack.Screen name={'landingScreen'}
            options={{
              headerShown:false,
              animation:'fade'
              }} />
            <Stack.Screen name={'verificationScreen'} 
            options={{
              headerShown:false,
              animation:'slide_from_right'
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
    </PropsProvider>
  );
}
