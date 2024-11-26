import axios from 'axios';

export const getMaterialById = async (materialSlug: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api-genfiit.yanginibeda.web.id/api/materials?populate[questions][populate]=item`, 
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`, // Pastikan token digunakan di header
        }
      }
    );

    // Cek apakah respons data ada dan apakah field yang dibutuhkan ada
    if (response.data && response.data.data) {
      const material = response.data.data;
      // Menyesuaikan sesuai dengan struktur data API yang Anda butuhkan
      const materialContent = material.map((item: any) => ({
        title: item.attributes.title, // Jika Anda membutuhkan title dari materi
        content: item.attributes.content, // Jika Anda membutuhkan konten dari materi
        questions: item.attributes.questions,
      }));

      return materialContent; // Mengembalikan konten materi
    } else {
      throw new Error('Material tidak ditemukan');
    }
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};
