// src/hooks/useStudentPromotion.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import studentPromotionService, {
    PromotionResult,
    PromotionPreview,
} from "@/services/studentPromotionService";

// Mutation hook for promoting students by year string
export const usePromoteStudentsByYear = () => {
    return useMutation<PromotionResult, Error, string>({
        mutationFn: (yearString: string) =>
            studentPromotionService.promoteAllStudentsByYear(yearString),
        onSuccess: (data) => {
            console.log("Promotion successful:", data);
        },
        onError: (error) => {
            console.error("Promotion failed:", error);
        },
    });
};

// Mutation hook for promoting students by academic year ID
export const usePromoteStudentsById = () => {
    return useMutation<PromotionResult, Error, string>({
        mutationFn: (targetAcademicYearId: string) =>
            studentPromotionService.promoteAllStudentsById(
                targetAcademicYearId
            ),
        onSuccess: (data) => {
            console.log("Promotion successful:", data);
        },
        onError: (error) => {
            console.error("Promotion failed:", error);
        },
    });
};

// Query hook for getting promotion preview
export const usePromotionPreview = (
    targetAcademicYearId: string,
    enabled: boolean = true
) => {
    return useQuery<PromotionPreview, Error>({
        queryKey: ["promotionPreview", targetAcademicYearId],
        queryFn: () =>
            studentPromotionService.getPromotionPreview(targetAcademicYearId),
        enabled: enabled && !!targetAcademicYearId,
    });
};
