// src/services/studentService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { STUDENT_ENDPOINTS } from "@/constants/apiEndpoints";

// Import the new interfaces
import {
    Student,
    CreateStudentData,
    UpdateStudentData,
} from "@/interfaces/student"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const studentService = {
    /**
     * Fetches all students.
     * Corresponds to GET /api/v1/students
     */
    getAllStudents: async (): Promise<Student[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ students: Student[] }>
            >(STUDENT_ENDPOINTS.BASE);
            return response.data.data.students;
        } catch (error) {
            console.error("Failed to fetch students:", error);
            throw error;
        }
    },

    /**
     * Fetches a single student by ID.
     * Corresponds to GET /api/v1/students/:id
     */
    getStudentById: async (id: IdType): Promise<Student> => {
        // Return type changed from Student | null to Student
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ student: Student }>
            >(STUDENT_ENDPOINTS.getById(id));
            return response.data.data.student;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Student with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(`Failed to fetch student with ID ${id}:`, error);
            throw error; // Re-throw other errors
        }
    },

    /**
     * Creates a new student.
     * Corresponds to POST /api/v1/students
     */
    createStudent: async (studentData: CreateStudentData): Promise<Student> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ student: Student }>
            >(STUDENT_ENDPOINTS.BASE, studentData);
            return response.data.data.student;
        } catch (error) {
            console.error("Failed to create student:", error);
            throw error;
        }
    },

    /**
     * Updates an existing student.
     * Corresponds to PATCH /api/v1/students/:id
     */
    updateStudent: async (
        id: IdType, // Use IdType
        updateData: UpdateStudentData
    ): Promise<Student> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ student: Student }>
            >(STUDENT_ENDPOINTS.getById(id), updateData);
            return response.data.data.student;
        } catch (error) {
            console.error(`Failed to update student with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Soft deletes a student.
     * Corresponds to DELETE /api/v1/students/:id
     */
    softDeleteStudent: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(STUDENT_ENDPOINTS.getById(id));
            console.log(`Student with ID ${id} soft-deleted successfully.`);
        } catch (error) {
            console.error(
                `Failed to soft-delete student with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch creation of students.
     * Corresponds to POST /api/v1/students/batch
     */
    batchCreateStudents: async (
        students: CreateStudentData[]
    ): Promise<Student[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ students: Student[] }>
            >(STUDENT_ENDPOINTS.BATCH, { students }); // Backend expects { students: [...] }
            return response.data.data.students;
        } catch (error) {
            console.error("Failed to batch create students:", error);
            throw error;
        }
    },
};

export default studentService;
