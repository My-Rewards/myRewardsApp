import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { color_pallete } from '@/constants/Colors';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions, Image, ScrollView, ActivityIndicator, PanResponder} from 'react-native';
import { PinPointProps } from '../app/(app)/mapPage';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Plan, shop, ShopHour, shopPreview } from '@/app-data/data-types';
import { transform } from '@babel/core';
import { mockPlan, mockShop } from '@/APIs/api';
import ParallaxScrollView from './ParallaxScrollView';
import { localData } from '@/app-data/appData';
import { isLoading } from 'expo-font';

const { width } = Dimensions.get('window');

type PrewviewShopProps = {
    selectedPin: shopPreview;
    isExpanded:boolean;
    setExpansion: Dispatch<SetStateAction<boolean>> | undefined;
  };
  
  type ShopPreviewProps = {
    selectedPin: shopPreview;
  };
const getShopStatus = (shop_hours:ShopHour[]) => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const now = new Date();
  const currentDay = daysOfWeek[now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const todayHours = shop_hours.find((day) => day.day === currentDay);

  if (!todayHours || todayHours.open === null || todayHours.close === null) {
    return "closed today";
  }
  else if (currentTime < todayHours.open) {
    return `opens at ${convertTo12HourFormat(todayHours.open)}`;
  }
  else if (currentTime >= todayHours.close) {
    return "closed today";
  }
  else return `open until ${convertTo12HourFormat(todayHours.close)}`;
};

