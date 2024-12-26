// CustomAlert.tsx
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';

export const loadingScreen = () => {
    const [visibleLoading, setVisibleLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const triggerLoadingScreen = ({ isLoading }: { isLoading: boolean})=>{

        let animationDuration = 200;
        
        if (isLoading) {
          setVisibleLoading(true)

              Animated.timing(fadeAnim, {
                toValue: 0.8,
                duration: animationDuration,
                easing: Easing.ease,
                useNativeDriver: true,
              }).start();
            }else{
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: animationDuration,
                    easing: Easing.ease,
                    useNativeDriver: true,
                  }).start();
    
                setTimeout(()=>{
                    setVisibleLoading(false)
                }, animationDuration)
            }
    }


    const LoadingModal = useMemo(() => {
        return visibleLoading ? 
        (<Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
                <ActivityIndicator size="large" />
            </View>
        </Animated.View>):
        null
    }, [visibleLoading, fadeAnim])

     return { triggerLoadingScreen, LoadingModal };
}

export default loadingScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
})