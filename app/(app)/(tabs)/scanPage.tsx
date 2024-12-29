import { useProps } from '@/app/LoadingProp/propsProvider';
import { handStar } from '@/assets/images/MR-logos';
import { color_pallete } from '@/constants/Colors';
import React, { useEffect, useState, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Animated, Dimensions } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { SvgXml } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(1)).current;
  
  const { alert } = useProps();


  useEffect(() => {
    if (isScanning) {
      startPulsating();
    } else {
      stopPulsating();
    }
  }, [isScanning]);

  const startPulsating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.8,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  
    setTimeout(()=>{
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim2, {
              toValue: 1.8,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim2, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim2, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim2, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    },600)
  };

  const stopPulsating = () => {
    scaleAnim.stopAnimation();
    fadeAnim.stopAnimation();
    scaleAnim.setValue(1);
    fadeAnim.setValue(1);

    scaleAnim2.stopAnimation();
    fadeAnim2.stopAnimation();
    scaleAnim2.setValue(1);
    fadeAnim2.setValue(1);
  };

  async function readNdef() {
    try {
      setIsScanning(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.log('Tag found:', tag);

      if (tag?.ndefMessage) {
        alert('Visit tracked Successfully', '', 'success');
      }
    } catch (ex) {
      alert('Something went wrong', '', 'error');
      console.warn('NFC read error:', ex);
      setIsScanning(false);
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest().catch(() => { /* do nothing */ });
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{position:'relative'}}>
        <TouchableOpacity
          onPress={readNdef}
          style={{
            zIndex:5,
            padding: 20,
            backgroundColor: color_pallete[3],
            borderRadius: width/2,
            justifyContent:'center',
            alignItems:'center',
            minWidth:150,
            minHeight:150,
            width:'55%',
            aspectRatio:1,
          }}
          disabled={isScanning}
        >
          <View style={styles.buttonContainer}>
            <SvgXml
              xml={handStar}
              width="50%"
              height="50%" 
              color={'white'} 
            />
            {isScanning?
            <Text style={styles.buttonText}>Scanning...</Text>
            :
            <Text style={styles.buttonText}>Click to Scan Tag</Text>
            }
          </View>
        </TouchableOpacity>
        <Animated.View 
        style={{
          backgroundColor:color_pallete[3],
          position:'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex:1,
          borderRadius: width/2,
          transform: [{ scale: scaleAnim }],
          opacity:fadeAnim
        }}/>
        <Animated.View 
        style={{
          backgroundColor:color_pallete[3],
          position:'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex:1,
          borderRadius: width/2,
          transform: [{ scale: scaleAnim2 }],
          opacity:fadeAnim2
        }}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer:{
    width:'100%', 
    height:'100%', 
    justifyContent:'center', 
    alignItems:'center',
    flexDirection:'column',
    gap:20
  },
  buttonText:{
    fontFamily:'Avenir Next',
    color:'white',
    fontWeight:'700'
  }
})