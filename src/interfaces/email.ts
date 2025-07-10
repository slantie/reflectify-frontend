/**
 * @file src/interfaces/email.ts
 * @description Interfaces for email-related API data
 */

import { IdType } from "./common";

/**
 * Data required to send form access emails.
 */
export interface SendFormAccessEmailData {
    formId: IdType;
    divisionId: IdType;
}
