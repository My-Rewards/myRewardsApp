import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { localData } from "@/app-data/appData";
import { ShopPreview } from "@/components/shopPreview";
import { ShopPreviewProps } from "@/app-data/data-types";
import { color_pallete } from "@/constants/Colors";
import { mediumLogo } from "@/assets/images/MR-logos";

const { width } = Dimensions.get("window");

export default function DiscoverScreen() {
  const { fetchDiscover, discoverNearby, discoverPopular, discoverFavorite } =
    localData();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFilter, setLoadingNewFilter] = useState(false);
  const [savedFilterSelection, setSavedFilterSelection] = useState(0);

  const runAnimation = (value: number) =>
    Animated.timing(slideAnim, {
      toValue: value,
      duration: 150,
      useNativeDriver: true,
    }).start();

  useEffect(() => {
    runAnimation((width / 3) * savedFilterSelection);
  }, [savedFilterSelection]);

  const getCurrentList = () => {
    if (savedFilterSelection === 0) return discoverNearby;
    if (savedFilterSelection === 1) return discoverPopular;
    return discoverFavorite;
  };

  const getFilterKey =
    savedFilterSelection === 0
      ? "nearby"
      : savedFilterSelection === 1
      ? "popular"
      : "favorite";
  const handlePress = async (filterIndex: number) => {
    setLoadingNewFilter(true);
    setSavedFilterSelection(filterIndex);
    runAnimation((width / 3) * filterIndex);

    await fetchDiscover(
      filterIndex === 0 ? "nearby" : filterIndex === 1 ? "popular" : "favorite",
      true
    );
    setLoadingNewFilter(false);
  };

  const loadMoreData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchDiscover(getFilterKey, false);
    setLoadingMore(false);
  };

  return (
    <View style={styles.page}>
      <FilterBar slideAnim={slideAnim} handlePress={handlePress} />

      {loadingNewFilter ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <ShopPreviews
          discoverShops={getCurrentList()}
          filterSelection={savedFilterSelection}
          loadMoreData={loadMoreData}
          loadingMore={loadingMore}
        />
      )}

      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, .1)"]}
        style={styles.gradient}
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
    {["Nearby", "Popular", "Favorites"].map((label, i) => (
      <TouchableWithoutFeedback key={i} onPress={() => handlePress(i)}>
        <View style={styles.filterItem}>
          <Text style={styles.filterText}>{label}</Text>
        </View>
      </TouchableWithoutFeedback>
    ))}
  </View>
));

const ShopPreviews = ({
  discoverShops,
  filterSelection,
  loadMoreData,
  loadingMore,
}: {
  discoverShops?: ShopPreviewProps[];
  filterSelection: number;
  loadMoreData: () => Promise<void>;
  loadingMore: boolean;
}) => {
  const { isLoadingDiscover, fetchDiscover } = localData();

  const keyForFilter =
    filterSelection === 0
      ? "nearby"
      : filterSelection === 1
      ? "popular"
      : "favorite";

  if (!discoverShops) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={discoverShops}
      keyExtractor={(item) => item.shop_id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/shopPage",
              params: { parentPage: "Discover", shop_id: item.shop_id },
            })
          }
          style={{ margin: 15 }}
        >
          <ShopPreview selectedPin={item} type={1} />
        </TouchableOpacity>
      )}
      refreshing={isLoadingDiscover}
      onRefresh={() => fetchDiscover(keyForFilter, true)}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
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
      ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
    />
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color_pallete[10] },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterBar: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: color_pallete[0],
  },
  filterItem: { flex: 1, alignItems: "center", padding: 10 },
  filterText: {
    fontWeight: "600",
    fontSize: 13,
    color: color_pallete[2],
  },
  indicator: {
    position: "absolute",
    height: "100%",
    width: width / 3,
    backgroundColor: color_pallete[0],
    borderRadius: 20,
  },
  gradient: { ...StyleSheet.absoluteFillObject, pointerEvents: "none" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: color_pallete[2],
    fontWeight: "600",
    textAlign: "center",
  },
});
