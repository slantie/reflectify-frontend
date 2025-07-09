// src/interfaces/feedbackForm.ts

import { IdType } from "./common";
import { Department } from "./department"; // Assuming FeedbackForm links to Department
import { Semester } from "./semester"; // Assuming FeedbackForm links to Semester
import { Division } from "./division"; // Assuming FeedbackForm links to Division
import { Subject } from "./subject"; // Assuming FeedbackForm links to Subject
import { Faculty } from "./faculty"; // Assuming FeedbackForm links to Faculty

// Enum for Feedback Form Status (adjust based on your Prisma enum if different)
export enum FeedbackFormStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ARCHIVED = "ARCHIVED",
    // Add other statuses as per your backend (e.g., SCHEDULED, PAUSED)
}

// Interface for a Question within a Feedback Form
// You'll need to align this with your Question Prisma model
export interface FeedbackQuestion {
    id: IdType;
    text: string;
    type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "BOOLEAN"; // Example types, align with backend
    displayOrder: number; // Order in which the question appears
    categoryId: IdType;
    facultyId: IdType;
    subjectId: IdType;
    batch?: string;
    isRequired?: boolean;
    // Add any other fields from your Question Prisma model
}

// Full Feedback Form Model
export interface FeedbackForm {
    id: IdType;
    title: string;
    description?: string;
    departmentId: IdType;
    academicYearId: IdType; // Assuming forms are tied to academic years
    semesterId: IdType;
    divisionId: IdType;
    subjectId?: IdType; // Optional, for subject-specific forms
    facultyId?: IdType; // Optional, for faculty-specific forms
    status: FeedbackFormStatus; // Current status of the form
    startDate?: string; // ISO date string, when form becomes active
    endDate?: string; // ISO date string, when form closes
    accessTokens?: string[]; // Array of UUIDs for student access (Sensitive, might not be returned on all GETs)
    questions: FeedbackQuestion[]; // Array of questions associated with the form

    // Optional nested relations if your backend includes them on fetch
    department?: Department;
    semester?: Semester;
    division?: Division;
    subject?: Subject;
    faculty?: Faculty;

    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to generate new Feedback Forms
// Corresponds to generateFormsSchema in your backend
export interface GenerateFormsData {
    departmentId: IdType;
    selectedSemesters: {
        id: IdType;
        divisions: IdType[];
    }[];
}

// Data required to add a question to an existing form
// Corresponds to addQuestionToFormSchema in your backend
export interface AddQuestionToFormInput {
    categoryId: string;
    facultyId: string;
    subjectId: string;
    batch?: string; // Optional, defaults to "None"
    text: string;
    type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "BOOLEAN"; // Align with backend
    isRequired?: boolean; // Optional, defaults to true
    displayOrder: number;
}

// Data for updating an existing Feedback Form (partial update)
// Corresponds to updateFormSchema in your backend
export interface UpdateFormData {
    title?: string;
    description?: string;
    departmentId?: IdType;
    academicYearId?: IdType;
    semesterId?: IdType;
    divisionId?: IdType;
    subjectId?: IdType;
    facultyId?: IdType;
    // status and dates are handled by specific PATCH routes
    isActive?: boolean;
}

// Data for updating a single form's status and dates
// Corresponds to updateFormStatusSchema in your backend
export interface UpdateFormStatusData {
    status: FeedbackFormStatus;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
}

// Data for bulk updating forms status and dates
// Corresponds to bulkUpdateFormStatusSchema in your backend
export interface BulkUpdateFormStatusData {
    formIds: IdType[];
    status: FeedbackFormStatus;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
}
