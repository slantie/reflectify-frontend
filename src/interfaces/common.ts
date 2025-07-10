/**
 * @file src/interfaces/common.ts
 * @description Common types and generic API response structure
 */

/**
 * Generic API response structure for successful operations.
 * T is the type of the 'data' field.
 */
export interface ApiResponse<T> {
    status: "success";
    message?: string;
    results?: number;
    data: T;
}

/**
 * Common structure for an ID parameter (UUID string).
 */
export type IdType = string;
