export const generateWhatsAppMessage = (name: string, category: string) => {
    const consultationType =
        category === "gizi" ? "gizi" : "kesehatan mental";
    const professional =
        category === "gizi" ? "Nutritionis" : "Psikolog";

    return `Halo, Min Genfiit. Saya ${name}. Saya ingin melakukan konsultasi terkait ${consultationType}. Bisa bantu jadwalkan konsultasi dengan ${professional}!\nTerima kasih`;
};
