import axios from 'axios';
import { getToken } from '../utils/handlingDataLogin';

interface Material {
  id: string;
  title: string;
  description: string;
  source?: string;
}

export const handlingDataMaterial = (data: any): Material | null => {
  if (!data || !data.data) return null;

  const { id, title, description, source } = data.data;

  return {
    id: id.toString(),
    title,
    description,
    source,
  };
};

export const getMaterialById = async (id: string): Promise<Material | null> => {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await axios.get(`https://api-genfiit.yanginibeda.web.id/api/materials/${id}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handlingDataMaterial(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const fetchQuizData = async (materialId: string): Promise<any | null> => {
  const apiUrl = `https://api-genfiit.yanginibeda.web.id/api/materials/${materialId}?populate=category&populate=questions.item&filters[category][slug][$eq]=category1`;

  try {
    const token = await getToken();
    if (!token) return null;

    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const getMaterialsBySegment = async (segmentIds: string[]): Promise<Material[]> => {
  try {
    const materialPromises = segmentIds.map(id => getMaterialById(id));
    const materials = await Promise.all(materialPromises);
    return materials.filter((material): material is Material => material !== null);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export const fetchMaterials = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token is missing or invalid.");

    const response = await axios.get('https://api-genfiit.yanginibeda.web.id/api/materials', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
      }
    } else {
      console.error(error);
    }
  }
};
