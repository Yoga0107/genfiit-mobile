import { saveToken } from "../utils/handlingDataLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";
import axios from "axios";

export const LoginApi = async (input: { identifier: string, password: string }) => {
    try {
        const response = await ApiManager.post('/auth/local', {
            identifier: input.identifier,
            password: input.password,
        });

        console.log('Response from login API:', response.data);

        const token = response.data.jwt;
        const user = response.data.user;

        if (token && user) {
            await saveToken(token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
            alert('Invalid login response: Missing token or user data');
        }

        return response;
    } catch (error: any) {
        console.error('Login API error:', error.response || error.message);
        if (error.response?.status === 401) {
            alert("Wrong username or password");
        } else {
            alert("Login failed: " + error.message);
        }
        throw error;
    }
};


export const RegisterApi = async (input: { username: string, email: string, password: string, phone: string }) => {
    try {
        const response = await ApiManager.post('/auth/local/register', input);
        console.log('Response from register API:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Register API error:', error.response || error.message);
        throw error;
    }
};


export const UserDetailApi = async (userDetails: any, token: string, userId: string) => {
    if (!token || !userId) {
        throw new Error("Token or User ID is missing");
    }

    try {
        const response = await ApiManager.post('/user-details', {
            data: {
                information: {
                    full_name: userDetails.full_name,
                    height: userDetails.height,
                    weight: userDetails.weight,
                    age: userDetails.age,
                    dob: userDetails.dob,
                    gender: userDetails.gender,
                },
                users_permissions_user: {
                    // Fixing the nested user permission user object to properly use the userId.
                    id: userId, // Assuming the API expects the user ID directly here
                },
            },
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Response from user details API:', response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error submitting user details:", error.response || error.message);
        throw error;
    }
};
