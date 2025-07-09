// src/hooks/useFeedbackForms.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import feedbackFormService from "@/services/feedbackFormService"; // Adjust path
import {
    FeedbackForm,
    GenerateFormsData,
    AddQuestionToFormInput,
    UpdateFormData,
    UpdateFormStatusData,
    BulkUpdateFormStatusData,
} from "@/interfaces/feedbackForm"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const FEEDBACK_FORM_QUERY_KEYS = {
    all: ["feedbackForms"] as const,
    lists: () => [...FEEDBACK_FORM_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...FEEDBACK_FORM_QUERY_KEYS.all, id] as const,
    byAccessToken: (token: string) =>
        [...FEEDBACK_FORM_QUERY_KEYS.all, "access", token] as const,
};

// --- Query Hook: Get All Feedback Forms ---
export const useAllFeedbackForms = () => {
    return useQuery<FeedbackForm[], Error>({
        queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
        queryFn: feedbackFormService.getAllForms,
    });
};

// --- Query Hook: Get Feedback Form by ID ---
export const useFeedbackForm = (id: IdType) => {
    return useQuery<FeedbackForm, Error>({
        queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(id),
        queryFn: () => feedbackFormService.getFormById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Query Hook: Get Feedback Form by Access Token ---
export const useFeedbackFormByAccessToken = (token: string) => {
    return useQuery<FeedbackForm, Error>({
        queryKey: FEEDBACK_FORM_QUERY_KEYS.byAccessToken(token),
        queryFn: () => feedbackFormService.getFormByAccessToken(token),
        enabled: !!token, // Only run the query if 'token' is truthy
        // This query might be public, so consider staleTime/gcTime carefully if sensitive
        staleTime: Infinity, // Forms accessed by token are usually static after load
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes (renamed from cacheTime in v5)
    });
};

// --- Mutation Hook: Generate Forms ---
export const useGenerateFeedbackForms = () => {
    const queryClient = useQueryClient();
    return useMutation<FeedbackForm[], Error, GenerateFormsData>({
        mutationFn: feedbackFormService.generateForms,
        onSuccess: () => {
            // Invalidate the list of feedback forms to refetch it after generation
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
        },
        // Optimistic update for generation is complex due to new IDs, so simple invalidation is safer.
    });
};

// --- Mutation Hook: Update Form ---
export const useUpdateFeedbackForm = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackForm, // TData
        Error, // TError
        { id: IdType; data: UpdateFormData }, // TVariables
        // TContext
        {
            previousForm: FeedbackForm | undefined;
            previousFormsList: FeedbackForm[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) => feedbackFormService.updateForm(id, data),
        onSuccess: (updatedForm) => {
            // Invalidate the list and specific detail query
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
            });

            // Optimistically update the specific form in cache
            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
                updatedForm
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });

            const previousForm = queryClient.getQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(id)
            );
            const previousFormsList = queryClient.getQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            queryClient.setQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((form) =>
                        form.id === id ? { ...form, ...updateData } : form
                    )
            );

            return { previousForm, previousFormsList };
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for form ID ${variables.id}:`,
                err
            );
            if (context?.previousForm) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.detail(variables.id),
                    context.previousForm
                );
            }
            if (context?.previousFormsList) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.lists(),
                    context.previousFormsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Form ---
export const useSoftDeleteFeedbackForm = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousFormsList: FeedbackForm[] | undefined }
    >({
        mutationFn: (id) => feedbackFormService.softDeleteForm(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
            queryClient.removeQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
            const previousFormsList = queryClient.getQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists(),
                (old) => old?.filter((form) => form.id !== idToDelete)
            );
            return { previousFormsList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for form ID ${idToDelete}:`,
                err
            );
            if (context?.previousFormsList) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.lists(),
                    context.previousFormsList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Add Question to Form ---
