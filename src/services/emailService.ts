/**
 * @file src/services/emailService.ts
 * @description Handles API requests related to sending emails.
 */

import axiosInstance from "@/lib/axiosInstance";
import { EMAIL_ENDPOINTS } from "@/constants/apiEndpoints";
import { SendFormAccessEmailData } from "@/interfaces/email";
import { ApiResponse, IdType } from "@/interfaces/common";

const emailService = {
    // Send feedback form access emails to students in a specific division
    sendFormAccessEmails: async (
        formId: IdType,
        divisionId: IdType
    ): Promise<string> => {
        const response = await axiosInstance.post<ApiResponse<null>>(
            EMAIL_ENDPOINTS.SEND_FORM_ACCESS,
            { formId, divisionId } as SendFormAccessEmailData
        );
        return (
            response.data.message || "Emails sending initiated successfully."
        );
    },
};

export default emailService;
