import { fetchAuthSession } from "aws-amplify/auth";
import axios, {AxiosError} from "axios";
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
        const timestamp = new Date().toISOString();

        const { data } = await axios.post(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                params:{
                    shop_id: shop_id,
                    timestamp: timestamp
                }
            }
        );

        return {
            visitId:data.visitId,
            success:data.success,
        };
    } catch (error: any) {
        if (error.isAxiosError) {
            if (error.response?.status === 404) {
                return {
                    success:false
                };
            }
            console.error(
                "Axios error:",
                error.response?.data || error.message
            );
        } else {
            console.error("Unknown error:", error);
        }

        return {
            success:false,
        };
    }
};
