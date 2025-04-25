import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  Image,
  ActivityIndicator,
  PanResponder,
  Platform,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Plan,
  OrganizationProps,
  shop,
  ShopPreviewProps,
} from "@/app-data/data-types";
import ShopScrollView from "./ShopScrollView";
import { localData } from "@/app-data/appData";
import { modalStyle, styles } from "./styling/mapPreviewStyle";
import { color_pallete } from "@/constants/Colors";
import { ExpendatureMap, RoadMap } from "@/components/planTemplate";
import Ionicons from "@expo/vector-icons/Ionicons";
import Collapsible from "react-native-collapsible";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import {
  calculateDistance,
  convertTo12HourFormat,
  getShopStatus,
} from "@/constants/functions";
import { useProps } from "@/app/LoadingProp/propsProvider";
import {fetchShop, fetchPlan} from "@/APIs/fetchShopPlan";
import {PlanLoadingState, RewardsLoadingState} from "@/components/navigation/loadingState";
import {toggleLike} from "@/APIs/updateOrgLike";

const { width } = Dimensions.get("window");

type MiniPreviewPropShops = {
  selectedPin: ShopPreviewProps;
  type: number;
};

type PreviewPropShops = {
  shopId: string;
  isExpanded: boolean;
  setExpansion: Dispatch<SetStateAction<boolean>> | undefined;
  type: number;
};

type OpenMapArgs = {
  lat: string | number;
  lng: string | number;
  label: string;
};

