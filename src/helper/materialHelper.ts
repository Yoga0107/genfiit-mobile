import axios from 'axios';

export const getMaterialById = async (materialSlug: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api-genfiit.yanginibeda.web.id/api/materials?populate[questions][populate]=item`, 
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, 
        }
      }
    );

    
    if (response.data && response.data.data) {
      const material = response.data.data;
      
      const materialContent = material.map((item: any) => ({
        title: item.attributes.title, 
        content: item.attributes.content, 
        questions: item.attributes.questions,
      }));

      return materialContent; 
    } else {
      throw new Error('Material tidak ditemukan');
    }
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};
