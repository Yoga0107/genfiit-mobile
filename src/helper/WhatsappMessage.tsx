export const generateWhatsAppMessage = (
  name: string,
  category: string,
  consultantName?: string,
  dob?: number // dob as epoch timestamp for consultation date
) => {
  const formatDate = (epoch: number) => {
      const date = new Date(epoch);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
      return `${year}-${month}-${day}`;
  };

  const date = dob ? formatDate(dob) : "[Tanggal Konsultasi]";  // Ensure dob is used for date formatting

  console.log("Formatted Date:", date); // Log to check the formatted date

  if (category === "mental_health") {
      return `Halo, Min Genfiit. Saya *${name}*. Saya ingin melakukan konsultasi terkait *Kesehatan mental* pada tanggal *${date}*.

Bisa bantu jadwalkan konsultasi dengan *${consultantName || "[Nama Psikolog]"}* sebagai *Psikolog*? Terima kasih 😊`;
  }

  if (category === "gizi") {
      return `Halo, Min Genfiit. Saya *${name}*. Saya ingin melakukan konsultasi terkait *Gizi* pada tanggal *${date}*.

Bisa bantu jadwalkan konsultasi dengan *${consultantName || "[Nama Nutritionist]"}* sebagai *Nutritionist*? Terima kasih 😊`;
  }

  return `Halo, Min Genfiit. Saya *${name}*. Saya ingin melakukan konsultasi terkait kategori yang belum terdefinisi. Terima kasih 😊`;
};
