import { localData } from "@/app-data/appData";
import { ExpandedShop } from "@/components/shopPreview";
import { color_pallete } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {fetchNearestShop} from "@/APIs/fetchShopPlan";

export default function shopPage() {
  const { parentPage, shop_id, org_id } = useLocalSearchParams<{
    parentPage: string;
    shop_id: string;
    org_id: string;
  }>();
  const { userLocation } = localData();

  const [shopId, setShopId] = useState(shop_id);

  useEffect(() => {
    const fetchShop = async () => {

      if (org_id && userLocation) {
        const shop = await fetchNearestShop(userLocation.latitude, userLocation.longitude, org_id);
        if (shop) {
          setShopId(shop);
        }
      }
    };
    fetchShop();
  }, [org_id]);


  return (
    <View style={{ flex: 1 }}>
      <View>
        <SafeAreaView style={{ backgroundColor: color_pallete[10] }}/>
        <View style={[styles.header, { paddingBottom: 5 }]}>
          <SafeAreaView />
          <TouchableOpacity
            style={styles.headerContainerButton}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons
              name={"chevron-back"}
              size={16}
              color={color_pallete[2]}
            />
            <Text style={styles.headerText}>Return to {parentPage}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {shopId ? (
        <View style={{ flex: 1 }}>
          <ExpandedShop
            shopId={shopId}
            isExpanded={true}
            setExpansion={undefined}
            type={1}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
          <Text>Finding nearest Shop</Text>
        </View>
      )}
    </View>
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
  headerContainerButton: {
    paddingLeft: "4%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 5,
  },

  headerText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Avenir Next",
    color: color_pallete[2],
  },
});
