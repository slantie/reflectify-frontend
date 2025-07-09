// src/app/(main)/layout.tsx
"use client"; // Essential because Header/Footer will likely use useAuth() and ProtectedRoute is a client component

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Import the ProtectedRoute component

export default function MainGroupLayout({
    // Renamed to MainGroupLayout for clarity with folder name
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Wrap the entire main content with ProtectedRoute
        // This ensures that any page within the (main) group is protected.
        // The `requireAuth={true}` prop is crucial for preventing access if not logged in.
        <ProtectedRoute requireAuth={true}>
            <>
                {/* Header and Footer are now rendered within the protected route context.
                    If they also use `useAuth`, they'll wait for the auth check from the Provider. */}
                <Header />
                <main>{children}</main>{" "}
                {/* Use main tag for semantic structure */}
                <Footer />
            </>
        </ProtectedRoute>
    );
}
