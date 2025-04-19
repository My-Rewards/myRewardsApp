import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const shopUrl = apiPath + "/app/shops/shop";
const planUrl = apiPath + "/app/plans/plan";
const nearestShopUrl = apiPath + "/app/shops/nearest";

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

        if(!data){
            throw new Error("Something went wrong");
        }

        return data;

    } catch (error: any) {
        console.error(
            "Error fetching shop details:",
            error.response?.data || error.message
        );

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
            case !org_id: throw new Error("no org_id provided");
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

        if(!data){
            throw new Error("Something went wrong");
        }

        return data;

    } catch (error: any) {
        console.error(
            "Error fetching plan:",
            error.response?.data || error.message
        );

        return null;
    }
}

export const fetchNearestShop = async (latitude:number, longitude:number, org_id:string) => {
    try {
        const {tokens} = await fetchAuthSession();
        const accessToken = tokens?.idToken;

        if(!accessToken){
            throw new Error("No access token available");
        }

        const {data} = await axios.get(nearestShopUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                org_id: org_id,
                lat:latitude,
                lon:longitude
            },
        });

        return data.shop_id;
    }catch{
        return null;
    }
}