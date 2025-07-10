/**
 * @file src/interfaces/college.ts
 * @description Interfaces for College entity and related API data
 */

import { IdType } from "./common";

/**
 * Represents a college entity.
 */
export interface College {
    id: IdType;
    name: string;
    code: string; // e.g., "LDRP-ITR"
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    establishedYear?: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

/**
 * Data required to create or upsert a college.
 */
export interface CreateCollegeData {
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
    establishedYear?: number;
}

/**
 * Data for updating an existing college (all fields optional).
 */
export interface UpdateCollegeData {
    name?: string;
    code?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    establishedYear?: number;
    isActive?: boolean;
}

/**
 * Data structure for batch update of the primary college.
 */
export interface BatchUpdateCollegeInput {
    updates: UpdateCollegeData;
}
