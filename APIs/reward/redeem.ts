import { fetchAuthSession } from "aws-amplify/auth";
import axios, {AxiosError} from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const url = apiPath + "/app/rewards/redeem";

export const redeemRewardApi = async (reward_id:string) => {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;

    if (!accessToken) {
        throw new Error("No access token available");
    }

    try {
        const timestamp = new Date().toISOString();

        const { data } = await axios.put(url,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                params:{
                    reward_id: reward_id,
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
