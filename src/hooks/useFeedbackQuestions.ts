// src/hooks/useFeedbackQuestions.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import feedbackQuestionService from "@/services/feedbackQuestionService"; // Adjust path
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
import { IdType } from "@/interfaces/common"; // Adjust path

// --- Query Keys ---
export const QUESTION_CATEGORY_QUERY_KEYS = {
    all: ["questionCategories"] as const,
    lists: () => [...QUESTION_CATEGORY_QUERY_KEYS.all, "list"] as const,
    detail: (id: IdType) => [...QUESTION_CATEGORY_QUERY_KEYS.all, id] as const,
};

export const FEEDBACK_QUESTION_QUERY_KEYS = {
    all: ["feedbackQuestions"] as const,
    listsByForm: (formId: IdType) =>
        [...FEEDBACK_QUESTION_QUERY_KEYS.all, "listByForm", formId] as const,
    detail: (id: IdType) => [...FEEDBACK_QUESTION_QUERY_KEYS.all, id] as const,
};

// --- Query Hook: Get All Question Categories ---
export const useAllQuestionCategories = () => {
    return useQuery<QuestionCategory[], Error>({
        queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
        queryFn: feedbackQuestionService.getAllQuestionCategories,
    });
};

// --- Query Hook: Get Question Category by ID ---
export const useQuestionCategory = (id: IdType) => {
    return useQuery<QuestionCategory, Error>({
        queryKey: QUESTION_CATEGORY_QUERY_KEYS.detail(id),
        queryFn: () => feedbackQuestionService.getQuestionCategoryById(id),
        enabled: !!id, // Only run the query if 'id' is truthy
    });
};

// --- Query Hook: Get Feedback Questions by Form ID ---
export const useFeedbackQuestionsByFormId = (formId: IdType) => {
    return useQuery<FeedbackQuestion[], Error>({
        queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
        queryFn: () =>
            feedbackQuestionService.getFeedbackQuestionsByFormId(formId),
        enabled: !!formId, // Only run the query if 'formId' is truthy
    });
};

// --- Mutation Hook: Create Question Category ---
export const useCreateQuestionCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<QuestionCategory, Error, CreateQuestionCategoryData>({
        mutationFn: feedbackQuestionService.createQuestionCategory,
        onSuccess: () => {
            // Invalidate the list of question categories to refetch it after creation
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Update Question Category ---
export const useUpdateQuestionCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<
        QuestionCategory, // TData
        Error, // TError
        { id: IdType; data: UpdateQuestionCategoryData }, // TVariables
        // TContext
        {
            previousCategory: QuestionCategory | undefined;
            previousCategoriesList: QuestionCategory[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) =>
            feedbackQuestionService.updateQuestionCategory(id, data),
        onSuccess: (updatedCategory) => {
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.detail(
                    updatedCategory.id
                ),
            });
            queryClient.setQueryData(
                QUESTION_CATEGORY_QUERY_KEYS.detail(updatedCategory.id),
                updatedCategory
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.detail(id),
            });
            await queryClient.cancelQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });

            const previousCategory = queryClient.getQueryData<QuestionCategory>(
                QUESTION_CATEGORY_QUERY_KEYS.detail(id)
            );
            const previousCategoriesList = queryClient.getQueryData<
                QuestionCategory[]
            >(QUESTION_CATEGORY_QUERY_KEYS.lists());

            queryClient.setQueryData<QuestionCategory>(
                QUESTION_CATEGORY_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );
            queryClient.setQueryData<QuestionCategory[]>(
                QUESTION_CATEGORY_QUERY_KEYS.lists(),
                (old) =>
                    old?.map((category) =>
                        category.id === id
                            ? { ...category, ...updateData }
                            : category
                    )
            );
            return { previousCategory, previousCategoriesList };
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for category ID ${variables.id}:`,
                err
            );
            if (context?.previousCategory) {
                queryClient.setQueryData(
                    QUESTION_CATEGORY_QUERY_KEYS.detail(variables.id),
                    context.previousCategory
                );
            }
            if (context?.previousCategoriesList) {
                queryClient.setQueryData(
                    QUESTION_CATEGORY_QUERY_KEYS.lists(),
                    context.previousCategoriesList
                );
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Soft Delete Question Category ---
export const useSoftDeleteQuestionCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        { previousCategoriesList: QuestionCategory[] | undefined }
    >({
        mutationFn: (id) =>
            feedbackQuestionService.softDeleteQuestionCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
            queryClient.removeQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            await queryClient.cancelQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
            const previousCategoriesList = queryClient.getQueryData<
                QuestionCategory[]
            >(QUESTION_CATEGORY_QUERY_KEYS.lists());

            queryClient.setQueryData<QuestionCategory[]>(
                QUESTION_CATEGORY_QUERY_KEYS.lists(),
                (old) => old?.filter((category) => category.id !== idToDelete)
            );
            return { previousCategoriesList };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for category ID ${idToDelete}:`,
                err
            );
            if (context?.previousCategoriesList) {
                queryClient.setQueryData(
                    QUESTION_CATEGORY_QUERY_KEYS.lists(),
                    context.previousCategoriesList
                );
            }
        },
        onSettled: (_data, _error, _idToDelete) => {
            queryClient.invalidateQueries({
                queryKey: QUESTION_CATEGORY_QUERY_KEYS.lists(),
            });
        },
    });
};

