import {Stack} from 'expo-router';
import { SessionProvider } from '../auth/ctx';
import React, { useEffect } from 'react';
import {Amplify} from 'aws-amplify';
import {amplifyConfiguration} from './amplify-config'
import { PropsProvider } from './LoadingProp/propsProvider';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';

console.warn = () => {};
Amplify.configure(amplifyConfiguration);
ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

export default function Root() {

  return (
    <PropsProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name={'sign-in'} 
            options={{
              headerShown:false,
               animation:'none'
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
            <Stack.Screen name={'verificationScreen'} 
            options={{
              headerShown:false,
              animation:'slide_from_right'
              }} />
            <Stack.Screen name={'forgot-password'}
            options={{
              headerShown:false,
              animation:'slide_from_right'
              }} />
            <Stack.Screen name={'password-reset-success'}
            options={{
              headerShown:false,
              animation:'slide_from_right'
              }} />
              <Stack.Screen name={'verify-email'}
            options={{
              headerShown:false,
              animation:'slide_from_right'
              }} />
          </Stack>
      </SessionProvider>
    </PropsProvider>
  );
}
