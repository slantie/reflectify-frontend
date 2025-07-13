/**
@file src/app/not-found.tsx
@description 404 Not Found page for missing routes.
*/

"use client";
import Error from "@/components/common/Error";

// NotFound page component
export default function NotFound() {
  return (
    // Render error message for 404
    <Error
      statusCode={404}
      title="Page Not Found"
      message="Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."
    />
  );
}
