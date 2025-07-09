// src/interfaces/faculty.ts

import { IdType } from "./common";
import { Designation } from "@/constants/designations";
import { Department } from "./department";

// Full Faculty Model (as returned from GET /faculties or after create/update)
export interface Faculty {
    id: IdType;
    name: string;
    email: string;
    abbreviation: string;
    designation: Designation;
    department: Department; // Full Department object
    departmentId: IdType; // Foreign key to Department
    departmentAbbreviation: string; // This field might be redundant if 'department' object is always present
    seatingLocation: string;
    joiningDate: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Faculty
// Corresponds to createFacultySchema in your backend
export interface CreateFacultyData {
    firstName: string;
    lastName: string;
    email: string;
    facultyAbbreviation: string;
    designation: Designation;
    departmentId: IdType; // The actual ID of the department
    seatingLocation: string;
    joiningDate: string; // Added this field (ISO date string)
}

// Data for updating an existing Faculty (all fields are optional)
// Corresponds to updateFacultySchema in your backend
export interface UpdateFacultyData {
    firstName?: string;
    lastName?: string;
    email?: string;
    facultyAbbreviation?: string;
    designation?: Designation;
    departmentId?: IdType;
    seatingLocation?: string;
    joiningDate?: string;
}

// Data structure for batch creation of faculties
export interface BatchCreateFacultyInput {
    faculties: CreateFacultyData[];
}

// Data structure for faculty abbreviations endpoint
export interface FacultyAbbreviation {
    id: IdType;
    facultyAbbreviation: string;
    fullName: string; // Assuming your backend returns a combined full name
}

export interface FacultyFormData {
    firstName: string;
    lastName: string;
    email: string;
    facultyAbbreviation: string;
    designation: Designation;
    departmentId: IdType | ""; // Allow empty string for initial form state or 'Select Department'
    // REMOVED: loading: boolean; <--- THIS LINE WAS THE PROBLEM
    seatingLocation: string;
    joiningDate: string; // Keep as string for input value, convert to Date object when needed
}
