import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View, Text, TouchableOpacity, Animated, Modal, Dimensions, Image, ActivityIndicator, PanResponder, Platform} from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Plan, shop, ShopHour, shopPreview } from '@/app-data/data-types';
import { mockPlan, mockShop } from '@/APIs/api';
import ShopScrollView from './ShopScrollView';
import { localData } from '@/app-data/appData';
import {modalStyle, styles} from './styling/mapPreviewStyle'
import { color_pallete } from '@/constants/Colors';
import {ExpendatureMap, RoadMap} from '@/components/planTemplate' 
import Ionicons from '@expo/vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Linking from "expo-linking";
import * as Haptics from 'expo-haptics';
import { calculateDistance, convertTo12HourFormat, getShopStatus } from '@/constants/functions';
import { useProps } from '@/app/LoadingProp/propsProvider';

const { width } = Dimensions.get('window');

type ShopPreviewProps = {
  selectedPin: shopPreview;
};

type PrewviewShopProps = {
  selectedPin: shopPreview;
  isExpanded:boolean;
  setExpansion: Dispatch<SetStateAction<boolean>> | undefined;
  type:number
};

type OpenMapArgs = {
  lat: string | number;
  lng: string | number;
  label: string;
};

export const ShopPreview = ({selectedPin}: ShopPreviewProps) => {
  const distance = calculateDistance(selectedPin.latitude, selectedPin.longitude)
  const shopStatus = getShopStatus(selectedPin.shop_hours);

  return (
    <View style={{height:'100%', width:width-30, alignSelf:'center', marginHorizontal:10, backgroundColor:'transparent'}}>
      <View style={[styles.modalContent]}>
        <View style={styles.miniContainer}>
          <Image style={{objectFit:'contain', height:'100%', aspectRatio:1}} source={{uri: selectedPin.preview}}/>
          <View style={{flex:1, flexDirection:'column'}}>
            <View style={styles.miniHeader}>
              <Text style={styles.headerText}>{selectedPin.name}</Text>
                {
                selectedPin.liked &&
                  <View style={styles.heartButton}> 
                    <Ionicons name='heart' size={16} color={'white'}/>
                  </View>
                }
            </View>
            <View style={{padding:10, flex:1, flexDirection:'column', gap:10}}>
              <View>
                <Text style={styles.minitext}>{selectedPin.location.city}, {selectedPin.location.state}</Text>
                <Text style={styles.miniSubText}>{distance} miles away</Text>
              </View>
              <View>
                <Text style={styles.minitext2}>{shopStatus.status}</Text>
                { shopStatus.hours && shopStatus.hours.open && shopStatus.hours.close ?
                  <Text style={styles.miniSubText}>{convertTo12HourFormat(shopStatus.hours?.open)} - {convertTo12HourFormat(shopStatus.hours?.close)}</Text>:
                  null
                }
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
);
}

