// src/services/databaseService.ts
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { DATABASE_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import common API response for consistency
import { ApiResponse } from "@/interfaces/common"; // Adjust path

const databaseService = {
    /**
     * Cleans all database tables.
     * This is a highly privileged and destructive operation.
     * Corresponds to DELETE /api/v1/database/clean
     */
    cleanDatabase: async (): Promise<string> => {
        try {
            const response = await axiosInstance.delete<ApiResponse<null>>( // Data is null for 200 response
                DATABASE_ENDPOINTS.CLEAN
            );
            return response.data.message || "Database cleaned successfully.";
        } catch (error) {
            console.error("Failed to clean database:", error);
            throw error;
        }
    },
};

export default databaseService;
