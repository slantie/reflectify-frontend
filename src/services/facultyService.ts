// src/services/facultyService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { FACULTY_ENDPOINTS } from "@/constants/apiEndpoints";

// Import the new interfaces
import {
    Faculty,
    CreateFacultyData,
    UpdateFacultyData,
    FacultyAbbreviation,
} from "@/interfaces/faculty"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const facultyService = {
    /**
     * Fetches all faculties.
     * Corresponds to GET /api/v1/faculties
     */
    getAllFaculties: async (): Promise<Faculty[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ faculties: Faculty[] }>
            >(FACULTY_ENDPOINTS.BASE);
            return response.data.data.faculties;
        } catch (error) {
            console.error("Failed to fetch faculties:", error);
            throw error;
        }
    },

    /**
     * Fetches a single faculty by ID.
     * Corresponds to GET /api/v1/faculties/:id
     */
    getFacultyById: async (id: IdType): Promise<Faculty> => {
        // Return type changed from Faculty | null to Faculty
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ faculty: Faculty }>
            >(FACULTY_ENDPOINTS.getById(id));
            return response.data.data.faculty;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Faculty with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch faculty with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Creates a new faculty.
     * Corresponds to POST /api/v1/faculties
     */
    createFaculty: async (facultyData: CreateFacultyData): Promise<Faculty> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ faculty: Faculty }>
            >(FACULTY_ENDPOINTS.BASE, facultyData);
            return response.data.data.faculty;
        } catch (error) {
            console.error("Failed to create faculty:", error);
            throw error;
        }
    },

    /**
     * Updates an existing faculty.
     * Corresponds to PATCH /api/v1/faculties/:id
     */
    updateFaculty: async (
        id: IdType,
        updateData: UpdateFacultyData
    ): Promise<Faculty> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ faculty: Faculty }>
            >(FACULTY_ENDPOINTS.getById(id), updateData);
            return response.data.data.faculty;
        } catch (error) {
            console.error(`Failed to update faculty with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a faculty.
     * Corresponds to DELETE /api/v1/faculties/:id
     */
    softDeleteFaculty: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(FACULTY_ENDPOINTS.getById(id));
            console.log(`Faculty with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete faculty with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of faculties.
     * Corresponds to POST /api/v1/faculties/batch
     */
    batchCreateFaculties: async (
        faculties: CreateFacultyData[]
    ): Promise<Faculty[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ faculties: Faculty[] }>
            >(FACULTY_ENDPOINTS.BATCH, { faculties }); // Backend expects { faculties: [...] }
            return response.data.data.faculties;
        } catch (error) {
            console.error("Failed to batch create faculties:", error);
            throw error;
        }
    },

    /**
     * Retrieves faculty abbreviations, optionally filtered by department abbreviation.
     * Corresponds to GET /api/v1/faculties/abbreviations/:deptAbbr?
     */
    getFacultyAbbreviations: async (
        deptAbbr?: string
    ): Promise<FacultyAbbreviation[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ abbreviations: FacultyAbbreviation[] }>
            >(FACULTY_ENDPOINTS.getAbbreviations(deptAbbr));
            return response.data.data.abbreviations;
        } catch (error) {
            console.error(
                `Failed to fetch faculty abbreviations (Dept: ${
                    deptAbbr || "All"
                }):`,
                error
            );
            throw error;
        }
    },
};

export default facultyService;
