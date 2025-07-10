/**
 * @file src/services/authService.ts
 * @description Service for authentication API operations
 */
import apiClient from "@/lib/axiosInstance";
import { AUTH_ENDPOINTS } from "@/constants/apiEndpoints";
import { LoginResponse, MeResponse } from "@/interfaces/auth";

const authService = {
    // Sends login credentials to the backend and returns the token and user data
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            AUTH_ENDPOINTS.LOGIN,
            { email, password }
        );
        return response.data;
    },

    // Fetches the currently authenticated user's details from the backend
    getMe: async (): Promise<MeResponse> => {
        const response = await apiClient.get<MeResponse>(AUTH_ENDPOINTS.ME);
        return response.data;
    },

    // You can add other auth-related API calls here, e.g., register, forgot password
};

export default authService;
