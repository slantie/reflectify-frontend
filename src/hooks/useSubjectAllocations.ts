/**
@file src/hooks/useSubjectAllocations.ts
@description React Query hooks for subject allocations
*/

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subjectAllocationService from "@/services/subjectAllocationService"; // Adjust path
import {
    SubjectAllocation,
    CreateSubjectAllocationData,
    UpdateSubjectAllocationData,
} from "@/interfaces/subjectAllocation"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// Query keys for subject allocations
export const SUBJECT_ALLOCATION_QUERY_KEYS = {
    all: ["subjectAllocations"] as const,
    lists: () => [...SUBJECT_ALLOCATION_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...SUBJECT_ALLOCATION_QUERY_KEYS.all, id] as const,
};

// Get all subject allocations
export const useAllSubjectAllocations = () => {
    return useQuery<SubjectAllocation[], Error>({
        queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
        queryFn: subjectAllocationService.getAllSubjectAllocations,
    });
};

// Get subject allocation by ID
export const useSubjectAllocation = (id: IdType) => {
    return useQuery<SubjectAllocation, Error>({
        queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
        queryFn: () => subjectAllocationService.getSubjectAllocationById(id),
        enabled: !!id,
    });
};

// Create subject allocation
export const useCreateSubjectAllocation = () => {
    const queryClient = useQueryClient();
    return useMutation<SubjectAllocation, Error, CreateSubjectAllocationData>({
        mutationFn: subjectAllocationService.createSubjectAllocation,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
    });
};

// Update subject allocation
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
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(
                    updatedAllocation.id
                ),
            });
            queryClient.setQueryData<SubjectAllocation>(
                SUBJECT_ALLOCATION_QUERY_KEYS.detail(updatedAllocation.id),
                updatedAllocation
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
            const previousAllocation =
                queryClient.getQueryData<SubjectAllocation>(
                    SUBJECT_ALLOCATION_QUERY_KEYS.detail(id)
                );
            const previousAllocationsList = queryClient.getQueryData<
                SubjectAllocation[]
            >(SUBJECT_ALLOCATION_QUERY_KEYS.lists());
            queryClient.setQueryData<SubjectAllocation>(
                SUBJECT_ALLOCATION_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );
            queryClient.setQueryData<SubjectAllocation[]>(
                SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((alloc) =>
                        alloc.id === id ? { ...alloc, ...updateData } : alloc
                    )
            );
            return { previousAllocation, previousAllocationsList };
        },
        onError: (_err, variables, context) => {
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
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
    });
};

// Soft delete subject allocation
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
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
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
        onError: (_err, _idToDelete, context) => {
            if (context?.previousAllocationsList) {
                queryClient.setQueryData(
                    SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
                    context.previousAllocationsList
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_ALLOCATION_QUERY_KEYS.lists(),
            });
        },
    });
};
