// src/interfaces/upload.ts

// Generic interface for upload results that return a message and rows affected.
export interface UploadResult {
    message: string;
    rowsAffected: number;
    status?: string; // Backend often includes status
    error?: string | { [key: string]: any }; // For error responses
}

// Interface for details about a skipped row in the Faculty Matrix upload.
// This is an inferred structure; adjust field names/types if your backend is more specific.
export interface SkippedRowDetail {
    rowNumber: number; // The row number in the Excel file
    reason: string; // The reason for skipping (e.g., "Faculty not found", "Subject not found")
    data: any; // The raw data from that row, or relevant parts for debugging
}

// Specific interface for the Faculty Matrix upload result, extending UploadResult.
export interface FacultyMatrixUploadResult extends UploadResult {
    totalRowsSkippedDueToMissingEntities: number;
    missingFaculties: string[];
    missingSubjects: string[];
    skippedRowsDetails: string[];
    flaskWarnings: string[];
    flaskErrors: string[];
    flaskSuccess: boolean;
}

export interface UploadData {
    [key: string]: string | number | boolean | null;
}

/**
 * Represents the structure of data sent to the preview table.
 * Contains the parsed data rows and the type of data (e.g., "Student Data").
 */
export interface TableData {
    data: UploadData[];
    type: string; // e.g., "Student Data", "Faculty Data", "Subject Data"
}

/**
 * Defines the structure for each entry in the FILE_ROUTES constant.
 */
export interface FileUploadRoute {
    route: string; // The API endpoint for uploading this file type
    label: string; // User-friendly label for display (e.g., "Student Data")
    icon: string; // An emoji or icon name (if using an icon library)
    requiredParams?: string[]; // Array of required parameter names
    referenceFileUrl?: string; // Google Drive link for reference file download
    description?: string; // Optional description for the upload type
}

// NOTE: FacultyUploadResponse is identical to UploadResult, so we'll use UploadResult for consistency.
// The `UploadResponse` at the bottom of your original file is also redundant if `UploadResult` is comprehensive.
// Let's consolidate to `UploadResult` and `FacultyMatrixUploadResult`.
// Removed the redundant `UploadResponse` and `FacultyUploadResponse` interfaces.

// Type for a single row of faculty data as extracted from Excel and validated on frontend (optional, but good for form validation)
// This is primarily for client-side parsing/validation, not directly for API response.
export interface FacultyExcelRowData {
    name: string;
    email: string;
    facultyAbbreviation: string | null;
    designationString: string; // The string representation from Excel, e.g., "HOD", "Assistant Professor"
    deptInput: string; // Department name/abbreviation from Excel
    joiningDate: string | Date | null; // Can be string (DD-MM-YYYY) or Date object from ExcelJS
}

// src/interfaces/common.ts (if not already existing and needed for ApiResponse)
export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}
/**
 * Interface for the parameters specific to Faculty Matrix Upload.
 */
export interface FacultyMatrixUploadParams {
    academicYear: string;
    semesterRun: string; // Should map to SemesterTypeEnum values (ODD/EVEN)
    deptAbbreviation: string;
}

// Type for a single row of faculty data as extracted from Excel and validated on frontend (optional, but good for form validation)
export interface FacultyExcelRowData {
    name: string;
    email: string;
    facultyAbbreviation: string | null;
    designationString: string;
    deptInput: string;
    joiningDate: string | Date | null;
}
