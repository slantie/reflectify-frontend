"use client"; // Error components must be Client Components

import { useEffect } from "react";
import ErrorComponent from "@/components/common/Error";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <ErrorComponent
            statusCode={500}
            title="Something Went Wrong"
            message={
                error.message ||
                "An unexpected error occurred. Please try again."
            }
            onRefresh={reset} // Pass the reset function to the component
        />
    );
}
