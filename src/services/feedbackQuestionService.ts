// src/services/feedbackQuestionService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { FEEDBACK_QUESTION_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import interfaces
import {
    QuestionCategory,
    CreateQuestionCategoryData,
    UpdateQuestionCategoryData,
} from "@/interfaces/questionCategory"; // Adjust path
import {
    FeedbackQuestion,
    CreateFeedbackQuestionData,
    UpdateFeedbackQuestionData,
    BatchUpdateFeedbackQuestionItem,
} from "@/interfaces/feedbackQuestion"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const feedbackQuestionService = {
    // --- Question Category Operations ---

    /**
     * Retrieves all active question categories.
     * Corresponds to GET /api/v1/feedback-questions/categories
     */
    getAllQuestionCategories: async (): Promise<QuestionCategory[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ categories: QuestionCategory[] }>
            >(FEEDBACK_QUESTION_ENDPOINTS.CATEGORIES);
            return response.data.data.categories;
        } catch (error) {
            console.error("Failed to fetch question categories:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single question category by ID.
     * Corresponds to GET /api/v1/feedback-questions/categories/:id
     */
    getQuestionCategoryById: async (id: IdType): Promise<QuestionCategory> => {
        // Changed return type from QuestionCategory | null to QuestionCategory
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ category: QuestionCategory }>
            >(FEEDBACK_QUESTION_ENDPOINTS.getCategoryById(id));
            return response.data.data.category;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Question category with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(
                `Failed to fetch question category with ID ${id}:`,
                error
            );
            throw error; // Re-throw other errors
        }
    },

    /**
     * Creates a new question category.
     * Corresponds to POST /api/v1/feedback-questions/categories
     */
    createQuestionCategory: async (
        categoryData: CreateQuestionCategoryData
    ): Promise<QuestionCategory> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ category: QuestionCategory }>
            >(FEEDBACK_QUESTION_ENDPOINTS.CATEGORIES, categoryData);
            return response.data.data.category;
        } catch (error) {
            console.error("Failed to create question category:", error);
            throw error;
        }
    },

    /**
     * Updates an existing question category.
     * Corresponds to PATCH /api/v1/feedback-questions/categories/:id
     */
    updateQuestionCategory: async (
        id: IdType,
        updateData: UpdateQuestionCategoryData
    ): Promise<QuestionCategory> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ category: QuestionCategory }>
            >(FEEDBACK_QUESTION_ENDPOINTS.getCategoryById(id), updateData);
            return response.data.data.category;
        } catch (error) {
            console.error(
                `Failed to update question category with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Soft deletes a question category.
     * Corresponds to DELETE /api/v1/feedback-questions/categories/:id
     */
    softDeleteQuestionCategory: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(
                FEEDBACK_QUESTION_ENDPOINTS.getCategoryById(id)
            );
            console.log(
                `Question category with ID ${id} soft-deleted successfully.`
            );
        } catch (error) {
            console.error(
                `Failed to soft-delete question category with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    // --- Feedback Question Operations ---

    /**
     * Creates a new feedback question for a specific form.
     * Corresponds to POST /api/v1/feedback-questions/form/:formId/questions
     */
    createFeedbackQuestion: async (
        formId: IdType,
        questionData: Omit<CreateFeedbackQuestionData, "formId"> // Exclude formId from input as it's from path
    ): Promise<FeedbackQuestion> => {
        try {
            const payload = { ...questionData, formId }; // Re-add formId for the payload
            const response = await axiosInstance.post<
                ApiResponse<{ question: FeedbackQuestion }>
            >(FEEDBACK_QUESTION_ENDPOINTS.QUESTIONS_BY_FORM(formId), payload);
            return response.data.data.question;
        } catch (error) {
            console.error(
                `Failed to create feedback question for form ID ${formId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Updates an existing feedback question.
     * Corresponds to PATCH /api/v1/feedback-questions/questions/:id
     */
    updateFeedbackQuestion: async (
        id: IdType,
        updateData: UpdateFeedbackQuestionData
    ): Promise<FeedbackQuestion> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ question: FeedbackQuestion }>
            >(FEEDBACK_QUESTION_ENDPOINTS.getQuestionById(id), updateData);
            return response.data.data.question;
        } catch (error) {
            console.error(
                `Failed to update feedback question with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Soft deletes a feedback question.
     * Corresponds to DELETE /api/v1/feedback-questions/questions/:id
     */
    softDeleteFeedbackQuestion: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(
                FEEDBACK_QUESTION_ENDPOINTS.getQuestionById(id)
            );
            console.log(
                `Feedback question with ID ${id} soft-deleted successfully.`
            );
        } catch (error) {
            console.error(
                `Failed to soft-delete feedback question with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves active feedback questions for a specific form.
     * Corresponds to GET /api/v1/feedback-questions/form/:formId/questions
     */
    getFeedbackQuestionsByFormId: async (
        formId: IdType
    ): Promise<FeedbackQuestion[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ questions: FeedbackQuestion[] }>
            >(FEEDBACK_QUESTION_ENDPOINTS.QUESTIONS_BY_FORM(formId));
            return response.data.data.questions;
        } catch (error) {
            console.error(
                `Failed to fetch feedback questions for form ID ${formId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Performs a batch update of feedback questions.
     * Corresponds to PATCH /api/v1/feedback-questions/questions/batch
     */
    batchUpdateFeedbackQuestions: async (
        questions: BatchUpdateFeedbackQuestionItem[] // Array of { id, data: UpdateFeedbackQuestionData }
    ): Promise<FeedbackQuestion[]> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ questions: FeedbackQuestion[] }>
            >(
                FEEDBACK_QUESTION_ENDPOINTS.BATCH_UPDATE_QUESTIONS,
                { questions } // Backend expects { questions: [...] }
            );
            return response.data.data.questions;
        } catch (error) {
            console.error("Failed to batch update feedback questions:", error);
            throw error;
        }
    },
};

export default feedbackQuestionService;
