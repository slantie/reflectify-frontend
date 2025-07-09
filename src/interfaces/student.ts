// src/interfaces/student.ts

import { IdType } from "./common";

// Full Student Model
export interface Student {
    id: IdType;
    firstName: string;
    lastName: string;
    email: string;
    enrollmentNumber: string;
    departmentId: IdType; // Foreign key to Department
    departmentAbbreviation: string; // Often included for convenience
    semesterId: IdType; // Foreign key to Semester
    divisionId: IdType; // Foreign key to Division
    // Add any other fields from your Student Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Student
export interface CreateStudentData {
    firstName: string;
    lastName: string;
    email: string;
    enrollmentNumber: string;
    departmentId: IdType;
    semesterId: IdType;
    divisionId: IdType;
}

// Data for updating an existing Student
export interface UpdateStudentData {
    firstName?: string;
    lastName?: string;
    email?: string;
    enrollmentNumber?: string;
    departmentId?: IdType;
    semesterId?: IdType;
    divisionId?: IdType;
}

// Data structure for batch creation of students
export interface BatchCreateStudentInput {
    students: CreateStudentData[];
}
