// src/hooks/useFaculties.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import facultyService from "@/services/facultyService"; // Adjust path
import {
    Faculty,
    CreateFacultyData,
    UpdateFacultyData,
    FacultyAbbreviation,
} from "@/interfaces/faculty"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const FACULTY_QUERY_KEYS = {
    all: ["faculties"] as const,
    lists: () => [...FACULTY_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...FACULTY_QUERY_KEYS.all, id] as const,
    abbreviations: (deptAbbr?: string) =>
        [...FACULTY_QUERY_KEYS.all, "abbreviations", deptAbbr] as const,
};

// --- Query Hook: Get All Faculties ---
export const useAllFaculties = () => {
    return useQuery<Faculty[], Error>({
        queryKey: FACULTY_QUERY_KEYS.lists(),
        queryFn: facultyService.getAllFaculties,
    });
};

// --- Query Hook: Get Faculty by ID ---
export const useFaculty = (id: IdType) => {
    return useQuery<Faculty, Error>({
        queryKey: FACULTY_QUERY_KEYS.detail(id),
        queryFn: () => facultyService.getFacultyById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Query Hook: Get Faculty Abbreviations ---
interface UseFacultyAbbreviationsParams {
    deptAbbr?: string;
    enabled?: boolean;
}
export const useFacultyAbbreviations = ({
    deptAbbr,
    enabled = true,
}: UseFacultyAbbreviationsParams = {}) => {
    return useQuery<FacultyAbbreviation[], Error>({
        queryKey: FACULTY_QUERY_KEYS.abbreviations(deptAbbr),
        queryFn: () => facultyService.getFacultyAbbreviations(deptAbbr),
        enabled: enabled, // Query runs by default unless explicitly disabled
    });
};

// --- Mutation Hook: Create Faculty ---
export const useCreateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation<Faculty, Error, CreateFacultyData>({
        mutationFn: facultyService.createFaculty,
        onSuccess: () => {
            // Invalidate the list of faculties and abbreviations to refetch them after creation
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            }); // Invalidate all abbreviations
            // If you want to invalidate specific department abbreviations:
            // queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.abbreviations(newFaculty.departmentAbbreviation) });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newFaculty) => { ... }
    });
};

// --- Mutation Hook: Update Faculty ---
export const useUpdateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Faculty, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateFacultyData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousFaculty: Faculty | undefined;
            previousFacultiesList: Faculty[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => facultyService.updateFaculty(id, data),
        onSuccess: (updatedFaculty) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            // Invalidate the specific faculty detail query
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.detail(updatedFaculty.id),
            });
            // Invalidate abbreviations if department or name might affect them
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Faculty>(
                FACULTY_QUERY_KEYS.detail(updatedFaculty.id),
                updatedFaculty
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this faculty and the list
            await queryClient.cancelQueries({
                queryKey: FACULTY_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            await queryClient.cancelQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });

            // Snapshot the previous values
            const previousFaculty = queryClient.getQueryData<Faculty>(
                FACULTY_QUERY_KEYS.detail(id)
            );
            const previousFacultiesList = queryClient.getQueryData<Faculty[]>(
                FACULTY_QUERY_KEYS.lists()
            );

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Faculty>(
                FACULTY_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<Faculty[]>(
                FACULTY_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((faculty) =>
                        faculty.id === id
                            ? { ...faculty, ...updateData }
                            : faculty
                    )
            );

            return { previousFaculty, previousFacultiesList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousFaculty) {
                queryClient.setQueryData(
                    FACULTY_QUERY_KEYS.detail(variables.id),
                    context.previousFaculty
                );
            }
            if (context?.previousFacultiesList) {
                queryClient.setQueryData(
                    FACULTY_QUERY_KEYS.lists(),
                    context.previousFacultiesList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Faculty ---
export const useSoftDeleteFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousFacultiesList: Faculty[] | undefined }
    >({
        mutationFn: (id) => facultyService.softDeleteFaculty(id),
        onSuccess: (_, id) => {
            // Invalidate the list of faculties and abbreviations to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });
            // Optionally, remove the specific faculty from cache
            queryClient.removeQueries({
                queryKey: FACULTY_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            await queryClient.cancelQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });

            const previousFacultiesList = queryClient.getQueryData<Faculty[]>(
                FACULTY_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<Faculty[]>(
                FACULTY_QUERY_KEYS.lists(),
                (old) => old?.filter((faculty) => faculty.id !== idToDelete)
            );
            return { previousFacultiesList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousFacultiesList) {
                queryClient.setQueryData(
                    FACULTY_QUERY_KEYS.lists(),
                    context.previousFacultiesList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });
        },
    });
};

// --- Mutation Hook: Batch Create Faculties ---
export const useBatchCreateFaculties = () => {
    const queryClient = useQueryClient();
    return useMutation<Faculty[], Error, CreateFacultyData[]>({
        mutationFn: facultyService.batchCreateFaculties,
        onSuccess: () => {
            // Invalidate the list of faculties and abbreviations to refetch them after batch creation
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.abbreviations(),
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
