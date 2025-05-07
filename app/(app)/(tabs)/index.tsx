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
import { mediumLogo } from "@/assets/images/MR-logos";
import { SvgXml } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function index() {
  const {
    fetchDiscover,
    setSavedFilterSelection,
    savedFilterSelection,
    discoverNearby,
    discoverPopular,
    discoverFavorite,
    isLoadingDiscover,
    filterNumber,
    setFilterNumber,
  } = localData();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loadingMore, setLoadingMore] = useState(false);
  const runAnimation = (value: number) => {
    Animated.timing(slideAnim, {
      toValue: value,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    runAnimation(filterNumber * (width / 3));
  }, [savedFilterSelection]);

  const getCurrentList = () => {
    if (filterNumber === 0) return discoverNearby;
    if (filterNumber === 1) return discoverPopular;
    return discoverFavorite;
  };

  const handlePress = async (index: 0 | 1 | 2) => {
    runAnimation(index * (width / 3));
    setFilterNumber(index);

    const key = index === 0 ? "nearby" : index === 1 ? "popular" : "favorite";

    setSavedFilterSelection(key);

    await fetchDiscover(key, false);
  };

  const loadMoreData = async () => {
    if (!loadingMore) {
      try {
        setLoadingMore(true);
        fetchDiscover(savedFilterSelection, false);
      } catch (error) {
        console.error("Error fetching more shops:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return (
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress} />
      {!isLoadingDiscover ? (
        <ShopPreviews
          discoverShops={getCurrentList()}
          filterSelection={filterNumber}
          loadMoreData={loadMoreData}
          loadingMore={loadingMore}
        />
      ) : (
        <View style={styles.loading}>
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

const ShopPreviews = ({
  loadMoreData,
  discoverShops,
  filterSelection,
}: {
  discoverShops: ShopPreviewProps[] | null | undefined;
  filterSelection: number;
  loadMoreData: () => Promise<void>;
  loadingMore: boolean;
}) => {
  const {
    isLoadingDiscover,
    setIsLoadingDiscover,
    fetchDiscover,
    savedFilterSelection,
    setSavedFilterSelection,
  } = localData();

  const handleScroll = async (event: any) => {
    // const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    if (!isLoadingDiscover) {
      await loadMoreData();
    }
  };

  const openShopPage = (shop_id: string) => {
    router.push({
      pathname: "/shopPage",
      params: { parentPage: "Discover", shop_id },
    });
  };

  const refreshAll = async () => {
    setIsLoadingDiscover(true);
    try{
      await Promise.all([
        fetchDiscover("nearby", true),
         fetchDiscover("popular", true),
        fetchDiscover("favorite", true),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoadingDiscover(false);
    }
  }

  if (discoverShops) {
    return (
      <View style={{ flex: 1, width: "100%", height: "100%", zIndex: 100 }}>
        <FlatList
          data={discoverShops}
          extraData={discoverShops}
          horizontal={false}
          renderItem={({ item }) => (
            <View key={item.shop_id} style={{ marginHorizontal: 15 }}>
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
          keyExtractor={(item) => item.shop_id}
          removeClippedSubviews={false}
          refreshing={isLoadingDiscover}
          onRefresh={refreshAll}
          windowSize={2}
          onScrollEndDrag={handleScroll}
          onEndReachedThreshold={0.8}
          onEndReached={handleScroll}
          ListEmptyComponent={
            filterSelection === 2 ? (
              <View style={styles.empty}>
                <SvgXml
                  xml={mediumLogo}
                  height={width / 4}
                  width={width * 0.7}
                  color={color_pallete[1]}
                />
                <Text style={styles.emptyText}>
                  Favorited Shops Will Appear Here
                </Text>
              </View>
            ) : null
          }
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
};

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
  empty: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: color_pallete[2],
    fontFamily: "Avenir Next",
    fontWeight: "600",
    flexWrap: "wrap",
    textAlign: "center",
    width: "80%",
    marginBottom: "8%",
  },
});
