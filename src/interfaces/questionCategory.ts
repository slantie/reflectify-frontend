// src/interfaces/questionCategory.ts

import { IdType } from "./common";

// Full Question Category Model
export interface QuestionCategory {
    id: IdType;
    name: string;
    description?: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Question Category
export interface CreateQuestionCategoryData {
    name: string;
    description?: string;
}

// Data for updating an existing Question Category (all fields are optional)
export interface UpdateQuestionCategoryData {
    name?: string;
    description?: string;
    isActive?: boolean;
}
