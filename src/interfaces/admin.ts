// src/interfaces/auth.ts

export interface Admin {
    id: string;
    name: string;
    email: string;
    designation: string;
    isSuper: boolean;
    // Add any other user properties returned by your /auth/me endpoint
}

// Add other authentication related interfaces here if needed (e.g., LoginPayload, RegisterPayload)
