import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/shops/nearest";

export const fetchNearestShop = async (shop_id: string, lon: number, lat: number) => {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.idToken;
  if (!shop_id) {   
    throw new Error("No shop_id defined");
  }
  if (!lon || !lat) {
    throw new Error("No lon or lat defined");
  }
  if (!accessToken) {
    throw new Error("No access token available");
  }
  if (!url) {
    throw new Error("fetchNearestShop endpoint is not defined");
  }

  try {
      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          shop_id: shop_id,
          lat: lat,
          lon: lon,
        }
      });
      console.log(JSON.stringify(data));
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
