/**
@file src/hooks/useUploads.ts
@description React Query hooks for uploading data (students, faculty, subjects, faculty matrix)
*/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import uploadService from "@/services/uploadService"; // Adjust path
import { UploadResult, FacultyMatrixUploadResult } from "@/interfaces/upload"; // Adjust path
import { SemesterTypeEnum } from "@/constants/semesterTypes"; // Adjust path as needed // Import the new toast handler\

import { STUDENT_QUERY_KEYS } from "./useStudents";
import { FACULTY_QUERY_KEYS } from "./faculty/useFaculties";
import { SUBJECT_QUERY_KEYS } from "./useSubjects";
import { showSuccessToast } from "@/components/common";

// Upload student data
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

// Upload faculty data
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

// Upload subject data
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

// Upload faculty matrix
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
            // handleFacultyMatrixUploadResponse(data);
            showSuccessToast(data);
            console.log("Faculty Matrix Log: ", data);

            queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: SUBJECT_QUERY_KEYS.all });

            onSuccessCallback?.(data);
        },
        onError: (error) => {
            onErrorCallback?.(error);
        },
    });
};
