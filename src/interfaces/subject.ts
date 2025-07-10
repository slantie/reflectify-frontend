/**
 * @file src/interfaces/subject.ts
 * @description Interfaces for Subject entity and related API data
 */

import { IdType } from "./common";

/**
 * Represents a subject entity.
 */
export interface Subject {
    id: IdType;
    name: string;
    code: string;
    description?: string;
    credits: number;
    semesterId: IdType;
    departmentId: IdType;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

/**
 * Data required to create a new subject.
 */
export interface CreateSubjectData {
    name: string;
    code: string;
    description?: string;
    credits: number;
    semesterId: IdType;
    departmentId: IdType;
}

/**
 * Data for updating an existing subject (all fields optional).
 */
export interface UpdateSubjectData {
    name?: string;
    code?: string;
    description?: string;
    credits?: number;
    semesterId?: IdType;
    departmentId?: IdType;
}

/**
 * Data structure for batch creation of subjects.
 */
export interface BatchCreateSubjectInput {
    subjects: CreateSubjectData[];
}

/**
 * Data structure for subject abbreviations endpoint.
 */
export interface SubjectAbbreviation {
    id: IdType;
    code: string;
    name: string;
}
