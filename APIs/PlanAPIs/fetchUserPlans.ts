import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import Constants from "expo-constants";
const { apiPath } = Constants.expoConfig?.extra || {};
const plansUrl = apiPath + "/app/plans";
const likedUrlPlans = apiPath + "/app/plans/favorite";

export const fetchUserPlans = async (lat:number|undefined, lng:number|undefined, limit:number, page:number) => {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;

    if (!accessToken) throw new Error("No access token available");

    try {
        const { data } = await axios.get(plansUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params:{
                lat: lat,
                lng: lng,
                limit: limit,
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

export const fetchUserLikedPlans = async (lat:number|undefined, lng:number|undefined, limit:number, page:number) => {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.idToken;

    if (!accessToken) throw new Error("No access token available");

    try {
        const { data } = await axios.get(likedUrlPlans, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params:{
                lat: lat,
                lng: lng,
                limit: limit,
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
