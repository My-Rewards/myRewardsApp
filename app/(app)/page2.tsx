import { color_pallete } from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, PanResponder, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ExpandedShop } from './page2/shopPreview';
import * as Location from 'expo-location';
import { useProps } from '../LoadingProp/propsProvider';
import {SvgXml} from 'react-native-svg';
import { whiteHandStar } from '@/assets/images/MR-logos';
import { localData } from '@/app-data/appData';

const { height } = Dimensions.get('window');
const usableHeight= height-100;

const MODAL_COLLAPSED_HEIGHT = usableHeight * 0.4;
const MODAL_EXPANDED_HEIGHT = usableHeight * 0.8;
const MAP_COLLAPSED_HEIGHT = usableHeight * 0.61;
const MAP_EXPANDED_HEIGHT = usableHeight * 0.21;

export type PinPointProps = shops & {
  onPress: () => void;
};

export default function CustomMap() {
  const { alert, triggerLoadingScreen } = useProps();
  const { fetchShopsByRadius, radiusShops, isLoading, region, setRegion } = localData();

  const [selectedPin, setSelectedPin] = useState<shops | null>(null);
  const translateY = useRef(new Animated.Value(usableHeight)).current;
  const mapHeight = useRef(new Animated.Value(usableHeight)).current;
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

  const openModal = (selectedPin:shops) => {
    setSelectedPin(selectedPin);
    setIsExpanded(false);

    Animated.timing(translateY, {
      toValue: usableHeight - MODAL_COLLAPSED_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(mapHeight, {
      toValue: MAP_COLLAPSED_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: usableHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSelectedPin(null));
    Animated.timing(mapHeight, {
      toValue: usableHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!isExpanded && gestureState.dy > 0) {
        translateY.setValue(usableHeight - MODAL_COLLAPSED_HEIGHT + gestureState.dy);
        mapHeight.setValue(MAP_COLLAPSED_HEIGHT + gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded && gestureState.dy < -50) {
        Animated.timing(translateY, {
          toValue: usableHeight - MODAL_EXPANDED_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start(() => (setIsExpanded(true)));
        Animated.timing(mapHeight, {
          toValue: MAP_EXPANDED_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }).start(() => (setIsExpanded(true)));
      } else {
        Animated.timing(translateY, {
          toValue: isExpanded ? usableHeight - MODAL_EXPANDED_HEIGHT : usableHeight - MODAL_COLLAPSED_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }).start();
        Animated.timing(mapHeight, {
          toValue: isExpanded ? usableHeight : MAP_COLLAPSED_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }).start();
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
    <View style={{ flex: 1, backgroundColor:'white'}}>
      <Animated.View style={[styles.mapContainer, { height: mapHeight }]}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation
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
      </Animated.View>
      {selectedPin && (
        <Animated.View
          style={[styles.bottomModal, { transform: [{ translateY }] }]}
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
    borderColor: 'black',
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
    height: MODAL_EXPANDED_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  }
});