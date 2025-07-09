// src/interfaces/semester.ts

import { IdType } from "./common";
import { Department } from "./department"; // Assuming Semester links to Department
import { AcademicYear } from "./academicYear"; // Assuming Semester links to AcademicYear

// Full Semester Model (as returned from GET /semesters or after create/update)
export interface Semester {
    id: IdType;
    name: string; // e.g., "Semester 1", "Odd Semester", "Even Semester"
    semesterNumber: number; // e.g., 1, 2, 3...
    academicYearId: IdType; // Foreign key to AcademicYear
    departmentId: IdType; // Foreign key to Department
    // Add any other fields present in your Semester Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete

    // Optional nested relations if your backend includes them on fetch
    academicYear?: AcademicYear;
    department?: Department;
}

// Data required to create a new Semester
// Corresponds to createSemesterSchema in your backend
export interface CreateSemesterData {
    name: string;
    semesterNumber: number;
    academicYearId: IdType;
    departmentId: IdType;
}

// Data for updating an existing Semester (all fields are optional)
// Corresponds to updateSemesterSchema in your backend
export interface UpdateSemesterData {
    name?: string;
    semesterNumber?: number;
    academicYearId?: IdType;
    departmentId?: IdType;
    isActive?: boolean; // If you allow changing active status
}

// Data structure for filtering semesters (e.g., for getAllSemesters)
// Corresponds to getSemestersQuerySchema in your backend
export interface GetSemestersFilters {
    departmentId?: IdType;
    academicYearId?: IdType;
    // Add any other filterable properties
}

// Data structure for batch creation of semesters
export interface BatchCreateSemesterInput {
    semesters: CreateSemesterData[];
}
