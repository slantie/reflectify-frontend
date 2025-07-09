// src/hooks/useColleges.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import collegeService from "@/services/collegeService"; // Adjust path
import {
    College,
    CreateCollegeData,
    UpdateCollegeData,
} from "@/interfaces/college"; // Adjust path

// --- Query Keys ---
export const COLLEGE_QUERY_KEYS = {
    all: ["colleges"] as const,
    primary: () => [...COLLEGE_QUERY_KEYS.all, "primary"] as const,
    // If you ever need to fetch a college by ID (though not explicitly in provided routes for individual college)
    // detail: (id: IdType) => [...COLLEGE_QUERY_KEYS.all, 'detail', id] as const,
};

// --- Query Hook: Get All Colleges ---
export const useAllColleges = () => {
    return useQuery<College[], Error>({
        queryKey: COLLEGE_QUERY_KEYS.all, // Using 'all' for the list of colleges
        queryFn: collegeService.getAllColleges,
    });
};

// --- Query Hook: Get Primary College ---
export const usePrimaryCollege = () => {
    return useQuery<College, Error>({
        queryKey: COLLEGE_QUERY_KEYS.primary(),
        queryFn: collegeService.getPrimaryCollege,
        // If it's possible that the primary college might not exist initially,
        // useQuery will automatically set isError and error.
        // The component can then check if error.response?.status === 404 to display "College not configured" etc.
    });
};

// --- Mutation Hook: Upsert Primary College (Create or Update) ---
export const useUpsertPrimaryCollege = () => {
    const queryClient = useQueryClient();
    return useMutation<College, Error, CreateCollegeData>({
        mutationFn: collegeService.upsertPrimaryCollege,
        onSuccess: (newOrUpdatedCollege) => {
            // Invalidate all colleges list and primary college query to refetch
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });

            // Optimistically update the primary college in cache (if it exists)
            // This assumes the API response contains the full updated/created college.
            queryClient.setQueryData<College>(
                COLLEGE_QUERY_KEYS.primary(),
                newOrUpdatedCollege
            );
        },
        // No optimistic update on mutate for upsert unless you have a clear strategy for temporary IDs
    });
};

// --- Mutation Hook: Update Primary College ---
export const useUpdatePrimaryCollege = () => {
    const queryClient = useQueryClient();
    return useMutation<
        College, // TData: Expected return type on success
        Error, // TError: Expected error type
        UpdateCollegeData, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousPrimaryCollege: College | undefined;
            previousAllColleges: College[] | undefined;
        }
    >({
        mutationFn: collegeService.updatePrimaryCollege,
        onSuccess: (updatedCollege) => {
            // Invalidate primary college query and all colleges list to ensure fresh data
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });

            // Optimistically update the primary college in cache
            queryClient.setQueryData(
                COLLEGE_QUERY_KEYS.primary(),
                updatedCollege
            );
        },
        onMutate: async (updateData) => {
            // Cancel any outgoing refetches for the primary college and the all list
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.all,
            });

            // Snapshot the previous values
            const previousPrimaryCollege = queryClient.getQueryData<College>(
                COLLEGE_QUERY_KEYS.primary()
            );
            const previousAllColleges = queryClient.getQueryData<College[]>(
                COLLEGE_QUERY_KEYS.all
            );

            // Optimistically update the primary college in the cache
            queryClient.setQueryData<College>(
                COLLEGE_QUERY_KEYS.primary(),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the primary college within the 'all' list
            // We assume the ID of the primary college is known from `previousPrimaryCollege`
            if (previousPrimaryCollege?.id) {
                queryClient.setQueryData<College[]>(
                    COLLEGE_QUERY_KEYS.all,
                    (old) =>
                        old?.map((college) =>
                            college.id === previousPrimaryCollege.id
                                ? { ...college, ...updateData }
                                : college
                        )
                );
            }

            return { previousPrimaryCollege, previousAllColleges }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error("Failed optimistic update for primary college:", err);
            // Rollback to the previous data if the mutation fails
            if (context?.previousPrimaryCollege) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.primary(),
                    context.previousPrimaryCollege
                );
            }
            if (context?.previousAllColleges) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.all,
                    context.previousAllColleges
                );
            }
        },
        onSettled: () => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });
        },
    });
};

