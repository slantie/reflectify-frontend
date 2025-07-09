// src/hooks/useAuthForm.ts
import { useState, ChangeEvent } from "react";
import { LoginFormInputs } from "@/interfaces/auth"; // Import the interface

export const useAuthForm = (initialState: LoginFormInputs) => {
    const [formData, setFormData] = useState<LoginFormInputs>(initialState);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return {
        formData,
        setFormData,
        handleInputChange,
    };
};
