import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/shops/discover";

export const fetchNearbyShops = async (longitude: number | undefined, latitude: number | undefined, page: number) => {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.idToken;
  if (!longitude && !latitude) {   
    throw new Error("No longitude or latitude available");
  }
  if (!accessToken) {
    throw new Error("No access token available");
  }
  if (!url) {
    throw new Error("discoverShops endpoint is not defined");
  }

  try {
      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
            lon: longitude,
            lat: latitude,
            page: page,
            limit: 4,
        }
      });
      // console.log(JSON.stringify(data));
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
