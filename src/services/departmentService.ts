// src/services/departmentService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { DEPARTMENT_ENDPOINTS } from "@/constants/apiEndpoints";

// Import the new interfaces
import {
    Department,
    CreateDepartmentData,
    UpdateDepartmentData,
} from "@/interfaces/department"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const departmentService = {
    /**
     * Fetches all departments.
     * Corresponds to GET /api/v1/departments
     */
    getAllDepartments: async (): Promise<Department[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ departments: Department[] }>
            >(DEPARTMENT_ENDPOINTS.BASE);
            return response.data.data.departments;
        } catch (error) {
            console.error("Failed to fetch departments:", error);
            throw error;
        }
    },

    /**
     * Fetches a single department by ID.
     * Corresponds to GET /api/v1/departments/:id
     */
    getDepartmentById: async (id: IdType): Promise<Department> => {
        // Return type changed from Department | null to Department
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ department: Department }>
            >(DEPARTMENT_ENDPOINTS.getById(id));
            return response.data.data.department;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Department with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch department with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Creates a new department.
     * Corresponds to POST /api/v1/departments
     */
    createDepartment: async (
        departmentData: CreateDepartmentData
    ): Promise<Department> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ department: Department }>
            >(DEPARTMENT_ENDPOINTS.BASE, departmentData);
            return response.data.data.department;
        } catch (error) {
            console.error("Failed to create department:", error);
            throw error;
        }
    },

    /**
     * Updates an existing department.
     * Corresponds to PATCH /api/v1/departments/:id
     */
    updateDepartment: async (
        id: IdType, // Use IdType
        updateData: UpdateDepartmentData
    ): Promise<Department> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ department: Department }>
            >(DEPARTMENT_ENDPOINTS.getById(id), updateData);
            return response.data.data.department;
        } catch (error) {
            console.error(`Failed to update department with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a department.
     * Corresponds to DELETE /api/v1/departments/:id
     */
    softDeleteDepartment: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(DEPARTMENT_ENDPOINTS.getById(id));
            console.log(`Department with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete department with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of departments.
     * Corresponds to POST /api/v1/departments/batch
     */
    batchCreateDepartments: async (
        departments: CreateDepartmentData[]
    ): Promise<Department[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ departments: Department[] }>
            >(DEPARTMENT_ENDPOINTS.BATCH, { departments }); // Backend expects { departments: [...] }
            return response.data.data.departments;
        } catch (error) {
            console.error("Failed to batch create departments:", error);
            throw error;
        }
    },
};

export default departmentService;
