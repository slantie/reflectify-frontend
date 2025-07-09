// src/interfaces/feedbackQuestion.ts

import { IdType } from "./common";
import { QuestionCategory } from "./questionCategory"; // Import category interface

// Define the types of questions supported (align with your backend Zod schema)
export type QuestionType = "RATING" | "TEXT" | "MULTIPLE_CHOICE" | "BOOLEAN";

// Full Feedback Question Model
export interface FeedbackQuestion {
    id: IdType;
    formId: IdType; // The ID of the feedback form this question belongs to
    categoryId: IdType; // Foreign key to QuestionCategory
    facultyId: IdType; // Foreign key to Faculty
    subjectId: IdType; // Foreign key to Subject
    batch?: string; // Batch information (e.g., "1", "2", "3", "None")
    text: string;
    type: QuestionType;
    isRequired?: boolean; // Whether this question is mandatory
    displayOrder: number; // Display order of the question within the form
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isDeleted: boolean; // For soft delete

    // Optional nested relations if your backend includes them on fetch
    category?: QuestionCategory;
    faculty?: any; // Import proper Faculty interface
    subject?: any; // Import proper Subject interface
}

// Data required to create a new Feedback Question
// Corresponds to backend createFeedbackQuestionSchema
export interface CreateFeedbackQuestionData {
    formId: IdType; // Though passed as param, including for type safety in service payload
    categoryId: IdType;
    facultyId: IdType;
    subjectId: IdType;
    batch?: string; // Optional, defaults to "None" in backend
    text: string;
    type: QuestionType;
    isRequired?: boolean; // Optional, defaults to true in backend
    displayOrder: number;
}

// Data for updating an existing Feedback Question (all fields are optional)
export interface UpdateFeedbackQuestionData {
    categoryId?: IdType;
    facultyId?: IdType;
    subjectId?: IdType;
    batch?: string;
    text?: string;
    type?: QuestionType;
    isRequired?: boolean;
    displayOrder?: number;
    isDeleted?: boolean;
}

// Data structure for a single item in a batch update request
export interface BatchUpdateFeedbackQuestionItem {
    id: IdType;
    data: UpdateFeedbackQuestionData; // The fields to update for this specific question
}

// Data structure for the entire batch update request body
export interface BatchUpdateFeedbackQuestionsData {
    questions: BatchUpdateFeedbackQuestionItem[];
}
