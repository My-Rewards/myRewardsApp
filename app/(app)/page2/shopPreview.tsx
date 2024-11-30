import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { color_pallete } from '@/constants/Colors';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { PinPointProps } from '../page2';
import { useEffect, useState } from 'react';

type ExpandedShopProps = {
    selectedPin: shops;
    isExpanded:boolean;
    closeModal: () => void;
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

export const ExpandedShop = ({ selectedPin, closeModal, isExpanded }: ExpandedShopProps) => {
    const [shopId, setShopId] = useState('')

    useEffect(()=>{
        // minimize API calls as much as possible

        // only call API to fetch shop details when expanded
        if(isExpanded){
            // TODO: fetch data on this Shop via API
        }
    },[isExpanded])

    if(isExpanded){
        return (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedPin.name}</Text>
              <Text>${selectedPin.name} Ecpanded View</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <TabBarIcon name={'close'} color={'rgba(0,0,0,0.5)'} />
              </TouchableOpacity>
            </View>
        );
    }else{
        return (
            <View style={styles.modalContent}>
              <View style={styles.pullTab}/>
              <Text style={styles.modalTitle}>{selectedPin.name}</Text>
              <Text>${selectedPin.name}</Text>
            </View>
        );
    }
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
    },
    pullTab:{
      backgroundColor:'rgba(0,0,0,0.2)',
      height:4,
      width:'40%',
      alignSelf:'center',
      marginBottom:5,
      borderRadius:4
    }
  });
  