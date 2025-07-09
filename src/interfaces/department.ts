// src/interfaces/department.ts

import { IdType } from "./common";

// Full Department Model
export interface Department {
    id: IdType;
    name: string;
    abbreviation: string;
    // Add any other fields from your Department Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
    // Potentially add counts if your getDepartmentsWithCounts endpoint returns them
    // facultyCount?: number;
    // studentCount?: number;
}

// Data required to create a new Department
export interface CreateDepartmentData {
    name: string;
    abbreviation: string;
}

// Data for updating an existing Department
export interface UpdateDepartmentData {
    name?: string;
    abbreviation?: string;
}

// Data structure for batch creation of departments
export interface BatchCreateDepartmentInput {
    departments: CreateDepartmentData[];
}
