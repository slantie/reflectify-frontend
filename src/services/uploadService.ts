// src/services/uploadService.ts
import axiosInstance from "@/lib/axiosInstance";
import { UPLOAD_ENDPOINTS } from "@/constants/apiEndpoints";

// Import upload interfaces
import { UploadResult, FacultyMatrixUploadResult } from "@/interfaces/upload";
import { SemesterTypeEnum } from "@/constants/semesterTypes";
import { FILE_ROUTES } from "@/constants/fileUploadRoutes";

const uploadService = {
    /**
     * Uploads and processes student data from an Excel file.
     * @param file The Excel file to upload (File or Blob).
     * @deprecated Use the generic `uploadFile` method instead.
     */
    uploadStudentData: async (file: File | Blob): Promise<UploadResult> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post<UploadResult>(
                UPLOAD_ENDPOINTS.UPLOAD_STUDENT_DATA,
                formData
            );
            return response.data;
        } catch (error) {
            console.error("Failed to upload student data:", error);
            throw error;
        }
    },

    // Removed the old uploadFacultyData function here as it's deprecated.
    // The generic `uploadFile` handles faculty data uploads.

    /**
     * Uploads and processes subject data from an Excel file.
     * @param file The Excel file to upload (File or Blob).
     * @deprecated Use the generic `uploadFile` method instead.
     */
    uploadSubjectData: async (file: File | Blob): Promise<UploadResult> => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post<UploadResult>(
                UPLOAD_ENDPOINTS.UPLOAD_SUBJECT_DATA,
                formData
            );
            return response.data;
        } catch (error) {
            console.error("Failed to upload subject data:", error);
            throw error;
        }
    },

    /**
     * Uploads and processes faculty matrix data from an Excel file.
     * @param file The Excel file to upload (File or Blob).
     * @param academicYear The academic year for the matrix (e.g., "2023-2024").
     * @param semesterRun The type of semester (ODD or EVEN).
     * @param deptAbbreviation The abbreviation of the department.
     */
    uploadFacultyMatrix: async (
        file: File | Blob,
        academicYear: string,
        semesterRun: SemesterTypeEnum,
        deptAbbreviation: string
    ): Promise<FacultyMatrixUploadResult> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("academicYear", academicYear);
            formData.append("semesterRun", semesterRun);
            formData.append("deptAbbreviation", deptAbbreviation);

            const response =
                await axiosInstance.post<FacultyMatrixUploadResult>(
                    UPLOAD_ENDPOINTS.UPLOAD_FACULTY_MATRIX,
                    formData
                );
            return response.data;
        } catch (error) {
            console.error("Failed to upload faculty matrix:", error);
            throw error;
        }
    },

    /**
     * Handles the upload of an Excel file to a specified backend endpoint.
     * It creates a FormData object and uses the configured axiosInstance to include authentication headers.
     * @param fileKey The key from FILE_ROUTES (e.g., 'studentData', 'facultyData', 'subjectData')
     * to determine the target API route.
     * @param file The File object to upload.
     * @returns A Promise that resolves with the backend's response data on success.
     * @throws An error if the upload fails or authentication token is missing.
     */
    uploadFile: async (
        fileKey: keyof typeof FILE_ROUTES,
        file: File
    ): Promise<UploadResult> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post<UploadResult>(
                FILE_ROUTES[fileKey].route,
                formData
            );
            return response.data;
        } catch (error: any) {
            console.error(
                `Upload failed for ${FILE_ROUTES[fileKey].label}:`,
                error
            );
            const errorMessage =
                error.response?.data?.message ||
                (error.response?.data?.error &&
                typeof error.response.data.error === "string"
                    ? error.response.data.error
                    : error.message ||
                      "An unexpected error occurred during upload.");

            throw new Error(errorMessage);
        }
    },
};

export default uploadService;
