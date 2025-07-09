// src/interfaces/common.ts

/**
 * Generic API Response structure for successful operations.
 * T will be the type of the 'data' field.
 */
export interface ApiResponse<T> {
    status: "success";
    message?: string;
    results?: number; // For list responses
    data: T;
}

/**
 * Common structure for an ID parameter.
 * Your backend uses string IDs (UUIDs probably), so string is appropriate.
 */
export type IdType = string;
