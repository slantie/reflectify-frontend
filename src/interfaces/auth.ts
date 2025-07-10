/**
 * @file src/interfaces/auth.ts
 * @description Interfaces for authentication API responses and forms
 */

import { Admin } from "./admin";

// API response for login endpoint.
export interface LoginResponse {
    token: string;
    data: {
        admin: Admin;
    };
}

// API response for /me endpoint.
export interface MeResponse {
    data: {
        admin: Admin;
    };
}

// Login form input fields.
export interface LoginFormInputs {
    email: string;
    password: string;
}
