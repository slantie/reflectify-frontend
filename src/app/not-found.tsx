"use client";

import Error from "@/components/common/Error";

export default function NotFound() {
    return (
        <Error
            statusCode={404}
            title="Page Not Found"
            message="Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
        />
    );
}
