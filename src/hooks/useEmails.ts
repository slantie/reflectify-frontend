// src/hooks/useEmails.ts

import { useMutation } from "@tanstack/react-query";
import emailService from "@/services/emailService"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Mutation Hook: Send Form Access Emails ---
interface SendFormAccessEmailVariables {
    formId: IdType;
    divisionId: IdType;
}

export const useSendFormAccessEmails = () => {
    // For send operations, we typically don't invalidate queries unless
    // there's a specific query tracking the status of email sending.
    // In this case, the success message from the service is returned.
    return useMutation<string, Error, SendFormAccessEmailVariables>({
        mutationFn: ({ formId, divisionId }) =>
            emailService.sendFormAccessEmails(formId, divisionId),
        onSuccess: (message) => {
            console.log("Email sending initiated:", message);
            // You might trigger a global success toast/notification here
            // e.g., showToast.success(message);
        },
        onError: (error) => {
            console.error("Failed to initiate email sending:", error);
            // You might trigger a global error toast/notification here
            // e.g., showToast.error("Failed to send emails. Please try again.");
        },
        // No optimistic updates are typically applied for "send" actions
        // as they don't directly modify cached data relevant to other queries.
    });
};
