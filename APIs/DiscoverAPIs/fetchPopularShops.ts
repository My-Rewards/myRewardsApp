import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/shops/popular";

export const fetchPopularShops = async (page: number) => {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.idToken;
  if (!accessToken) {
    throw new Error("No access token available");
  }
  if (!url) {
    throw new Error("fetchPopularShops endpoint is not defined");
  }

  try {
      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
            page: page,
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
