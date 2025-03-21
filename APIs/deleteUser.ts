import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

const INVOKE_URL = process.env.INVOKE_URL;
const url = `${INVOKE_URL}/customer/user/delete`;

const deleteUser = async () => {
    try {
        const { tokens } = await fetchAuthSession();
        const accessToken = tokens?.idToken;
        if (!accessToken) {
            throw new Error("No access token available");
        }

        const { data } = await axios.delete(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        return data;
    } catch (error: any) {
        console.error("Error deleting user:", error.response?.data || error.message);
        console.error("Status code:", error.response?.status);
        console.error("Headers:", error.response?.headers);

        return null;
    }
};

export default deleteUser;
