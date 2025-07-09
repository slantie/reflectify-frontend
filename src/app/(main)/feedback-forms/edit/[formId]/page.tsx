"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    CheckIcon,
    XMarkIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";

// Import components
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";
import OverrideStudentsCard from "@/components/feedback/OverrideStudentsCard";

// Import services
import feedbackFormService from "@/services/feedbackFormService";
import feedbackQuestionService from "@/services/feedbackQuestionService";
import facultyService from "@/services/facultyService";
import subjectService from "@/services/subjectService";

// Import interfaces
import {
    FeedbackForm,
    FeedbackFormStatus,
    AddQuestionToFormInput,
} from "@/interfaces/feedbackForm";
import { UpdateFeedbackQuestionData } from "@/interfaces/feedbackQuestion";
import { Faculty } from "@/interfaces/faculty";
import { Subject } from "@/interfaces/subject";
import { QuestionCategory } from "@/interfaces/questionCategory";

interface EditFeedbackFormPageProps {
    params: Promise<{ formId: string }>;
}

export default function EditFeedbackFormPage({
    params,
}: EditFeedbackFormPageProps) {
    const router = useRouter();
    const { formId } = React.use(params);
    const [form, setForm] = useState<FeedbackForm | null>(null);
    const [editedForm, setEditedForm] = useState<FeedbackForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState<AddQuestionToFormInput>({
        text: "",
        type: "RATING",
        categoryId: "",
        facultyId: "",
        subjectId: "",
        displayOrder: 0,
    });

    // State for dropdown data
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [categories, setCategories] = useState<QuestionCategory[]>([]);
    const [loadingDropdowns, setLoadingDropdowns] = useState(true);

    const fetchForm = useCallback(async () => {
        try {
            const formData = await feedbackFormService.getFormById(formId);
            setForm(formData);
            setEditedForm(JSON.parse(JSON.stringify(formData)));
        } catch (error) {
            console.error("Failed to fetch form:", error);
            showToast.error("Failed to load feedback form");
            router.push("/feedback-forms");
        } finally {
            setLoading(false);
        }
    }, [formId, router]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [facultiesData, subjectsData, categoriesData] =
                await Promise.all([
                    facultyService.getAllFaculties(),
                    subjectService.getAllSubjects(),
                    feedbackQuestionService.getAllQuestionCategories(),
                ]);
            setFaculties(facultiesData);
            setSubjects(subjectsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch dropdown data:", error);
            showToast.error("Failed to load dropdown data");
        } finally {
            setLoadingDropdowns(false);
        }
    }, []);

    useEffect(() => {
        fetchForm();
        fetchDropdownData();
    }, [fetchForm, fetchDropdownData]);

    const handleFormUpdate = (field: keyof FeedbackForm, value: any) => {
        if (!editedForm) return;

        setEditedForm({
            ...editedForm,
            [field]: value,
        });
        setHasChanges(true);
    };

    const handleStatusUpdate = async () => {
        if (!editedForm) return;

        setSaving(true);
        try {
            const updatedForm = await feedbackFormService.updateFormStatus(
                formId,
                {
                    status: editedForm.status,
                    startDate: editedForm.startDate,
                    endDate: editedForm.endDate,
                }
            );

            setForm(updatedForm);
            setEditedForm(JSON.parse(JSON.stringify(updatedForm)));
            setHasChanges(false);
            showToast.success("Form status updated successfully");
        } catch (error) {
            console.error("Failed to update form status:", error);
            showToast.error("Failed to update form status");
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!editedForm || !newQuestion.text.trim()) {
            showToast.error("Please enter a question text");
            return;
        }

        setSaving(true);
        try {
            const questionData = {
                ...newQuestion,
                displayOrder: editedForm.questions.length + 1,
            };

            const updatedForm = await feedbackFormService.addQuestionToForm(
                formId,
                questionData
            );
            setForm(updatedForm);
            setEditedForm(JSON.parse(JSON.stringify(updatedForm)));

            setNewQuestion({
                text: "",
                type: "RATING",
                categoryId: "",
                facultyId: "",
                subjectId: "",
                displayOrder: 0,
            });
            setShowAddQuestion(false);
            showToast.success("Question added successfully");
        } catch (error) {
            console.error("Failed to add question:", error);
            showToast.error("Failed to add question");
        } finally {
            setSaving(false);
        }
    };

    const handleQuestionUpdate = async (
        questionId: string,
        updateData: UpdateFeedbackQuestionData
    ) => {
        if (!editedForm) return;

        try {
            // Update the question in the backend
            const updatedQuestion =
                await feedbackQuestionService.updateFeedbackQuestion(
                    questionId,
                    updateData
                );

            // Update the local state
            const updatedQuestions = editedForm.questions.map((q) =>
                q.id === questionId ? { ...q, ...updatedQuestion } : q
            );

            const updatedForm = { ...editedForm, questions: updatedQuestions };
            setEditedForm(updatedForm);
            setHasChanges(true);
        } catch (error) {
            console.error("Failed to update question:", error);
            showToast.error("Failed to update question");
        }
    };

    const handleQuestionDelete = async (questionId: string) => {
        if (!editedForm) return;

        if (!confirm("Are you sure you want to delete this question?")) {
            return;
        }

        try {
            await feedbackQuestionService.softDeleteFeedbackQuestion(
                questionId
            );

            // Update the local state
            const updatedQuestions = editedForm.questions.filter(
                (q) => q.id !== questionId
            );
            const updatedForm = { ...editedForm, questions: updatedQuestions };
            setEditedForm(updatedForm);
            setHasChanges(true);
            showToast.success("Question deleted successfully");
        } catch (error) {
            console.error("Failed to delete question:", error);
            showToast.error("Failed to delete question");
        }
    };

    const handleDiscardChanges = () => {
        if (!form) return;
        setEditedForm(JSON.parse(JSON.stringify(form)));
        setHasChanges(false);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "text-green-600 bg-green-50 border-green-200";
            case "draft":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "completed":
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
            month: "short",
            day: "numeric",
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

    if (!editedForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                        Feedback Form Not Found
                    </h1>
                    <Button
                        onClick={() => router.push("/feedback")}
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
                                    Edit Feedback Form
                                </h1>
                                <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                    {editedForm.title}
                                </p>
                            </div>
                        </div>

                        {hasChanges && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleDiscardChanges}
                                    className="flex items-center gap-2"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                    Discard Changes
                                </Button>
                                <Button
                                    onClick={handleStatusUpdate}
                                    disabled={saving}
                                    className="flex items-center gap-2"
                                >
                                    {saving ? (
                                        <Loader />
                                    ) : (
                                        <CheckIcon className="h-4 w-4" />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Form Settings */}
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                                    Form Settings
                                </h2>

                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Form Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editedForm.title}
                                            onChange={(e) =>
                                                handleFormUpdate(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter form title"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={editedForm.description || ""}
                                            onChange={(e) =>
                                                handleFormUpdate(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter form description"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Form Status
                                        </label>
                                        <select
                                            value={editedForm.status}
                                            onChange={(e) =>
                                                handleFormUpdate(
                                                    "status",
                                                    e.target
                                                        .value as FeedbackFormStatus
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                            aria-label="Form Status"
                                        >
                                            <option
                                                value={FeedbackFormStatus.DRAFT}
                                            >
                                                Draft
                                            </option>
                                            <option
                                                value={
                                                    FeedbackFormStatus.ACTIVE
                                                }
                                            >
                                                Active
                                            </option>
                                            <option
                                                value={
                                                    FeedbackFormStatus.COMPLETED
                                                }
                                            >
                                                Completed
                                            </option>
                                            <option
                                                value={
                                                    FeedbackFormStatus.ARCHIVED
                                                }
                                            >
                                                Archived
                                            </option>
                                        </select>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                Start Date
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={
                                                    editedForm.startDate
                                                        ? new Date(
                                                              editedForm.startDate
                                                          )
                                                              .toISOString()
                                                              .slice(0, 16)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleFormUpdate(
                                                        "startDate",
                                                        e.target.value
                                                            ? new Date(
                                                                  e.target.value
                                                              ).toISOString()
                                                            : undefined
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                aria-label="Start Date"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                End Date
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={
                                                    editedForm.endDate
                                                        ? new Date(
                                                              editedForm.endDate
                                                          )
                                                              .toISOString()
                                                              .slice(0, 16)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleFormUpdate(
                                                        "endDate",
                                                        e.target.value
                                                            ? new Date(
                                                                  e.target.value
                                                              ).toISOString()
                                                            : undefined
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                aria-label="End Date"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Questions */}
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                                        Questions (
                                        {editedForm.questions?.length || 0})
                                    </h2>
                                    <Button
                                        onClick={() => setShowAddQuestion(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Add Question
                                    </Button>
                                </div>

                                {/* Add Question Form */}
                                {showAddQuestion && (
                                    <div className="mb-6 p-4 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-muted-background dark:bg-dark-muted-background">
                                        <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
                                            Add New Question
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                    Question Text
                                                </label>
                                                <textarea
                                                    value={newQuestion.text}
                                                    onChange={(e) =>
                                                        setNewQuestion({
                                                            ...newQuestion,
                                                            text: e.target
                                                                .value,
                                                        })
                                                    }
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Enter your question..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                        Faculty
                                                    </label>
                                                    <select
                                                        value={
                                                            newQuestion.facultyId
                                                        }
                                                        onChange={(e) =>
                                                            setNewQuestion({
                                                                ...newQuestion,
                                                                facultyId:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        aria-label="Select Faculty for New Question"
                                                        disabled={
                                                            loadingDropdowns
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Faculty
                                                        </option>
                                                        {faculties.map(
                                                            (faculty) => (
                                                                <option
                                                                    key={
                                                                        faculty.id
                                                                    }
                                                                    value={
                                                                        faculty.id
                                                                    }
                                                                >
                                                                    {
                                                                        faculty.name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        faculty.abbreviation
                                                                    }
                                                                    )
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                        Subject
                                                    </label>
                                                    <select
                                                        value={
                                                            newQuestion.subjectId
                                                        }
                                                        onChange={(e) =>
                                                            setNewQuestion({
                                                                ...newQuestion,
                                                                subjectId:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        aria-label="Select Subject for New Question"
                                                        disabled={
                                                            loadingDropdowns
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Subject
                                                        </option>
                                                        {subjects.map(
                                                            (subject) => (
                                                                <option
                                                                    key={
                                                                        subject.id
                                                                    }
                                                                    value={
                                                                        subject.id
                                                                    }
                                                                >
                                                                    {
                                                                        subject.name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        subject.code
                                                                    }
                                                                    )
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={
                                                            newQuestion.categoryId
                                                        }
                                                        onChange={(e) =>
                                                            setNewQuestion({
                                                                ...newQuestion,
                                                                categoryId:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        aria-label="Select Category for New Question"
                                                        disabled={
                                                            loadingDropdowns
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Category
                                                        </option>
                                                        {categories.map(
                                                            (category) => (
                                                                <option
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                                        Question Type
                                                    </label>
                                                    <select
                                                        value={newQuestion.type}
                                                        onChange={(e) =>
                                                            setNewQuestion({
                                                                ...newQuestion,
                                                                type: e.target
                                                                    .value as any,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        aria-label="Select Question Type for New Question"
                                                    >
                                                        <option value="RATING">
                                                            Rating
                                                        </option>
                                                        <option value="TEXT">
                                                            Text
                                                        </option>
                                                        <option value="MULTIPLE_CHOICE">
                                                            Multiple Choice
                                                        </option>
                                                        <option value="BOOLEAN">
                                                            Yes/No
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            newQuestion.isRequired ||
                                                            false
                                                        }
                                                        onChange={(e) =>
                                                            setNewQuestion({
                                                                ...newQuestion,
                                                                isRequired:
                                                                    e.target
                                                                        .checked,
                                                            })
                                                        }
                                                        className="w-4 h-4 rounded border-light-secondary dark:border-dark-secondary text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-light-text dark:text-dark-text">
                                                        Required Response
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    onClick={handleAddQuestion}
                                                    disabled={
                                                        saving ||
                                                        !newQuestion.text.trim() ||
                                                        !newQuestion.facultyId ||
                                                        !newQuestion.subjectId ||
                                                        !newQuestion.categoryId
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    {saving ? (
                                                        <Loader />
                                                    ) : (
                                                        <CheckIcon className="h-4 w-4" />
                                                    )}
                                                    {saving
                                                        ? "Adding..."
                                                        : "Add Question"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setShowAddQuestion(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Questions List */}
                                {editedForm.questions &&
                                editedForm.questions.length > 0 ? (
                                    <div className="space-y-4">
                                        {editedForm.questions.map(
                                            (question, index) => (
                                                <Card
                                                    key={question.id}
                                                    className="p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="space-y-4">
                                                        {/* Question Header */}
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-2xl font-bold text-primary">
                                                                Q{index + 1}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    question.text
                                                                }
                                                                onChange={(e) =>
                                                                    handleQuestionUpdate(
                                                                        question.id,
                                                                        {
                                                                            text: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                    )
                                                                }
                                                                className="flex-1 text-lg font-medium p-2 border-b border-transparent hover:border-light-secondary dark:hover:border-dark-secondary focus:border-primary focus:outline-none bg-transparent"
                                                                placeholder="Enter question text"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleQuestionDelete(
                                                                        question.id
                                                                    )
                                                                }
                                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </Button>
                                                        </div>

                                                        {/* Question Details Grid */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {/* Faculty Dropdown */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-light-muted-text dark:text-dark-muted-text mb-1">
                                                                    Faculty
                                                                </label>
                                                                <select
                                                                    value={
                                                                        question.facultyId ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                facultyId:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-full p-2 rounded-lg border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                                    disabled={
                                                                        loadingDropdowns
                                                                    }
                                                                    aria-label="Select Faculty"
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Faculty
                                                                    </option>
                                                                    {faculties.map(
                                                                        (
                                                                            faculty
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    faculty.id
                                                                                }
                                                                                value={
                                                                                    faculty.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    faculty.name
                                                                                }{" "}
                                                                                (
                                                                                {
                                                                                    faculty.abbreviation
                                                                                }

                                                                                )
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Subject Dropdown */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-light-muted-text dark:text-dark-muted-text mb-1">
                                                                    Subject
                                                                </label>
                                                                <select
                                                                    value={
                                                                        question.subjectId ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                subjectId:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-full p-2 rounded-lg border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                                    disabled={
                                                                        loadingDropdowns
                                                                    }
                                                                    aria-label="Select Subject"
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Subject
                                                                    </option>
                                                                    {subjects.map(
                                                                        (
                                                                            subject
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    subject.id
                                                                                }
                                                                                value={
                                                                                    subject.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    subject.name
                                                                                }{" "}
                                                                                (
                                                                                {
                                                                                    subject.code
                                                                                }

                                                                                )
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Category Dropdown */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-light-muted-text dark:text-dark-muted-text mb-1">
                                                                    Category
                                                                </label>
                                                                <select
                                                                    value={
                                                                        question.categoryId ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                categoryId:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-full p-2 rounded-lg border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                                    disabled={
                                                                        loadingDropdowns
                                                                    }
                                                                    aria-label="Select Category"
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                        Category
                                                                    </option>
                                                                    {categories.map(
                                                                        (
                                                                            category
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={
                                                                                    category.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Batch Dropdown */}
                                                            <div>
                                                                <label className="block text-xs font-medium text-light-muted-text dark:text-dark-muted-text mb-1">
                                                                    Batch
                                                                </label>
                                                                <select
                                                                    value={
                                                                        question.batch ||
                                                                        "None"
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                batch:
                                                                                    e
                                                                                        .target
                                                                                        .value ===
                                                                                    "None"
                                                                                        ? undefined
                                                                                        : e
                                                                                              .target
                                                                                              .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-full p-2 rounded-lg border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                                    aria-label="Select Batch"
                                                                >
                                                                    <option value="None">
                                                                        No Batch
                                                                    </option>
                                                                    <option value="1">
                                                                        Batch 1
                                                                    </option>
                                                                    <option value="2">
                                                                        Batch 2
                                                                    </option>
                                                                    <option value="3">
                                                                        Batch 3
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Question Type and Required */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1 mr-4">
                                                                <label className="block text-xs font-medium text-light-muted-text dark:text-dark-muted-text mb-1">
                                                                    Question
                                                                    Type
                                                                </label>
                                                                <select
                                                                    value={
                                                                        question.type
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                type: e
                                                                                    .target
                                                                                    .value as any,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-full p-2 rounded-lg border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                                                    aria-label="Select Question Type"
                                                                >
                                                                    <option value="RATING">
                                                                        Rating
                                                                        Scale
                                                                    </option>
                                                                    <option value="TEXT">
                                                                        Text
                                                                        Response
                                                                    </option>
                                                                    <option value="MULTIPLE_CHOICE">
                                                                        Multiple
                                                                        Choice
                                                                    </option>
                                                                    <option value="BOOLEAN">
                                                                        Yes/No
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        question.isRequired ||
                                                                        false
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleQuestionUpdate(
                                                                            question.id,
                                                                            {
                                                                                isRequired:
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 rounded border-light-secondary dark:border-dark-secondary text-primary focus:ring-primary"
                                                                />
                                                                <span className="text-light-text dark:text-dark-text">
                                                                    Required
                                                                    Response
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-light-muted-text dark:text-dark-muted-text text-center py-8">
                                        No questions added yet. Click &quot;Add
                                        Question&quot; to get started.
                                    </p>
                                )}
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Override Students */}
                            <OverrideStudentsCard
                                formId={formId}
                                formStatus={editedForm.status}
                            />

                            {/* Current Status */}
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                    Current Status
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-light-muted-text dark:text-dark-muted-text">
                                            Status:
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                                                editedForm.status
                                            )}`}
                                        >
                                            {editedForm.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-light-muted-text dark:text-dark-muted-text">
                                            Start:
                                        </span>
                                        <span className="text-light-text dark:text-dark-text text-sm">
                                            {formatDate(editedForm.startDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-light-muted-text dark:text-dark-muted-text">
                                            End:
                                        </span>
                                        <span className="text-light-text dark:text-dark-text text-sm">
                                            {formatDate(editedForm.endDate)}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Academic Info */}
                            {(editedForm.department ||
                                editedForm.semester ||
                                editedForm.division) && (
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                                        Academic Information
                                    </h3>
                                    <div className="space-y-3">
                                        {editedForm.department && (
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Department
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    {editedForm.department.name}
                                                </p>
                                            </div>
                                        )}
                                        {editedForm.semester && (
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Semester
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    Semester{" "}
                                                    {
                                                        editedForm.semester
                                                            .semesterNumber
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {editedForm.division && (
                                            <div>
                                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                    Division
                                                </p>
                                                <p className="text-light-text dark:text-dark-text">
                                                    Division{" "}
                                                    {editedForm.division.name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
