// src/hooks/useSubjects.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subjectService from "@/services/subjectService"; // Adjust path
import {
    Subject,
    CreateSubjectData,
    UpdateSubjectData,
    SubjectAbbreviation,
} from "@/interfaces/subject"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const SUBJECT_QUERY_KEYS = {
    all: ["subjects"] as const,
    lists: () => [...SUBJECT_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...SUBJECT_QUERY_KEYS.all, id] as const,
    bySemester: (semesterId: IdType) =>
        [...SUBJECT_QUERY_KEYS.all, "bySemester", semesterId] as const,
    abbreviations: (deptAbbr?: string) =>
        [...SUBJECT_QUERY_KEYS.all, "abbreviations", deptAbbr] as const,
};

// --- Query Hook: Get All Subjects ---
export const useAllSubjects = () => {
    return useQuery<Subject[], Error>({
        queryKey: SUBJECT_QUERY_KEYS.lists(),
        queryFn: subjectService.getAllSubjects,
    });
};

// --- Query Hook: Get Subject by ID ---
export const useSubject = (id: IdType) => {
    return useQuery<Subject, Error>({
        queryKey: SUBJECT_QUERY_KEYS.detail(id),
        queryFn: () => subjectService.getSubjectById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Query Hook: Get Subjects by Semester ID ---
interface UseSubjectsBySemesterParams {
    semesterId: IdType;
    enabled?: boolean;
}
export const useSubjectsBySemester = ({
    semesterId,
    enabled = true,
}: UseSubjectsBySemesterParams) => {
    return useQuery<Subject[], Error>({
        queryKey: SUBJECT_QUERY_KEYS.bySemester(semesterId),
        queryFn: () => subjectService.getSubjectsBySemester(semesterId),
        enabled: enabled && !!semesterId, // Only run if semesterId is provided and enabled
    });
};

// --- Query Hook: Get Subject Abbreviations ---
interface UseSubjectAbbreviationsParams {
    deptAbbr?: string;
    enabled?: boolean;
}
export const useSubjectAbbreviations = ({
    deptAbbr,
    enabled = true,
}: UseSubjectAbbreviationsParams = {}) => {
    return useQuery<SubjectAbbreviation[], Error>({
        queryKey: SUBJECT_QUERY_KEYS.abbreviations(deptAbbr),
        queryFn: () => subjectService.getSubjectAbbreviations(deptAbbr),
        enabled: enabled,
    });
};

// --- Mutation Hook: Create Subject ---
export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation<Subject, Error, CreateSubjectData>({
        mutationFn: subjectService.createSubject,
        onSuccess: () => {
            // Invalidate all subject lists and abbreviations to refetch them after creation
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            }); // Invalidate all abbreviations
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newSubject) => { ... }
    });
};

// --- Mutation Hook: Update Subject ---
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Subject, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateSubjectData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousSubject: Subject | undefined;
            previousSubjectsList: Subject[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => subjectService.updateSubject(id, data),
        onSuccess: (updatedSubject) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            // Invalidate the specific subject detail query
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.detail(updatedSubject.id),
            });
            // Invalidate abbreviations if department or name might affect them
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });
            // Invalidate by semester if subject is part of a semester's subjects
            // This would require knowing the semesterId, which isn't directly in Subject interface.
            // If needed, you'd fetch the subject first or pass semesterId to the mutation.
            // For now, a broader invalidation or specific refetch might be needed.

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Subject>(
                SUBJECT_QUERY_KEYS.detail(updatedSubject.id),
                updatedSubject
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this subject and the list
            await queryClient.cancelQueries({
                queryKey: SUBJECT_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            await queryClient.cancelQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });

            // Snapshot the previous values
            const previousSubject = queryClient.getQueryData<Subject>(
                SUBJECT_QUERY_KEYS.detail(id)
            );
            const previousSubjectsList = queryClient.getQueryData<Subject[]>(
                SUBJECT_QUERY_KEYS.lists()
            );

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Subject>(
                SUBJECT_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<Subject[]>(
                SUBJECT_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((subject) =>
                        subject.id === id
                            ? { ...subject, ...updateData }
                            : subject
                    )
            );

            return { previousSubject, previousSubjectsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousSubject) {
                queryClient.setQueryData(
                    SUBJECT_QUERY_KEYS.detail(variables.id),
                    context.previousSubject
                );
            }
            if (context?.previousSubjectsList) {
                queryClient.setQueryData(
                    SUBJECT_QUERY_KEYS.lists(),
                    context.previousSubjectsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });
            // If the subject is part of a semester, you might need to invalidate that specific semester's subject list
            // This would require knowing the semesterId, which isn't directly available here.
            // If this is a common pattern, consider passing semesterId as part of variables or fetching it in onMutate.
        },
    });
};

// --- Mutation Hook: Soft Delete Subject ---
export const useSoftDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousSubjectsList: Subject[] | undefined }
    >({
        mutationFn: (id) => subjectService.softDeleteSubject(id),
        onSuccess: (_, id) => {
            // Invalidate the list of subjects and abbreviations to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });
            // Optionally, remove the specific subject from cache
            queryClient.removeQueries({
                queryKey: SUBJECT_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            await queryClient.cancelQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });

            const previousSubjectsList = queryClient.getQueryData<Subject[]>(
                SUBJECT_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<Subject[]>(
                SUBJECT_QUERY_KEYS.lists(),
                (old) => old?.filter((subject) => subject.id !== idToDelete)
            );
            return { previousSubjectsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousSubjectsList) {
                queryClient.setQueryData(
                    SUBJECT_QUERY_KEYS.lists(),
                    context.previousSubjectsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });
        },
    });
};

// --- Mutation Hook: Batch Create Subjects ---
export const useBatchCreateSubjects = () => {
    const queryClient = useQueryClient();
    return useMutation<Subject[], Error, CreateSubjectData[]>({
        mutationFn: subjectService.batchCreateSubjects,
        onSuccess: () => {
            // Invalidate the list of subjects and abbreviations to refetch them after batch creation
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