// --- Mutation Hook: Create Feedback Question ---
export const useCreateFeedbackQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackQuestion, // TData
        Error, // TError
        {
            formId: IdType;
            questionData: Omit<CreateFeedbackQuestionData, "formId">;
        } // TVariables
    >({
        mutationFn: ({ formId, questionData }) =>
            feedbackQuestionService.createFeedbackQuestion(
                formId,
                questionData
            ),
        onSuccess: (newQuestion) => {
            // Invalidate the questions list for the specific form
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(
                    newQuestion.formId
                ),
            });
            // Also invalidate the feedback form detail if it contains questions as part of its data
            queryClient.invalidateQueries({
                queryKey: ["feedbackForms", newQuestion.formId],
            });
        },
        // Optimistic update for adding a question to a form is possible but requires careful handling
        // of temporary IDs and ensuring the form's questions array is updated correctly.
        // For simplicity, we're doing invalidation here.
    });
};

// --- Mutation Hook: Update Feedback Question ---
export const useUpdateFeedbackQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackQuestion, // TData
        Error, // TError
        { id: IdType; data: UpdateFeedbackQuestionData }, // TVariables
        // TContext
        {
            previousQuestion: FeedbackQuestion | undefined;
            previousQuestionsList: FeedbackQuestion[] | undefined;
        }
    >({
        mutationFn: ({ id, data }) =>
            feedbackQuestionService.updateFeedbackQuestion(id, data),
        onSuccess: (updatedQuestion) => {
            // Invalidate the specific question detail and the list it belongs to
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.detail(
                    updatedQuestion.id
                ),
            });
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(
                    updatedQuestion.formId
                ),
            });
            // Also invalidate the feedback form detail if it contains questions as part of its data
            queryClient.invalidateQueries({
                queryKey: ["feedbackForms", updatedQuestion.formId],
            });

            queryClient.setQueryData<FeedbackQuestion>(
                FEEDBACK_QUESTION_QUERY_KEYS.detail(updatedQuestion.id),
                updatedQuestion
            );
        },
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.detail(id),
            });
            // We need to know the formId to cancel/update the list
            const questionToUpdate = queryClient.getQueryData<FeedbackQuestion>(
                FEEDBACK_QUESTION_QUERY_KEYS.detail(id)
            );
            const formId = questionToUpdate?.formId;

            if (formId) {
                await queryClient.cancelQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                });
            }

            const previousQuestion = questionToUpdate;
            const previousQuestionsList = formId
                ? queryClient.getQueryData<FeedbackQuestion[]>(
                      FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId)
                  )
                : undefined;

            queryClient.setQueryData<FeedbackQuestion>(
                FEEDBACK_QUESTION_QUERY_KEYS.detail(id),
                (old) => (old ? { ...old, ...updateData } : old)
            );

            if (formId) {
                queryClient.setQueryData<FeedbackQuestion[]>(
                    FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                    (old) =>
                        old?.map((q) =>
                            q.id === id ? { ...q, ...updateData } : q
                        )
                );
            }

            return { previousQuestion, previousQuestionsList };
        },
        onError: (err, variables, context) => {
            console.error(
                `Failed optimistic update for question ID ${variables.id}:`,
                err
            );
            if (context?.previousQuestion) {
                queryClient.setQueryData(
                    FEEDBACK_QUESTION_QUERY_KEYS.detail(variables.id),
                    context.previousQuestion
                );
            }
            if (
                context?.previousQuestionsList &&
                context.previousQuestion?.formId
            ) {
                queryClient.setQueryData(
                    FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(
                        context.previousQuestion.formId
                    ),
                    context.previousQuestionsList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // If mutation succeeded and we have data, use its formId, otherwise try to get it from variables or context
            const formId =
                (data as FeedbackQuestion)?.formId ||
                (error as any)?.response?.data?.formId ||
                (variables as any)?.formId; // Fallback to variables if formId not in data/error
            if (formId) {
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.detail(variables.id),
                });
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                });
                queryClient.invalidateQueries({
                    queryKey: ["feedbackForms", formId],
                }); // Invalidate parent form
            } else {
                // Fallback if formId can't be reliably determined from success/error/variables
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.all,
                });
            }
        },
    });
};

