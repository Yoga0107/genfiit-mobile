export const generateWhatsAppMessage = (name: string, category: string) => {
    const consultationType =
        category === "gizi" ? "Gizi" : "Kesehatan Mental";
    const professional =
        category === "gizi" ? "Nutritionist" : "Psikolog";

    return `Halo, Min Genfiit. Saya *${name}*. Saya ingin melakukan konsultasi terkait *${consultationType}*. 

Bisa bantu jadwalkan konsultasi dengan *${professional}*? Terima kasih😊`;
};
