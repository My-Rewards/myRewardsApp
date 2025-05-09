import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/customer/user/delete";
const deleteUser = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;
    if (!accessToken) {
      throw new Error("No access token available");
    }
    if (!url) {
      throw new Error("CUSTOMER_DELETE_ENDPOINT is not defined");
    }
    const { data } = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data;
  } catch (error: any) {
    return null;
  }
};

export default deleteUser;