export const ShopPreview = ({ selectedPin, type }: MiniPreviewPropShops) => {
  const shopStatus = getShopStatus(selectedPin.shop_hours);

  return (
    <View style={[type == 0 ? styles.mapsPreview : styles.discoverPreview]}>
      <View style={[type == 0 ? styles.modalContent1 : styles.modalContent2]}>
        <View style={styles.miniContainer}>
          <View
            style={[
              type == 0
                ? { flex: 0.4, borderWidth: 2 }
                : { flex: 0.5, aspectRatio: 1 },
              styles.imageContainer,
            ]}
          >
            <Image
              style={{ height: "100%", resizeMode: "cover" }}
              source={{ uri: selectedPin.preview }}
            />
            <View style={{ position: "absolute", margin: 5 }}>
              {selectedPin.favorite && (
                <View style={[styles.heartButton]}>
                  <Ionicons
                    name="heart"
                    size={type == 0 ? 16 : 20}
                    color={type == 0 ? color_pallete[10] : color_pallete[10]}
                    style={{
                      shadowRadius: 3,
                      shadowColor: color_pallete[2],
                      shadowOpacity: 1,
                      shadowOffset: {
                        height: 0,
                        width: 0,
                      },
                    }}
                  />
                </View>
              )}
            </View>
          </View>
          <View
            style={{ flex: type == 0 ? 0.6 : 0.5, flexDirection: "column" }}
          >
            <View
              style={[
                styles.miniHeader,
                type == 0
                  ? { borderBottomColor: color_pallete[2], padding: 6 }
                  : { borderBottomColor: color_pallete[0] },
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  type == 0
                    ? { color: color_pallete[2] }
                    : { color: color_pallete[2] },
                ]}
              >
                {selectedPin.name}
              </Text>
            </View>
            <View
              style={{ padding: 10, flex: 1, flexDirection: "column", gap: 10 }}
            >
              <View>
                <Text
                  style={[
                    styles.minitext,
                    type == 0
                      ? { color: color_pallete[2] }
                      : { color: color_pallete[2] },
                  ]}
                >
                  {selectedPin.location.city}, {selectedPin.location.state}
                </Text>
                <Text
                  style={[
                    styles.miniSubText,
                    type == 0
                      ? { color: color_pallete[2], fontSize: 10 }
                      : { color: color_pallete[2] },
                  ]}
                >
                {selectedPin.distance != null
                  ? `${selectedPin.distance} miles away`
                  : "location unavailable"}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.minitext2,
                    {
                      color:
                        shopStatus.status == "Open"
                          ? color_pallete[3]
                          : color_pallete[9],
                    },
                  ]}
                >
                  {shopStatus.status}
                </Text>
                {shopStatus.hours &&
                shopStatus.hours.open &&
                shopStatus.hours.close ? (
                  <Text
                    style={[
                      styles.miniSubText,
                      type == 0
                        ? { color: color_pallete[2], fontSize: 10 }
                        : { color: color_pallete[2] },
                    ]}
                  >
                    {convertTo12HourFormat(shopStatus.hours?.open)} -{" "}
                    {convertTo12HourFormat(shopStatus.hours?.close)}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// The reusable content component
export const ExpandedShop = ({
  shopId,
  type,
  setExpansion,
}: PreviewPropShops) => {
  const { profile, userLocation } = localData();
  const [busy, setBusy] = useState(false);

  const [shopDetails, setShopDetails] = useState<shop | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [expandHours, setExpandHours] = useState<boolean>(false);
  const [distance, setDistance] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const highlightPosition = useRef(new Animated.Value(-15)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const currentScreen = useRef(0);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (profile) {
        setLoading(true);
        try {
          if (!profile.id) {
            throw new Error("No profile id found");
          }
          const shopData = await fetchShop(shopId);
          setShopDetails(shopData);
          setDistance(
            calculateDistance(
              shopData.latitude,
              shopData.longitude,
              userLocation
            )
          );
          setLiked(shopData.favorite);
          const planData = await fetchPlan(shopData.org_id);
          setPlan(planData);
        } catch (error) {
          console.error("Error fetching shop details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchShopDetails();
  }, [shopId]);


  const handleToggle = (index: number) => {
    setSelectedIndex(index);
    currentScreen.current = -index;

    Animated.timing(highlightPosition, {
      toValue: index * (width / 2) - 15,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(translateX, {
      toValue: width * currentScreen.current,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminate: (_, gestureState) => {
      if (gestureState.dx < -width / 6 && currentScreen.current === 0) {
        currentScreen.current = -1;
      } else if (gestureState.dx > width / 6 && currentScreen.current === -1) {
        currentScreen.current = 0;
      }
      handleToggle(-currentScreen.current);
    },
    onPanResponderMove: (_, gestureState) => {
      const nextTranslateX = width * currentScreen.current + gestureState.dx;
      const underlineTranslation =
        -((width / 2) * currentScreen.current) - 15 - gestureState.dx / 2;

      if (
        (currentScreen.current === 0 && gestureState.dx > 0) ||
        (currentScreen.current === -1 && gestureState.dx < 0)
      ) {
        return;
      }
      translateX.setValue(nextTranslateX);
      highlightPosition.setValue(underlineTranslation);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width / 4 && currentScreen.current === 0) {
        currentScreen.current = -1;
      } else if (gestureState.dx > width / 4 && currentScreen.current === -1) {
        currentScreen.current = 0;
      }

      handleToggle(-currentScreen.current);
    },
  });

  const planSection = () => {
    if (plan) {
      return (
        <View>
          <Animated.View
            style={[
              modalStyle.wrapper,
              plan.rl_active && plan.rm_active
                ? { width: width * 2 }
                : { width: width },
              { transform: [{ translateX }] },
            ]}
            {...(plan.rl_active &&
              plan.rm_active &&
              panResponder.panHandlers)}
          >
            {plan.rl_active && (
              <View style={{ width }}>
                <RoadMap plan={plan} />
              </View>
            )}
            {plan.rm_active && (
              <View style={{ width }}>
                <ExpendatureMap plan={plan} />
              </View>
            )}
          </Animated.View>
        </View>
      );
    } else {
      return (
        <View>
          <RewardsLoadingState />
        </View>
      );
    }
  };

  const redirectWeb = async (url: string | undefined) => {
    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      } catch (error) {
        console.error("Something went wrong", error);
      }
    }
  };

  const openMap = ({ lat, lng, label }: OpenMapArgs) => {
    const scheme = Platform.select({
      ios: `maps://?q=${label}&ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });

    if (scheme) {
      Linking.openURL(scheme).catch((err) =>
        console.error("Error opening map: ", err)
      );
    }
  };

  const handleLike = async () => {
      if (busy || !shopDetails?.org_id) return;
      setBusy(true);
      setLiked(!liked);

      const { status } = await toggleLike(shopDetails.org_id);
      if(status != !liked) setLiked(status);

      setBusy(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <View style={type == 0 ? modalStyle.container : styles.expandedContainer}>
        {loading || !shopDetails || !distance ? (
            <PlanLoadingState />
        ) : (
          <ShopScrollView
            headerBackgroundColor={{
              light: "rgba(64, 124, 156, 1)",
              dark: "rgba(64, 124, 156, 1)",
            }}
            headerImage={
              <Image
                source={{ uri: shopDetails.banner }}
                style={modalStyle.image}
                resizeMode="contain"
              />
            }
            name={shopDetails.name}
            description={shopDetails.description}
            setExpansion={setExpansion}
          >
            <View>
              <View
                style={{
                  backgroundColor: color_pallete[5],
                  paddingVertical: 10,
                }}
              >
                <View>
                  <View style={modalStyle.infoRow}>
                    <Ionicons
                      name={"location-outline"}
                      color={"white"}
                      size={25}
                    />
                    <TouchableOpacity
                      style={modalStyle.internalInfoRow}
                      activeOpacity={1}
                      onPress={() => {
                        openMap({
                          lat: shopDetails.latitude,
                          lng: shopDetails.longitude,
                          label: "Open maps",
                        });
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={modalStyle.underline_infoText}>
                          {shopDetails.location.city},{" "}
                          {shopDetails.location.state}
                        </Text>
                        <Text style={modalStyle.sub_infoText}>
                          {distance} miles away
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward"
                        style={{
                          transform: [{ rotate: "-45deg" }],
                          marginRight: 10,
                        }}
                        color={"white"}
                        size={25}
                      />
                      <View style={modalStyle.underline} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={modalStyle.infoRow}>
                  <View
                    style={{ position: "relative", height: "100%", width: 25 }}
                  >
                    <AntDesign
                      name={"clockcircleo"}
                      color={"white"}
                      size={25}
                      style={{
                        position: "absolute",
                        alignSelf: "center",
                        top: 15,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <TouchableOpacity
                      style={modalStyle.internalInfoRow}
                      activeOpacity={1}
                      onPress={() => {
                        setExpandHours(!expandHours);
                      }}
                    >
                      <Text
                        style={
                          getShopStatus(shopDetails.shop_hours).status == "Open"
                            ? modalStyle.openText
                            : modalStyle.closedText
                        }
                      >
                        {getShopStatus(shopDetails.shop_hours).status}
                      </Text>
                      <Ionicons
                        name="chevron-up"
                        size={25}
                        color={"white"}
                        style={{
                          transform: [
                            { rotate: !expandHours ? "90deg" : "180deg" },
                          ],
                          marginRight: 10,
                        }}
                      />
                    </TouchableOpacity>
                    <View>
                      <Collapsible collapsed={!expandHours}>
                        <View style={{ marginBottom: 10, gap: 2 }}>
                          {shopDetails.shop_hours.map((shopDay, index) => {
                            if (shopDay.open && shopDay.close) {
                              return (
                                <View
                                  style={modalStyle.hoursContainer}
                                  key={index}
                                >
                                  <Text style={modalStyle.infoText1}>
                                    {shopDay.day}
                                  </Text>
                                  <View>
                                    <Text style={modalStyle.infoText1}>
                                      {convertTo12HourFormat(shopDay.open)} -{" "}
                                      {convertTo12HourFormat(shopDay.close)}
                                    </Text>
                                  </View>
                                </View>
                              );
                            } else {
                              return (
                                <View
                                  style={modalStyle.hoursContainer}
                                  key={index}
                                >
                                  <Text style={modalStyle.infoText1}>
                                    {shopDay.day}
                                  </Text>
                                  <Text style={modalStyle.infoText1}>
                                    Closed
                                  </Text>
                                </View>
                              );
                            }
                          })}
                        </View>
                      </Collapsible>
                    </View>
                    <View style={modalStyle.underline} />
                  </View>
                </View>
                {shopDetails.menu && (
                  <View>
                    <View style={modalStyle.infoRow}>
                      <MaterialIcons
                        name={"restaurant"}
                        color={"white"}
                        size={25}
                      />
                      <TouchableOpacity
                        style={modalStyle.internalInfoRow}
                        activeOpacity={1}
                        onPress={() => redirectWeb(shopDetails.menu)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={modalStyle.underline_infoText}>
                            Menu
                          </Text>
                        </View>
                        <Ionicons
                          name="arrow-forward"
                          style={{
                            transform: [{ rotate: "-45deg" }],
                            marginRight: 10,
                          }}
                          color={"white"}
                          size={25}
                        />
                        <View style={modalStyle.underline} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <View>
                  <View style={modalStyle.infoRow}>
                    <AntDesign
                      name={"phone"}
                      style={{ transform: [{ scaleX: -1 }] }}
                      color={"white"}
                      size={25}
                    />
                    <TouchableOpacity
                      style={modalStyle.internalInfoRow}
                      activeOpacity={1}
                      onPress={() =>
                        redirectWeb(`tel:${shopDetails.phone_number}`)
                      }
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={modalStyle.underline_infoText}>
                          {shopDetails.phone_number}
                        </Text>
                      </View>
                      <Ionicons
                        name="arrow-forward"
                        style={{
                          transform: [{ rotate: "-45deg" }],
                          marginRight: 10,
                        }}
                        color={"white"}
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {plan?.rm_active && plan?.rl_active && (
                <View style={{ width: "100%", backgroundColor: "white" }}>
                  <Animated.View
                    style={[
                      { left: highlightPosition },
                      modalStyle.toggleHighlight,
                    ]}
                  />
                  <View style={modalStyle.toggleSection}>
                    <TouchableOpacity onPress={() => handleToggle(0)}>
                      <Text
                        style={[
                          modalStyle.toggleText,
                          selectedIndex === 0
                            ? { opacity: 1 }
                            : { opacity: 0.6 },
                        ]}
                      >
                        Loyalty Rewards
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggle(1)}>
                      <Text
                        style={[
                          modalStyle.toggleText,
                          selectedIndex === 1
                            ? { opacity: 1 }
                            : { opacity: 0.6 },
                        ]}
                      >
                        Milestone Rewards
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View>
                <View style={styles.subHeader}>
                  <View style={styles.titleContainer}>
                    <View style={styles.logo}>
                      <Image
                        style={{ flex: 1, backgroundColor: "gray" }}
                        source={{ uri: shopDetails.logo }}
                      />
                    </View>
                    <Text style={styles.text1}>{shopDetails.name}</Text>
                  </View>
                  <TouchableOpacity onPress={handleLike} disabled={busy}>
                    <TabBarIcon
                      color={color_pallete[2]}
                      name={liked ? "heart" : "heart-outline"}
                    />
                  </TouchableOpacity>
                </View>
                {planSection()}
                {plan && !plan.active && (
                  <View
                    style={{
                      alignSelf: "center",
                      marginBottom: "20%",
                      marginHorizontal:10
                    }}
                  >
                    <Text style={styles.startPlanText}>Log your first visit to activate your plan!</Text>
                  </View>
                )}
              </View>
            </View>
          </ShopScrollView>
        )}
      </View>
    </View>
  );
};

// The modal wrapper component
export const ExpandedModalShop = ({
  shopId,
  setExpansion,
  isExpanded,
  type,
}: PreviewPropShops) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isExpanded}
      onRequestClose={() => setExpansion && setExpansion(false)}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <ExpandedShop
          shopId={shopId}
          type={type}
          setExpansion={setExpansion}
          isExpanded={isExpanded}
        />
      </View>
    </Modal>
  );
};
