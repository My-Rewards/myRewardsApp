import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions, Image, ScrollView, ActivityIndicator, PanResponder} from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Plan, shop, ShopHour, shopPreview } from '@/app-data/data-types';
import { mockPlan, mockShop } from '@/APIs/api';
import ParallaxScrollView from './ParallaxScrollView';
import { localData } from '@/app-data/appData';
import {modalStyle, styles} from './mapPreviewStyle'
import { color_pallete } from '@/constants/Colors';
import {roadMap} from '@/components/planTemplate' 

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
  const distance = calculateDistance(selectedPin.latitude, selectedPin.longitude)

  return (
    <View style={{height:'100%', width:width-30, alignSelf:'center', marginHorizontal:10}}>
      <View style={[styles.modalContent,]}>
        <View style={[styles.titleContainer, {marginBottom:5}]}>
          <View style={styles.logo2}>
            <Image style={{flex:1}} source={{uri: selectedPin.logo}}/>
          </View>
          <Text style={styles.text1}>{selectedPin.name}</Text>
        </View>
        <View style={styles.subHeader2}>
          <Text style={[styles.modalTitle1]}>{selectedPin.location.city}, {selectedPin.location.state}</Text>
          <View style={styles.subHeader1}>
            <View>
              <Text style={[styles.subText]}>{distance} miles away</Text>
            </View>
            <View>
              <Text style={styles.subText}>{getShopStatus(selectedPin.shop_hours)}</Text>
            </View>
          </View>
          <View style={styles.descContainer}>
            <Text style={styles.text2}>{selectedPin.description}</Text>
          </View>
        </View>
      </View>
    </View>
);
}

export const ExpandedShop = ({ selectedPin, setExpansion, isExpanded }: PrewviewShopProps) => {
  const { profile } = localData();

  const [shopDetails, setShopDetails] = useState<shop | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [liked, setLiked] = useState<boolean>(false)

  const [loading, setLoading] = useState(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const underlinePosition = useRef(new Animated.Value(10)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentScreen = useRef(0);

  const distance = calculateDistance(selectedPin.latitude, selectedPin.longitude)
  const { width: screenWidth } = Dimensions.get('window');
  
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (isExpanded && profile) {
        setLoading(true);
        try {
          const shopData = await mockShop(selectedPin.id, profile.id);
          setShopDetails(shopData);
          setLiked(shopData.liked)
          const planData = await mockPlan(profile.id, shopData.id)
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
            <View style={{width, flexDirection:'column'}}>
              {roadMap(plan)}
            </View>
            <View style={{width}}>
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
                    <Text style={modalStyle.modalTitle1}>{selectedPin.location.city}, {selectedPin.location.state}</Text>
                    <View style={modalStyle.subHeader}>
                      <View>
                        <Text style={[modalStyle.subText]}>{distance} miles away</Text>
                      </View>
                      <View>
                        <Text style={modalStyle.subText}>{getShopStatus(selectedPin.shop_hours)}</Text>
                      </View>
                    </View>
                    <View style={modalStyle.descContainer}>
                      <Text style={modalStyle.text1}>{selectedPin.description}</Text>
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
                <View>
                  <View style={styles.subHeader}>
                    <View style={styles.titleContainer}>
                      <View style={styles.logo}>
                        <Image style={{flex:1}} source={{uri: selectedPin.logo}}/>
                      </View>
                      <Text style={styles.text1}>{selectedPin.name}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{setLiked(!liked)}}>
                      <TabBarIcon color={color_pallete[2]} name={liked?'heart':'heart-outline'} />
                    </TouchableOpacity>
                  </View>
                  { planSection() }
                </View>
              </View>
            </ParallaxScrollView>
          )}
        </View>
      </View>
      </Modal>
    </View>
  );
};