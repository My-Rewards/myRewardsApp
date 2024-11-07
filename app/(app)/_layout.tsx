import { useColorScheme, View } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useSession } from '../../auth/ctx';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { LoadingScreenDefault } from '../loadingScreen';

/* 
  App itself (redirect back to landingScreen from here if needed)

  Tips:
  - Default screen needs to be named index (index.tsx)
*/

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return LoadingScreenDefault()
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
  <Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
  }}>
    <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="page2"
        options={{
          title: 'Home',
          headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          title: undefined,
          headerShown: false, 
          tabBarLabel: "", 
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: 'blue', borderRadius: 100, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', marginBottom:-5 }}>
              <TabBarIcon name={focused ? 'add' : 'add-outline'} color={'white'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="page4"
        options={{
          title: 'Rewards',
          headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="page5"
        options={{
          title: 'Profile',
          headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
  </Tabs>
  );
}
