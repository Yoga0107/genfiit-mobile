// api/materialApi.ts
import { fetchMaterialData } from '../utils/apiUtils';

// Function to get material data by category
export const getMaterialData = async (token: string, categorySlug: string) => {
  const data = await fetchMaterialData(token, categorySlug);
  return data;
};
