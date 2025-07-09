// src/interfaces/auth.ts

export interface Admin {
    id: string;
    name: string;
    email: string;
    designation: string;
    isSuper: boolean;
}

export interface LoginFormInputs {
    email: string;
    password: string;
}
