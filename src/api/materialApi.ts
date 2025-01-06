// api/materialApi.ts
import { getToken } from '../utils/handlingDataLogin';

export const getMaterialData = async (token: string, categorySlug: string) => {
  const response = await fetch(`https://api-genfiit.yanginibeda.web.id/api/materials?category=${categorySlug}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};


export const submitReport = async (token: string, reportId: string | null, data: any) => {
  try {
    const method = reportId ? 'PUT' : 'POST';
    const url = reportId
      ? `https://api-genfiit.yanginibeda.web.id/api/reports/${reportId}`
      : 'https://api-genfiit.yanginibeda.web.id/api/reports';

    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit report');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};

// utils/materialApi.ts

export const getContentDetailsById = async (token: string, contentId: string) => {
  try {
    const response = await fetch(`https://api.example.com/content/${contentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching content details:', error);
    throw error;
  }
};
