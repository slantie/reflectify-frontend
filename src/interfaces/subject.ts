// src/interfaces/subject.ts

import { IdType } from "./common";

// Full Subject Model (as returned from GET /subjects or after create/update)
export interface Subject {
    id: IdType;
    name: string;
    code: string; // e.g., "CS101"
    description?: string;
    credits: number;
    semesterId: IdType; // Foreign key to Semester model
    departmentId: IdType; // Foreign key to Department model
    // Add any other fields present in your Subject Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Subject
// Corresponds to createSubjectSchema in your backend
export interface CreateSubjectData {
    name: string;
    code: string;
    description?: string;
    credits: number;
    semesterId: IdType;
    departmentId: IdType;
}

// Data for updating an existing Subject (all fields are optional)
// Corresponds to updateSubjectSchema in your backend
export interface UpdateSubjectData {
    name?: string;
    code?: string;
    description?: string;
    credits?: number;
    semesterId?: IdType;
    departmentId?: IdType;
}

// Data structure for batch creation of subjects
export interface BatchCreateSubjectInput {
    subjects: CreateSubjectData[];
}

// Data structure for subject abbreviations endpoint
export interface SubjectAbbreviation {
    id: IdType;
    code: string; // The subject code
    name: string; // The full subject name
    // Add any other relevant fields your backend returns for abbreviations
}
