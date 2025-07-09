"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

export function PublicRoute({
    children,
    redirectPath = "/dashboard",
}: PublicRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const redirectAttempted = useRef(false); // To prevent multiple redirects/flickering

    useEffect(() => {
        // If auth is not loading, and user is authenticated, and a redirect hasn't been attempted yet
        if (!loading && user && !redirectAttempted.current) {
            router.replace(redirectPath);
            redirectAttempted.current = true; // Mark that a redirect has been initiated
        }
    }, [user, loading, redirectPath, router]);

    // Show loading state while checking authentication OR if a redirect has been initiated
    // This prevents content from briefly rendering before a redirect, or flickering
    if (loading || (user && !redirectAttempted.current)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading...</p>{" "}
                {/* Added for consistency */}
            </div>
        );
    }

    // If a redirect was attempted, don't render children
    if (redirectAttempted.current) {
        return null;
    }

    // If not authenticated and no redirect occurred, show the public page
    return <>{children}</>;
}
