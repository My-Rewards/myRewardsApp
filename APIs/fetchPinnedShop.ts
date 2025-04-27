import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/shops/pinned";

export const fetchPinnedShop = async (shop_id: string | undefined, longitude: number | undefined, latiude: number | undefined) => {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.idToken;
    if (!longitude && !latiude) {   
        throw new Error("No longitude or latitude available");
    }
  if (!shop_id) {   
    throw new Error("No shop_id");
  }
  if (!accessToken) {
    throw new Error("No access token available");
  }
  if (!url) {
    throw new Error("radiusShops endpoint is not defined");
  }

  try {
      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
            shop_id: shop_id,
            lon: longitude,
            lat: latiude,
        }
      });
      return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
};
