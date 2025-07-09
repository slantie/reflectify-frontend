// src/interfaces/college.ts

import { IdType } from "./common";

// Full College Model
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
    contactPhone?: string; // Optional
    website?: string; // Optional
    establishedYear?: number; // Optional
    // Add any other fields from your College Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create/upsert a College (for POST /api/v1/colleges)
// Corresponds to createCollegeSchema in your backend
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

// Data for updating an existing College (all fields are optional)
// Corresponds to updateCollegeSchema in your backend
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
    isActive?: boolean; // If you allow reactivating/deactivating this way
}

// Data structure for batch update of the primary college
// Corresponds to batchUpdateCollegeSchema in your backend
export interface BatchUpdateCollegeInput {
    updates: UpdateCollegeData; // Your controller expects { updates: Partial<CollegeData> }
}
