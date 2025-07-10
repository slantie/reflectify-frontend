"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    PencilIcon,
    EyeIcon,
    TrashIcon,
    ArrowLeftIcon,
    CalendarIcon,
    AcademicCapIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";

// Import components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";

// Import services
import feedbackFormService from "@/services/feedbackFormService";

// Import interfaces
import { FeedbackForm } from "@/interfaces/feedbackForm";

interface FeedbackFormDetailsPageProps {
    params: Promise<{ formId: string }>;
}

export default function FeedbackFormDetailsPage({
    params,
}: FeedbackFormDetailsPageProps) {
    const router = useRouter();
    const { formId } = React.use(params);
    const [form, setForm] = useState<FeedbackForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchForm = useCallback(async () => {
        try {
            const formData = await feedbackFormService.getFormById(formId);
            setForm(formData);
        } catch (error) {
            console.error("Failed to fetch form:", error);
            showToast.error("Failed to load feedback form");
            router.push("/feedback-forms");
        } finally {
            setLoading(false);
        }
    }, [formId, router]);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);

    const handleDeleteForm = async () => {
        if (
            !confirm(
                "Are you sure you want to delete this feedback form? This action cannot be undone."
            )
        ) {
            return;
        }

        setDeleting(true);
        try {
            await feedbackFormService.softDeleteForm(formId);
            showToast.success("Feedback form deleted successfully");
            router.push("/feedback-forms");
        } catch (error) {
            console.error("Failed to delete form:", error);
            showToast.error("Failed to delete feedback form");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "text-green-600 bg-green-50 border-green-200";
            case "draft":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Closed":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "archived":
                return "text-gray-600 bg-gray-50 border-gray-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <Loader />
                    <p className="text-light-text dark:text-dark-text ml-2 mt-2">
                        Loading feedback form...
                    </p>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                        Feedback Form Not Found
                    </h1>
                    <p className="text-light-muted-text dark:text-dark-muted-text mt-2">
                        The requested feedback form could not be found.
                    </p>
                    <Button
                        onClick={() => router.push("/feedback-forms")}
                        className="mt-4"
                    >
                        Back to Feedback Forms
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.back()}
                                className="p-2"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
                                    {form.title}
                                </h1>
                                <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                    Feedback Form Details
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        `/feedback-forms/preview/${form.id}`
                                    )
                                }
                                className="flex items-center gap-2"
                            >
                                <EyeIcon className="h-4 w-4" />
                                Preview
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    router.push(
                                        `/feedback-forms/edit/${form.id}`
                                    )
                                }
                                className="flex items-center gap-2"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteForm}
                                disabled={deleting}
                                className="flex items-center gap-2"
                            >
                                {deleting ? (
                                    <Loader />
                                ) : (
                                    <TrashIcon className="h-4 w-4" />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>

                    {/* Form Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                                    Form Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-light-muted-text dark:text-dark-muted-text">
                                            Status:
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                                                form.status
                                            )}`}
                                        >
                                            {form.status}
                                        </span>
                                    </div>

                                    {form.description && (
                                        <div>
                                            <span className="text-light-muted-text dark:text-dark-muted-text">
                                                Description:
                                            </span>
                                            <p className="text-light-text dark:text-dark-text mt-1">
                                                {form.description}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {form.startDate && (
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                                <div>
                                                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                        Start Date
                                                    </p>
                                                    <p className="text-light-text dark:text-dark-text">
                                                        {formatDate(
                                                            form.startDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {form.endDate && (
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                                <div>
                                                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                        End Date
                                                    </p>
                                                    <p className="text-light-text dark:text-dark-text">
                                                        {formatDate(
                                                            form.endDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>

                            {/* Questions Preview */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                                    Questions ({form.questions?.length || 0})
                                </h2>
                                {form.questions && form.questions.length > 0 ? (
                                    <div className="space-y-3">
                                        {form.questions
                                            .slice(0, 5)
                                            .map((question, index) => (
                                                <div
                                                    key={question.id}
                                                    className="p-3 bg-light-muted-background dark:bg-dark-muted-background rounded-lg"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-medium text-light-text dark:text-dark-text">
                                                                {index + 1}.{" "}
                                                                {question.text}
                                                            </p>
                                                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-1">
                                                                Type:{" "}
                                                                {question.type}{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {form.questions.length > 5 && (
                                            <p className="text-center text-light-muted-text dark:text-dark-muted-text">
                                                ... and{" "}
                                                {form.questions.length - 5} more
                                                questions
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-light-muted-text dark:text-dark-muted-text text-center py-8">
                                        No questions added yet. Click
                                        &quot;Edit&quot; to add questions.
                                    </p>
                                )}
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Academic Information */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                    Academic Information
                                </h3>
                                <div className="space-y-3">
                                    {form.department && (
                                        <div className="flex items-center gap-2">
                                            <AcademicCapIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Department
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    {form.department.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {form.semester && (
                                        <div className="flex items-center gap-2">
                                            <UserGroupIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Semester
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    Semester{" "}
                                                    {
                                                        form.semester
                                                            .semesterNumber
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {form.division && (
                                        <div className="flex items-center gap-2">
                                            <UserGroupIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Division
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    Division{" "}
                                                    {form.division.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {form.subject && (
                                        <div className="flex items-center gap-2">
                                            <AcademicCapIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Subject
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    {form.subject.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {form.faculty && (
                                        <div className="flex items-center gap-2">
                                            <UserGroupIcon className="h-5 w-5 text-light-muted-text dark:text-dark-muted-text" />
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Faculty
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    {form.faculty.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Metadata */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                    Metadata
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            Created
                                        </p>
                                        <p className="text-light-text dark:text-dark-text">
                                            {formatDate(form.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            Last Updated
                                        </p>
                                        <p className="text-light-text dark:text-dark-text">
                                            {formatDate(form.updatedAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            Form ID
                                        </p>
                                        <p className="text-xs text-light-muted-text dark:text-dark-muted-text font-mono">
                                            {form.id}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
