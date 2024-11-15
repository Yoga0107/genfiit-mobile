import axios from 'axios';
import { handlingDataMaterial } from '../helper/materialHelper';
import { getToken } from '../utils/handlingDataLogin';

// Function to fetch all materials (you might have it in materialHelper already)
const fetchMaterials = async () => {
  try {
    const token = await getToken();
    console.log("Token used for API call:", token); // Log the token for debugging
    if (!token) {
      throw new Error("Token is missing or invalid.");
    }
    
    const response = await axios.get('https://api-genfiit.yanginibeda.web.id/api/materials', {
      headers: {
        'accept': 'application/json', 
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching materials:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
};


export { fetchMaterials };
