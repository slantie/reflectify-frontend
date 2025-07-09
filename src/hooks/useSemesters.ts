// src/hooks/useSemesters.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import semesterService from "@/services/semesterService"; // Adjust path
import {
    Semester,
    CreateSemesterData,
    UpdateSemesterData,
    GetSemestersFilters,
} from "@/interfaces/semester"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const SEMESTER_QUERY_KEYS = {
    all: ["semesters"] as const,
    lists: (filters?: GetSemestersFilters) =>
        [...SEMESTER_QUERY_KEYS.all, "list", filters] as const, // Include filters in query key
    detail: (id: IdType) => [...SEMESTER_QUERY_KEYS.all, id] as const,
    byDepartment: (departmentId: IdType) =>
        [...SEMESTER_QUERY_KEYS.all, "byDepartment", departmentId] as const,
};

// --- Query Hook: Get All Semesters ---
interface UseAllSemestersParams {
    filters?: GetSemestersFilters;
    enabled?: boolean;
}
export const useAllSemesters = ({
    filters,
    enabled = true,
}: UseAllSemestersParams = {}) => {
    return useQuery<Semester[], Error>({
        queryKey: SEMESTER_QUERY_KEYS.lists(filters),
        queryFn: () => semesterService.getAllSemesters(filters),
        enabled: enabled,
    });
};

// --- Query Hook: Get Semester by ID ---
export const useSemester = (id: IdType) => {
    return useQuery<Semester, Error>({
        queryKey: SEMESTER_QUERY_KEYS.detail(id),
        queryFn: () => semesterService.getSemesterById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Query Hook: Get Semesters by Department ID ---
interface UseSemestersByDepartmentIdParams {
    departmentId: IdType;
    enabled?: boolean;
}
export const useSemestersByDepartmentId = ({
    departmentId,
    enabled = true,
}: UseSemestersByDepartmentIdParams) => {
    return useQuery<Semester[], Error>({
        queryKey: SEMESTER_QUERY_KEYS.byDepartment(departmentId),
        queryFn: () => semesterService.getSemestersByDepartmentId(departmentId),
        enabled: enabled && !!departmentId, // Only run if departmentId is provided and enabled
    });
};

// --- Mutation Hook: Create Semester ---
export const useCreateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation<Semester, Error, CreateSemesterData>({
        mutationFn: semesterService.createSemester,
        onSuccess: (newSemester) => {
            // Invalidate all semester lists to refetch them after creation
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            // Invalidate specific department's semester list
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.byDepartment(
                    newSemester.departmentId
                ),
            });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newSemester) => { ... }
    });
};

// --- Mutation Hook: Update Semester ---
export const useUpdateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Semester, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateSemesterData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousSemester: Semester | undefined;
            previousSemestersList: Semester[] | undefined;
            previousDeptSemestersList: Semester[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => semesterService.updateSemester(id, data),
        onSuccess: (updatedSemester) => {
            // Invalidate all semester lists that might be affected
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            // Invalidate the specific semester detail query
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.detail(updatedSemester.id),
            });
            // Invalidate specific department's semester list
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.byDepartment(
                    updatedSemester.departmentId
                ),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Semester>(
                SEMESTER_QUERY_KEYS.detail(updatedSemester.id),
                updatedSemester
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this semester and relevant lists
            await queryClient.cancelQueries({
                queryKey: SEMESTER_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });

            const previousSemester = queryClient.getQueryData<Semester>(
                SEMESTER_QUERY_KEYS.detail(id)
            );
            if (previousSemester?.departmentId) {
                await queryClient.cancelQueries({
                    queryKey: SEMESTER_QUERY_KEYS.byDepartment(
                        previousSemester.departmentId
                    ),
                });
            }

            // Snapshot the previous values
            const previousSemestersList = queryClient.getQueryData<Semester[]>(
                SEMESTER_QUERY_KEYS.all
            );
            const previousDeptSemestersList = previousSemester?.departmentId
                ? queryClient.getQueryData<Semester[]>(
                      SEMESTER_QUERY_KEYS.byDepartment(
                          previousSemester.departmentId
                      )
                  )
                : undefined;

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Semester>(
                SEMESTER_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the general list (if it exists)
            queryClient.setQueryData<Semester[]>(
                SEMESTER_QUERY_KEYS.all,
                (old) =>
                    old?.map((sem) =>
                        sem.id === id ? { ...sem, ...updateData } : sem
                    )
            );

            // Optimistically update the item within the department-specific list (if it exists)
            if (previousSemester?.departmentId) {
                queryClient.setQueryData<Semester[]>(
                    SEMESTER_QUERY_KEYS.byDepartment(
                        previousSemester.departmentId
                    ),
                    (old) =>
                        old?.map((sem) =>
                            sem.id === id ? { ...sem, ...updateData } : sem
                        )
                );
            }

            return {
                previousSemester,
                previousSemestersList,
                previousDeptSemestersList,
            }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousSemester) {
                queryClient.setQueryData(
                    SEMESTER_QUERY_KEYS.detail(variables.id),
                    context.previousSemester
                );
            }
            if (context?.previousSemestersList) {
                queryClient.setQueryData(
                    SEMESTER_QUERY_KEYS.all,
                    context.previousSemestersList
                );
            }
            if (
                context?.previousDeptSemestersList &&
                context.previousSemester?.departmentId
            ) {
                queryClient.setQueryData(
                    SEMESTER_QUERY_KEYS.byDepartment(
                        context.previousSemester.departmentId
                    ),
                    context.previousDeptSemestersList
                );
            }
        },
        onSettled: (data, error, variables, context) => {
            // Added 'context' parameter
            // Prioritize data (if successful), then context, then try to get from cache
            const affectedDepartmentId =
                (data as Semester)?.departmentId ||
                context?.previousSemester?.departmentId;

            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            if (affectedDepartmentId) {
                queryClient.invalidateQueries({
                    queryKey:
                        SEMESTER_QUERY_KEYS.byDepartment(affectedDepartmentId),
                });
            }
        },
    });
};

