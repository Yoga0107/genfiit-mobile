export const generateWhatsAppMessage = (
    name: string,
    category: string,
    consultantName?: string
) => {
    if (category === "mental_health") {
        return `Halo, *Ibu/Bapak* Psikolog ${consultantName || "[Nama Psikolog]"}. Saya ${name}. Saya ingin melakukan konsultasi terkait Mental Health. Bisa bantu saya untuk (ceritakan masalah Anda)….
Terima kasih sebelumnya!`;
    }

    if (category === "gizi") {
        return `Halo, *Ibu/Bapak* Nutritionist ${consultantName || "[Nama Nutritionist]"}. Saya ${name}. Saya ingin melakukan konsultasi terkait gizi. Bisa bantu saya untuk (ceritakan masalah Anda)….
Terima kasih sebelumnya!`;
    }

    return `Halo, Min Genfiit. Saya ${name}. Saya ingin melakukan konsultasi terkait kategori yang belum terdefinisi. Terima kasih 😊`;
};
