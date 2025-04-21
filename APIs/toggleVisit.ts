import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/visit";

export const toggleVisit = async (shop_id:string) => {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;

    if (!accessToken) {
        throw new Error("No access token available");
    }

    try {
        const { data } = await axios.post(
            url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    shop_id: shop_id,
                    timestamp: Date.now()
                }
            }
        );


        return {
            visitId:data.visitId,
            success:data.success,
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
        } else {
            console.error("Unknown error:", error);
        }
        return {
            success:false,
        };
    }
};
