// src/interfaces/email.ts

import { IdType } from "./common";

// Data required to send form access emails
// Corresponds to sendFormAccessEmailBodySchema in your backend
export interface SendFormAccessEmailData {
    formId: IdType;
    divisionId: IdType;
}
