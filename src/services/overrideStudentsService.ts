// src/services/overrideStudentsService.ts
import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/interfaces/common";
import {
    OverrideStudent,
    OverrideStudentUploadResult as UploadOverrideStudentsResponse,
    PaginatedOverrideStudents,
} from "@/interfaces/overrideStudent";

const overrideStudentsService = {
    /**
     * Upload override students for a specific feedback form
     * Corresponds to POST /api/v1/feedback-forms/:id/override-students/upload
     */
    uploadOverrideStudents: async (
        formId: string,
        file: File
    ): Promise<UploadOverrideStudentsResponse> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post<
                ApiResponse<UploadOverrideStudentsResponse>
            >(
                `/api/v1/feedback-forms/${formId}/override-students/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data.data;
        } catch (error) {
            console.error("Failed to upload override students:", error);
            throw error;
        }
    },

    /**
     * Get override students for a feedback form with pagination
     * Corresponds to GET /api/v1/feedback-forms/:id/override-students
     */
    getOverrideStudents: async (
        formId: string,
        page = 1,
        limit = 50
    ): Promise<PaginatedOverrideStudents> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<PaginatedOverrideStudents>
            >(`/api/v1/feedback-forms/${formId}/override-students`, {
                params: { page, limit },
            });

            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch override students:", error);
            throw error;
        }
    },

    /**
     * Get the count of override students for a feedback form
     * Corresponds to GET /api/v1/feedback-forms/:id/override-students/count
     */
    getOverrideStudentsCount: async (formId: string): Promise<number> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ count: number }>
            >(`/api/v1/feedback-forms/${formId}/override-students/count`);

            return response.data.data.count;
        } catch (error) {
            console.error("Failed to fetch override students count:", error);
            throw error;
        }
    },

    /**
     * Get all override students for a feedback form without pagination
     * Corresponds to GET /api/v1/feedback-forms/:id/override-students/all
     */
    getAllOverrideStudents: async (
        formId: string
    ): Promise<OverrideStudent[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ students: OverrideStudent[] }>
            >(`/api/v1/feedback-forms/${formId}/override-students/all`);

            return response.data.data.students;
        } catch (error) {
            console.error("Failed to fetch all override students:", error);
            throw error;
        }
    },

    /**
     * Update a specific override student
     * Corresponds to PATCH /api/v1/feedback-forms/:id/override-students/:studentId
     */
    updateOverrideStudent: async (
        formId: string,
        studentId: string,
        updateData: Partial<Omit<OverrideStudent, "id" | "createdAt">>
    ): Promise<OverrideStudent> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ student: OverrideStudent }>
            >(
                `/api/v1/feedback-forms/${formId}/override-students/${studentId}`,
                updateData
            );

            return response.data.data.student;
        } catch (error) {
            console.error("Failed to update override student:", error);
            throw error;
        }
    },

    /**
     * Delete a specific override student
     * Corresponds to DELETE /api/v1/feedback-forms/:id/override-students/:studentId
     */
    deleteOverrideStudent: async (
        formId: string,
        studentId: string
    ): Promise<void> => {
        try {
            await axiosInstance.delete(
                `/api/v1/feedback-forms/${formId}/override-students/${studentId}`
            );
        } catch (error) {
            console.error("Failed to delete override student:", error);
            throw error;
        }
    },

    /**
     * Clear all override students for a feedback form
     * Corresponds to DELETE /api/v1/feedback-forms/:id/override-students
     */
    clearAllOverrideStudents: async (formId: string): Promise<number> => {
        try {
            const response = await axiosInstance.delete<
                ApiResponse<{ deletedCount: number }>
            >(`/api/v1/feedback-forms/${formId}/override-students`);

            return response.data.data.deletedCount;
        } catch (error) {
            console.error("Failed to clear override students:", error);
            throw error;
        }
    },
};

export default overrideStudentsService;
