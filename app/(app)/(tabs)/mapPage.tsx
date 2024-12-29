import { color_pallete } from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { ExpandedModalShop, ShopPreview } from '../../../components/shopPreview';
import { SvgXml } from 'react-native-svg';
import { handStar } from '@/assets/images/MR-logos';
import { localData } from '@/app-data/appData';
import { regionProp, shopPreview } from '@/app-data/data-types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export default function mapPage() {
  const { radiusShops, region, locateMe, fetchShopsByRadius } = localData();
  const [containerHeight, setContainerHeight] = useState<number>(1);

  const MODAL_COLLAPSED_HEIGHT = Math.max(containerHeight * 0.25, 150);

  const [selectedPin, setSelectedPin] = useState<shopPreview | null>(null);
  const translateY = useRef(new Animated.Value(containerHeight)).current;
  const [isExpanded, setIsExpanded] = useState(false); 
  const [pinsRendered, setPinsRendered] = useState(false); 
  const [mapLoaded, setMapLoaded] = useState(false); 
  const [isFlatListScrolling, setIsFlatListScrolling] = useState(true);

  const mapRef = React.useRef<Map>(null);
  const flatListRef = useRef<FlatList>(null);
  const currentScrollX = useRef(0);
  const memoizedPins = React.useMemo(() => radiusShops, [radiusShops]);

  useEffect(()=>{
    if(radiusShops){
      setPinsRendered(true)
    }
  },[radiusShops])

  useEffect(()=>{
    translateY.setValue(containerHeight);
  },[containerHeight])

  const openModal = (selectedPin?:shopPreview, pos?:number) => {
    if(selectedPin && pos!== undefined){
      setSelectedPin(selectedPin);
      flatListRef.current?.scrollToIndex({index:pos, animated:false})
      currentScrollX.current = pos * width; 
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
    Animated.timing(translateY, {
      toValue: containerHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(()=>{
      setIsExpanded(false);
      setSelectedPin(null);
    })
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return !isFlatListScrolling && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (_, gestureState) => {
      if (!isExpanded && gestureState.dy > 20 && gestureState.dy<(MODAL_COLLAPSED_HEIGHT-10) && Math.abs(gestureState.dx) < 20 ) {
        translateY.setValue(containerHeight - MODAL_COLLAPSED_HEIGHT + gestureState.dy);
      } else if(!isExpanded && gestureState.dy > 20 && gestureState.dy>=(MODAL_COLLAPSED_HEIGHT-10) && Math.abs(gestureState.dx) < 20){
        translateY.setValue(containerHeight);
      }
      if(!isExpanded && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)){
        const offsetX = currentScrollX.current - gestureState.dx;
        flatListRef.current?.scrollToOffset({ offset: offsetX, animated: false });
      }

    },
    onPanResponderRelease: (_, gestureState) => {
      const isPress = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
      if (isPress) {
        setIsExpanded(true)
      } else if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded) {
        openModal();
      }

      if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && radiusShops) {
        let move = 0;

        if(gestureState.dx > 0){
          move = Math.round((gestureState.dx + (width/4))/ width);
        }else{
          move = Math.round((gestureState.dx - (width/4))/ width);
        }

        let currPos = currentScrollX.current/width;
        let newPos = currentScrollX.current/width;

        if(move > 0 && currPos>0){
          newPos = currPos - 1;
        }

        else if(move < 0 && currPos<radiusShops.length-1){
          newPos = currPos + 1;
        }
    
        currentScrollX.current = newPos * width; 
        setSelectedPin(radiusShops[newPos]);   
        
        flatListRef.current?.scrollToIndex({index:newPos, animated:true})
        mapRef.current?.animateToRegion({
          latitude: radiusShops[newPos].latitude,
          longitude: radiusShops[newPos].longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        }, 300);
      }
    },
    onPanResponderTerminate: (_, gestureState) => {
      const isPress = Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
      if (isPress) {
        setIsExpanded(true)
      } else if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded) {
        openModal();
      }

      if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && radiusShops) {
        let move = 0;

        if(gestureState.dx > 0){
          move = Math.round((gestureState.dx + (width/4))/ width);
        }else{
          move = Math.round((gestureState.dx - (width/4))/ width);
        }

        let currPos = currentScrollX.current/width;
        let newPos = currentScrollX.current/width;

        if(move > 0 && currPos>0){
          newPos = currPos - 1;
        }

        else if(move < 0 && currPos<radiusShops.length-1){
          newPos = currPos + 1;
        }
    
        flatListRef.current?.scrollToIndex({index:newPos, animated:true})
        mapRef.current?.animateToRegion({
          latitude: radiusShops[newPos].latitude,
          longitude: radiusShops[newPos].longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        }, 300);
    
        currentScrollX.current = newPos * width; 
        setSelectedPin(radiusShops[newPos]);   
      }
    },
  });

  function handleMapUpdate(region:regionProp){
    fetchShopsByRadius(region)
  }

  return (
    <View 
      style={[{ flex: 1, backgroundColor:'white', width:'100%', height:'100%'}]}
      onLayout={(event) => {
        const { height: newHeight } = event.nativeEvent.layout;
        translateY.setValue(newHeight);
        setContainerHeight(newHeight)
      }}>
        <View 
        style={[styles.mapContainer, { height: '100%' }]} 
        pointerEvents={isExpanded ? "box-only" : "auto"}
        >
          <MapView
            style={styles.map}
            region={region}
            ref={mapRef}
            loadingBackgroundColor={'rgba(0,0,0,0.5)'}
            loadingEnabled={true}
            showsUserLocation
            pitchEnabled={false}
            provider={PROVIDER_GOOGLE}
            scrollEnabled={!isExpanded}
            zoomEnabled={!isExpanded}
            rotateEnabled={!isExpanded}
            animationEnabled={!isExpanded}
            onMapReady={()=>{locateMe(mapRef)}}
            onMapLoaded={()=>setMapLoaded(true)}
            clusterColor={color_pallete[2]}
            clusterFontFamily='Avenir Next'
            clusterTextColor='white'
            clusteringEnabled={true}
            radius={15}
            onRegionChangeComplete={(region)=>{handleMapUpdate(region)}}
            >
            {memoizedPins?.map((shop, index) => (
              <Marker
                coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                onPress={()=>openModal(shop, index)}
                key={shop.id}>
                <View style={styles.marker}>
                  <View style={selectedPin?.id == shop.id ? styles.circleSelected : styles.circle}>
                    <SvgXml
                      color={selectedPin?.id == shop.id ? color_pallete[1] : 'white'}
                      xml={handStar}
                      width="62%"
                      height="62%"
                    />
                  </View>
                  <View style={styles.pin} />
                </View>
              </Marker>
            ))}
          </MapView>
          {!isExpanded && !selectedPin &&  
          <View style={styles.crossHairButton}>
            <TouchableOpacity
              onPress={() => {
                locateMe(mapRef);
              }}>
                <MaterialIcons name={'my-location'} size={25} color={'white'}/>
            </TouchableOpacity>
          </View>
          }
        </View>
        <Animated.View
          style={[styles.bottomModal, 
            { transform: [{ translateY }], 
            height:MODAL_COLLAPSED_HEIGHT}]}
          {...panResponder.panHandlers}
          >                
            <FlatList
              ref={flatListRef}
              data={radiusShops}
              horizontal
              style={{backgroundColor:'transparent'}}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ShopPreview
                  key={item.id}
                  selectedPin={item}  
                  type={0}    
                  />
              )}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              onScrollBeginDrag={() => setIsFlatListScrolling(true)}
              onScrollEndDrag={() => setIsFlatListScrolling(false)}
              onMomentumScrollEnd={() => setIsFlatListScrolling(false)}
            />
        </Animated.View>      
        {isExpanded &&  selectedPin &&
          <ExpandedModalShop 
            selectedPin={selectedPin}
            isExpanded={isExpanded}
            setExpansion={setIsExpanded}
            type={0}
        />}
        {(!mapLoaded || containerHeight===1 || !pinsRendered) && (
          <View style={styles.mapLoading}>
            <ActivityIndicator />
          </View>
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
    backgroundColor:'transparent'
  },
  marker: {
    alignItems: 'center',
  },
  circleSelected: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth:2,
    borderColor: color_pallete[1],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:11
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
    zIndex:10
  },
  bottomModal: {
    position: 'absolute',
    width: '100%',
    elevation: 5,
    backgroundColor:'transparent',
  },
  crossHairButton:{
    position:'absolute',
    bottom:0,
    right:0,
    margin:15,
    padding:10,
    borderRadius:50,
    backgroundColor:color_pallete[3],
  },
  mapLoading:{
    flex:1, 
    position:'absolute', 
    width:'100%', 
    height:'100%', 
    backgroundColor:'white', 
    opacity:1,
    justifyContent:'center',
    alignItems:'center'
  }
});