import { color_pallete } from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ExpandedShop } from './page2/shopPreview';
import * as Location from 'expo-location';
import { useProps } from '../LoadingProp/propsProvider';
import {SvgXml} from 'react-native-svg';
import { whiteHandStar } from '@/assets/images/MR-logos';
import { localData } from '@/app-data/appData';
import { shops } from '@/app-data/data-types';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { height } = Dimensions.get('window');

export type PinPointProps = shops & {
  onPress: () => void;
};

export default function CustomMap() {
  const { alert } = useProps();
  const { radiusShops, isLoading, region, setRegion, locateMe } = localData();
  const [containerHeight, setContainerHeight] = useState(1);

  if(containerHeight === 0){
    return(
      <View style={{flex:1, width:'100%', height:'100%', backgroundColor:'white'}}/>
    )
  }

  const MODAL_COLLAPSED_HEIGHT = containerHeight * 0.35;
  const MODAL_EXPANDED_HEIGHT = containerHeight * 0.8;
  const MAP_COLLAPSED_HEIGHT = containerHeight * 0.66;
  const MAP_EXPANDED_HEIGHT = containerHeight * 0.21;


  const [selectedPin, setSelectedPin] = useState<shops | null>(null);
  const translateY = useRef(new Animated.Value(containerHeight)).current;
  const mapHeight = useRef(new Animated.Value(containerHeight)).current;
  const [isExpanded, setIsExpanded] = useState(false); 

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('', 'Enable Access to your Location in Settings', 'error');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,      
      })
    }

    getCurrentLocation();
  }, []);

  useEffect(()=>{
    if(isExpanded && selectedPin){
      setRegion({
        latitude: selectedPin.latitude,
        longitude: selectedPin.longitude,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,   
      })
    }
  },[isExpanded])

  useEffect(()=>{
    translateY.setValue(containerHeight);
    mapHeight.setValue(containerHeight);
  },[containerHeight])

  const openModal = (selectedPin?:shops) => {
    if(selectedPin){
      setSelectedPin(selectedPin);
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: containerHeight - MODAL_COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(mapHeight, {
        toValue: MAP_COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: containerHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(mapHeight, {
        toValue: containerHeight,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsExpanded(false);
      setSelectedPin(null);
    });
  };

  const expandFull = () =>{
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: containerHeight - MODAL_EXPANDED_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(mapHeight, {
        toValue: MAP_EXPANDED_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => setIsExpanded(true));
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!isExpanded && gestureState.dy > 0 && gestureState.dy<(MODAL_COLLAPSED_HEIGHT-10)) {
        translateY.setValue(containerHeight - MODAL_COLLAPSED_HEIGHT + gestureState.dy);
        mapHeight.setValue(MAP_COLLAPSED_HEIGHT + gestureState.dy);
      } else if(!isExpanded && gestureState.dy > 0 && gestureState.dy>=(MODAL_COLLAPSED_HEIGHT-10)){
        translateY.setValue(containerHeight);
        mapHeight.setValue(containerHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded && gestureState.dy < -50) {
        expandFull()
      }else{
        openModal()
      }
    },
  });

  const PinPoint: React.FC<PinPointProps> = (info) => {
    const latitude = info.latitude;
    const longitude = info.longitude;

    return(
      <Marker coordinate={{ latitude, longitude }} onPress={info.onPress}>
      <View style={styles.marker}>
        <View style={selectedPin?.id == info.id ? styles.circleSelected : styles.circle}>
          <SvgXml
            color='white'
            xml={whiteHandStar}
            width="62%"
            height="62%"
          />
        </View>
        <View style={styles.pin} />
      </View>
    </Marker>
    )
  };

  return (
    <View 
      style={{ flex: 1, backgroundColor:'white', width:'100%', height:'100%'}}
      onLayout={(event) => {
        const { height: newHeight } = event.nativeEvent.layout;
        translateY.setValue(newHeight);
        mapHeight.setValue(newHeight);
        setContainerHeight(newHeight)
      }}>
      <Animated.View 
      style={[styles.mapContainer, { height: mapHeight }]} 
      pointerEvents={isExpanded ? "box-only" : "auto"}
      >
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
          scrollEnabled={!isExpanded}
          zoomEnabled={!isExpanded}
          rotateEnabled={!isExpanded}
          showsMyLocationButton
          onStartShouldSetResponder={() => false}
          >
            {/* PinPoints hardcoded for designing/testing */}
          {radiusShops?.map((shop) => {
            return (
              <PinPoint
                key={shop.id}
                latitude={shop.latitude}
                longitude={shop.longitude}
                logo={shop.logo}
                id={shop.id}
                name={shop.name}
                description={shop.description}
                organization_id={shop.id} 
                location_id={shop.location_id} 
                geohash={shop.geohash} 
                onPress={() => openModal(shop)}
              />
            );
          })}
        </MapView>
        {!isExpanded &&  
        <TouchableOpacity 
          style={styles.crossHairButton}
          onPress={() => {
            locateMe()
          }}>
            <FontAwesome6 name={'location-crosshairs'} size={30} color={'black'} />
        </TouchableOpacity>
        }
      </Animated.View>
      {selectedPin && (
        <Animated.View
          style={[styles.bottomModal, { transform: [{ translateY }], height:isExpanded?MODAL_EXPANDED_HEIGHT:MODAL_COLLAPSED_HEIGHT}]}
          {...panResponder.panHandlers}
        >
          <ExpandedShop 
           selectedPin={selectedPin}
           isExpanded={isExpanded}
           closeModal={closeModal}/>
        </Animated.View>
      )}
    </View>
  );
}

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
  circleSelected: {
    width: 40,
    height: 40,
    backgroundColor: color_pallete[1],
    borderRadius: 20,
    borderWidth:2,
    borderColor: color_pallete[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: color_pallete[1],
    borderRadius: 20,
    borderWidth:2,
    borderColor: 'transparent',
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
  bottomModal: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  crossHairButton:{
    position:'absolute',
    bottom:0,
    right:0,
    margin:15
  }
});