export const ExpandedShop = ({ selectedPin, setExpansion, isExpanded, type }: PrewviewShopProps) => {
  const { profile } = localData();

  const {alert} = useProps()

  const [shopDetails, setShopDetails] = useState<shop | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [liked, setLiked] = useState<boolean>(false)
  const [expandHours, setExpandHours] = useState<boolean>(false)

  const [loading, setLoading] = useState(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const highlightPosition = useRef(new Animated.Value(-15)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentScreen = useRef(0);

  const distance = calculateDistance(selectedPin.latitude, selectedPin.longitude)
  const shopStatus = getShopStatus(selectedPin.shop_hours);
  
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

    Animated.timing(highlightPosition, {
      toValue: (index * (width/2)-15),
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
      const underlineTranslation = -(width/2 * currentScreen.current)-15 - gestureState.dx/2;

      if ((currentScreen.current === 0 && gestureState.dx > 0) || (currentScreen.current === -1 && gestureState.dx < 0)) {
        return;
      }
      translateX.setValue(nextTranslateX);
      highlightPosition.setValue(underlineTranslation)
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
    if(plan){
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
              <RoadMap plan={plan}/>
            </View>
            <View style={{width}}>
              <ExpendatureMap plan={plan}/>
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

  const redirectWeb = async (url:string|undefined) => {
    if(url){
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log(`Can't handle URL: ${url}`);
        }
      } catch (error) {
        console.error('Something went wrong', error);
      }
    }
  };

  const openMap = ({lat, lng, label}: OpenMapArgs) => {
    const scheme = Platform.select({
      ios: `maps://?q=${label}&ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });
  
    if (scheme) {
      Linking.openURL(scheme).catch(err =>
        console.error('Error opening map: ', err),
      );
    }
  };

  const handleLike = () =>{
    if(!liked){
      alert('Shop added to Favoriites', '', 'success')
    }
    setLiked(!liked)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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
          {loading || !shopDetails ? (
            <View style={modalStyle.loadingContainer}>
              <Animated.View style={[{height:250, width:'100%'},{backgroundColor: animatedBackgroundColor }]} />
              <View style={{alignContent:'center', justifyContent:'center', flex:1}}>
                <ActivityIndicator />
              </View>
            </View>
          ) : (
            <ShopScrollView
            headerBackgroundColor={{ light: 'rgba(64, 124, 156, 1)', dark: 'rgba(64, 124, 156, 1)' }}
            headerImage={<Image source={{ uri: shopDetails.banner }} style={modalStyle.image} resizeMode="contain"/>}
            type={type}
            name={selectedPin.name}
            description={selectedPin.description}
            setExpansion={setExpansion}
            >
              <View>
                <View style={{backgroundColor:color_pallete[5], paddingVertical:10}}>
                  <View>
                    <View style={modalStyle.infoRow}>
                      <Ionicons name={'location-outline'} color={'white'} size={25}/>
                      <TouchableOpacity style={modalStyle.internalInfoRow} activeOpacity={1} onPress={()=>{openMap({lat:selectedPin.latitude, lng:selectedPin.longitude, label:'Open maps'})}}>
                        <View style={{flex:1}}>
                          <Text style={modalStyle.underline_infoText}>{selectedPin.location.city}, {selectedPin.location.state}</Text>
                          <Text style={modalStyle.sub_infoText}>{distance} miles away</Text>
                        </View>
                        <Ionicons name='arrow-forward' style={{transform:[{rotate:'-45deg'}], marginRight:10}} color={'white'} size={25} />
                        <View  style={modalStyle.underline}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <View style={modalStyle.infoRow}>
                      <View style={{position:'relative', height:'100%', width:25}}>
                        <AntDesign name={'clockcircleo'} color={'white'} size={25} style={{position:'absolute', alignSelf:'center', top:15,}}/>
                      </View>
                      <View style={{flexDirection:'column', flex:1}}>
                        <TouchableOpacity style={modalStyle.internalInfoRow} activeOpacity={1} onPress={()=>{setExpandHours(!expandHours)}}>
                          <Text style={shopStatus.status == 'Open'? modalStyle.openText: modalStyle.closedText}>{shopStatus.status}</Text>
                          <Ionicons name='chevron-up' size={25} color={'white'}  style={{transform:[{rotate:!expandHours?'90deg':'180deg'}], marginRight:10}}/>
                        </TouchableOpacity>
                        <View>
                          <Collapsible collapsed={!expandHours}>
                            <View style={{marginBottom:10, gap:2}}>
                              {selectedPin.shop_hours.map((shopDay, index)=>{
                                if(shopDay.open && shopDay.close){
                                  return(
                                    <View style={modalStyle.hoursContainer} key={index}>
                                      <Text style={modalStyle.infoText1}>{shopDay.day}</Text>
                                      <View>
                                        <Text style={modalStyle.infoText1}>{convertTo12HourFormat(shopDay.open)} - {convertTo12HourFormat(shopDay.close)}</Text>
                                      </View>
                                    </View>
                                  )
                                }else{
                                  return(
                                    <View style={modalStyle.hoursContainer} key={index}>
                                      <Text style={modalStyle.infoText1}>{shopDay.day}</Text>
                                      <Text style={modalStyle.infoText1}>Closed</Text>
                                    </View>
                                  )
                                }
                              })}
                            </View>
                          </Collapsible>
                        </View>
                      <View  style={modalStyle.underline}/>
                      </View>
                    </View>
                  </View>
                  {shopDetails.menu && 
                    <View>
                      <View style={modalStyle.infoRow}>
                        <MaterialIcons name={'restaurant'} color={'white'} size={25}/>
                        <TouchableOpacity style={modalStyle.internalInfoRow} activeOpacity={1} onPress={()=>redirectWeb(shopDetails.menu)}>
                          <View style={{flex:1}}>
                            <Text style={modalStyle.underline_infoText}>Menu</Text>
                          </View>
                          <Ionicons name='arrow-forward' style={{transform:[{rotate:'-45deg'}], marginRight:10}} color={'white'} size={25} />
                          <View  style={modalStyle.underline}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                    <View>
                    <View style={modalStyle.infoRow}>
                        <AntDesign name={'phone'} style={{transform: [{ scaleX: -1 }]}} color={'white'} size={25}/>
                        <TouchableOpacity style={modalStyle.internalInfoRow} activeOpacity={1} onPress={()=>redirectWeb(`tel:${shopDetails.phoneNumber}`)}>
                          <View style={{flex:1}}>
                            <Text style={modalStyle.underline_infoText}>{shopDetails.phoneNumber}</Text>
                          </View>
                          <Ionicons name='arrow-forward' style={{transform:[{rotate:'-45deg'}], marginRight:10}} color={'white'} size={25} />
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>

                <View style={{width:'100%',backgroundColor:'white'}}>
                  <Animated.View style={[{left:highlightPosition}, modalStyle.toggleHighlight]}/>
                    <View style={modalStyle.toggleSection}>
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
                        <Image style={{flex:1, backgroundColor:'gray'}} source={{uri: selectedPin.preview}}/>
                      </View>
                      <Text style={styles.text1}>{selectedPin.name}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLike}>
                      <TabBarIcon color={color_pallete[2]} name={liked?'heart':'heart-outline'} />
                    </TouchableOpacity>
                  </View>
                  {planSection()}
                </View>
              </View>
            </ShopScrollView>
          )}
        </View>
      </View>
      </Modal>
    </View>
  );
};