// src/interfaces/overrideStudent.ts

import { IdType } from "./common";

/**
 * Interface representing an override student.
 * Override students are manually added students (not from regular student data)
 * who can be granted access to a specific feedback form.
 */
export interface OverrideStudent {
    id: IdType;
    feedbackFormOverrideId: string;
    name: string;
    email: string;
    enrollmentNumber?: string | null;
    batch?: string | null;
    phoneNumber?: string | null;
    department?: string | null;
    semester?: string | null;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Interface for the response when uploading override students via Excel/CSV
 */
export interface OverrideStudentUploadResult {
    message: string;
    rowsAffected: number;
    skippedRows: number;
    skippedDetails: string[];
}

/**
 * Interface for the response when fetching paginated override students
 */
export interface PaginatedOverrideStudents {
    students: OverrideStudent[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Interface for the response when updating an override student
 */
export interface UpdateOverrideStudentInput {
    name?: string;
    email?: string;
    enrollmentNumber?: string | null;
    batch?: string | null;
    phoneNumber?: string | null;
    department?: string | null;
    semester?: string | null;
}
