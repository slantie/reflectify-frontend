// src/services/subjectService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { SUBJECT_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    Subject,
    CreateSubjectData,
    UpdateSubjectData,
    SubjectAbbreviation,
} from "@/interfaces/subject"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const subjectService = {
    /**
     * Fetches all subjects.
     * Corresponds to GET /api/v1/subjects
     */
    getAllSubjects: async (): Promise<Subject[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subjects: Subject[] }>
            >(SUBJECT_ENDPOINTS.BASE);
            return response.data.data.subjects;
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            throw error;
        }
    },

    /**
     * Fetches a single subject by ID.
     * Corresponds to GET /api/v1/subjects/:id
     */
    getSubjectById: async (id: IdType): Promise<Subject> => {
        // Changed return type
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subject: Subject }>
            >(SUBJECT_ENDPOINTS.getById(id));
            return response.data.data.subject;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Subject with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch subject with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Creates a new subject.
     * Corresponds to POST /api/v1/subjects
     */
    createSubject: async (subjectData: CreateSubjectData): Promise<Subject> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ subject: Subject }>
            >(SUBJECT_ENDPOINTS.BASE, subjectData);
            return response.data.data.subject;
        } catch (error) {
            console.error("Failed to create subject:", error);
            throw error;
        }
    },

    /**
     * Updates an existing subject.
     * Corresponds to PATCH /api/v1/subjects/:id
     */
    updateSubject: async (
        id: IdType,
        updateData: UpdateSubjectData
    ): Promise<Subject> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ subject: Subject }>
            >(SUBJECT_ENDPOINTS.getById(id), updateData);
            return response.data.data.subject;
        } catch (error) {
            console.error(`Failed to update subject with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a subject.
     * Corresponds to DELETE /api/v1/subjects/:id
     */
    softDeleteSubject: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(SUBJECT_ENDPOINTS.getById(id));
            console.log(`Subject with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete subject with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves subjects by semester ID.
     * Corresponds to GET /api/v1/subjects/semester/:semesterId
     */
    getSubjectsBySemester: async (semesterId: IdType): Promise<Subject[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subjects: Subject[] }>
            >(SUBJECT_ENDPOINTS.getBySemester(semesterId));
            return response.data.data.subjects;
        } catch (error) {
            console.error(
                `Failed to fetch subjects for semester ID ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves subject abbreviations, optionally filtered by department abbreviation.
     * Corresponds to GET /api/v1/subjects/abbreviations/:deptAbbr?
     */
    getSubjectAbbreviations: async (
        deptAbbr?: string
    ): Promise<SubjectAbbreviation[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ abbreviations: SubjectAbbreviation[] }>
            >(SUBJECT_ENDPOINTS.getAbbreviations(deptAbbr));
            return response.data.data.abbreviations;
        } catch (error) {
            console.error(
                `Failed to fetch subject abbreviations (Dept: ${
                    deptAbbr || "All"
                }):`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of subjects.
     * Corresponds to POST /api/v1/subjects/batch
     */
    batchCreateSubjects: async (
        subjects: CreateSubjectData[]
    ): Promise<Subject[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ subjects: Subject[] }>
            >(
                SUBJECT_ENDPOINTS.BATCH,
                { subjects } // Backend expects { subjects: [...] }
            );
            return response.data.data.subjects;
        } catch (error) {
            console.error("Failed to batch create subjects:", error);
            throw error;
        }
    },
};

export default subjectService;
