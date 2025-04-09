import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import { Profile } from "@/app-data/data-types";
import { updateUserSchema } from "@/constants/validationTypes";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/customer/user/update";

const updateUser = async (updates: Partial<Profile>) => {
  try {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const result = updateUserSchema.safeParse({ updates });
    if (result.success === false) {
      return null;
    }
    if (!url) {
      throw new Error("CUSTOMER_UPDATE_ENDPOINT is not defined");
    }

    const { data } = await axios.put(
      url,
      { ...updates },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data.user;
  } catch (error: any) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    console.error("Status code:", error.response?.status);
    console.error("Headers:", error.response?.headers);

    return null;
  }
};

export default updateUser;
