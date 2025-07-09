/**
 * @file src/hooks/useAcademicYear.ts
 * @description React Query hooks for Academic Year CRUD operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { academicYearService } from "@/services/academicYear.service";
import {
    AcademicYear,
    CreateAcademicYearData,
    UpdateAcademicYearData,
    AcademicYearStats,
} from "@/interfaces/academicYear";
import { showToast } from "@/lib/toast";

// Query keys
export const ACADEMIC_YEAR_QUERY_KEYS = {
    all: ["academicYears"] as const,
    lists: () => [...ACADEMIC_YEAR_QUERY_KEYS.all, "list"] as const,
    list: (filters: string) =>
        [...ACADEMIC_YEAR_QUERY_KEYS.lists(), { filters }] as const,
    details: () => [...ACADEMIC_YEAR_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string) =>
        [...ACADEMIC_YEAR_QUERY_KEYS.details(), id] as const,
    active: () => [...ACADEMIC_YEAR_QUERY_KEYS.all, "active"] as const,
};

/**
 * Hook to fetch all academic years
 */
export const useAcademicYears = () => {
    return useQuery({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
        queryFn: () => academicYearService.getAllAcademicYears(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to fetch a single academic year by ID
 */
export const useAcademicYear = (id: string) => {
    return useQuery({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(id),
        queryFn: () => academicYearService.getAcademicYearById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to create a new academic year
 */
export const useCreateAcademicYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAcademicYearData) =>
            academicYearService.createAcademicYear(data),
        onSuccess: (newAcademicYear) => {
            // Invalidate and refetch academic years list
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });

            // Add the new academic year to the cache
            queryClient.setQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists(),
                (old) => (old ? [newAcademicYear, ...old] : [newAcademicYear])
            );

            showToast.success("Academic year created successfully");
        },
        onError: (error: any) => {
            showToast.error(error?.message || "Failed to create academic year");
        },
    });
};

/**
 * Hook to update an academic year
 */
export const useUpdateAcademicYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAcademicYearData;
        }) => academicYearService.updateAcademicYear(id, data),
        onSuccess: (updatedAcademicYear, variables) => {
            // Update the academic years list
            queryClient.setQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((academicYear) =>
                        academicYear.id === variables.id
                            ? updatedAcademicYear
                            : academicYear
                    ) || []
            );

            // Update the individual academic year cache
            queryClient.setQueryData(
                ACADEMIC_YEAR_QUERY_KEYS.detail(variables.id),
                updatedAcademicYear
            );

            showToast.success("Academic year updated successfully");
        },
        onError: (error: any) => {
            showToast.error(error?.message || "Failed to update academic year");
        },
    });
};

/**
 * Hook to delete an academic year
 */
export const useDeleteAcademicYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => academicYearService.deleteAcademicYear(id),
        onSuccess: (_, deletedId) => {
            // Remove from academic years list
            queryClient.setQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists(),
                (old) =>
                    old?.filter(
                        (academicYear) => academicYear.id !== deletedId
                    ) || []
            );

            // Remove individual academic year cache
            queryClient.removeQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(deletedId),
            });

            showToast.success("Academic year deleted successfully");
        },
        onError: (error: any) => {
            showToast.error(error?.message || "Failed to delete academic year");
        },
    });
};

/**
 * Hook to calculate academic year statistics
 */
export const useAcademicYearStats = () => {
    const { data: academicYears = [], isLoading } = useAcademicYears();

    const stats: AcademicYearStats = {
        totalAcademicYears: academicYears.length,
        activeYearsCount: academicYears.filter((year) => !year.isDeleted)
            .length,
        currentYear: getCurrentAcademicYear(academicYears),
        upcomingYear: getUpcomingAcademicYear(academicYears),
    };

    return { stats, isLoading };
};

/**
 * Hook to fetch the active academic year
 */
export const useActiveAcademicYear = () => {
    return useQuery({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.active(),
        queryFn: () => academicYearService.getActiveAcademicYear(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Helper functions
const getCurrentAcademicYear = (
    academicYears: AcademicYear[]
): AcademicYear | null => {
    return academicYears.find((year) => year.isActive) || null;
};

// Since we've removed date-based logic, there's no concept of "upcoming" years anymore
// This function now returns null as we're relying solely on isActive flag
const getUpcomingAcademicYear = (
    _academicYears: AcademicYear[]
): AcademicYear | null => {
    return null;
};
