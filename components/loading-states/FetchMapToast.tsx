import {Animated, StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import { localData } from '@/app-data/appData';
import { useEffect, useRef } from 'react';
import { color_pallete } from '@/constants/Colors';
export const FetchMapToast = () => {
    const { isPage2Loading } = localData();

    const fadeAnim = useRef(new Animated.Value(0)).current; 

    useEffect(() => {
        if (isPage2Loading) {
          fadeIn();
        } else {
          fadeOut();
        }
      }, [isPage2Loading]);

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }

    return (
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
          <View style={styles.toastContent}>
            <Text style={styles.toastText}>Fetching nearby shops</Text>
            <ActivityIndicator size="small" color={color_pallete[2]} />
          </View>
        </Animated.View>
      );
};

export const NoShopsToast = () => {
  const { radiusShops, isPage2Loading } = localData();
  const fadeAnim = useRef(new Animated.Value(0)).current; // useRef to persist the same Animated.Value across renders

  useEffect(() => {
    if (!isPage2Loading && radiusShops && radiusShops.length === 0) {
      // Shops loaded but none nearby → show toast
      fadeIn();

      // Auto fade out after 2.5 seconds
      const timer = setTimeout(() => {
        fadeOut();
      }, 2500);

      // Clear timer if user navigates or component unmounts
      return () => clearTimeout(timer);
    } else {
      // Hide the toast during loading or if shops exist
      fadeOut();
    }
  }, [isPage2Loading, radiusShops]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>No Shops Nearby</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    toastContainer: {
      position: "absolute",
      bottom: 30,
      alignSelf: "center",
      backgroundColor: color_pallete[10],
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    toastContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    toastText: {
      marginLeft: 10,
      color: color_pallete[2],
      fontWeight: "600",
    },
  });

