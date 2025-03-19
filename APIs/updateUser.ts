import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import { UserAttributes } from "@/auth/ctx";
const INVOKE_URL = process.env.INVOKE_URL;
const url = `${INVOKE_URL}/customer/user/update`;

const updateUser = async (updates: Partial<UserAttributes>) => {
    try {
        const { tokens } = await fetchAuthSession();
        const accessToken = tokens?.idToken;
        if (!accessToken) {
            throw new Error("No access token available");
        }

        const { data } = await axios.patch(url, { updates }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        return data;
    } catch (error: any) {
        console.error("Error updating user:", error.response?.data || error.message);
        console.error("Status code:", error.response?.status);
        console.error("Headers:", error.response?.headers);

        return null;
    }
};

export default updateUser;