// --- Mutation Hook: Soft Delete Feedback Question ---
export const useSoftDeleteFeedbackQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation<
        void, // TData
        Error, // TError
        IdType, // TVariables
        // TContext
        {
            previousQuestionsList: FeedbackQuestion[] | undefined;
            formId: IdType | undefined;
        }
    >({
        mutationFn: (id) =>
            feedbackQuestionService.softDeleteFeedbackQuestion(id),
        onSuccess: (_, id) => {
            // We need the formId to invalidate the correct list.
            // This might need to be passed from the component or derived from cache.
            // For now, we'll invalidate all questions lists, or rely on onSettled to get formId.
            queryClient.invalidateQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.all,
            }); // Broad invalidation
            queryClient.removeQueries({
                queryKey: FEEDBACK_QUESTION_QUERY_KEYS.detail(id),
            });
        },
        onMutate: async (idToDelete) => {
            const questionToDelete = queryClient.getQueryData<FeedbackQuestion>(
                FEEDBACK_QUESTION_QUERY_KEYS.detail(idToDelete)
            );
            const formId = questionToDelete?.formId;

            if (formId) {
                await queryClient.cancelQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                });
            }
            const previousQuestionsList = formId
                ? queryClient.getQueryData<FeedbackQuestion[]>(
                      FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId)
                  )
                : undefined;

            if (formId) {
                queryClient.setQueryData<FeedbackQuestion[]>(
                    FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                    (old) => old?.filter((q) => q.id !== idToDelete)
                );
            }
            return { previousQuestionsList, formId };
        },
        onError: (err, idToDelete, context) => {
            console.error(
                `Failed optimistic deletion for question ID ${idToDelete}:`,
                err
            );
            if (context?.previousQuestionsList && context.formId) {
                queryClient.setQueryData(
                    FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(context.formId),
                    context.previousQuestionsList
                );
            }
        },
        onSettled: (data, error, idToDelete) => {
            // Attempt to get formId from context or error object if available
            const formId =
                (error as any)?.response?.data?.formId ||
                (data as any)?.formId ||
                queryClient.getQueryData<FeedbackQuestion>(
                    FEEDBACK_QUESTION_QUERY_KEYS.detail(idToDelete)
                )?.formId;

            if (formId) {
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                });
                queryClient.invalidateQueries({
                    queryKey: ["feedbackForms", formId],
                }); // Invalidate parent form
            } else {
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.all,
                }); // Fallback broad invalidation
            }
        },
    });
};

// --- Mutation Hook: Batch Update Feedback Questions ---
export const useBatchUpdateFeedbackQuestions = () => {
    const queryClient = useQueryClient();
    return useMutation<
        FeedbackQuestion[],
        Error,
        BatchUpdateFeedbackQuestionItem[]
    >({
        mutationFn: feedbackQuestionService.batchUpdateFeedbackQuestions,
        onSuccess: (updatedQuestions) => {
            // Batch updates are complex for optimistic UI, so typically just invalidate affected queries
            // Invalidate all relevant question lists (if questions belong to different forms)
            const uniqueFormIds = [
                ...new Set(updatedQuestions.map((q) => q.formId)),
            ];
            uniqueFormIds.forEach((formId) => {
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.listsByForm(formId),
                });
                queryClient.invalidateQueries({
                    queryKey: ["feedbackForms", formId],
                }); // Invalidate parent forms
            });
            // Also invalidate specific question details if they were updated
            updatedQuestions.forEach((q) => {
                queryClient.invalidateQueries({
                    queryKey: FEEDBACK_QUESTION_QUERY_KEYS.detail(q.id),
                });
            });
        },
        // No optimistic update on mutate for batch operations for simplicity and safety
    });
};
