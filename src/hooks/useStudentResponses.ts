// src/hooks/useStudentResponses.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import studentResponseService from "@/services/studentResponseService"; // Adjust path
import {
    SubmitResponsesData,
    SubmitResponseItem,
    CheckSubmissionStatus,
} from "@/interfaces/studentResponse"; // Adjust path

// --- Query Keys ---
export const STUDENT_RESPONSE_QUERY_KEYS = {
    all: ["studentResponses"] as const,
    submissionStatus: (token: string) =>
        [...STUDENT_RESPONSE_QUERY_KEYS.all, "status", token] as const,
};

// --- Query Hook: Check Submission Status ---
interface UseCheckSubmissionStatusParams {
    token: string;
    enabled?: boolean; // Allow disabling the query, e.g., if token is not yet available
}

export const useCheckSubmissionStatus = ({
    token,
    enabled = true,
}: UseCheckSubmissionStatusParams) => {
    return useQuery<CheckSubmissionStatus, Error>({
        queryKey: STUDENT_RESPONSE_QUERY_KEYS.submissionStatus(token),
        queryFn: () => studentResponseService.checkSubmission(token),
        enabled: enabled && !!token, // Only run the query if 'token' is truthy and enabled
        // This query often represents a one-time check or a status that changes infrequently,
        // so setting a longer staleTime might be appropriate.
        // For public forms, maybe even 'Infinity' if the status is truly immutable after initial check.
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Cache entry stays for 10 minutes (garbage collection time)
    });
};

// --- Mutation Hook: Submit Responses ---
interface UseSubmitResponsesParams {
    onSuccessCallback?: (data: SubmitResponseItem[]) => void;
    onErrorCallback?: (error: Error) => void;
}

export const useSubmitResponses = ({
    onSuccessCallback,
    onErrorCallback,
}: UseSubmitResponsesParams = {}) => {
    const queryClient = useQueryClient();

    return useMutation<
        SubmitResponseItem[], // TData: Expected return type on success
        Error, // TError: Expected error type
        { token: string; responses: SubmitResponsesData } // TVariables: Type of the variables passed to mutate
    >({
        mutationFn: ({ token, responses }) =>
            studentResponseService.submitResponses(token, responses),
        onSuccess: (data, variables) => {
            console.log(
                `Responses submitted successfully for token: ${variables.token}`
            );
            // Invalidate the submission status for this token to refetch it,
            // as the status has likely changed from 'not submitted' to 'submitted'.
            queryClient.invalidateQueries({
                queryKey: STUDENT_RESPONSE_QUERY_KEYS.submissionStatus(
                    variables.token
                ),
            });

            // Call any provided success callback
            onSuccessCallback?.(data);
        },
        onError: (error, variables) => {
            console.error(
                `Failed to submit responses for token ${variables.token}:`,
                error
            );
            // No optimistic updates for submission, just handle the error.
            // Call any provided error callback
            onErrorCallback?.(error);
        },
        // No onMutate for optimistic update as response submission usually involves
        // backend processing and a definite 'success' state after the fact.
        // Also, the return data (SubmitResponseItem[]) might include IDs not known client-side.
    });
};
