// src/services/academicYearService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { ACADEMIC_YEAR_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    AcademicYear,
    CreateAcademicYearData,
    UpdateAcademicYearData,
} from "@/interfaces/academicYear"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const academicYearService = {
    /**
     * Creates a new academic year.
     * Corresponds to POST /api/v1/academic-years
     */
    createAcademicYear: async (
        academicYearData: CreateAcademicYearData
    ): Promise<AcademicYear> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ academicYear: AcademicYear }>
            >(ACADEMIC_YEAR_ENDPOINTS.BASE, academicYearData);
            return response.data.data.academicYear;
        } catch (error) {
            console.error("Failed to create academic year:", error);
            throw error;
        }
    },

    /**
     * Retrieves all academic years.
     * Corresponds to GET /api/v1/academic-years
     */
    getAllAcademicYears: async (): Promise<AcademicYear[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ academicYears: AcademicYear[] }>
            >(ACADEMIC_YEAR_ENDPOINTS.BASE);
            return response.data.data.academicYears;
        } catch (error) {
            console.error("Failed to fetch academic years:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single academic year by ID.
     * Corresponds to GET /api/v1/academic-years/:id
     */
    getAcademicYearById: async (id: IdType): Promise<AcademicYear> => {
        // Return type changed to AcademicYear (not null)
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ academicYear: AcademicYear }>
            >(ACADEMIC_YEAR_ENDPOINTS.getById(id));
            return response.data.data.academicYear;
        } catch (error: any) {
            // TanStack Query expects the queryFn to throw an error for failed fetches (including 404s).
            // It will then set isError to true and provide the error object.
            // Components can check error.response?.status for specific handling (e.g., "not found" message).
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Academic year with ID ${id} not found, throwing error for TanStack Query.`
                );
                // Throw the error so useQuery's isError becomes true
                throw error;
            }
            console.error(
                `Failed to fetch academic year with ID ${id}:`,
                error
            );
            throw error; // Re-throw other errors for global handling/TanStack Query
        }
    },

    /**
     * Updates an existing academic year.
     * Corresponds to PATCH /api/v1/academic-years/:id
     */
    updateAcademicYear: async (
        id: IdType,
        updateData: UpdateAcademicYearData
    ): Promise<AcademicYear> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ academicYear: AcademicYear }>
            >(ACADEMIC_YEAR_ENDPOINTS.getById(id), updateData);
            return response.data.data.academicYear;
        } catch (error) {
            console.error(
                `Failed to update academic year with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Soft deletes an academic year.
     * Corresponds to DELETE /api/v1/academic-years/:id
     */
    softDeleteAcademicYear: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(ACADEMIC_YEAR_ENDPOINTS.getById(id));
            console.log(
                `Academic year with ID ${id} soft-deleted successfully.`
            );
        } catch (error) {
            console.error(
                `Failed to soft-delete academic year with ID ${id}:`,
                error
            );
            throw error;
        }
    },
};

export default academicYearService;
