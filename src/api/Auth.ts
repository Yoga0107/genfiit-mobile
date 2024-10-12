import { saveToken } from "../utils/handlingDataLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiManager from "./ApiManager";

export const LoginApi = async (input: any) => {
    try {
        const response = await ApiManager.post('/auth/local', { // Adjusted URL
            identifier: input.identifier,
            password: input.password,
        });

        console.log('Response from login API:', response.data); // Log the full response

        const token = response.data.jwt;
        const user = response.data.user;

        if (token && user) {
            await saveToken(token);
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Store the user data
        } else {
            alert('Invalid login response: Missing token or user data');
        }

        return response;
    } catch (error: any) {
        console.error('Login API error:', error.response || error.message); // Log error
        if (error.response && error.response.status === 401) {
            alert("Wrong username or password");
        } else {
            alert("Login failed: " + error.message);
        }
        throw error;
    }
};
