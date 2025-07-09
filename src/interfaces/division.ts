// src/interfaces/division.ts

import { IdType } from "./common";

// Full Division Model (as returned from GET /divisions or after create/update)
export interface Division {
    id: IdType;
    name: string; // e.g., "A", "B", "C"
    departmentId: IdType; // Foreign key to Department
    semesterId: IdType; // Foreign key to Semester
    // Add any other fields present in your Division Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Division
// Corresponds to createDivisionSchema in your backend
export interface CreateDivisionData {
    name: string;
    departmentId: IdType;
    semesterId: IdType;
}

// Data for updating an existing Division (all fields are optional)
// Corresponds to updateDivisionSchema in your backend
export interface UpdateDivisionData {
    name?: string;
    departmentId?: IdType;
    semesterId?: IdType;
    isActive?: boolean; // If you allow changing active status
}

// Data structure for batch creation of divisions
export interface BatchCreateDivisionInput {
    divisions: CreateDivisionData[];
}
