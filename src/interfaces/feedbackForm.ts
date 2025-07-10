/**
 * @file src/interfaces/feedbackForm.ts
 * @description Interfaces for Feedback Form entity and related API data
 */

import { IdType } from "./common";
import { Department } from "./department";
import { Semester } from "./semester";
import { Division } from "./division";
import { Subject } from "./subject";
import { Faculty } from "./faculty";

/**
 * Enum for feedback form status.
 */
export enum FeedbackFormStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED",
}

/**
 * Interface for a question within a feedback form.
 */
export interface FeedbackQuestion {
    id: IdType;
    text: string;
    type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "BOOLEAN";
    displayOrder: number;
    categoryId: IdType;
    facultyId: IdType;
    subjectId: IdType;
    batch?: string;
    isRequired?: boolean;
}

/**
 * Represents a feedback form entity.
 */
export interface FeedbackForm {
    id: IdType;
    title: string;
    description?: string;
    departmentId: IdType;
    academicYearId: IdType;
    semesterId: IdType;
    divisionId: IdType;
    subjectId?: IdType;
    facultyId?: IdType;
    status: FeedbackFormStatus;
    startDate?: string;
    endDate?: string;
    accessTokens?: string[];
    questions: FeedbackQuestion[];
    department?: Department;
    semester?: Semester;
    division?: Division;
    subject?: Subject;
    faculty?: Faculty;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    subjectAllocation?: {
        departmentId?: string;
    };
}

/**
 * Data required to generate new feedback forms.
 */
export interface GenerateFormsData {
    departmentId: IdType;
    selectedSemesters: {
        id: IdType;
        divisions: IdType[];
    }[];
}

/**
 * Data required to add a question to an existing form.
 */
export interface AddQuestionToFormInput {
    categoryId: string;
    facultyId: string;
    subjectId: string;
    batch?: string;
    text: string;
    type: "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "BOOLEAN";
    isRequired?: boolean;
    displayOrder: number;
}

/**
 * Data for updating an existing feedback form (partial update).
 */
export interface UpdateFormData {
    title?: string;
    description?: string;
    departmentId?: IdType;
    academicYearId?: IdType;
    semesterId?: IdType;
    divisionId?: IdType;
    subjectId?: IdType;
    facultyId?: IdType;
    isActive?: boolean;
}

/**
 * Data for updating a single form's status and dates.
 */
export interface UpdateFormStatusData {
    status: FeedbackFormStatus;
    startDate?: string;
    endDate?: string;
}

/**
 * Data for bulk updating forms status and dates.
 */
export interface BulkUpdateFormStatusData {
    formIds: IdType[];
    status: FeedbackFormStatus;
    startDate?: string;
    endDate?: string;
}
