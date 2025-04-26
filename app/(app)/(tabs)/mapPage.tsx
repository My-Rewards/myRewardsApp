import { color_pallete } from "@/constants/Colors";
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Map, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MapView from "react-native-map-clustering";
import {
  ExpandedModalShop,
  ShopPreview,
} from "../../../components/shopPreview";
import { SvgXml } from "react-native-svg";
import { handStar } from "@/assets/images/MR-logos";
import { localData } from "@/app-data/appData";
import {
  mapPinProps,
  regionProp,
  ShopPreviewProps,
} from "@/app-data/data-types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { fetchPinnedShop } from "@/APIs/fetchPinnedShop";

export default function mapPage() {
  const { radiusShops, region, locateMe, fetchShopsByRadius, isPage2Loading, userLocation } =
    localData();
  const [containerHeight, setContainerHeight] = useState<number>(1);

  const MODAL_COLLAPSED_HEIGHT = Math.max(containerHeight * 0.25, 150);
  const [initalizedPins, setInitializedPins] = useState<mapPinProps | null>(null);
  const [selectedPin, setSelectedPin] = useState<ShopPreviewProps | null>(null);
  const translateY = useRef(new Animated.Value(containerHeight)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const [pinsRendered, setPinsRendered] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = React.useRef<Map>(null);


  useEffect(() => {
    if (radiusShops && radiusShops.length > 0) {
      setPinsRendered(true);
    }
  }, [radiusShops]);

  useEffect(() => {
    translateY.setValue(containerHeight);
  }, [containerHeight]);

  const fetchSelectedPinDetails = async (
    initializedPin: mapPinProps,
    pos: number
  ) => {
    console.log("Selected pin: ", initializedPin.shop_id);
    console.log("Selected pin pos: ", pos);
    if (selectedPin && pos !== undefined) {
      setInitializedPins(initializedPin);
      if(userLocation) {
        const details = await fetchPinnedShop(
          selectedPin.shop_id,
          userLocation.longitude,
          userLocation.latitude
        );
        setSelectedPin(details);
        openModal();
      }
    }
  };
  const openModal = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: containerHeight - MODAL_COLLAPSED_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: containerHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsExpanded(false);
      setSelectedPin(null);
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return (
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      );
    },
    onPanResponderMove: (_, gestureState) => {
      if (
        !isExpanded &&
        gestureState.dy > 20 &&
        gestureState.dy < MODAL_COLLAPSED_HEIGHT - 10
      ) {
        translateY.setValue(
          containerHeight - MODAL_COLLAPSED_HEIGHT + gestureState.dy
        );
      } else if (
        !isExpanded &&
        gestureState.dy > 20 &&
        gestureState.dy >= MODAL_COLLAPSED_HEIGHT - 10
      ) {
        translateY.setValue(containerHeight);
      }
  },
    onPanResponderRelease: (_, gestureState) => {
      const isPress =
        Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
      if (isPress) {
        setIsExpanded(true);
      } else if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded) {
        openModal();
      }
  },
    onPanResponderTerminate: (_, gestureState) => {
      const isPress =
        Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10;
      if (isPress) {
        setIsExpanded(true);
      } else if (!isExpanded && gestureState.dy > 100) {
        closeModal();
      } else if (!isExpanded) {
        openModal();
      }
   },
  });

  function handleMapUpdate(region: regionProp) {
    if (isPage2Loading) {
      return;
    }
    fetchShopsByRadius(region);
  }

  return (
    <View
      style={[
        { flex: 1, backgroundColor: "white", width: "100%", height: "100%" },
      ]}
      onLayout={(event) => {
        const { height: newHeight } = event.nativeEvent.layout;
        translateY.setValue(newHeight);
        setContainerHeight(newHeight);
      }}
    >
      <View>
        <MapView
          style={styles.map}
          region={region}
          ref={mapRef}
          loadingBackgroundColor={"rgba(0,0,0,0.5)"}
          loadingEnabled={true}
          showsUserLocation
          pitchEnabled={false}
          provider={PROVIDER_DEFAULT}
          scrollEnabled={!isExpanded}
          zoomEnabled={!isExpanded}
          rotateEnabled={!isExpanded}
          animationEnabled={!isExpanded}
          onMapReady={() => {
            setMapLoaded(true);
            locateMe(mapRef);
          }}
          onMapLoaded={() => {
            if (!mapLoaded) {
              setMapLoaded(true);
            }
          }}
          clusterColor={color_pallete[2]}
          clusterFontFamily="Avenir Next"
          clusterTextColor="white"
          clusteringEnabled={true}
          radius={15}
          onRegionChangeComplete={(region) => {
            handleMapUpdate(region);
          }}
        >
          {radiusShops?.map((shop, index) => (
            <Marker
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude,
              }}
              onPress={() => fetchSelectedPinDetails(shop, index)}
              key={shop.shop_id}
            >
              <View style={styles.marker}>
                <View
                  style={
                    initalizedPins?.shop_id == shop.shop_id
                      ? styles.circleSelected
                      : styles.circle
                  }
                >
                  <SvgXml
                    color={
                      initalizedPins?.shop_id == shop.shop_id
                        ? color_pallete[1]
                        : "white"
                    }
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
        {!isExpanded && !initalizedPins && (
          <View style={styles.crossHairButton}>
            <TouchableOpacity
              onPress={() => {
                locateMe(mapRef);
              }}
            >
              <MaterialIcons name={"my-location"} size={25} color={"white"} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Animated.View
        style={[
          styles.bottomModal,
          { transform: [{ translateY }], height: MODAL_COLLAPSED_HEIGHT },
        ]}
        {...panResponder.panHandlers}
      >
        {selectedPin && (
          <ShopPreview
            key={selectedPin.shop_id}
            selectedPin={selectedPin}
            type={0}
          />
        )}
      </Animated.View>
      {isExpanded && selectedPin && (
        <ExpandedModalShop
          isExpanded={isExpanded}
          setExpansion={setIsExpanded}
          type={0}
          shopId={selectedPin.shop_id}
        />
      )}
      {(!mapLoaded || containerHeight === 1 || !pinsRendered) && (
        <View style={styles.mapLoading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Fetching Nearby Shops</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  marker: {
    alignItems: "center",
  },
  circleSelected: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: color_pallete[1],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: color_pallete[1],
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  pin: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: color_pallete[1],
    marginTop: -5,
    zIndex: 10,
  },
  bottomModal: {
    position: "absolute",
    width: "100%",
    elevation: 5,
    backgroundColor: "transparent",
  },
  crossHairButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 15,
    padding: 10,
    borderRadius: 50,
    backgroundColor: color_pallete[3],
  },
  mapLoading: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    opacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Avenir Next",
    fontWeight: "600",
    color: color_pallete[2],
    fontSize: 13,
    padding: 10,
    textAlign: "center",
  },
});