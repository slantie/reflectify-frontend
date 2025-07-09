// src/services/dashboardService.ts

import axiosInstance from "@/lib/axiosInstance"; // Use your configured axios instance
import { DASHBOARD_ENDPOINTS } from "@/constants/apiEndpoints";
import { DashboardStats } from "@/interfaces/dashboard";
import { ApiResponse } from "@/interfaces/common"; // <--- ADD THIS IMPORT

const dashboardService = {
    /**
     * Fetches general statistics for the dashboard.
     * This service now leverages the global axiosInstance for authentication
     * and error handling.
     * @returns A promise that resolves to DashboardStats.
     * @throws {Error} If the API call fails, the error is re-thrown for TanStack Query to catch.
     */
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            // Correctly type the expected response from the API
            const response = await axiosInstance.get<
                ApiResponse<DashboardStats>
            >(DASHBOARD_ENDPOINTS.STATS);

            // IMPORTANT: Now access the nested 'data' property
            return response.data.data;
        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
    },

    /**
     * Deletes all data from the database (development only).
     * This service now leverages the global axiosInstance for authentication
     * and error handling.
     * @returns A promise that resolves when the operation is complete.
     * @throws {Error} If the API call fails, the error is re-thrown for TanStack Query to catch.
     */
    deleteAllData: async (): Promise<void> => {
        try {
            // Only allow this operation in development
            if (process.env.NODE_ENV === "production") {
                throw new Error(
                    "Database deletion is not allowed in production."
                );
            }

            await axiosInstance.delete(DASHBOARD_ENDPOINTS.DELETE_ALL_DATA);
        } catch (error: any) {
            console.error("Error deleting database data:", error);
            throw error;
        }
    },
};

export default dashboardService;
