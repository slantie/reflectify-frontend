// src/services/authService.ts
import apiClient from "@/lib/axiosInstance"; // Our centralized Axios instance
import { AUTH_ENDPOINTS } from "@/constants/apiEndpoints"; // Updated path for API endpoints
import { Admin } from "@/interfaces/auth"; // Assuming User interface will be here or common

// Define API response types for authentication
interface LoginResponse {
    token: string;
    data: {
        admin: Admin;
    };
}

interface MeResponse {
    data: {
        admin: Admin;
    };
}

const authService = {
    /**
     * Sends login credentials to the backend and returns the token and user data.
     * @param email User's email.
     * @param password User's password.
     * @returns Promise resolving to LoginResponse data.
     */
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            AUTH_ENDPOINTS.LOGIN,
            {
                email,
                password,
            }
        );
        return response.data;
    },

    /**
     * Fetches the currently authenticated user's details from the backend.
     * @returns Promise resolving to MeResponse data.
     */
    getMe: async (): Promise<MeResponse> => {
        const response = await apiClient.get<MeResponse>(AUTH_ENDPOINTS.ME);
        return response.data;
    },

    // You can add other auth-related API calls here, e.g., register, forgot password
};

export default authService;
