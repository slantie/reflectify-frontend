// src/app/(main)/feedback/page.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { showToast } from "@/lib/toast";

// Import hooks and services
import { useAllFeedbackForms } from "@/hooks/useFeedbackForms";
import { useRouter } from "next/navigation";
import feedbackFormService from "@/services/feedbackFormService";

// Import UI components
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/common/Loader";

// Import modular components
import {
    FeedbackFormHeader,
    FeedbackFormStats,
    FeedbackFormSearchFilter,
    FeedbackFormList,
} from "@/components/feedback";

// Import interfaces
import { FeedbackFormStatus } from "@/interfaces/feedbackForm";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function FeedbackFormManagement() {
    const router = useRouter();

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        FeedbackFormStatus | "ALL"
    >("ALL");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch feedback forms using the existing hook
    const {
        data: feedbackForms = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useAllFeedbackForms();

    // Filter and search logic
    const filteredForms = useCallback(() => {
        return feedbackForms.filter((form) => {
            const matchesSearch = form.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" || form.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [feedbackForms, searchTerm, statusFilter]);

    // Handle actions
    const handleView = useCallback(
        (formId: string) => {
            router.push(`/feedback-forms/${formId}`);
        },
        [router]
    );

    const handleEdit = useCallback(
        (formId: string) => {
            router.push(`/feedback-forms/edit/${formId}`);
        },
        [router]
    );

    const handleDelete = useCallback(
        async (formId: string) => {
            if (
                window.confirm(
                    "Are you sure you want to delete this form? This action cannot be undone."
                )
            ) {
                try {
                    await feedbackFormService.softDeleteForm(formId);
                    // Refetch the forms list to update UI
                    refetch();
                    showToast.success("Feedback form deleted successfully");
                } catch (error) {
                    console.error("Failed to delete form:", error);
                    showToast.error("Failed to delete feedback form");
                }
            }
        },
        [refetch]
    );

    const handleCreateNew = useCallback(() => {
        router.push("/feedback-forms/create");
    }, [router]);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
        }
    }, [refetch]);

    // Handle stat click to filter by status
    const handleStatClick = useCallback((status: FeedbackFormStatus) => {
        setStatusFilter(status);
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <Loader />
                <p className="text-light-text dark:text-dark-text ml-2">
                    Loading feedback forms...
                </p>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <p className="text-light-text dark:text-dark-text mb-2">
                        {error?.message || "Failed to load feedback forms."}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            Reload Page
                        </Button>
                        <Button onClick={handleRefresh} variant="default">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const formsToDisplay = filteredForms();

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Header Section */}
                    <FeedbackFormHeader
                        isRefreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        onCreateNew={handleCreateNew}
                    />

                    {/* Stats Cards */}
                    <FeedbackFormStats
                        forms={feedbackForms}
                        onStatClick={handleStatClick}
                    />

                    {/* Search and Filter Section */}
                    <FeedbackFormSearchFilter
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                        onSearchChange={setSearchTerm}
                        onStatusFilterChange={setStatusFilter}
                    />

                    {/* Forms List */}
                    <FeedbackFormList
                        forms={formsToDisplay}
                        totalForms={feedbackForms.length}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </motion.div>
            </div>
        </div>
    );
}
