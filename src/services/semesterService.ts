// src/services/semesterService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { SEMESTER_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    Semester,
    CreateSemesterData,
    UpdateSemesterData,
    GetSemestersFilters,
} from "@/interfaces/semester"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const semesterService = {
    /**
     * Retrieves all active semesters, optionally filtered.
     * Corresponds to GET /api/v1/semesters
     */
    getAllSemesters: async (
        filters?: GetSemestersFilters
    ): Promise<Semester[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ semesters: Semester[] }>
            >(SEMESTER_ENDPOINTS.BASE, { params: filters });
            return response.data.data.semesters;
        } catch (error) {
            console.error("Failed to fetch semesters:", error);
            throw error;
        }
    },

    /**
     * Creates a new semester.
     * Corresponds to POST /api/v1/semesters
     */
    createSemester: async (
        semesterData: CreateSemesterData
    ): Promise<Semester> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ semester: Semester }>
            >(SEMESTER_ENDPOINTS.BASE, semesterData);
            return response.data.data.semester;
        } catch (error) {
            console.error("Failed to create semester:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single semester by ID.
     * Corresponds to GET /api/v1/semesters/:id
     */
    getSemesterById: async (id: IdType): Promise<Semester> => {
        // Changed return type
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ semester: Semester }>
            >(SEMESTER_ENDPOINTS.getById(id));
            return response.data.data.semester;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Semester with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch semester with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Updates an existing semester.
     * Corresponds to PATCH /api/v1/semesters/:id
     */
    updateSemester: async (
        id: IdType,
        updateData: UpdateSemesterData
    ): Promise<Semester> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ semester: Semester }>
            >(SEMESTER_ENDPOINTS.getById(id), updateData);
            return response.data.data.semester;
        } catch (error) {
            console.error(`Failed to update semester with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a semester.
     * Corresponds to DELETE /api/v1/semesters/:id
     */
    softDeleteSemester: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(SEMESTER_ENDPOINTS.getById(id));
            console.log(`Semester with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete semester with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of semesters.
     * Corresponds to POST /api/v1/semesters/batch
     */
    batchCreateSemesters: async (
        semesters: CreateSemesterData[]
    ): Promise<Semester[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ semesters: Semester[] }>
            >(
                SEMESTER_ENDPOINTS.BATCH,
                { semesters } // Backend expects { semesters: [...] }
            );
            return response.data.data.semesters;
        } catch (error) {
            console.error("Failed to batch create semesters:", error);
            throw error;
        }
    },

    /**
     * Retrieves all active semesters for a specific department.
     * Corresponds to GET /api/v1/semesters/dept/:id
     */
    getSemestersByDepartmentId: async (
        departmentId: IdType
    ): Promise<Semester[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ semesters: Semester[] }>
            >(SEMESTER_ENDPOINTS.GET_BY_DEPARTMENT(departmentId));
            return response.data.data.semesters;
        } catch (error) {
            console.error(
                `Failed to fetch semesters for department ID ${departmentId}:`,
                error
            );
            throw error;
        }
    },
};

export default semesterService;
