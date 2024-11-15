import ApiManager from './ApiManager';  
import { getToken } from "../utils/handlingDataLogin";

export const postTelehealthData = async (data: any) => {
    const token = await getToken();

    
    if (!token) {
        throw new Error("Token is missing");
    }

    try {
        
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

        
        if (response.data) {
            console.log('Response from telehealth API:', response.data);
            return response.data;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error: any) {
        
        console.error("Failed to post telehealth data:", error?.response?.data || error.message);
        throw error;  
    }
};