export const useAddQuestionToFeedbackForm = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackForm, // TData
        Error, // TError
        { formId: IdType; questionData: AddQuestionToFormInput }, // TVariables
        // TContext
        { previousForm: FeedbackForm | undefined }
    >({
        mutationFn: ({ formId, questionData }) =>
            feedbackFormService.addQuestionToForm(formId, questionData),
        onSuccess: (updatedForm) => {
            // Invalidate the specific form detail query and list (as questions might affect list representation)
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });

            // Optimistically update the specific form in cache
            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
                updatedForm
            );
        },
        onMutate: async ({ formId, questionData }) => {
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(formId),
            });
            const previousForm = queryClient.getQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(formId)
            );

            // Optimistically add the new question (assuming backend adds it to questions array)
            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(formId),
                (old) => {
                    if (old) {
                        // This assumes your FeedbackForm interface has a 'questions' array
                        // and that questionData can be directly added or mapped to the correct question type.
                        // You might need to adjust this based on the exact structure of your questionData and FeedbackForm.questions
                        const newQuestions = old.questions
                            ? [
                                  ...old.questions,
                                  {
                                      ...questionData,
                                      id: "temp-id-" + Date.now(),
                                  },
                              ]
                            : [
                                  {
                                      ...questionData,
                                      id: "temp-id-" + Date.now(),
                                  },
                              ];
                        return {
                            ...old,
                            questions: newQuestions,
                        };
                    }
                    return old;
                }
            );
            return { previousForm };
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic add question for form ID ${variables.formId}:`,
                err
            );
            if (context?.previousForm) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.detail(variables.formId),
                    context.previousForm
                );
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(variables.formId),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            }); // Invalidate list too
        },
    });
};

// --- Mutation Hook: Update Form Status ---
export const useUpdateFeedbackFormStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackForm, // TData
        Error, // TError
        { formId: IdType; statusData: UpdateFormStatusData }, // TVariables
        // TContext
        {
            previousForm: FeedbackForm | undefined;
            previousFormsList: FeedbackForm[] | undefined;
        }
    >({
        mutationFn: ({ formId, statusData }) =>
            feedbackFormService.updateFormStatus(formId, statusData),
        onSuccess: (updatedForm) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
            });

            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(updatedForm.id),
                updatedForm
            );
        },
        onMutate: async ({ formId, statusData }) => {
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(formId),
            });
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });

            const previousForm = queryClient.getQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(formId)
            );
            const previousFormsList = queryClient.getQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists()
            );

            queryClient.setQueryData<FeedbackForm>(
                FEEDBACK_FORM_QUERY_KEYS.detail(formId),
                (old) => (old ? { ...old, ...statusData } : old)
            );

            queryClient.setQueryData<FeedbackForm[]>(
                FEEDBACK_FORM_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((form) =>
                        form.id === formId ? { ...form, ...statusData } : form
                    )
            );

            return { previousForm, previousFormsList };
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update status for form ID ${variables.formId}:`,
                err
            );
            if (context?.previousForm) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.detail(variables.formId),
                    context.previousForm
                );
            }
            if (context?.previousFormsList) {
                queryClient.setQueryData(
                    FEEDBACK_FORM_QUERY_KEYS.lists(),
                    context.previousFormsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(variables.formId),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Bulk Update Form Status ---
export const useBulkUpdateFeedbackFormStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<FeedbackForm[], Error, BulkUpdateFormStatusData>({
        mutationFn: feedbackFormService.bulkUpdateFormStatus,
        onSuccess: () => {
            // Bulk updates are complex for optimistic UI, so typically just invalidate affected queries
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_FORM_QUERY_KEYS.lists(),
            });
            // If you know the IDs of the updated forms from the response, you could invalidate their specific detail queries too
            // e.g., updatedForms.forEach(form => queryClient.invalidateQueries({ queryKey: FEEDBACK_FORM_QUERY_KEYS.detail(form.id) }));
        },
        // No optimistic update on mutate for bulk operations for simplicity and safety
    });
};
