import { toast_pallete } from '@/constants/Colors';
import React, { useState, useRef, useMemo } from 'react';
import { Animated, Modal, StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const hiddenPos=-100;

export const useAlert = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', description: '', status:'' });

  const slideAnim = useRef(new Animated.Value(hiddenPos)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const alert = useMemo(() => (title: string, description: string, status:string) => {
    setAlertData({ title, description, status });
    setAlertVisible(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
        hideAlert();
    }, 5000);
  }, []);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: hiddenPos,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
        setAlertVisible(false);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: slideAnim } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.translationY < hiddenPos/4) {
        hideAlert(); 
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
  };

  const AlertModal = useMemo(() => {
    return alertVisible ? (
    <Animated.View style={{position:'absolute',top:0, width:'100%'}}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <SafeAreaView />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View
                style={[
                    style.alertContainer,
                    {
                    transform: [{
                        translateY: slideAnim.interpolate({
                        inputRange: [hiddenPos, 0],
                        outputRange: [hiddenPos, 0],
                        extrapolate: 'clamp',
                        }),
                    }],
                    opacity: fadeAnim,
                    },
                ]}
                >
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}>
                    <Animated.View style={{ width: '100%' }}>
                    <View style={[style.alertBox, alertData.status === 'success' ? style.successColor : style.errorColor]}>
                        <Text style={style.title}>{alertData.title}</Text>
                        <Text style={style.description}>{alertData.description}</Text>
                    </View>
                    </Animated.View>
                </PanGestureHandler>
                </Animated.View>
            </GestureHandlerRootView>
        </View>
    </Animated.View>
    ) : null;
  }, [alertVisible, slideAnim, fadeAnim]);

  return { alert, AlertModal};
};

export default useAlert;

const style = StyleSheet.create({
    alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 10,
    alignItems: 'center',
  },
  alertBox: {
    borderRadius: 20,
    padding: 15,
    paddingVertical:20,
    width: '100%',
    shadowColor: 'black',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    flexWrap:'wrap',
    justifyContent:'center',
    gap:10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  successColor:{
    backgroundColor:toast_pallete[0]
  },
  errorColor:{
    backgroundColor:toast_pallete[1]
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 12,
    width:'auto',
    fontFamily:'Avenir Next'
  },
  description: {
    color: 'white',
    fontSize: 12,
    width:'auto',
    fontFamily:'Avenir Next'
  },
});

