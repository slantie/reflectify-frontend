// src/hooks/useAcademicYears.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import academicYearService from "@/services/academicYearService"; // Adjust path
import {
    AcademicYear,
    CreateAcademicYearData,
    UpdateAcademicYearData,
} from "@/interfaces/academicYear"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const ACADEMIC_YEAR_QUERY_KEYS = {
    all: ["academicYears"] as const,
    lists: () => [...ACADEMIC_YEAR_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...ACADEMIC_YEAR_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Academic Years ---
export const useAllAcademicYears = () => {
    return useQuery<AcademicYear[], Error>({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
        queryFn: academicYearService.getAllAcademicYears,
    });
};

// --- Query Hook: Get Academic Year by ID ---
export const useAcademicYear = (id: IdType) => {
    return useQuery<AcademicYear, Error>({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(id),
        queryFn: () => academicYearService.getAcademicYearById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Mutation Hook: Create Academic Year ---
export const useCreateAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation<AcademicYear, Error, CreateAcademicYearData>({
        mutationFn: academicYearService.createAcademicYear,
        onSuccess: () => {
            // Invalidate the list of academic years to refetch it after creation
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newYear) => { ... }
    });
};

// --- Mutation Hook: Update Academic Year ---
export const useUpdateAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation<
        AcademicYear, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateAcademicYearData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousYear: AcademicYear | undefined;
            previousYearsList: AcademicYear[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) =>
            academicYearService.updateAcademicYear(id, data),
        onSuccess: (updatedYear) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
            // Invalidate the specific academic year detail query
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(updatedYear.id),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<AcademicYear>(
                ACADEMIC_YEAR_QUERY_KEYS.detail(updatedYear.id),
                updatedYear
            );
        },
        // Optional: Optimistic update example for PATCH
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this academic year and the list
            await queryClient.cancelQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });

            // Snapshot the previous values
            const previousYear = queryClient.getQueryData<AcademicYear>(
                ACADEMIC_YEAR_QUERY_KEYS.detail(id)
            );
            const previousYearsList = queryClient.getQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists()
            );

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<AcademicYear>(
                ACADEMIC_YEAR_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((year) =>
                        year.id === id ? { ...year, ...updateData } : year
                    )
            );

            return { previousYear, previousYearsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousYear) {
                // Now 'context' is correctly typed
                queryClient.setQueryData(
                    ACADEMIC_YEAR_QUERY_KEYS.detail(variables.id),
                    context.previousYear
                );
            }
            if (context?.previousYearsList) {
                // Now 'context' is correctly typed
                queryClient.setQueryData(
                    ACADEMIC_YEAR_QUERY_KEYS.lists(),
                    context.previousYearsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Academic Year ---
export const useSoftDeleteAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousYearsList: AcademicYear[] | undefined }
    >({
        mutationFn: (id) => academicYearService.softDeleteAcademicYear(id),
        onSuccess: (_, id) => {
            // Invalidate the list of academic years to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
            // Optionally, remove the specific academic year from cache
            queryClient.removeQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(id),
            });
        },
        // Optional: Optimistic update for deletion
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
            const previousYearsList = queryClient.getQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<AcademicYear[]>(
                ACADEMIC_YEAR_QUERY_KEYS.lists(),
                (old) => old?.filter((year) => year.id !== idToDelete)
            );
            return { previousYearsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousYearsList) {
                // Now 'context' is correctly typed
                queryClient.setQueryData(
                    ACADEMIC_YEAR_QUERY_KEYS.lists(),
                    context.previousYearsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: ACADEMIC_YEAR_QUERY_KEYS.lists(),
            });
        },
    });
};
