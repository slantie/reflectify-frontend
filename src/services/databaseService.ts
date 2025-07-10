/**
 * @file src/services/databaseService.ts
 * @description Service for Database API operations
 */
import axiosInstance from "@/lib/axiosInstance";
import { DATABASE_ENDPOINTS } from "@/constants/apiEndpoints";
import { ApiResponse } from "@/interfaces/common";

// Service for Database API operations
const databaseService = {
    cleanDatabase: async (): Promise<string> => {
        const response = await axiosInstance.delete<ApiResponse<null>>(
            DATABASE_ENDPOINTS.CLEAN
        );
        return response.data.message || "Database cleaned successfully.";
    },
};

export default databaseService;
