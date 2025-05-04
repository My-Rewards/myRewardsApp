import { useEffect, useState } from "react";
import { View, Animated, Easing, StyleSheet, ActivityIndicator} from "react-native"

export const LoadingScreen = ({isLoading, setLoadingScreen}:any) =>{
    const [visibleLoading, setVisibleLoading] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        let animationDuration = 200;

        if (isLoading) {
          setLoadingScreen(true)
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
                setLoadingScreen(false)
                setVisibleLoading(false)
            }, animationDuration)
        }
      }, [isLoading]);

    if(visibleLoading){
        return(
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
                    <ActivityIndicator size="large" />
                </View>
            </Animated.View>
        )
    }else{
        return null
    }
}

export const LoadingScreenDefault = () =>{
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
            <ActivityIndicator size="large" />
        </View>
    )
}

export default LoadingScreenDefault;

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
})