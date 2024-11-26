import ApiManager from './ApiManager';  
import { getToken } from "../utils/handlingDataLogin";
import { getID } from '../utils/handlingDataRegister';

export const postTelehealthData = async (data: any) => {
    const token = await getToken();
    const userId = await getID(); 
  
    if (!token || !userId) {
      throw new Error("Token or User ID is missing");
    }
  
    try {
      const response = await ApiManager.post(
        '/telehealths',
        {
          data: {
            ...data, 
            users_permissions_user: userId, 
            category: "gizi", 
            status: "in_progress", 
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
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
  