// --- Mutation Hook: Soft Delete Primary College ---
export const useSoftDeletePrimaryCollege = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        void, // TVariables (no variables needed for deleting primary)
        // TContext
        {
            previousPrimaryCollege: College | undefined;
            previousAllColleges: College[] | undefined;
        }
    >({
        mutationFn: collegeService.softDeletePrimaryCollege,
        onSuccess: () => {
            // Invalidate primary college query and all colleges list
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });
            // Optionally, remove the primary college from cache entirely as it's "deleted"
            queryClient.removeQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
        },
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.all,
            });

            const previousPrimaryCollege = queryClient.getQueryData<College>(
                COLLEGE_QUERY_KEYS.primary()
            );
            const previousAllColleges = queryClient.getQueryData<College[]>(
                COLLEGE_QUERY_KEYS.all
            );

            // Optimistically remove the primary college from cache by setting to undefined
            // This makes usePrimaryCollege return undefined if accessed before refetch
            queryClient.setQueryData<College>(
                COLLEGE_QUERY_KEYS.primary(),
                undefined
            );

            // Optimistically remove the primary college from the 'all' list
            if (previousPrimaryCollege?.id) {
                queryClient.setQueryData<College[]>(
                    COLLEGE_QUERY_KEYS.all,
                    (old) =>
                        old?.filter(
                            (college) =>
                                college.id !== previousPrimaryCollege.id
                        )
                );
            }

            return { previousPrimaryCollege, previousAllColleges };
        },
        onError: (err, variables, context) => {
            console.error(
                "Failed optimistic deletion for primary college:",
                err
            );
            if (context?.previousPrimaryCollege) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.primary(),
                    context.previousPrimaryCollege
                );
            }
            if (context?.previousAllColleges) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.all,
                    context.previousAllColleges
                );
            }
        },
        onSettled: () => {
            // Ensure data is consistent after mutation attempt
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });
        },
    });
};

// --- Mutation Hook: Batch Update Primary College ---
export const useBatchUpdatePrimaryCollege = () => {
    const queryClient = useQueryClient();
    return useMutation<
        College, // TData
        Error, // TError
        UpdateCollegeData, // TVariables
        // TContext
        {
            previousPrimaryCollege: College | undefined;
            previousAllColleges: College[] | undefined;
        }
    >({
        mutationFn: collegeService.batchUpdatePrimaryCollege,
        onSuccess: (updatedCollege) => {
            // Invalidate primary college query and all colleges list
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });

            // Optimistically update the primary college in cache
            queryClient.setQueryData(
                COLLEGE_QUERY_KEYS.primary(),
                updatedCollege
            );
        },
        // Optimistic update for batch update on primary college
        onMutate: async (updateData) => {
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            await queryClient.cancelQueries({
                queryKey: COLLEGE_QUERY_KEYS.all,
            });

            const previousPrimaryCollege = queryClient.getQueryData<College>(
                COLLEGE_QUERY_KEYS.primary()
            );
            const previousAllColleges = queryClient.getQueryData<College[]>(
                COLLEGE_QUERY_KEYS.all
            );

            queryClient.setQueryData<College>(
                COLLEGE_QUERY_KEYS.primary(),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the 'all' list by its ID
            if (previousPrimaryCollege?.id) {
                queryClient.setQueryData<College[]>(
                    COLLEGE_QUERY_KEYS.all,
                    (old) =>
                        old?.map((college) =>
                            college.id === previousPrimaryCollege.id
                                ? { ...college, ...updateData }
                                : college
                        )
                );
            }

            return { previousPrimaryCollege, previousAllColleges };
        },
        onError: (err, variables, context) => {
            console.error(
                "Failed optimistic batch update for primary college:",
                err
            );
            if (context?.previousPrimaryCollege) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.primary(),
                    context.previousPrimaryCollege
                );
            }
            if (context?.previousAllColleges) {
                queryClient.setQueryData(
                    COLLEGE_QUERY_KEYS.all,
                    context.previousAllColleges
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: COLLEGE_QUERY_KEYS.primary(),
            });
            queryClient.invalidateQueries({ queryKey: COLLEGE_QUERY_KEYS.all });
        },
    });
};
