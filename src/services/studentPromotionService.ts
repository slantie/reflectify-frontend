// src/services/studentPromotionService.ts
import axiosInstance from "@/lib/axiosInstance";
import { API_V1_URL } from "@/constants/apiEndpoints";
import { ApiResponse } from "@/interfaces/common";

// Interfaces for promotion API
export interface PromotionResult {
    promoted: number;
    graduated: number;
    failed: number;
    details: {
        promoted: Array<{
            studentId: string;
            studentName: string;
            fromSemester: number;
            toSemester: number;
            fromAcademicYear: string;
            toAcademicYear: string;
        }>;
        graduated: Array<{
            studentId: string;
            studentName: string;
            finalSemester: number;
            academicYear: string;
        }>;
        failed: Array<{
            studentId: string;
            studentName: string;
            reason: string;
        }>;
    };
}

export interface PromotionPreview {
    totalStudents: number;
    willBePromoted: number;
    willGraduate: number;
    byDepartment: Array<{
        departmentName: string;
        currentSemester: number;
        studentCount: number;
        action: "promote" | "graduate";
    }>;
}

export interface PromoteByIdRequest {
    targetAcademicYearId: string;
}

export interface PromoteByYearRequest {
    yearString: string;
}

const STUDENT_PROMOTION_ENDPOINTS = {
    PROMOTE: `${API_V1_URL}/students/promote`,
    PREVIEW: `${API_V1_URL}/students/promote/preview`,
};

const studentPromotionService = {
    /**
     * Promotes all students using academic year ID
     * @param targetAcademicYearId - The ID of the target academic year
     * @returns Promise with promotion results
     */
    promoteAllStudentsById: async (
        targetAcademicYearId: string
    ): Promise<PromotionResult> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ promotion: PromotionResult }>
            >(STUDENT_PROMOTION_ENDPOINTS.PROMOTE, {
                targetAcademicYearId,
            });

            return response.data.data.promotion;
        } catch (error) {
            console.error("Failed to promote students by ID:", error);
            throw error;
        }
    },

    /**
     * Promotes all students using year string (auto-creates academic year if needed)
     * @param yearString - The year string (e.g., "2025-2026")
     * @returns Promise with promotion results
     */
    promoteAllStudentsByYear: async (
        yearString: string
    ): Promise<PromotionResult> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ promotion: PromotionResult }>
            >(STUDENT_PROMOTION_ENDPOINTS.PROMOTE, {
                yearString,
            });

            return response.data.data.promotion;
        } catch (error) {
            console.error("Failed to promote students by year:", error);
            throw error;
        }
    },

    /**
     * Gets a preview of what would happen during promotion
     * @param targetAcademicYearId - The ID of the target academic year
     * @returns Promise with promotion preview
     */
    getPromotionPreview: async (
        targetAcademicYearId: string
    ): Promise<PromotionPreview> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ preview: PromotionPreview }>
            >(STUDENT_PROMOTION_ENDPOINTS.PREVIEW, {
                params: { targetAcademicYearId },
            });

            return response.data.data.preview;
        } catch (error) {
            console.error("Failed to get promotion preview:", error);
            throw error;
        }
    },
};

export default studentPromotionService;
