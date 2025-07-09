// src/components/providers/ToastProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                gutter={8}
                containerStyle={{
                    top: 20,
                    right: 20,
                }}
                toastOptions={{
                    duration: 5000,
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                    success: {
                        duration: 5000,
                    },
                    error: {
                        duration: 20000,
                    },
                    loading: {
                        duration: Infinity,
                    },
                }}
            />
        </>
    );
}
