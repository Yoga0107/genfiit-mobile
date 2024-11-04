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


export const RegisterApi = async (input: any) => {
    try {
      const response = await ApiManager.post('/auth/local/register', {
        username: input.username,
        email: input.email,
        password: input.password,
        phone: input.phone,
      });
      
      console.log('Response from register API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register API error:', error.response || error.message);
      throw error;
    }
  };

  export const UserDetailApi = async (userDetails: any, token: string, userId: string) => {
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
          users_permissions_user: userId,
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
      throw error; // Propagate the error for handling in the calling function
    }
  };
  