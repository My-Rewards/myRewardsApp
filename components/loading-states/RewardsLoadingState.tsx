import {useRef, useEffect} from "react";
import {Animated, View, ActivityIndicator} from "react-native";
import {modalStyle} from "@/components/styling/mapPreviewStyle";
export function RewardsLoadingState(){
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateGradient = () => {
      Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue1, {
              toValue: 1,
              duration: 700,
              useNativeDriver: false,
            }),
            Animated.timing(animatedValue1, {
              toValue: 0,
              duration: 700,
              useNativeDriver: false,
            }),
          ])
      ).start();

      const timer = setTimeout(() => {
        Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue2, {
                toValue: 1,
                duration: 700,
                useNativeDriver: false,
              }),
              Animated.timing(animatedValue2, {
                toValue: 0,
                duration: 700,
                useNativeDriver: false,
              }),
            ])
        ).start();
      }, 350);

      return () => clearTimeout(timer);
    };

    animateGradient();
  }, [animatedValue1, animatedValue2]);

  const animatedBackgroundColor = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: ["gray", "darkgray"],
  });

  return(
      <View style={[modalStyle.loadingContainer,{marginVertical:70}]}>
        <View style={{display:'flex', margin:'auto'}}>
            <ActivityIndicator size="large" />
        </View>
      </View>
  )

}
