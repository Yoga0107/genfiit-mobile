import ApiManager from './ApiManager';  // Adjust the path as needed
import { getToken } from "../utils/handlingDataLogin";

export const postTelehealthData = async (data: any) => {
    const token = await getToken();

    // Check if the token is available
    if (!token) {
        throw new Error("Token is missing");
    }

    try {
        // Make the API call to post telehealth data
        const response = await ApiManager.post(
            '/telehealths', 
            { data },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        // Check if the response has the expected data
        if (response.data) {
            console.log('Response from telehealth API:', response.data);
            return response.data;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error: any) {
        // Enhanced error handling
        console.error("Failed to post telehealth data:", error?.response?.data || error.message);
        throw error;  // Re-throw the error after logging
    }
};
