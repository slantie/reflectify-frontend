// src/interfaces/studentResponse.ts

import { IdType } from "./common";

// The type for the 'value' of a student's response.
// This should match the possible types your backend expects (e.g., string for text/rating, boolean for boolean questions).
export type StudentResponseValue = string | number | boolean;

// Interface for a single student's response to a question.
// Corresponds to an item in the array for submitResponsesBodySchema.
export interface SubmitResponseItem {
    feedbackQuestionId: IdType; // The ID of the question being answered
    value: StudentResponseValue; // The student's answer
}

// Data structure for submitting multiple student responses.
// Corresponds to submitResponsesBodySchema.
export type SubmitResponsesData = SubmitResponseItem[];

// Data structure for the response from checking submission status.
// Corresponds to the data returned by checkSubmission.
export interface CheckSubmissionStatus {
    isSubmitted: boolean;
    // You might also receive formId or other related info here if your backend returns it.
    // For now, based on the controller, it's just `isSubmitted`.
}
