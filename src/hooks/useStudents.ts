// src/hooks/useStudents.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "@/services/studentService"; // Adjust path
import {
    Student,
    CreateStudentData,
    UpdateStudentData,
} from "@/interfaces/student"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const STUDENT_QUERY_KEYS = {
    all: ["students"] as const,
    lists: () => [...STUDENT_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...STUDENT_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Students ---
export const useAllStudents = () => {
    return useQuery<Student[], Error>({
        queryKey: STUDENT_QUERY_KEYS.lists(),
        queryFn: studentService.getAllStudents,
    });
};

// --- Query Hook: Get Student by ID ---
export const useStudent = (id: IdType) => {
    return useQuery<Student, Error>({
        queryKey: STUDENT_QUERY_KEYS.detail(id),
        queryFn: () => studentService.getStudentById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Mutation Hook: Create Student ---
export const useCreateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation<Student, Error, CreateStudentData>({
        mutationFn: studentService.createStudent,
        onSuccess: () => {
            // Invalidate the list of students to refetch it after creation
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
        },
        // Optional: Add optimistic update logic here if desired
        // onMutate: async (newStudent) => { ... }
    });
};

// --- Mutation Hook: Update Student ---
export const useUpdateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Student, // TData: Expected return type on success
        Error, // TError: Expected error type
        { id: IdType; data: UpdateStudentData }, // TVariables: Type of the variables passed to mutate
        // TContext: Type of the context object returned by onMutate
        {
            previousStudent: Student | undefined;
            previousStudentsList: Student[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
        onSuccess: (updatedStudent) => {
            // Invalidate the list to ensure the updated item is reflected
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
            // Invalidate the specific student detail query
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.detail(updatedStudent.id),
            });

            // Optional: Optimistically update the specific item in the cache
            queryClient.setQueryData<Student>(
                STUDENT_QUERY_KEYS.detail(updatedStudent.id),
                updatedStudent
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            // Cancel any outgoing refetches for this student and the list
            await queryClient.cancelQueries({
                queryKey: STUDENT_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });

            // Snapshot the previous values
            const previousStudent = queryClient.getQueryData<Student>(
                STUDENT_QUERY_KEYS.detail(id)
            );
            const previousStudentsList = queryClient.getQueryData<Student[]>(
                STUDENT_QUERY_KEYS.lists()
            );

            // Optimistically update the specific item in the cache
            queryClient.setQueryData<Student>(
                STUDENT_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            // Optimistically update the item within the list (if it exists)
            queryClient.setQueryData<Student[]>(
                STUDENT_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((student) =>
                        student.id === id
                            ? { ...student, ...updateData }
                            : student
                    )
            );

            return { previousStudent, previousStudentsList }; // Return context for onError
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for ID ${variables.id}:`,
                err
            );
            // Rollback to the previous data if the mutation fails
            if (context?.previousStudent) {
                queryClient.setQueryData(
                    STUDENT_QUERY_KEYS.detail(variables.id),
                    context.previousStudent
                );
            }
            if (context?.previousStudentsList) {
                queryClient.setQueryData(
                    STUDENT_QUERY_KEYS.lists(),
                    context.previousStudentsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch to ensure consistency after optimistic update or rollback
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Student ---
export const useSoftDeleteStudent = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousStudentsList: Student[] | undefined }
    >({
        mutationFn: (id) => studentService.softDeleteStudent(id),
        onSuccess: (_, id) => {
            // Invalidate the list of students to reflect the deletion
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
            // Optionally, remove the specific student from cache
            queryClient.removeQueries({
                queryKey: STUDENT_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
            const previousStudentsList = queryClient.getQueryData<Student[]>(
                STUDENT_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<Student[]>(
                STUDENT_QUERY_KEYS.lists(),
                (old) => old?.filter((student) => student.id !== idToDelete)
            );
            return { previousStudentsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for ID ${idToDelete}:`,
                err
            );
            if (context?.previousStudentsList) {
                queryClient.setQueryData(
                    STUDENT_QUERY_KEYS.lists(),
                    context.previousStudentsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Batch Create Students ---
export const useBatchCreateStudents = () => {
    const queryClient = useQueryClient();
    return useMutation<Student[], Error, CreateStudentData[]>({
        mutationFn: studentService.batchCreateStudents,
        onSuccess: () => {
            // Invalidate the list of students to refetch it after batch creation
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
        },
        // No optimistic update for batch create unless you have a robust temporary ID strategy
    });
};
