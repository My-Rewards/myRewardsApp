import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { color_pallete } from "@/constants/Colors";

export type FetchingNotificationRef = {
  show: () => void;
  hide: () => void;
};

const FetchingNotification = forwardRef<FetchingNotificationRef>((_, ref) => {
  const fetchingOpacity = useRef(new Animated.Value(0)).current;
  const fetchingTranslateY = useRef(new Animated.Value(-50)).current;

  useImperativeHandle(ref, () => ({
    show: () => {
      Animated.parallel([
        Animated.timing(fetchingOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fetchingTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
    hide: () => {
      Animated.parallel([
        Animated.timing(fetchingOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fetchingTranslateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fetchingOpacity,
          transform: [{ translateY: fetchingTranslateY }],
        },
      ]}
    >
      <Text style={styles.text}>Fetching nearby shops...</Text>
    </Animated.View>
  );
});

export default FetchingNotification;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color_pallete[1],
    opacity: 0.9,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
