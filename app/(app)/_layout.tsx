import { useColorScheme, View, Text } from 'react-native';
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
  const color_pallete = ['#FBC19F', '#F35E43', '#7F513A'];

  if (isLoading) {
    return LoadingScreenDefault();
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'whitesmoke',
            elevation: 0,
            shadowOpacity: 0.1,
            borderBottomColor:color_pallete[2],
            borderBottomWidth:2,
            shadowColor:'black',
            shadowRadius:3,
            shadowOffset:{
              height:5,
              width:0
            }
          },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 30,
            paddingLeft:'4%', 
            fontWeight: 'bold',
            color: color_pallete[2],
            fontFamily:'Avenir Next'
          },
          tabBarStyle: {
            backgroundColor: color_pallete[0],
            paddingTop:5,
            height:87, //88 because 85 + 3 (border)
            borderTopColor:color_pallete[1],
            borderTopWidth:2,
          },
          tabBarItemStyle:{gap:5}
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={'menu'} color={focused?'white':color_pallete[1]} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: 'normal',
                fontSize:12,
                color:focused?'white':color_pallete[1],
                fontFamily:'Avenir Next'
              }}>
              Discover
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="page2"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={'map'} color={focused?'white':color_pallete[1]} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: 'normal',
                fontSize:12,
                color:focused?'white':color_pallete[1],
                fontFamily:'Avenir Next'
              }}>
              Map
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="page3"
        options={{
          title: undefined,
          headerShown:false,
          tabBarItemStyle:{backgroundColor:'white', borderRadius:10},
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: 'normal',
                fontSize:12,
                color:color_pallete[1],
                fontFamily:'Avenir Next'
              }}>
              Scan
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <TabBarIcon name={'barcode-outline'} size={40} color={color_pallete[1]}/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="page4"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={'book'} color={focused?'white':color_pallete[1]} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: 'normal',
                fontSize:12,
                color:focused?'white':color_pallete[1],
                fontFamily:'Avenir Next'
              }}>
              Plans
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="page5"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name={'person'} color={focused?'white':color_pallete[1]} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: 'normal',
                fontSize:12,
                color:focused?'white':color_pallete[1],
                fontFamily:'Avenir Next'
              }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
