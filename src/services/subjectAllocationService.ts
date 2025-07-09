// src/services/subjectAllocationService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { SUBJECT_ALLOCATION_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    SubjectAllocation,
    CreateSubjectAllocationData,
    UpdateSubjectAllocationData,
} from "@/interfaces/subjectAllocation"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const subjectAllocationService = {
    /**
     * Retrieves all active subject allocations.
     * Corresponds to GET /api/v1/subject-allocations
     */
    getAllSubjectAllocations: async (): Promise<SubjectAllocation[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subjectAllocations: SubjectAllocation[] }>
            >(SUBJECT_ALLOCATION_ENDPOINTS.BASE);
            return response.data.data.subjectAllocations;
        } catch (error) {
            console.error("Failed to fetch subject allocations:", error);
            throw error;
        }
    },

    /**
     * Creates a new subject allocation.
     * Corresponds to POST /api/v1/subject-allocations
     */
    createSubjectAllocation: async (
        allocationData: CreateSubjectAllocationData
    ): Promise<SubjectAllocation> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ subjectAllocation: SubjectAllocation }>
            >(SUBJECT_ALLOCATION_ENDPOINTS.BASE, allocationData);
            return response.data.data.subjectAllocation;
        } catch (error) {
            console.error("Failed to create subject allocation:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single subject allocation by ID.
     * Corresponds to GET /api/v1/subject-allocations/:id
     */
    getSubjectAllocationById: async (
        id: IdType
    ): Promise<SubjectAllocation> => {
        // Changed return type
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subjectAllocation: SubjectAllocation }>
            >(SUBJECT_ALLOCATION_ENDPOINTS.getById(id));
            return response.data.data.subjectAllocation;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Subject allocation with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(
                `Failed to fetch subject allocation with ID ${id}:`,
                error
            );
            throw error; // Re-throw other errors
        }
    },

    /**
     * Updates an existing subject allocation.
     * Corresponds to PATCH /api/v1/subject-allocations/:id
     */
    updateSubjectAllocation: async (
        id: IdType,
        updateData: UpdateSubjectAllocationData
    ): Promise<SubjectAllocation> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ subjectAllocation: SubjectAllocation }>
            >(SUBJECT_ALLOCATION_ENDPOINTS.getById(id), updateData);
            return response.data.data.subjectAllocation;
        } catch (error) {
            console.error(
                `Failed to update subject allocation with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Soft deletes a subject allocation.
     * Corresponds to DELETE /api/v1/subject-allocations/:id
     */
    softDeleteSubjectAllocation: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(
                SUBJECT_ALLOCATION_ENDPOINTS.getById(id)
            );
            console.log(
                `Subject allocation with ID ${id} soft-deleted successfully.`
            );
        } catch (error) {
            console.error(
                `Failed to soft-delete subject allocation with ID ${id}:`,
                error
            );
            throw error;
        }
    },
};

export default subjectAllocationService;
