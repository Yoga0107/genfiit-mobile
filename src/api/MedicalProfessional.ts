import axios from 'axios';
import { getToken } from '../utils/handlingDataLogin';
import ApiManager from './ApiManager';

export const fetchMedicalProfessionals = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token is missing");

    const response = await ApiManager.get(`/consultants` ,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });

    return response.data.data; // returns the array of consultants
  } catch (error) {
    console.error("Failed to fetch medical professionals:", error);
    throw error;
  }
};
