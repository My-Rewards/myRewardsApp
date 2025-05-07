import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { router, Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { color_pallete } from "@/constants/Colors";
import { SvgXml } from "react-native-svg";
import { useState } from "react";
import { whtieStar } from "@/assets/images/MR-logos";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fetchTypedShop } from "@/APIs/DiscoverAPIs/fetchTypedShop";
import { localData } from "@/app-data/appData";
import { RewardModalProvider } from "../Reward/redeem";
export default function TabLayout() {
  // check if iphone is new era or old era iphone
  const insets = useSafeAreaInsets();
  const hasSafeArea = insets.bottom > 0;
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string }[]
  >([]);
  const { searchShop } = localData();

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.trim() === "") {
      setSearchResults([]);
      return;
    } else {
      try {
        const results = await fetchTypedShop(text);
        if (results) {
          const names = [];
          for (let result of results) {
            names.push({ id: result.id, name: result.search_name });
          }
          setSearchResults(names);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    }
  };
  const handleResultClick = async (result: string) => {
    setSearchText(result);
    setSearchResults([]);
    await fetchSearchResult(result);
  };

  const fetchSearchResult = async (name: string) => {
    searchShop(name);
    setSearchText("");
    setSearchResults([]);
  };
  return (
        <Tabs
        screenOptions={{
        headerShown: true,
        headerStyle: [styles.header],
        headerTitleAlign: "left",
        headerTitleStyle: [styles.headerText],
        tabBarStyle: [hasSafeArea ? styles.newEraNavbar : styles.oldEraNavbar],
        tabBarItemStyle: { gap: 5 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={"menu"}
              color={focused ? "white" : color_pallete[1]}
            />
          ),
          header: () => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.header2}>
                <SafeAreaView />
                <Text style={[styles.headerText, { color: color_pallete[2] }]}>
                  Discover
                </Text>
                <View style={{ marginVertical: 10, zIndex: 15 }}>
                  <View style={styles.searchBar}>
                    <TextInput
                      placeholder="Search"
                      autoCapitalize="none"
                      keyboardType="default"
                      onChangeText={handleSearch}
                      value={searchText}
                      autoCorrect={false}
                      style={styles.searchBarText}
                      placeholderTextColor={color_pallete[4]}
                    />
                    <View>
                      <TabBarIcon name={"search"} color={color_pallete[3]} />
                    </View>
                  </View>
                </View>
                {searchText && searchResults.length > 0 && (
                  <FlatList
                    data={searchResults}
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.resultItem}
                        activeOpacity={1}
                        onPress={async () => handleResultClick(item.name)}
                      >
                        {/* Wrap the text inside a Text component */}
                        <Text style={styles.resultText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.searchResults}
                  />
                )}
                {searchResults.length === 0 && searchText && (
                  <TouchableOpacity
                    style={styles.searchResults}
                    activeOpacity={1}
                  >
                    <View style={styles.resultItem}>
                      <Text style={styles.resultText}>No shops found</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 12,
                color: focused ? "white" : color_pallete[1],
                fontFamily: "Avenir Next",
              }}
            >
              Discover
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="mapPage"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "white" : color_pallete[1],
                flex: 1,
                borderRadius: 50,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome name={"location-arrow"} color={color_pallete[0]} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 12,
                color: focused ? "white" : color_pallete[1],
                fontFamily: "Avenir Next",
              }}
            >
              Map
            </Text>
          ),
          header: () => (
            <View style={[styles.header, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <Text style={styles.headerText}>Map</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scanPage"
        options={{
          title: undefined,
          headerShown: false,
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress}
              activeOpacity={1}
              style={styles.scanButton}
            >
              <SvgXml
                xml={whtieStar}
                width="100%"
                height="100%"
                color={color_pallete[1]}
              />
              <Ionicons
                name={"chevron-back"}
                color={color_pallete[1]}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: [{ rotate: "45deg" }],
                }}
              />
              <Ionicons
                name={"chevron-back"}
                color={color_pallete[1]}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  transform: [{ rotate: "135deg" }],
                }}
              />
              <Ionicons
                name={"chevron-back"}
                color={color_pallete[1]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
              <Ionicons
                name={"chevron-back"}
                color={color_pallete[1]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  transform: [{ rotate: "-135deg" }],
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="plansPage"
        options={{
          title: "Rewards",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                flex: 1,
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={"book"}
                color={focused ? "white" : color_pallete[1]}
                size={25}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 12,
                color: focused ? "white" : color_pallete[1],
                fontFamily: "Avenir Next",
              }}
            >
              Plans
            </Text>
          ),
          header: () => (
            <View style={[styles.header2, { paddingBottom: 5 }]}>
              <SafeAreaView />
              <View style={styles.planHeader}>
                <SvgXml
                  xml={whtieStar}
                  height="40"
                  width="40"
                  color={color_pallete[1]}
                />
                <Text style={styles.headerText}>My Plans</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profilePage"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={"person"}
              color={focused ? "white" : color_pallete[1]}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontWeight: "normal",
                fontSize: 12,
                color: focused ? "white" : color_pallete[1],
                fontFamily: "Avenir Next",
              }}
            >
              Profile
            </Text>
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: color_pallete[10],
    elevation: 0,
    shadowOpacity: 0.1,
    borderBottomWidth: 2,
    shadowColor: "black",
    shadowRadius: 3,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    borderBottomColor: color_pallete[2],
  },
  header2: {
    backgroundColor: color_pallete[10],
    elevation: 0,
    borderBottomWidth: 2,
    borderBottomColor: color_pallete[0],
  },
  headerContainerButton: {
    paddingLeft: "4%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 5,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Avenir Next",
    color: color_pallete[2],
    marginLeft: "5%",
  },
  headerText2: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Avenir Next",
    color: color_pallete[2],
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    justifyContent: "space-between",
    padding: 8,
    marginHorizontal: 15,
    borderColor: color_pallete[3],
    borderWidth: 2,
    borderRadius: 10,
    gap: 5,
    backgroundColor: color_pallete[10],
  },
  searchBarText: {
    flex: 1,
    fontFamily: "Avenir Next",
    fontSize: 15,
    color: color_pallete[2],
  },
  resultItem: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: color_pallete[3],
  },
  resultText: {
    fontFamily: "Avenir Next",
    fontSize: 15,
    color: color_pallete[2],
  },
  searchResults: {
    position: "absolute",
    top: "100%",
    left: 15,
    right: 15,
    marginTop: -15,
    maxHeight: 200,
    backgroundColor: color_pallete[10],
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 8,
    zIndex: 10,
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  planHeader: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    paddingLeft: "4%",
  },
  newEraNavbar: {
    position: "relative",
    backgroundColor: color_pallete[0],
    paddingTop: 5,
    height: 88, //88 because 85 + 3 (border)
    borderTopColor: color_pallete[1],
    borderTopWidth: 2,
    zIndex: 99,
  },
  oldEraNavbar: {
    position: "relative",
    backgroundColor: color_pallete[0],
    paddingTop: 5,
    paddingBottom: 10,
    height: 65,
    borderTopColor: color_pallete[1],
    borderTopWidth: 2,
    zIndex: 99,
  },
  scanButton: {
    flex: 1,
    width: "100%",
    height: "100%",
    aspectRatio: 5 / 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
});
