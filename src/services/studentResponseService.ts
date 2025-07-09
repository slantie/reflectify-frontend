// src/services/studentResponseService.ts
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed (Note: this module doesn't use isAuthenticated, but still uses axiosInstance for base URL and error handling)
import { STUDENT_RESPONSE_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import interfaces
import {
    SubmitResponsesData,
    SubmitResponseItem,
    CheckSubmissionStatus,
} from "@/interfaces/studentResponse"; // Adjust path
import { ApiResponse } from "@/interfaces/common"; // Adjust path

const studentResponseService = {
    /**
     * Submits student responses for a feedback form using an access token.
     * Corresponds to POST /api/v1/student-responses/submit/:token
     */
    submitResponses: async (
        token: string,
        responses: SubmitResponsesData
    ): Promise<SubmitResponseItem[]> => {
        try {
            const response = await axiosInstance.post<
                ApiResponse<{ responses: SubmitResponseItem[] }>
            >(STUDENT_RESPONSE_ENDPOINTS.SUBMIT_RESPONSES(token), responses);
            return response.data.data.responses;
        } catch (error) {
            console.error(
                `Failed to submit responses for token ${token}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Checks the submission status of a feedback form using an access token.
     * Corresponds to GET /api/v1/student-responses/check-submission/:token
     */
    checkSubmission: async (token: string): Promise<CheckSubmissionStatus> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<CheckSubmissionStatus>
            >(STUDENT_RESPONSE_ENDPOINTS.CHECK_SUBMISSION(token));
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to check submission status for token ${token}:`,
                error
            );
            throw error;
        }
    },
};

export default studentResponseService;
