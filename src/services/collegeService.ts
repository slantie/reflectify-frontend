// src/services/collegeService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { COLLEGE_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    College,
    CreateCollegeData,
    UpdateCollegeData,
} from "@/interfaces/college"; // Adjust path
import { ApiResponse } from "@/interfaces/common"; // Adjust path

const collegeService = {
    /**
     * Fetches all colleges (or potentially just the primary one if only one exists).
     * Corresponds to GET /api/v1/colleges
     */
    getAllColleges: async (): Promise<College[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ colleges: College[] }>
            >(COLLEGE_ENDPOINTS.BASE);
            return response.data.data.colleges;
        } catch (error) {
            console.error("Failed to fetch colleges:", error);
            throw error;
        }
    },

    /**
     * Creates or updates the primary college.
     * Corresponds to POST /api/v1/colleges
     * This is an "upsert" operation from the frontend's perspective.
     */
    upsertPrimaryCollege: async (
        collegeData: CreateCollegeData
    ): Promise<College> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ college: College }>
            >(COLLEGE_ENDPOINTS.BASE, collegeData);
            return response.data.data.college;
        } catch (error) {
            console.error("Failed to create/upsert primary college:", error);
            throw error;
        }
    },

    /**
     * Retrieves the primary college.
     * Corresponds to GET /api/v1/colleges/primary
     */
    getPrimaryCollege: async (): Promise<College> => {
        // Return type changed from College | null to College
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ college: College }>
            >(COLLEGE_ENDPOINTS.PRIMARY);
            return response.data.data.college;
        } catch (error: any) {
            // TanStack Query expects the queryFn to throw an error for failed fetches (including 404s).
            // It will then set isError to true and provide the error object.
            // Components can check error.response?.status for specific handling (e.g., "not found" message).
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    "Primary college not found, throwing error for TanStack Query."
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error("Failed to fetch primary college:", error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Updates the primary college.
     * Corresponds to PATCH /api/v1/colleges/primary
     */
    updatePrimaryCollege: async (
        updateData: UpdateCollegeData
    ): Promise<College> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ college: College }>
            >(COLLEGE_ENDPOINTS.PRIMARY, updateData);
            return response.data.data.college;
        } catch (error) {
            console.error("Failed to update primary college:", error);
            throw error;
        }
    },

    /**
     * Soft deletes the primary college.
     * Corresponds to DELETE /api/v1/colleges/primary
     */
    softDeletePrimaryCollege: async (): Promise<void> => {
        try {
            await axiosInstance.delete(COLLEGE_ENDPOINTS.PRIMARY);
            console.log("Primary college soft-deleted successfully.");
        } catch (error) {
            console.error("Failed to soft-delete primary college:", error);
            throw error;
        }
    },

    /**
     * Performs a batch update on the primary college.
     * Corresponds to PATCH /api/v1/colleges/primary/batch-update
     */
    batchUpdatePrimaryCollege: async (
        updates: UpdateCollegeData
    ): Promise<College> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ college: College }>
            >(
                COLLEGE_ENDPOINTS.BATCH_UPDATE_PRIMARY,
                { updates } // Backend expects { updates: {...} }
            );
            return response.data.data.college;
        } catch (error) {
            console.error("Failed to batch update primary college:", error);
            throw error;
        }
    },
};

export default collegeService;
