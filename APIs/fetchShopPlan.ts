import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const shopUrl = apiPath + "/app/shops/fetch";
const planUrl = apiPath + "/app/shops/fetch";

export const fetchShop = async (shopId:string) => {
    try {
        const { tokens } = await fetchAuthSession();
        const accessToken = tokens?.idToken;

        switch(true){
            case !accessToken: throw new Error("No access token available");
            case !apiPath: throw new Error("CUSTOMER_GET_ENDPOINT is not defined");
        }

        const { data } = await axios.get(shopUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                shop_id: shopId
            },
        });
        return data;

    } catch (error: any) {
        console.error(
            "Error fetching user:",
            error.response?.data || error.message
        );
        console.error("Status code:", error.response?.status);
        console.error("Headers:", error.response?.headers);

        return null;
    }
};

export const fetchPlan = async (org_id:string) => {
    try {
        const {tokens} = await fetchAuthSession();
        const accessToken = tokens?.idToken;

        switch(true){
            case !accessToken: throw new Error("No access token available");
            case !apiPath: throw new Error("CUSTOMER_GET_ENDPOINT is not defined");
        }

        const {data} = await axios.get(planUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                org_id: org_id
            },
        });

        return data;

    } catch (error: any) {
        console.error(
            "Error fetching user:",
            error.response?.data || error.message
        );
        console.error("Status code:", error.response?.status);
        console.error("Headers:", error.response?.headers);

        return null;
    }
}