const convertTo12HourFormat = (time:string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const calculateDistance = (lat: number, lon: number): string => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const { userLocation } = localData();

  if (!userLocation) return '';

  const R = 6371;
  const dLat = toRadians(userLocation.latitude - lat);
  const dLon = toRadians(userLocation.longitude - lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat)) *
      Math.cos(toRadians(userLocation.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceInKm = R * c;
  const distanceInMiles = distanceInKm * 0.621371;
  return(`${Math.round(distanceInMiles * 10) / 10}`);
}

export const ShopPreview = ({selectedPin}: ShopPreviewProps) => {

  return (
    <View style={{height:'100%', width:width-30, alignSelf:'center', marginHorizontal:10}}>
      <View style={[styles.modalContent,]}>
        <Text style={styles.header}>{selectedPin.name}</Text>
        <Text>${selectedPin.name}</Text>
      </View>
    </View>
);
}

export const ExpandedShop = ({ selectedPin, setExpansion, isExpanded }: PrewviewShopProps) => {
  const { profile } = localData();

  const [shopDetails, setShopDetails] = useState<shop | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);

  const [loading, setLoading] = useState(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const underlinePosition = useRef(new Animated.Value(10)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentScreen = useRef(0);

  const distance = calculateDistance(selectedPin.latitude, selectedPin.longitude)

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (isExpanded && profile) {
        setLoading(true);
        try {
          const shopData = await mockShop(selectedPin.id);
          setShopDetails(shopData);
          const planData = await mockPlan(profile?.id, shopData.id)
          setPlan(planData)
        } catch (error) {
          console.error('Error fetching shop details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setShopDetails(null);
      }
    };

    fetchShopDetails();
  }, [isExpanded]);

  useEffect(() => {
    const startGlow = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );
    startGlow.start();

    return () => startGlow.stop();
  }, [isExpanded]);

  const animatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['gray', 'darkgray'],
  });

  const handleToggle = (index:number) => {
    setSelectedIndex(index);
    currentScreen.current = -index;

    Animated.timing(underlinePosition, {
      toValue: (index * (width/2)) + 20,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(translateX, {
      toValue: width * currentScreen.current,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminate: (_, gestureState) =>{
      if (gestureState.dx < -width / 6 && currentScreen.current === 0) {
        currentScreen.current = -1;
      } else if (gestureState.dx > width / 6 && currentScreen.current === -1) {
        currentScreen.current = 0;
      }    
      handleToggle(-currentScreen.current);
    },
    onPanResponderMove: (_, gestureState) => {
      const nextTranslateX = width * currentScreen.current + gestureState.dx;
      const underlineTranslation = -(width/2 * currentScreen.current)+20 - gestureState.dx/2;

      if ((currentScreen.current === 0 && gestureState.dx > 0) || (currentScreen.current === -1 && gestureState.dx < 0)) {
        return;
      }
      translateX.setValue(nextTranslateX);
      underlinePosition.setValue(underlineTranslation)
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width / 4 && currentScreen.current === 0) {
        currentScreen.current = -1;
      } else if (gestureState.dx > width / 4 && currentScreen.current === -1) {
        currentScreen.current = 0;
      }
  
      handleToggle(-currentScreen.current);
    },
  });

  const planSection = () =>{
    if(plan && shopDetails && !loading){
      return(
        <View>
          <Animated.View
          style={[
            modalStyle.wrapper,
            { transform: [{ translateX }] },
          ]}
          {...panResponder.panHandlers}
        >    
            <View style={{width}}>
              <Text>{plan.id}</Text>
            </View>
            <View style={{width}}>
              <Text>{plan.reward_plan.exp_rewards.expenditure}</Text>
            </View>
          </Animated.View>
        </View>
      )
    }else{
      return(
        <View>
          <ActivityIndicator />
        </View>
      )
    }
  }


  return (
    <View style={[modalStyle.modalContainer]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isExpanded}
        onRequestClose={() => setExpansion && setExpansion(false)}
      >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={modalStyle.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>  setExpansion && setExpansion(false)}
          >
            <TabBarIcon name={'close'} color={'rgba(255,255,255,0.7)'} />
          </TouchableOpacity>
          {loading || !shopDetails ? (
            <View style={modalStyle.loadingContainer}>
              <Animated.View style={[{height:200, width:'100%'},{backgroundColor: animatedBackgroundColor }]} />
              <View style={{alignContent:'center', justifyContent:'center', flex:1}}>
                <ActivityIndicator />
              </View>
            </View>
          ) : (
            <ParallaxScrollView
            headerBackgroundColor={{ light: 'rgba(64, 124, 156, 1)', dark: 'rgba(64, 124, 156, 1)' }}
            headerImage={<Image source={{ uri: shopDetails.banner }} style={modalStyle.image} resizeMode="contain"/>}
            >
              <View>
                <View style={{backgroundColor:'rgba(64, 124, 156, 1)'}}>
                  <View style={modalStyle.titleContainer}>
                    <Text style={modalStyle.modalTitle}>{selectedPin.name}</Text>
                  </View>
                  <View>
                    <Text style={modalStyle.modalTitle1}>{shopDetails.location.city}, {shopDetails.location.state}</Text>
                    <View style={modalStyle.subHeader}>
                      <View>
                        <Text style={[modalStyle.subText]}>{distance} miles away</Text>
                      </View>
                      <View>
                        <Text style={modalStyle.subText}>{getShopStatus(shopDetails.shop_hours)}</Text>
                      </View>
                    </View>
                    <View style={modalStyle.descContainer}>
                      <Text style={modalStyle.text1}>{shopDetails.description}</Text>
                    </View>
                  </View>
                  <View style={modalStyle.toggleSection}>
                    <Animated.View style={[{height:2, width:(width/2 - 40), backgroundColor:'white', position:'absolute', bottom:0, left:underlinePosition}]}/>
                    <TouchableOpacity onPress={()=>handleToggle(0)}>
                        <Text style={[modalStyle.toggleText, selectedIndex===0?{'opacity':1}:{'opacity':0.6}]}>Loyalty Rewards</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>handleToggle(1)}>
                        <Text style={[modalStyle.toggleText, selectedIndex===1?{'opacity':1}:{'opacity':0.6}]}>Milestone Rewards</Text>
                      </TouchableOpacity>
                  </View>
                </View>
                { planSection() }
              </View>
            </ParallaxScrollView>
          )}
        </View>
      </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    mapContainer: {
      width: '100%',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    marker: {
      alignItems: 'center',
    },
    circle: {
      width: 40,
      height: 40,
      backgroundColor: color_pallete[1],
      borderRadius: 20,
      borderColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pin: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 15,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: color_pallete[1],
      marginTop: -5,
    },
    modalContent: {
      backgroundColor:'white',
      flex:1,
      paddingHorizontal: 20,
      margin:10,
      borderRadius:10,
      paddingTop:10,
      width:width-20,
      alignSelf:'center'
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 25,
      padding: 5,
      zIndex:100
    },
    header:{
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    }
});
  
const modalStyle = StyleSheet.create({
  modalContainer:{ 
    position: 'absolute', 
    width: '100%', 
    height: '100%'
  },
  container:{
    backgroundColor:'white', 
    flex:0.8,
    borderTopRightRadius:15,
    borderTopLeftRadius:15,
    overflow:'hidden',
  },
  loadingContainer:{
    display:'flex',
    flex:1,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    position:'relative',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex:99
  },
  imageContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
    textAlign:'center',
    fontFamily:'Avenir Next'
  },
  modalTitle1:{
    alignSelf:'center',
    fontFamily:'Avenir Next',
    fontWeight:'700',
    fontSize:16,
    color:'white',
    opacity:0.8
  },
  titleContainer:{
    borderRadius:10,
    borderWidth:2,
    borderColor:'white',
    display:'flex',
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal:10,
    paddingVertical:5, 
    paddingHorizontal:10,
    minWidth:'60%'
  },
  subHeader:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
    marginTop:5,
    marginBottom:20
  },
  subText:{
    fontFamily:'Avenir Next',
    color:'white',
    fontWeight:'500',
    fontSize:12,
    opacity:0.8
  },
  descContainer:{
    alignSelf:'center', 
    marginBottom:30
  },
  text1:{
    fontFamily:'Avenir Next',
    color:'white',
    fontWeight:'500',
    fontSize:13,
    opacity:1
  },
  toggleSection:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    paddingBottom:5,
    marginBottom:3
  },
  toggleText:{
    fontSize:14,
    color:'white',
    fontFamily:'Avenir Next',
    fontWeight:'500'
  },
  wrapper: {
    flexDirection: 'row',
    width: width * 2,
    backgroundColor:'transparent',
    flex:1,
    height:500
  },
});