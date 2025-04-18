import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { color_pallete } from "@/constants/Colors";
import { localData } from "@/app-data/appData";
import { ShopPreview } from "@/components/shopPreview";
import { ShopPreviewProps, shop } from "@/app-data/data-types";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function index() {
  const {
    fetchDiscoverShops,
    discoverShopsFilter1,
    discoverShopsFilter2,
    discoverShopsFilter3,
  } = localData();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFilter, setLoadingNewFilter] = useState(false);
  const [savedFilterSelection, setSavedFilterSelection] = useState(0);

  const runAnimation = (value: number) => {
    Animated.timing(slideAnim, {
      toValue: value,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const sendShopOption = () => {
    switch (savedFilterSelection) {
      case 0:
        return discoverShopsFilter1;
      case 1:
        return discoverShopsFilter2;
      case 2:
        return discoverShopsFilter3;
    }
  };

  const handlePress = async (filterSelection: number) => {
    try {
      setLoadingNewFilter(true);
      setSavedFilterSelection(filterSelection);

      runAnimation(filterSelection * (width / 3));

      setLoadingNewFilter(false);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  // TBD on wheter/when this will be implemented

  // const loadMoreData = async () => {
  //   if (!loadingMore) {
  //     try {
  //       setLoadingMore(true);
  //       await fetchDiscoverShops(savedFilterSelection, 1);
  //     } catch (error) {
  //       console.error("Error fetching more shops:", error);
  //     } finally {
  //       setLoadingMore(false);
  //     }
  //   }
  // };

  return (
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress} />
      {!loadingNewFilter ? (
        <ShopPreviews
          discoverShops={sendShopOption()}
          filterSelection={savedFilterSelection}
          // loadMoreData={loadMoreData}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      )}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, .1)"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 5,
          pointerEvents: "none",
        }}
        locations={[0.3, 1]}
      />
    </View>
  );
}

const FilterBar = React.memo(({ slideAnim, handlePress }: any) => (
  <View style={styles.filterBar}>
    <Animated.View
      style={[styles.indicator, { transform: [{ translateX: slideAnim }] }]}
    />
    {[0, 1, 2].map((filterSelection) => (
      <TouchableWithoutFeedback
        key={filterSelection}
        onPress={() => handlePress(filterSelection)}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.filterText}>
            {filterSelection === 0
              ? "Nearby"
              : filterSelection === 1
              ? "Popular"
              : "Favorites"}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ))}
  </View>
));

const ShopPreviews = React.memo(
  ({
    discoverShops,
    filterSelection,
  }: {
    discoverShops: ShopPreviewProps[] | null | undefined;
    filterSelection: number;
  }) => {
    // loadMoreData:() => Promise<void>

    const { isPage1Loading, fetchDiscoverShops } = localData();

    // const handleScroll = async (event: any) => {
    //   const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    //   if ((contentOffset.y + layoutMeasurement.height >= contentSize.height - 20) && !isPage1Loading && contentOffset.y>0) {
    //     loadMoreData();
    //   }
    // };

    const openShopPage = (shop_id: string) => {
      router.push({
        pathname: "/shopPage",
        params: { parentPage: "Discover", shop_id },
      });
    };

    if (discoverShops) {
      return (
        <View style={{ flex: 1, width: "100%", height: "100%", zIndex: 100 }}>
          <FlatList
            data={discoverShops}
            horizontal={false}
            renderItem={({ item }) => (
              <View key={item.id} style={{ marginHorizontal: 15 }}>
                <TouchableOpacity onPress={() => openShopPage(item.shop_id)}>
                  <ShopPreview selectedPin={item} type={1} />
                </TouchableOpacity>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, width: "100%", height: "100%" }}
            scrollEventThrottle={20}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={false}
            refreshing={isPage1Loading}
            onRefresh={() => {
              fetchDiscoverShops(filterSelection, 0);
            }}
            windowSize={2}
            // onScrollEndDrag={handleScroll}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
  }
);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBar: {
    position: "relative",
    display: "flex",
    width: "100%",
    zIndex: 100,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: color_pallete[0],
    borderBottomWidth: 2,
  },
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: color_pallete[10],
  },
  filterText: {
    fontFamily: "Avenir Next",
    fontWeight: "600",
    color: color_pallete[2],
    fontSize: 13,
    padding: 10,
  },
  indicator: {
    position: "absolute",
    height: "100%",
    left: -15,
    width: width / 3 + 30,
    backgroundColor: color_pallete[0],
    borderRadius: 20,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    padding: 20,
    backgroundColor: color_pallete[1],
    borderRadius: 10,
    alignItems: "center",
  },
  cardText: {
    color: color_pallete[2],
    fontSize: 16,
    fontWeight: "bold",
  },
});
