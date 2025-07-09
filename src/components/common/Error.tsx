"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui"; // Adjust the import path as necessary

interface ErrorProps {
    statusCode?: number;
    title?: string;
    message?: string;
    onRefresh?: () => void;
}

function Error({
    statusCode = 404,
    title = "Page Not Found",
    message = "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.",
    onRefresh,
}: ErrorProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            router.refresh();
        }
    };

    const goBack = () => {
        router.back();
    };

    const baseButtonClasses =
        "group font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto";

    return (
        <div
            className="relative flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background py-8 px-4"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            {/* Theme Toggle Button */}
            {mounted && (
                <div className="absolute top-5 right-5">
                    <ThemeToggle />
                </div>
            )}

            <div className="text-center space-y-8 max-w-2xl w-full">
                <div className="relative inline-block">
                    <div className="w-24 h-24 mx-auto bg-primary-main dark:bg-primary-dark rounded-full flex items-center justify-center shadow-2xl">
                        <AlertTriangle className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-6xl font-bold text-light-text dark:text-dark-text">
                        {statusCode}
                    </h1>
                    <h2 className="text-3xl font-bold text-light-text dark:text-dark-text">
                        {title}
                    </h2>
                    <p className="text-lg text-light-muted-text dark:text-dark-muted-text max-w-md mx-auto leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className={`${baseButtonClasses} bg-primary-main text-white hover:bg-primary-dark`}
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Go Home</span>
                    </Link>

                    <button
                        onClick={handleRefresh}
                        className={`${baseButtonClasses} bg-light-muted-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main dark:hover:border-primary-light text-light-text dark:text-dark-text`}
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-primary-main dark:text-primary-light" />
                        <span>Refresh</span>
                    </button>

                    <button
                        onClick={goBack}
                        className={`${baseButtonClasses} bg-light-muted-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main dark:hover:border-primary-light text-light-text dark:text-dark-text`}
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 text-primary-main dark:text-primary-light" />
                        <span>Go Back</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Error;
