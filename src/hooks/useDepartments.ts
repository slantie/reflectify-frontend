// src/hooks/useDepartments.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import departmentService from "@/services/departmentService"; // Adjust path
import {
    Department,
    CreateDepartmentData,
    UpdateDepartmentData,
} from "@/interfaces/department"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const DEPARTMENT_QUERY_KEYS = {
    all: ["departments"] as const,
    lists: () => [...DEPARTMENT_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...DEPARTMENT_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Departments ---
export const useAllDepartments = () => {
    return useQuery<Department[], Error>({
        queryKey: DEPARTMENT_QUERY_KEYS.lists(),
        queryFn: departmentService.getAllDepartments,
    });
};

// --- Query Hook: Get Department by ID ---
export const useDepartment = (id: IdType) => {
    return useQuery<Department, Error>({
        queryKey: DEPARTMENT_QUERY_KEYS.detail(id),
        queryFn: () => departmentService.getDepartmentById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Mutation Hook: Create Department ---
export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation<Department, Error, CreateDepartmentData>({
        mutationFn: departmentService.createDepartment,
        onSuccess: () => {
            // Invalidate the list of departments to refetch it after creation
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newDept) => { ... }
    });
};

// --- Mutation Hook: Update Department ---
export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Department, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateDepartmentData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousDepartment: Department | undefined;
            previousDepartmentsList: Department[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) =>
            departmentService.updateDepartment(id, data),
        onSuccess: (updatedDepartment) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
            // Invalidate the specific department detail query
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.detail(updatedDepartment.id),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Department>(
                DEPARTMENT_QUERY_KEYS.detail(updatedDepartment.id),
                updatedDepartment
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this department and the list
            await queryClient.cancelQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });

            // Snapshot the previous values
            const previousDepartment = queryClient.getQueryData<Department>(
                DEPARTMENT_QUERY_KEYS.detail(id)
            );
            const previousDepartmentsList = queryClient.getQueryData<
                Department[]
            >(DEPARTMENT_QUERY_KEYS.lists());

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Department>(
                DEPARTMENT_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<Department[]>(
                DEPARTMENT_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((dept) =>
                        dept.id === id ? { ...dept, ...updateData } : dept
                    )
            );

            return { previousDepartment, previousDepartmentsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousDepartment) {
                queryClient.setQueryData(
                    DEPARTMENT_QUERY_KEYS.detail(variables.id),
                    context.previousDepartment
                );
            }
            if (context?.previousDepartmentsList) {
                queryClient.setQueryData(
                    DEPARTMENT_QUERY_KEYS.lists(),
                    context.previousDepartmentsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Department ---
export const useSoftDeleteDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousDepartmentsList: Department[] | undefined }
    >({
        mutationFn: (id) => departmentService.softDeleteDepartment(id),
        onSuccess: (_, id) => {
            // Invalidate the list of departments to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
            // Optionally, remove the specific department from cache
            queryClient.removeQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
            const previousDepartmentsList = queryClient.getQueryData<
                Department[]
            >(DEPARTMENT_QUERY_KEYS.lists());

            queryClient.setQueryData<Department[]>(
                DEPARTMENT_QUERY_KEYS.lists(),
                (old) => old?.filter((dept) => dept.id !== idToDelete)
            );
            return { previousDepartmentsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousDepartmentsList) {
                queryClient.setQueryData(
                    DEPARTMENT_QUERY_KEYS.lists(),
                    context.previousDepartmentsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Batch Create Departments ---
export const useBatchCreateDepartments = () => {
    const queryClient = useQueryClient();
    return useMutation<Department[], Error, CreateDepartmentData[]>({
        mutationFn: departmentService.batchCreateDepartments,
        onSuccess: () => {
            // Invalidate the list of departments to refetch it after batch creation
            queryClient.invalidateQueries({
                queryKey: DEPARTMENT_QUERY_KEYS.lists(),
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
