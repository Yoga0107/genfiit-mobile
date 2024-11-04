import { getToken } from '../utils/handlingDataLogin';
import { getID } from '../utils/handlingDataRegister';
import ApiManager from './ApiManager';  

export const getUserDetails = async () => {
  try {
    const token = await getToken();
    const userId = await getID(); 

    const response = await ApiManager.get(`user-details/${userId}?populate=*`, {  
      headers: {
        Authorization: `Bearer ${token}`,  
        accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; 
  }
};
