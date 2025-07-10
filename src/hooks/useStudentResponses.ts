/**
@file src/hooks/useStudentResponses.ts
@description React Query hooks for student response submission and status
*/

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import studentResponseService from "@/services/studentResponseService";
import {
    SubmitResponsesData,
    SubmitResponseItem,
    CheckSubmissionStatus,
} from "@/interfaces/studentResponse";

// Query keys
export const STUDENT_RESPONSE_QUERY_KEYS = {
    all: ["studentResponses"] as const,
    submissionStatus: (token: string) =>
        [...STUDENT_RESPONSE_QUERY_KEYS.all, "status", token] as const,
};

// Check submission status
interface UseCheckSubmissionStatusParams {
    token: string;
    enabled?: boolean;
}
export const useCheckSubmissionStatus = ({
    token,
    enabled = true,
}: UseCheckSubmissionStatusParams) =>
    useQuery<CheckSubmissionStatus, Error>({
        queryKey: STUDENT_RESPONSE_QUERY_KEYS.submissionStatus(token),
        queryFn: () => studentResponseService.checkSubmission(token),
        enabled: enabled && !!token,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

// Submit student responses
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
        SubmitResponseItem[],
        Error,
        { token: string; responses: SubmitResponsesData }
    >({
        mutationFn: ({ token, responses }) =>
            studentResponseService.submitResponses(token, responses),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: STUDENT_RESPONSE_QUERY_KEYS.submissionStatus(
                    variables.token
                ),
            });
            onSuccessCallback?.(data);
        },
        onError: (error, _variables) => {
            onErrorCallback?.(error);
        },
    });
};