// --- Mutation Hook: Soft Delete Semester ---
export const useSoftDeleteSemester = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        {
            previousSemestersList: Semester[] | undefined;
            previousDeptSemestersList: Semester[] | undefined;
            semesterToDelete: Semester | undefined;
        }
    >({
        mutationFn: (id) => semesterService.softDeleteSemester(id),
        onSuccess: (_, id) => {
            // Invalidate all semester lists to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            // Invalidate specific department's semester list if known
            // This will be handled more robustly by onSettled if we can derive departmentId
            queryClient.removeQueries({
                queryKey: SEMESTER_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            const semesterToDelete = queryClient.getQueryData<Semester>(
                SEMESTER_QUERY_KEYS.detail(idToDelete)
            );

            await queryClient.cancelQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            if (semesterToDelete?.departmentId) {
                await queryClient.cancelQueries({
                    queryKey: SEMESTER_QUERY_KEYS.byDepartment(
                        semesterToDelete.departmentId
                    ),
                });
            }

            const previousSemestersList = queryClient.getQueryData<Semester[]>(
                SEMESTER_QUERY_KEYS.all
            );
            const previousDeptSemestersList = semesterToDelete?.departmentId
                ? queryClient.getQueryData<Semester[]>(
                      SEMESTER_QUERY_KEYS.byDepartment(
                          semesterToDelete.departmentId
                      )
                  )
                : undefined;

            queryClient.setQueryData<Semester[]>(
                SEMESTER_QUERY_KEYS.all,
                (old) => old?.filter((sem) => sem.id !== idToDelete)
            );

            if (semesterToDelete?.departmentId) {
                queryClient.setQueryData<Semester[]>(
                    SEMESTER_QUERY_KEYS.byDepartment(
                        semesterToDelete.departmentId
                    ),
                    (old) => old?.filter((sem) => sem.id !== idToDelete)
                );
            }

            return {
                previousSemestersList,
                previousDeptSemestersList,
                semesterToDelete,
            };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousSemestersList) {
                queryClient.setQueryData(
                    SEMESTER_QUERY_KEYS.all,
                    context.previousSemestersList
                );
            }
            if (
                context?.previousDeptSemestersList &&
                context.semesterToDelete?.departmentId
            ) {
                queryClient.setQueryData(
                    SEMESTER_QUERY_KEYS.byDepartment(
                        context.semesterToDelete.departmentId
                    ),
                    context.previousDeptSemestersList
                );
            }
        },
        onSettled: (data, error, idToDelete, context) => {
            // Added 'context' parameter
            // The most reliable source for the departmentId of a deleted item is the context from onMutate.
            const affectedDepartmentId =
                context?.semesterToDelete?.departmentId;

            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            if (affectedDepartmentId) {
                queryClient.invalidateQueries({
                    queryKey:
                        SEMESTER_QUERY_KEYS.byDepartment(affectedDepartmentId),
                });
            }
        },
    });
};

// --- Mutation Hook: Batch Create Semesters ---
export const useBatchCreateSemesters = () => {
    const queryClient = useQueryClient();
    return useMutation<Semester[], Error, CreateSemesterData[]>({
        mutationFn: semesterService.batchCreateSemesters,
        onSuccess: (newSemesters) => {
            // Invalidate all semester lists to refetch them after batch creation
            queryClient.invalidateQueries({
                queryKey: SEMESTER_QUERY_KEYS.all,
            });
            // Invalidate specific department's semester lists
            const uniqueDepartmentIds = [
                ...new Set(newSemesters.map((sem) => sem.departmentId)),
            ];
            uniqueDepartmentIds.forEach((deptId) => {
                queryClient.invalidateQueries({
                    queryKey: SEMESTER_QUERY_KEYS.byDepartment(deptId),
                });
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
