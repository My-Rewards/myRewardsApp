import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { color_pallete } from "@/constants/Colors";
import { loadingState } from "./loadingState";
const { width } = Dimensions.get("window");

export const ShopPreviewLoading = () => {
  const animatedBackground = loadingState();
  return (
    <View style={styles.mapsPreview}>
      <View style={styles.modalContent1}>
        <View style={styles.miniContainer}>
          <Animated.View
            style={[
              {
                flex: 0.4,
                borderWidth: 2,
                backgroundColor: animatedBackground,
              },
              styles.imageContainer,
            ]}
          >
            <Image style={{ height: "100%", resizeMode: "cover" }} />
            <View style={{ position: "absolute", margin: 5 }}></View>
          </Animated.View>
          <View style={{ flex: 0.6, flexDirection: "column" }}>
            <Animated.View
              style={[
                styles.miniHeader,
                {
                  borderBottomColor: color_pallete[2],
                  padding: 6,
                  backgroundColor: animatedBackground,
                },
              ]}
            >
              <Text style={[styles.headerText]}></Text>
            </Animated.View>
            <View
              style={{ padding: 10, flex: 1, flexDirection: "column", gap: 10 }}
            >
              <Animated.View style={{ backgroundColor: animatedBackground }}>
                <Text style={[styles.minitext]}></Text>
                <Text style={[styles.miniSubText]}></Text>
              </Animated.View>
              <Animated.View style={{ backgroundColor: animatedBackground }}>
                <Text style={[styles.minitext2]}></Text>
                <Text style={[styles.miniSubText]}></Text>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent1: {
    backgroundColor: color_pallete[10],
    flex: 1,
    margin: 10,
    borderRadius: 10,
    width: width - 20,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  mapsPreview: {
    height: "100%",
    width: width - 30,
    alignSelf: "center",
    marginHorizontal: 10,
    backgroundColor: "transparent",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  subHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 30,
  },
  modalTitle1: {
    alignSelf: "center",
    fontFamily: "Avenir Next",
    fontWeight: "600",
    fontSize: 13,
    color: color_pallete[3],
    opacity: 0.8,
  },
  miniContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
    height: "auto",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  heartButton: {
    padding: 4,
    borderRadius: 20,
  },
  miniHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    width: "50%",
    gap: 10,
  },
  headerText: {
    fontFamily: "Avenir Next",
    flex: 1,
    fontWeight: "700",
    fontSize: 18,
  },
  minitext: {
    fontFamily: "Avenir Next",
    fontSize: 14,
    fontWeight: "600",
  },
  minitext2: {
    fontFamily: "Avenir Next",
    fontSize: 14,
    fontWeight: "600",
  },
  miniSubText: {
    fontFamily: "Avenir Next",
    fontSize: 12,
    fontWeight: "400",
  },
  imageContainer: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderRadius: 10,
    borderColor: "white",
    overflow: "hidden",
  },
  startPlanBttn: {
    borderWidth: 3,
    borderColor: color_pallete[5],
    width: "70%",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
  },
  startPlanText: {
    fontFamily: "Avenir Next",
    marginHorizontal: "auto",
    textAlign: "center",
    opacity: 0.6,
    fontSize: 18,
    fontWeight: "600",
    color: color_pallete[2],
  },
});

export const modalStyle = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    backgroundColor: "white",
    flex: 0.8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: "hidden",
  },
  loadingContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  container2: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 99,
  },
  imageContainer: {
    justifyContent: "flex-start",
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 3 / 2,
    backgroundColor: "gray",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontFamily: "Avenir Next",
  },
  modalTitle1: {
    alignSelf: "center",
    fontFamily: "Avenir Next",
    fontWeight: "700",
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
});
