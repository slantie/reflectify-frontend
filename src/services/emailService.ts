// src/services/emailService.ts
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { EMAIL_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import the new interface
import { SendFormAccessEmailData } from "@/interfaces/email"; // Adjust path
import { ApiResponse } from "@/interfaces/common"; // Adjust path
import { IdType } from "@/interfaces/common";

const emailService = {
    /**
     * Triggers the sending of feedback form access emails to students in a specific division.
     * Corresponds to POST /api/v1/emails/send-form-access
     */
    sendFormAccessEmails: async (
        formId: IdType, // Using IdType as it's a UUID string
        divisionId: IdType // Using IdType as it's a UUID string
    ): Promise<string> => {
        try {
            const response = await axiosInstance.post<ApiResponse<null>>(
                EMAIL_ENDPOINTS.SEND_FORM_ACCESS,
                { formId, divisionId } as SendFormAccessEmailData // Cast to the interface for clarity
            );
            return (
                response.data.message ||
                "Emails sending initiated successfully."
            );
        } catch (error) {
            console.error("Failed to send form access emails:", error);
            throw error;
        }
    },
};

export default emailService;
