import { color_pallete } from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ExpandedShop } from './page2/shopPreview';
import { useProps } from '../LoadingProp/propsProvider';
import {SvgXml} from 'react-native-svg';
import { whiteHandStar } from '@/assets/images/MR-logos';
import { localData } from '@/app-data/appData';
import { shopPreview } from '@/app-data/data-types';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width } = Dimensions.get('window');

export type PinPointProps = shopPreview & {
  onPress: () => void;
};

export default function CustomMap() {
  const { alert } = useProps();
  const { radiusShops, isLoading, region, setRegion, locateMe } = localData();
  const [containerHeight, setContainerHeight] = useState(1);

  // const MODAL_COLLAPSED_HEIGHT = containerHeight * 0.31;
  const MODAL_COLLAPSED_HEIGHT = Math.max(containerHeight * 0.25, 150);
  const MODAL_EXPANDED_HEIGHT = containerHeight * 0.82;
  const MAP_EXPANDED_HEIGHT = containerHeight * 0.19;


  const [selectedPin, setSelectedPin] = useState<shopPreview | null>(null);
  const translateY = useRef(new Animated.Value(containerHeight)).current;
  const mapHeight = useRef(new Animated.Value(containerHeight)).current;
  const [isExpanded, setIsExpanded] = useState(false); 

  const mapRef = useRef<MapView>(null);

  useEffect(()=>{
    if(isExpanded && selectedPin && mapRef.current){
      mapRef.current.animateToRegion({
        latitude: selectedPin.latitude-0.00001,
        longitude: selectedPin.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 500);
    }
  },[isExpanded])

  useEffect(()=>{
    translateY.setValue(containerHeight);
    mapHeight.setValue(containerHeight);
  },[containerHeight])

  const openModal = (selectedPin?:shopPreview) => {
    if(selectedPin){
      setSelectedPin(selectedPin);
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: containerHeight - MODAL_COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      })
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
    ]).start(()=>{
      setIsExpanded(false);
      setSelectedPin(null);
    })
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
      } else if(!isExpanded && gestureState.dy > 0 && gestureState.dy>=(MODAL_COLLAPSED_HEIGHT-10)){
        translateY.setValue(containerHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const isPress = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
      if (isPress) {
        console.log('expand')
        expandFull();
      } else if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded && gestureState.dy < -50) {
        expandFull();
      } else if (!isExpanded) {
        openModal();
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
          ref={mapRef}
          showsUserLocation
          scrollEnabled={!isExpanded}
          zoomEnabled={!isExpanded}
          rotateEnabled={!isExpanded}
          >
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
                onPress={() => {openModal(shop)}}
              />
            );
          })}
        </MapView>
        {!isExpanded && !selectedPin &&  
        <TouchableOpacity 
          style={styles.crossHairButton}
          onPress={() => {
            locateMe(mapRef);
          }}>
            <FontAwesome6 name={'location-crosshairs'} size={40} color={color_pallete[2]} />
        </TouchableOpacity>
        }
      </Animated.View>
      {selectedPin && (
        <Animated.View
          style={[styles.bottomModal, 
            { transform: [{ translateY }], 
            height:isExpanded?MODAL_EXPANDED_HEIGHT: MODAL_COLLAPSED_HEIGHT, width:isExpanded?width:width-20}]}
          {...panResponder.panHandlers}
        >
            <ExpandedShop 
            selectedPin={selectedPin}
            isExpanded={isExpanded}
            closeModal={closeModal}
          />
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