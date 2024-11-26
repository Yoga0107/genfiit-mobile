// api/Material.ts
import axios from 'axios';
import { getToken } from '../utils/handlingDataLogin'; // assuming the getToken function is in utils/handlingDataLogin.ts

const fetchMaterials = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token is missing or invalid.");

    const response = await axios.get('https://api-genfiit.yanginibeda.web.id/api/materials', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.data || !response.data.data) {
      console.error("No materials found or invalid response format");
      return [];
    }

    return response.data.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected Error:", error);
    }
    return [];
  }
};

export { fetchMaterials };
