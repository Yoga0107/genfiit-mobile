import ApiManager from "./ApiManager";
import { getIDuserdetail, getToken } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";

export const postTelehealthData = async (
  data: any,
  selectedProgram: string
) => {
  let token = await getToken();
  let userId = await getID();

  // Check if userId is not found, fallback to getIDuserdetail
  if (!userId) {
    userId = await getIDuserdetail();
  }

  if (!token || !userId) {
    throw new Error("Token or User ID is missing");
  }

  // Menentukan kategori berdasarkan program yang dipilih
  const category =
    selectedProgram === "Mental Health" ? "mental_health" : "gizi";

  try {
    const response = await ApiManager.post(
      "/telehealths",
      {
        data: {
          ...data,
          users_permissions_user: userId, // Menambahkan relasi pengguna
          category: category, // Menentukan kategori
          status: "in_progress", // Status awal konsultasi
          consultant: data.professional, // Properti yang benar untuk relasi dengan konsultan
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data) {
      console.log("Response from telehealth API:", response.data);
      return response.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error: any) {
    console.error(
      "Failed to post telehealth data:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
