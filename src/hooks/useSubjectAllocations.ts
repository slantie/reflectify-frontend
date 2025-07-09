// src/hooks/useSubjectAllocations.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subjectAllocationService from "@/services/subjectAllocationService"; // Adjust path
import {
    SubjectAllocation,
    CreateSubjectAllocationData,
    UpdateSubjectAllocationData,
} from "@/interfaces/subjectAllocation"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const SUBJECT_ALLOCATION_QUERY_KEYS = {
    all: ["subjectAllocations"] as const,
    lists: () => [...SUBJECT_ALLOCATION_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...SUBJECT_ALLOCATION_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Subject Allocations ---
export const useAllSubjectAllocations = () => {
    return useQuery<SubjectAllocation[], Error>({
        queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
        queryFn: subjectAllocationService.getAllSubjectAllocations,
    });
};

// --- Query Hook: Get Subject Allocation by ID ---
export const useSubjectAllocation = (id: IdType) => {
    return useQuery<SubjectAllocation, Error>({
        queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
        queryFn: () => subjectAllocationService.getSubjectAllocationById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Mutation Hook: Create Subject Allocation ---
export const useCreateSubjectAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation<SubjectAllocation, Error, CreateSubjectAllocationData>({
        mutationFn: subjectAllocationService.createSubjectAllocation,
        onSuccess: () => {
            // Invalidate the list of subject allocations to refetch it after creation
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newAllocation) => { ... }
    });
};

// --- Mutation Hook: Update Subject Allocation ---
export const useUpdateSubjectAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        SubjectAllocation, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateSubjectAllocationData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousAllocation: SubjectAllocation | undefined;
            previousAllocationsList: SubjectAllocation[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) =>
            subjectAllocationService.updateSubjectAllocation(id, data),
        onSuccess: (updatedAllocation) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
            // Invalidate the specific subject allocation detail query
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(
                    updatedAllocation.id
                ),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<SubjectAllocation>(
                SUBJECT_ALLOCATION_QUERY_KEYS.detail(updatedAllocation.id),
                updatedAllocation
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this allocation and the list
            await queryClient.cancelQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });

            // Snapshot the previous values
            const previousAllocation =
                queryClient.getQueryData<SubjectAllocation>(
                    SUBJECT_ALLOCATION_QUERY_KEYS.detail(id)
                );
            const previousAllocationsList = queryClient.getQueryData<
                SubjectAllocation[]
            >(SUBJECT_ALLOCATION_QUERY_KEYS.lists());

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<SubjectAllocation>(
                SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<SubjectAllocation[]>(
                SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((alloc) =>
                        alloc.id === id ? { ...alloc, ...updateData } : alloc
                    )
            );

            return { previousAllocation, previousAllocationsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousAllocation) {
                queryClient.setQueryData(
                    SUBJECT_ALLOCATION_QUERY_KEYS.detail(variables.id),
                    context.previousAllocation
                );
            }
            if (context?.previousAllocationsList) {
                queryClient.setQueryData(
                    SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                    context.previousAllocationsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Subject Allocation ---
export const useSoftDeleteSubjectAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousAllocationsList: SubjectAllocation[] | undefined }
    >({
        mutationFn: (id) =>
            subjectAllocationService.softDeleteSubjectAllocation(id),
        onSuccess: (_, id) => {
            // Invalidate the list of subject allocations to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
            // Optionally, remove the specific subject allocation from cache
            queryClient.removeQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
            const previousAllocationsList = queryClient.getQueryData<
                SubjectAllocation[]
            >(SUBJECT_ALLOCATION_QUERY_KEYS.lists());

            queryClient.setQueryData<SubjectAllocation[]>(
                SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                (old) => old?.filter((alloc) => alloc.id !== idToDelete)
            );
            return { previousAllocationsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousAllocationsList) {
                queryClient.setQueryData(
                    SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                    context.previousAllocationsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
    });
};
