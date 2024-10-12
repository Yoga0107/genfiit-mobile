import ApiManager from './ApiManager';  // Import ApiManager to handle requests
import { getToken } from '../utils/handlingDataLogin';  // Import getToken to retrieve the saved token

export const getUserDetails = async (token: string) => {
  try {
    const response = await ApiManager.get('users/me?populate=user_information', {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the token as a bearer token in the headers
        accept: 'application/json',
      },
    });
    
    return response.data;  // Return the response data containing user information
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;  // Throw error to handle it in the calling component
  }
};
