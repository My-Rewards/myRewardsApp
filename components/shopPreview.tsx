import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { color_pallete } from '@/constants/Colors';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions, Image, ScrollView, ActivityIndicator} from 'react-native';
import { PinPointProps } from '../app/(app)/mapPage';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { shop, shopPreview } from '@/app-data/data-types';
import { transform } from '@babel/core';
import { mockShop } from '@/APIs/api';
import ParallaxScrollView from './ParallaxScrollView';

const { height } = Dimensions.get('window');

type PrewviewShopProps = {
    selectedPin: shopPreview;
    isExpanded:boolean;
    setExpansion?: Dispatch<SetStateAction<boolean>>;
  };

type ShopPreviewProps = {
  latitude: number;
  longitude: number;
  id:string;
  name:string;
  description:string;
  logo:string;
  banner:string;
  plan:null|any;
}

export const ShopPreview = ({ selectedPin, isExpanded }: PrewviewShopProps) => {
    const [shopId, setShopId] = useState('')

    return (
      <View style={[styles.modalContent, {margin:14, borderRadius:10}]}>
        <Text style={styles.modalTitle}>{selectedPin.name}</Text>
        <Text>${selectedPin.name}</Text>
      </View>
  );
}

export const ExpandedShop = ({ selectedPin, setExpansion, isExpanded }: PrewviewShopProps) => {
  const [shopDetails, setShopDetails] = useState<shop | null>(null);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useRef(new Animated.Value(0)).current;

  if (!setExpansion) return null;

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (isExpanded) {
        setLoading(true);
        try {
          const shopData = await mockShop();
          setShopDetails(shopData);
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
    // Animate background dimming
    Animated.timing(backgroundColor, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Needed for color interpolation
    }).start();
  }, [isExpanded]);

  const interpolatedBackground = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
  });

  return (
    <Animated.View style={[modalStyle.modalContainer, { backgroundColor: interpolatedBackground }]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isExpanded}
        onRequestClose={() => setExpansion(false)}
      >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={modalStyle.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setExpansion(false)}
          >
            <TabBarIcon name={'close'} color={'rgba(0,0,0,0.5)'} />
          </TouchableOpacity>

          {loading ? (
            <View style={modalStyle.loadingContainer}>
              <Animated.View style={{height:200, width:'100%', backgroundColor:'gray'}} />
              <View style={{alignContent:'center', justifyContent:'center', flex:1}}>
                <ActivityIndicator />
              </View>
            </View>
          ) : shopDetails ? (
            <ParallaxScrollView
            headerBackgroundColor={{ light: 'rgba(64, 124, 156, 1)', dark: 'rgba(64, 124, 156, 1)' }}
            headerImage={<Image source={{ uri: shopDetails.banner }} style={modalStyle.image} resizeMode="contain"/>}
            >
              <View style={{backgroundColor:'rgba(64, 124, 156, 1)'}}>
                <Text style={styles.modalTitle}>{shopDetails.title}</Text>
                <Text>{shopDetails.description}</Text>
                {shopDetails.shop_hours.map((hour, index) => (
                  <Text key={index}>
                    {hour.day}: {hour.open} - {hour.close}
                  </Text>
                ))}
                <Text>Geohash: {shopDetails.geohash}</Text>
                <View>
                  
                </View>
              </View>
            </ParallaxScrollView>
          ) : (
            <Text>No shop data available.</Text>
          )}
        </View>
      </View>

      </Modal>
    </Animated.View>
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
      paddingBottom:20,
      paddingTop:10
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: 25,
      padding: 5,
      zIndex:100
    },
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
});