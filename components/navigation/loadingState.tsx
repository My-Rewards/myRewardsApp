import {View, StyleSheet, Dimensions, Animated, ActivityIndicator} from "react-native";
import React, { useEffect, useRef } from "react";
import {modalStyle} from "@/components/styling/mapPreviewStyle";

export function ProfileLoadingState() {
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

  const windowHeight = Dimensions.get("window").height;
  return (
    <View style={[styles.container, { height: windowHeight - 90 }]}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          {/* User Icon */}
          <Animated.View
            style={[styles.userIcon, { backgroundColor: animatedBackground }]}
          />

          {/* User Info */}
          <Animated.View
            style={[styles.userName, { backgroundColor: animatedBackground }]}
          />
          <View style={styles.emailWrapper}>
            <View style={styles.emailContainer}>
              <View style={styles.emailLine} />
              <Animated.View
                style={[
                  styles.emailText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <View style={styles.emailLine} />
            </View>
          </View>

          {/* Membership Info */}
          <View style={styles.membershipContainer}>
            <View style={styles.membershipRow}>
              <Animated.View
                style={[
                  styles.membershipText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.membershipText,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
            <View style={styles.membershipRow}>
              <Animated.View
                style={[
                  styles.membershipText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.membershipText,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
          </View>

          {/* View Plans Button */}
          <Animated.View
            style={[
              styles.viewPlansButton,
              { backgroundColor: animatedBackground },
            ]}
          />
        </View>

        <View style={styles.actionButtonContainer}>
          {/* First Card Group */}
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <Animated.View
                style={[
                  styles.menuText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallIcon,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
            <View style={styles.menuDivider} />

            <View style={styles.menuItem}>
              <Animated.View
                style={[
                  styles.menuText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallIcon,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
            <View style={styles.menuDivider} />

            <View style={styles.menuItem}>
              <Animated.View
                style={[
                  styles.menuText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallIcon,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
          </View>

          {/* Second Card Group */}
          <View style={styles.card}>
            <View style={styles.menuItem}>
              <Animated.View
                style={[
                  styles.menuText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallIcon,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
            <View style={styles.menuDivider} />

            <View style={styles.menuItem}>
              <Animated.View
                style={[
                  styles.menuText,
                  { backgroundColor: animatedBackground },
                ]}
              />
              <Animated.View
                style={[
                  styles.smallIcon,
                  { backgroundColor: animatedBackground },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export function PlanLoadingState(){
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

  const animatedBackgroundColorDelay = animatedValue2.interpolate({
    inputRange: [0.5, 1],
    outputRange: ["gray", "darkgray"],
  });

    return(
        <View style={modalStyle.loadingContainer}>
          <Animated.View
              style={[
                { height: 250, width: "100%" },
                { backgroundColor: animatedBackgroundColor },
              ]}
          />
          <Animated.View
              style={{
                height: 200,
                width: "100%",
                backgroundColor: animatedBackgroundColorDelay
              }}
          />
          <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                flex: 1,
              }}
          >
            <Animated.View
                style={[
                  { height: 200, width: "100%", },
                  { backgroundColor: 'red' },
                ]}
            />
          </View>
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf7",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
  },
  userIcon: {
    width: 70,
    height: 70,
    marginBottom: 12,
    backgroundColor: "hsl(0, 1%, 85%)",
  },
  userName: {
    backgroundColor: "hsl(0, 1%, 85%)",
    width: 300,
    height: 40,
  },
  emailWrapper: {
    width: "100%",
    marginBottom: 8,
    marginTop: 20,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  emailLine: {
    height: 2.5,
    width: 77,
    backgroundColor: "#7F513A",
  },
  emailText: {
    height: 5,
    width: 50,
    backgroundColor: "hsl(0, 1%, 85%)",
  },
  membershipContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,
    marginTop: 5,
  },
  membershipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  membershipText: {
    backgroundColor: "hsl(0, 1%, 85%)",
    height: 8,
    width: 50,
  },
  viewPlansButton: {
    backgroundColor: "hsl(0, 1%, 85%)",
    width: 400,
    maxWidth: 320,
    height: 50,
    padding: 12,
    borderRadius: 12,
    marginBottom: 26,
    marginTop: 2,
  },
  viewPlansText: {
    fontFamily: "AvenirNext-Bold",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
  },
  actionButtonContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 24,
    alignSelf: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: "#7F513A",
    borderRadius: 10,
    overflow: "hidden",
  },
  smallIcon: {
    height: 18,
    width: 18,
    backgroundColor: "hsl(0, 1%, 85%)",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuText: {
    backgroundColor: "hsl(0, 1%, 85%)",
    height: 20,
    width: 100,
  },
  menuIcon: {
    position: "absolute",
    right: 16,
  },
  deleteText: {
    fontFamily: "AvenirNext-Medium",
    fontSize: 14,
    color: "#F35E43",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#8B4513",
    width: "92%",
    alignSelf: "center",
  },
  modalContent: {
    height: 1 / 2,
  },
});
