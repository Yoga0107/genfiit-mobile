import axios from 'axios';
import { getToken } from '../utils/handlingDataLogin'; // Ensure this path is correct

// Define the types for material according to the API response
interface Material {
  id: string;
  title: string;
  description: string; // Description of the material
  source?: string; // Optional source
}

// Function to handle material data from API response
export const handlingDataMaterial = (data: any): Material | null => {
  if (!data || !data.data) return null; // Ensure data exists

  const { id, title, description, source } = data.data; // Extract necessary properties from data

  return {
    id: id.toString(), // Ensure ID is a string
    title,
    description,
    source, // Include source if available
  };
};

// Function to fetch material by ID
export const getMaterialById = async (id: string): Promise<Material | null> => {
  try {
    const token = await getToken(); // Get token from AsyncStorage
    if (!token) {
      console.error('No token found. Please log in again.');
      return null; // Handle case where token is not found
    }

    const response = await axios.get(`https://api-genfiit.yanginibeda.web.id/api/materials/${id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`, // Use token here
      },
    });

    return handlingDataMaterial(response.data); // Return processed data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching material:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null; // Return null if there is an error
  }
};

// Function to fetch quiz data based on material ID
export const fetchQuizData = async (materialId: string): Promise<any | null> => {
  const apiUrl = `https://api-genfiit.yanginibeda.web.id/api/materials/${materialId}?populate=category&populate=questions.item&filters[category][slug][$eq]=category1`;
  
  try {
    const token = await getToken();
    if (!token) {
      console.error('No token found. Please log in again.');
      return null;
    }

    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data; // Return the quiz data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching quiz data:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

// Function to fetch multiple materials by segment
export const getMaterialsBySegment = async (segmentIds: string[]): Promise<Material[]> => {
  try {
    const materialPromises = segmentIds.map(id => getMaterialById(id));
    const materials = await Promise.all(materialPromises);
    return materials.filter((material): material is Material => material !== null); // Filter out null values
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching materials by segment:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Rethrow error for handling elsewhere
  }
};

// Function to fetch all materials
export const fetchMaterials = async () => {
  try {
    const token = await getToken();
    console.log("Token used for API call:", token); // Log token for debugging
    if (!token) {
      throw new Error("Token is missing or invalid.");
    }

    const response = await axios.get('https://api-genfiit.yanginibeda.web.id/api/materials', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data; // Return received data
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
