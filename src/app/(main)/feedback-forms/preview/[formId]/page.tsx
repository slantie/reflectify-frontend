"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    PencilIcon,
    EyeIcon,
    StarIcon,
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

interface PreviewFeedbackFormPageProps {
    params: Promise<{ formId: string }>;
}

export default function PreviewFeedbackFormPage({
    params,
}: PreviewFeedbackFormPageProps) {
    const router = useRouter();
    const [formId, setFormId] = useState<string | null>(null);
    const [form, setForm] = useState<FeedbackForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBatch] = useState<string>("all");
    const [responses, setResponses] = useState<{ [questionId: string]: any }>(
        {}
    );

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const resolvedParams = await params;
            if (isMounted) setFormId(resolvedParams.formId);
        })();
        return () => {
            isMounted = false;
        };
    }, [params]);

    const fetchForm = useCallback(
        async (id: string) => {
            try {
                const formData = await feedbackFormService.getFormById(id);
                setForm(formData);
            } catch (error) {
                console.error("Failed to fetch form:", error);
                showToast.error("Failed to load feedback form");
                router.push("/feedback-forms");
            } finally {
                setLoading(false);
            }
        },
        [router]
    );

    useEffect(() => {
        if (formId) {
            fetchForm(formId);
        }
    }, [formId, fetchForm]);

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleResponseChange = (questionId: string, value: any) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const renderQuestionInput = (question: any) => {
        const value = responses[question.id] || "";

        switch (question.type) {
            case "RATING":
                return (
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() =>
                                    handleResponseChange(question.id, rating)
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                    value === rating
                                        ? "text-yellow-500"
                                        : "text-gray-300 hover:text-yellow-400"
                                }`}
                                aria-label={`Rate ${rating} stars`}
                            >
                                <StarIcon className="h-6 w-6 fill-current" />
                            </button>
                        ))}
                        {value && (
                            <span className="ml-2 text-sm text-light-muted-text dark:text-dark-muted-text">
                                {value}/5
                            </span>
                        )}
                    </div>
                );

            case "TEXT":
                return (
                    <textarea
                        value={value}
                        onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your response..."
                    />
                );

            case "MULTIPLE_CHOICE":
                return (
                    <div className="space-y-2">
                        {question.options?.map(
                            (option: string, index: number) => (
                                <label
                                    key={index}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) =>
                                            handleResponseChange(
                                                question.id,
                                                e.target.value
                                            )
                                        }
                                        className="h-4 w-4 text-primary focus:ring-primary border-light-secondary"
                                    />
                                    <span className="text-light-text dark:text-dark-text">
                                        {option}
                                    </span>
                                </label>
                            )
                        ) || (
                            <p className="text-light-muted-text dark:text-dark-muted-text italic">
                                No options configured for this question
                            </p>
                        )}
                    </div>
                );

            case "BOOLEAN":
                return (
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value="yes"
                                checked={value === "yes"}
                                onChange={(e) =>
                                    handleResponseChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                                className="h-4 w-4 text-primary focus:ring-primary border-light-secondary"
                            />
                            <span className="text-light-text dark:text-dark-text">
                                Yes
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value="no"
                                checked={value === "no"}
                                onChange={(e) =>
                                    handleResponseChange(
                                        question.id,
                                        e.target.value
                                    )
                                }
                                className="h-4 w-4 text-primary focus:ring-primary border-light-secondary"
                            />
                            <span className="text-light-text dark:text-dark-text">
                                No
                            </span>
                        </label>
                    </div>
                );

            default:
                return (
                    <p className="text-light-muted-text dark:text-dark-muted-text italic">
                        Unknown question type: {question.type}
                    </p>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <Loader />
                    <p className="text-light-text dark:text-dark-text ml-2 mt-2">
                        Loading feedback form preview...
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

    const sortedQuestions = form.questions ? [...form.questions] : [];

    const filteredQuestions =
        selectedBatch === "all"
            ? sortedQuestions
            : sortedQuestions.filter((_q) => {
                  // Filter logic can be implemented based on batch information
                  // For now, showing all questions
                  return true;
              });

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
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
                                    Form Preview
                                </h1>
                                <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                    Preview how students will see this feedback
                                    form
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
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
                                Edit Form
                            </Button>
                        </div>
                    </div>

                    {/* Form Header */}
                    <Card className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                                {form.title}
                            </h2>
                            {form.description && (
                                <p className="text-light-muted-text dark:text-dark-muted-text">
                                    {form.description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-light-muted-background dark:bg-dark-muted-background rounded-lg">
                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                    Status
                                </p>
                                <span
                                    className={`inline-flex px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                                        form.status
                                    )}`}
                                >
                                    {form.status}
                                </span>
                            </div>
                            {form.department && (
                                <div className="p-3 bg-light-muted-background dark:bg-dark-muted-background rounded-lg">
                                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                        Department
                                    </p>
                                    <p className="text-light-text dark:text-dark-text font-medium">
                                        {form.department.name}
                                    </p>
                                </div>
                            )}
                            {form.semester && (
                                <div className="p-3 bg-light-muted-background dark:bg-dark-muted-background rounded-lg">
                                    <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                        Semester
                                    </p>
                                    <p className="text-light-text dark:text-dark-text font-medium">
                                        Semester {form.semester.semesterNumber}
                                    </p>
                                </div>
                            )}
                        </div>

                        {(form.startDate || form.endDate) && (
                            <div className="mt-4 p-3 bg-light-muted-background dark:bg-dark-muted-background rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                                    {form.startDate && (
                                        <div>
                                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                Available From
                                            </p>
                                            <p className="text-light-text dark:text-dark-text font-medium">
                                                {formatDate(form.startDate)}
                                            </p>
                                        </div>
                                    )}
                                    {form.endDate && (
                                        <div>
                                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                Available Until
                                            </p>
                                            <p className="text-light-text dark:text-dark-text font-medium">
                                                {formatDate(form.endDate)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Filter */}
                    {/* Batch filter can be implemented when needed */}

                    {/* Questions */}
                    <div className="space-y-6">
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((question, index) => (
                                <Card key={question.id} className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        Question {index + 1}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                                            {
                                                                RATING: "text-blue-600 bg-blue-50 border-blue-200",
                                                                TEXT: "text-green-600 bg-green-50 border-green-200",
                                                                MULTIPLE_CHOICE:
                                                                    "text-purple-600 bg-purple-50 border-purple-200",
                                                                BOOLEAN:
                                                                    "text-orange-600 bg-orange-50 border-orange-200",
                                                            }[question.type] ||
                                                            "text-gray-600 bg-gray-50 border-gray-200"
                                                        }`}
                                                    >
                                                        {question.type}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
                                                    {question.text}
                                                </h3>
                                                {renderQuestionInput(question)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-12 text-center">
                                <EyeIcon className="h-12 w-12 text-light-muted-text dark:text-dark-muted-text mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-2">
                                    No Questions Available
                                </h3>
                                <p className="text-light-muted-text dark:text-dark-muted-text mb-4">
                                    This feedback form doesn&apos;t have any
                                    questions yet.
                                </p>
                                <Button
                                    onClick={() =>
                                        router.push(
                                            `/feedback-forms/edit/${form.id}`
                                        )
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    Add Questions
                                </Button>
                            </Card>
                        )}
                    </div>

                    {/* Preview Footer */}
                    {filteredQuestions.length > 0 && (
                        <Card className="p-6">
                            <div className="text-center">
                                <p className="text-light-muted-text dark:text-dark-muted-text mb-4">
                                    This is a preview of your feedback form.
                                    Students will see a similar interface when
                                    submitting their responses.
                                </p>
                                <div className="flex items-center justify-center gap-3">
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
                                        Edit Form
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            router.push(
                                                `/feedback-forms/${form.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
