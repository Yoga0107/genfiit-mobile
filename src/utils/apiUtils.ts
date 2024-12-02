import { Alert } from 'react-native';

// Utility function to fetch data from API
export const fetchMaterialData = async (token: string, categorySlug: string) => {
  const url = `https://api-genfiit.yanginibeda.web.id/api/materials?populate=category&populate=questions.item&filters[category][slug][$eq]=${categorySlug}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch material data');
    }

    const data = await response.json();
    return data; // return the JSON response data
  } catch (error) {
    console.error('Error fetching material data:', error);
    Alert.alert('Error', 'Failed to fetch data');
  }
};
