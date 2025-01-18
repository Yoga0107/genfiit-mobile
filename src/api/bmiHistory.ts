import axios from "axios";
import { getToken, getIDuserdetail } from "../utils/handlingDataLogin";
import { getID } from "../utils/handlingDataRegister";

const BASE_URL = "https://api-genfiit.yanginibeda.web.id/api/bmi-histories";

interface BMIHistory {
  id: number;
  attributes: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    result: number;
    createdAt: string;
  };
}

export const postBMIHistory = async (age: number, gender: string, height: number, weight: number, result: string) => {
  try {
    const token = await getToken();
    let userID = await getID();

    // Jika userID dari getID tidak ditemukan, fallback ke getIDuserdetail
    if (!userID) {
      userID = await getIDuserdetail();
    }

    if (!token || !userID) {
      throw new Error("Token or User ID is missing");
    }

    const payload = {
      data: {
        age,
        gender,
        height,
        weight,
        result,
        users_permissions_user: userID,
      },
    };

    const response = await axios.post(BASE_URL, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error posting BMI history:", error);
    throw error;
  }
};

export const getBmiHistory = async (): Promise<{ data: BMIHistory[] }> => {
  try {
    const token = await getToken();
    let userID = await getID();

    // Jika userID dari getID tidak ditemukan, fallback ke getIDuserdetail
    if (!userID) {
      userID = await getIDuserdetail();
    }

    if (!token || !userID) {
      throw new Error("Token or User ID is missing");
    }

    const response = await axios.get(
      `https://api-genfiit.yanginibeda.web.id/api/bmi-histories?populate=*&filters[users_permissions_user][id][$eq]=${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data; // Assuming the response contains the 'data' property directly
  } catch (error) {
    console.error("Error fetching BMI history:", error);
    throw error;
  }
};