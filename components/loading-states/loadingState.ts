import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const loadingState = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateGradient = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateGradient();
  }, [animatedValue]);

  // Interpolate gradient colors
  const animatedBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#b4b5b8", "#909091"], // Light Grey to Dark Grey
  });

  return animatedBackground;
};
