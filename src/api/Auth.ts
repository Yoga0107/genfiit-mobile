import { saveToken } from "../utils/handlingDataLogin";
import ApiManager from "./ApiManager";

export const LoginApi = async (input: any) => {
    try {
        // Send the login request
        const response = await ApiManager.post('auth/local/', {
            identifier: input.identifier, // Use identifier for Strapi-based auth
            password: input.password,
        });

        console.log('API Response:', response);

        // Extract token (jwt) and username from the response
        const token = response.data.jwt;
        const username = response.data.user?.username;

        if (token && username) {
            await saveToken(token);  // Save the token
            console.log("Token: ", token)
            // console.log("Token and Username:", token, username);
        } else {
            alert('Invalid login response: Missing token or username');
        }

        return response;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            alert("Wrong username or password");
        } else {
            alert("Login failed: " + error.message);
        }
        throw error;
    }
};
