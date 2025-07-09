// src/hooks/useUploads.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import uploadService from "@/services/uploadService"; // Adjust path
import { UploadResult, FacultyMatrixUploadResult } from "@/interfaces/upload"; // Adjust path
import { SemesterTypeEnum } from "@/constants/semesterTypes"; // Adjust path as needed
import { handleFacultyMatrixUploadResponse } from "@/utils/facultyMatrixToasts"; // Import the new toast handler

// It's good practice to invalidate specific queries that might be affected by uploads.
// These typically include lists of students, faculty, subjects, and potentially subject allocations or faculty matrices.
// Assuming corresponding query keys exist in other hooks (e.g., useStudents, useFaculties, useSubjects).
import { STUDENT_QUERY_KEYS } from "./useStudents"; // Adjust path
import { FACULTY_QUERY_KEYS } from "./faculty/useFaculties"; // Adjust path
import { SUBJECT_QUERY_KEYS } from "./useSubjects"; // Adjust path
// import { SUBJECT_ALLOCATION_QUERY_KEYS } from './useSubjectAllocations'; // If subject allocation upload is added later
// import { FACULTY_MATRIX_QUERY_KEYS } from './useFacultyMatrices'; // If faculty matrix data can be directly queried

// --- Mutation Hook: Upload Student Data ---
interface UseUploadStudentDataParams {
    onSuccessCallback?: (data: UploadResult) => void;
    onErrorCallback?: (error: Error) => void;
}

export const useUploadStudentData = ({
    onSuccessCallback,
    onErrorCallback,
}: UseUploadStudentDataParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation<UploadResult, Error, File | Blob>({
        mutationFn: (file) => uploadService.uploadStudentData(file), // This calls the deprecated function
        onSuccess: (data) => {
            console.log("Student data uploaded successfully:", data);
            queryClient.invalidateQueries({
                queryKey: STUDENT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({ queryKey: STUDENT_QUERY_KEYS.all });

            onSuccessCallback?.(data);
        },
        onError: (error) => {
            console.error("Failed to upload student data:", error);
            onErrorCallback?.(error);
        },
    });
};

// --- Mutation Hook: Upload Faculty Data ---
interface UseUploadFacultyDataParams {
    onSuccessCallback?: (data: UploadResult) => void; // <--- Changed to UploadResult
    onErrorCallback?: (error: Error) => void;
}

export const useUploadFacultyData = ({
    onSuccessCallback,
    onErrorCallback,
}: UseUploadFacultyDataParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation<UploadResult, Error, File | Blob>({
        // <--- Changed to UploadResult
        mutationFn: (file) =>
            uploadService.uploadFile("facultyData", file as File), // <--- Use generic uploadFile
        onSuccess: (data) => {
            console.log("Faculty data uploaded successfully:", data);
            queryClient.invalidateQueries({
                queryKey: FACULTY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });

            onSuccessCallback?.(data);
        },
        onError: (error) => {
            console.error("Failed to upload faculty data:", error);
            onErrorCallback?.(error);
        },
    });
};

// --- Mutation Hook: Upload Subject Data ---
interface UseUploadSubjectDataParams {
    onSuccessCallback?: (data: UploadResult) => void;
    onErrorCallback?: (error: Error) => void;
}

export const useUploadSubjectData = ({
    onSuccessCallback,
    onErrorCallback,
}: UseUploadSubjectDataParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation<UploadResult, Error, File | Blob>({
        mutationFn: (file) => uploadService.uploadSubjectData(file), // This calls the deprecated function
        onSuccess: (data) => {
            console.log("Subject data uploaded successfully:", data);
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEYS.all });
            queryClient.invalidateQueries({
                queryKey: SUBJECT_QUERY_KEYS.abbreviations(),
            });

            onSuccessCallback?.(data);
        },
        onError: (error) => {
            console.error("Failed to upload subject data:", error);
            onErrorCallback?.(error);
        },
    });
};

// --- Mutation Hook: Upload Faculty Matrix ---
interface UploadFacultyMatrixVariables {
    file: File | Blob;
    academicYear: string;
    semesterRun: SemesterTypeEnum;
    deptAbbreviation: string;
}

interface UseUploadFacultyMatrixParams {
    onSuccessCallback?: (data: FacultyMatrixUploadResult) => void;
    onErrorCallback?: (error: Error) => void;
}

export const useUploadFacultyMatrix = ({
    onSuccessCallback,
    onErrorCallback,
}: UseUploadFacultyMatrixParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation<
        FacultyMatrixUploadResult,
        Error,
        UploadFacultyMatrixVariables
    >({
        mutationFn: ({ file, academicYear, semesterRun, deptAbbreviation }) =>
            uploadService.uploadFacultyMatrix(
                file,
                academicYear,
                semesterRun,
                deptAbbreviation
            ),
        onSuccess: (data) => {
            console.log("Faculty matrix uploaded successfully:", data);
            console.log(
                "🔍 Upload Hook - Raw response data:",
                JSON.stringify(data, null, 2)
            );

            // Handle the response with appropriate toast messages
            handleFacultyMatrixUploadResponse(data);

            queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEYS.all });

            onSuccessCallback?.(data);
        },
        onError: (error) => {
            console.log("Failed to upload faculty matrix:", error);
            onErrorCallback?.(error);
        },
    });
};
