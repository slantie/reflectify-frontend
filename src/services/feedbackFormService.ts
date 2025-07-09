// src/services/feedbackFormService.ts
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { FEEDBACK_FORM_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interfaces
import {
    FeedbackForm,
    GenerateFormsData,
    AddQuestionToFormInput,
    UpdateFormData,
    UpdateFormStatusData,
    BulkUpdateFormStatusData,
} from "@/interfaces/feedbackForm"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const feedbackFormService = {
    /**
     * Generates feedback forms based on department and selected semesters/divisions.
     * Corresponds to POST /api/v1/feedback-forms/generate
     */
    generateForms: async (
        generationData: GenerateFormsData
    ): Promise<FeedbackForm[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ forms: FeedbackForm[] }>
            >(FEEDBACK_FORM_ENDPOINTS.GENERATE, generationData);
            return response.data.data.forms;
        } catch (error) {
            console.error("Failed to generate feedback forms:", error);
            throw error;
        }
    },

    /**
     * Retrieves all active feedback forms.
     * Corresponds to GET /api/v1/feedback-forms
     */
    getAllForms: async (): Promise<FeedbackForm[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ forms: FeedbackForm[] }>
            >(FEEDBACK_FORM_ENDPOINTS.BASE);
            return response.data.data.forms;
        } catch (error) {
            console.error("Failed to fetch all feedback forms:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single feedback form by ID.
     * Corresponds to GET /api/v1/feedback-forms/:id
     */
    getFormById: async (id: IdType): Promise<FeedbackForm> => {
        // Changed return type
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ form: FeedbackForm }>
            >(FEEDBACK_FORM_ENDPOINTS.getById(id));
            return response.data.data.form;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Feedback form with ID ${id} not found, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(
                `Failed to fetch feedback form with ID ${id}:`,
                error
            );
            throw error; // Re-throw other errors
        }
    },

    /**
     * Updates an existing feedback form.
     * Corresponds to PATCH /api/v1/feedback-forms/:id
     */
    updateForm: async (
        id: IdType,
        updateData: UpdateFormData
    ): Promise<FeedbackForm> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ form: FeedbackForm }>
            >(FEEDBACK_FORM_ENDPOINTS.getById(id), updateData);
            return response.data.data.form;
        } catch (error) {
            console.error(
                `Failed to update feedback form with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Soft deletes a feedback form.
     * Corresponds to DELETE /api/v1/feedback-forms/:id
     */
    softDeleteForm: async (id: IdType): Promise<void> => {
        try {
            await axiosInstance.delete(FEEDBACK_FORM_ENDPOINTS.getById(id));
            console.log(
                `Feedback form with ID ${id} soft-deleted successfully.`
            );
        } catch (error) {
            console.error(
                `Failed to soft-delete feedback form with ID ${id}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Adds a new question to an existing feedback form.
     * Corresponds to POST /api/v1/feedback-forms/:id/questions
     */
    addQuestionToForm: async (
        formId: IdType,
        questionData: AddQuestionToFormInput
    ): Promise<FeedbackForm> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ form: FeedbackForm }>
            >(FEEDBACK_FORM_ENDPOINTS.ADD_QUESTION(formId), questionData);
            return response.data.data.form;
        } catch (error) {
            console.error(
                `Failed to add question to form with ID ${formId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Updates the status and dates of a single feedback form.
     * Corresponds to PATCH /api/v1/feedback-forms/:id/status
     */
    updateFormStatus: async (
        formId: IdType,
        statusData: UpdateFormStatusData
    ): Promise<FeedbackForm> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ form: FeedbackForm }>
            >(FEEDBACK_FORM_ENDPOINTS.UPDATE_STATUS(formId), statusData);
            return response.data.data.form;
        } catch (error) {
            console.error(
                `Failed to update status for form with ID ${formId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Bulk updates the status and dates for multiple feedback forms.
     * Corresponds to PATCH /api/v1/feedback-forms/bulk-status
     */
    bulkUpdateFormStatus: async (
        bulkStatusData: BulkUpdateFormStatusData
    ): Promise<FeedbackForm[]> => {
        try {
            const response = await axiosInstance.patch<
                ApiResponse<{ forms: FeedbackForm[] }>
            >(FEEDBACK_FORM_ENDPOINTS.BULK_UPDATE_STATUS, bulkStatusData);
            return response.data.data.forms;
        } catch (error) {
            console.error("Failed to bulk update form statuses:", error);
            throw error;
        }
    },

    /**
     * Retrieves a feedback form using an access token (public route).
     * Corresponds to GET /api/v1/feedback-forms/access/:token
     */
    getFormByAccessToken: async (token: string): Promise<FeedbackForm> => {
        // Changed return type
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ form: FeedbackForm }>
            >(FEEDBACK_FORM_ENDPOINTS.ACCESS_BY_TOKEN(token));
            return response.data.data.form;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                console.warn(
                    `Form with access token ${token} not found or inaccessible, throwing error for TanStack Query.`
                );
                throw error; // Throw the error for TanStack Query to handle
            }
            console.error(
                `Failed to fetch form by access token ${token}:`,
                error
            );
            throw error; // Re-throw other errors
        }
    },
};

export default feedbackFormService;
