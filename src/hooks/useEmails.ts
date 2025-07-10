/**
@file src/hooks/useEmails.ts
@description React Query hook for sending form access emails
*/

import { useMutation } from "@tanstack/react-query";
import emailService from "@/services/emailService";
import { IdType } from "@/interfaces/common";

// Types for mutation variables
interface SendFormAccessEmailVariables {
    formId: IdType;
    divisionId: IdType;
}

// Send form access emails
export const useSendFormAccessEmails = () =>
    useMutation<string, Error, SendFormAccessEmailVariables>({
        mutationFn: ({ formId, divisionId }) =>
            emailService.sendFormAccessEmails(formId, divisionId),
    });
