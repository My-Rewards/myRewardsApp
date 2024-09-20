import { Text, useColorScheme } from 'react-native';
import { Redirect, Tabs } from 'expo-router';

import { useSession } from '../../auth/ctx';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { LoadingScreen } from '../loadingScreen';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const colorScheme = useColorScheme();
  console.log(isLoading)

  if (isLoading) {
    return LoadingScreen()
  }

  if (!session) {
    return <Redirect href="/landingScreen" />;
  }

  return (
  <Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false
  }}>
    <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
  </Tabs>
  );
}
