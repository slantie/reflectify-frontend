// src/services/divisionService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { DIVISION_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    Division,
    CreateDivisionData,
    UpdateDivisionData,
} from "@/interfaces/division"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const divisionService = {
    /**
     * Retrieves all active divisions, optionally filtered by departmentId and semesterId.
     * Corresponds to GET /api/v1/divisions
     */
    getAllDivisions: async (
        departmentId?: IdType,
        semesterId?: IdType
    ): Promise<Division[]> => {
        try {
            const params: { departmentId?: IdType; semesterId?: IdType } = {};
            if (departmentId) {
                params.departmentId = departmentId;
            }
            if (semesterId) {
                params.semesterId = semesterId;
            }

            const response = await axiosInstance.get<
                ApiResponse<{ divisions: Division[] }>
            >(DIVISION_ENDPOINTS.BASE, { params });
            return response.data.data.divisions;
        } catch (error) {
            console.error("Failed to fetch divisions:", error);
            throw error;
        }
    },

    /**
     * Creates a new division.
     * Corresponds to POST /api/v1/divisions
     */
    createDivision: async (
        divisionData: CreateDivisionData
    ): Promise<Division> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ division: Division }>
            >(DIVISION_ENDPOINTS.BASE, divisionData);
            return response.data.data.division;
        } catch (error) {
            console.error("Failed to create division:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single division by ID.
     * Corresponds to GET /api/v1/divisions/:id
     */
    getDivisionById: async (id: IdType): Promise<Division> => {
        // Return type changed from Division | null to Division
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ division: Division }>
            >(DIVISION_ENDPOINTS.getById(id));
            return response.data.data.division;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Division with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch division with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Updates an existing division.
     * Corresponds to PATCH /api/v1/divisions/:id
     */
    updateDivision: async (
        id: IdType,
        updateData: UpdateDivisionData
    ): Promise<Division> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ division: Division }>
            >(DIVISION_ENDPOINTS.getById(id), updateData);
            return response.data.data.division;
        } catch (error) {
            console.error(`Failed to update division with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a division.
     * Corresponds to DELETE /api/v1/divisions/:id
     */
    softDeleteDivision: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(DIVISION_ENDPOINTS.getById(id));
            console.log(`Division with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete division with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of divisions.
     * Corresponds to POST /api/v1/divisions/batch
     */
    batchCreateDivisions: async (
        divisions: CreateDivisionData[]
    ): Promise<Division[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ divisions: Division[] }>
            >(
                DIVISION_ENDPOINTS.BATCH,
                { divisions } // Backend expects { divisions: [...] }
            );
            return response.data.data.divisions;
        } catch (error) {
            console.error("Failed to batch create divisions:", error);
            throw error;
        }
    },
};

export default divisionService;
