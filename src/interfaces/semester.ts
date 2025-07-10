/**
 * @file src/interfaces/semester.ts
 * @description Interfaces for Semester entity and related API data
 */

import { IdType } from "./common";
import { Department } from "./department";
import { AcademicYear } from "./academicYear";

/**
 * Represents a semester entity.
 */
export interface Semester {
    id: IdType;
    name: string;
    semesterNumber: number;
    academicYearId: IdType;
    departmentId: IdType;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    academicYear?: AcademicYear;
    department?: Department;
}

/**
 * Data required to create a new semester.
 */
export interface CreateSemesterData {
    name: string;
    semesterNumber: number;
    academicYearId: IdType;
    departmentId: IdType;
}

/**
 * Data for updating an existing semester (all fields optional).
 */
export interface UpdateSemesterData {
    name?: string;
    semesterNumber?: number;
    academicYearId?: IdType;
    departmentId?: IdType;
    isActive?: boolean;
}

/**
 * Data structure for filtering semesters (e.g., for getAllSemesters).
 */
export interface GetSemestersFilters {
    departmentId?: IdType;
    academicYearId?: IdType;
}

/**
 * Data structure for batch creation of semesters.
 */
export interface BatchCreateSemesterInput {
    semesters: CreateSemesterData[];
}
