import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  SafeAreaView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { useSession } from '../../auth/ctx';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { LoadingScreenDefault } from '../loadingScreen';
import {AppData} from '../../app-data/appData'
import { color_pallete } from '@/constants/Colors';
import {SvgXml} from 'react-native-svg';
import React from 'react';
import { whtieStar } from '@/assets/images/MR-logos';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 
  App itself (redirect back to landingScreen from here if needed)

  Tips:
  - Default screen needs to be named index (index.tsx)
*/

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // check if iphone is new era or old era iphone
  const insets = useSafeAreaInsets();
  const hasSafeArea = (insets.bottom > 0); 

  if (isLoading) {
    return LoadingScreenDefault();
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <AppData>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: [styles.header],
          headerTitleAlign: 'left',
          headerTitleStyle: [styles.headerText],
          tabBarStyle: [hasSafeArea?styles.newEraNavbar:styles.oldEraNavbar],
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
          header: ()=>(            
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.header2}>
              <SafeAreaView />
              <Text style={[styles.headerText, { color: color_pallete[2] }]}>
                Discover
              </Text>
              <View style={styles.searchBar}>
                <TextInput
                  placeholder="Search"
                  autoCapitalize="none"
                  keyboardType="default"
                  style={styles.searchBarText}
                  placeholderTextColor={color_pallete[4]}
                />
                <TabBarIcon name={'search'} color={color_pallete[3]} />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
        name="mapPage"
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
          header: () => (
            <View style={[styles.header, {paddingBottom:5}]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Map</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="scanPage"
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
        name="plansPage"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ focused }) => (
            <SvgXml
              xml={whtieStar}
              height="100%"
              width="100%"
              color={focused?'white':color_pallete[1]}
            />
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
          header: () => (
            <View style={[styles.header2, {paddingBottom:5}]}>
              <SafeAreaView />
              <View style={styles.planHeader}>
                <SvgXml
                  xml={whtieStar}
                  height='40'
                  width="40"
                  color={color_pallete[1]}
                />
                <Text style={styles.headerText2}>My Plans</Text>
              </View>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="profilePage"
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
          header: () => (
            <View style={[styles.header, {paddingBottom:5}]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Profile</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="shopPage"
        options={{
          title: 'Profile',
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null,
          tabBarShowLabel:false,
          header: () => (
            <View style={[styles.header, {paddingBottom:5}]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Profile</Text>
            </View>
          )
        }}
      />
    </Tabs>
  </AppData>
  );
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: 'whitesmoke',
    elevation: 0,
    shadowOpacity: 0.1,
    borderBottomWidth:2,
    shadowColor:'black',
    shadowRadius:3,
    shadowOffset:{
      height:5,
      width:0
    },
    borderBottomColor:color_pallete[2],
  },
  header2:{
    backgroundColor: 'whitesmoke',
    elevation: 0,
    borderBottomWidth:2,
    borderBottomColor:color_pallete[0],
  },
  headerText:{
    fontSize: 30,
    paddingLeft:'4%', 
    fontWeight: 'bold',
    fontFamily:'Avenir Next',
    color:color_pallete[2],
  },
  headerText2:{
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily:'Avenir Next',
    color:color_pallete[2],
  },
  searchBar:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:8,
    margin:10,
    marginHorizontal:15,
    borderColor: color_pallete[3],
    borderWidth:2,
    borderRadius:10,
    gap:5,
  },
  searchBarText:{
    fontFamily:'Avenir Next',
    fontSize:15,
    display:'flex',
    flex:1,
  },
  planHeader:{
    display:'flex',
    flexDirection:'row',
    gap:5,
    paddingLeft:'4%', 

  },
  newEraNavbar:{
    position:'relative',
    backgroundColor: color_pallete[0],
    paddingTop:5,
    height:87, //88 because 85 + 3 (border)
    borderTopColor:color_pallete[1],
    borderTopWidth:2,
    zIndex:99,
  },
  oldEraNavbar:{
    position:'relative',
    backgroundColor: color_pallete[0],
    paddingTop:5,
    paddingBottom:10,
    height:77, //88 because 85 + 3 (border)
    borderTopColor:color_pallete[1],
    borderTopWidth:2,
    zIndex:99,
  }
})
