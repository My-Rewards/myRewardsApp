import { fetchAuthSession } from "aws-amplify/auth";
import axios, {AxiosError} from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/customer/like";

export const toggleLike = async (org_id:string) => {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;

    if (!accessToken) {
        throw new Error("No access token available");
    }


    try {
        const { data } = await axios.put(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                params:{
                    org_id: org_id,
                }
            }
        );

        return {
            status:data.liked,
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
