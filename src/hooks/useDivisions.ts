// src/hooks/useDivisions.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import divisionService from "@/services/divisionService"; // Adjust path
import {
    Division,
    CreateDivisionData,
    UpdateDivisionData,
} from "@/interfaces/division"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const DIVISION_QUERY_KEYS = {
    all: ["divisions"] as const,
    lists: (departmentId?: IdType, semesterId?: IdType) =>
        [...DIVISION_QUERY_KEYS.all, "list", departmentId, semesterId] as const,
    detail: (id: IdType) => [...DIVISION_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Divisions ---
interface UseAllDivisionsParams {
    departmentId?: IdType;
    semesterId?: IdType;
    enabled?: boolean;
}
export const useAllDivisions = ({
    departmentId,
    semesterId,
    enabled = true,
}: UseAllDivisionsParams = {}) => {
    return useQuery<Division[], Error>({
        queryKey: DIVISION_QUERY_KEYS.lists(departmentId, semesterId),
        queryFn: () =>
            divisionService.getAllDivisions(departmentId, semesterId),
        enabled: enabled, // Query runs by default unless explicitly disabled
    });
};

// --- Query Hook: Get Division by ID ---
export const useDivision = (id: IdType) => {
    return useQuery<Division, Error>({
        queryKey: DIVISION_QUERY_KEYS.detail(id),
        queryFn: () => divisionService.getDivisionById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Mutation Hook: Create Division ---
export const useCreateDivision = () => {
    const queryClient = useQueryClient();
    return useMutation<Division, Error, CreateDivisionData>({
        mutationFn: divisionService.createDivision,
        onSuccess: (_newDivision) => {
            // Invalidate all division lists that might be affected
            // This will refetch any useAllDivisions queries
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            }); // Invalidate all lists
            // Optionally, specifically invalidate lists with relevant department/semester IDs if known
            // queryClient.invalidateQueries({ queryKey: DIVISION_QUERY_KEYS.lists(newDivision.departmentId, newDivision.semesterId) });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newDivision) => { ... }
    });
};

// --- Mutation Hook: Update Division ---
export const useUpdateDivision = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Division, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateDivisionData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousDivision: Division | undefined;
            previousDivisionsList: Division[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => divisionService.updateDivision(id, data),
        onSuccess: (updatedDivision) => {
            // Invalidate all division lists that might be affected
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
            // Invalidate the specific division detail query
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.detail(updatedDivision.id),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Division>(
                DIVISION_QUERY_KEYS.detail(updatedDivision.id),
                updatedDivision
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this division and relevant lists
            await queryClient.cancelQueries({
                queryKey: DIVISION_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });

            // Snapshot the previous values
            const previousDivision = queryClient.getQueryData<Division>(
                DIVISION_QUERY_KEYS.detail(id)
            );
            const previousDivisionsList = queryClient.getQueryData<Division[]>(
                DIVISION_QUERY_KEYS.all
            );

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Division>(
                DIVISION_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<Division[]>(
                DIVISION_QUERY_KEYS.all,
                (old) =>
                    old?.map((div) =>
                        div.id === id ? { ...div, ...updateData } : div
                    )
            );

            return { previousDivision, previousDivisionsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousDivision) {
                queryClient.setQueryData(
                    DIVISION_QUERY_KEYS.detail(variables.id),
                    context.previousDivision
                );
            }
            if (context?.previousDivisionsList) {
                queryClient.setQueryData(
                    DIVISION_QUERY_KEYS.all,
                    context.previousDivisionsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Division ---
export const useSoftDeleteDivision = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousDivisionsList: Division[] | undefined }
    >({
        mutationFn: (id) => divisionService.softDeleteDivision(id),
        onSuccess: (_, id) => {
            // Invalidate all division lists to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
            // Optionally, remove the specific division from cache
            queryClient.removeQueries({
                queryKey: DIVISION_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
            const previousDivisionsList = queryClient.getQueryData<Division[]>(
                DIVISION_QUERY_KEYS.all
            );

            queryClient.setQueryData<Division[]>(
                DIVISION_QUERY_KEYS.all,
                (old) => old?.filter((div) => div.id !== idToDelete)
            );
            return { previousDivisionsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousDivisionsList) {
                queryClient.setQueryData(
                    DIVISION_QUERY_KEYS.all,
                    context.previousDivisionsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
        },
    });
};

// --- Mutation Hook: Batch Create Divisions ---
export const useBatchCreateDivisions = () => {
    const queryClient = useQueryClient();
    return useMutation<Division[], Error, CreateDivisionData[]>({
        mutationFn: divisionService.batchCreateDivisions,
        onSuccess: () => {
            // Invalidate all division lists to refetch it after batch creation
            queryClient.invalidateQueries({
                queryKey: DIVISION_QUERY_KEYS.all,
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
