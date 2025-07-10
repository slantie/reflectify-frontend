// src/components/feedback/FeedbackFormListItem.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    FileText,
    Eye,
    Edit,
    Trash2,
    Users,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FeedbackForm, FeedbackFormStatus } from "@/interfaces/feedbackForm";
import { OverrideStudentsList } from "./OverrideStudentsList";

// Status badge configuration
const getStatusConfig = (status: FeedbackFormStatus) => {
    switch (status) {
        case FeedbackFormStatus.DRAFT:
            return {
                variant: "secondary" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Draft",
            };
        case FeedbackFormStatus.ACTIVE:
            return {
                variant: "success" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Active",
            };
        case FeedbackFormStatus.CLOSED:
            return {
                variant: "info" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Closed",
            };
        case FeedbackFormStatus.ARCHIVED:
            return {
                variant: "destructive" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Archived",
            };
        default:
            return {
                variant: "secondary" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Unknown",
            };
    }
};

// Format date helper
const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

interface FeedbackFormListItemProps {
    form: FeedbackForm;
    index: number;
    onView: (formId: string) => void;
    onEdit: (formId: string) => void;
    onDelete: (formId: string) => void;
}

export const FeedbackFormListItem = ({
    form,
    index,
    onView,
    onEdit,
    onDelete,
}: FeedbackFormListItemProps) => {
    const statusConfig = getStatusConfig(form.status);
    const [showOverrideStudents, setShowOverrideStudents] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 hover:bg-light-muted-background dark:hover:bg-dark-background transition-colors border-b border-light-border dark:border-dark-border"
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-light-text dark:text-dark-text">
                            {form.title}
                        </h3>
                        <Badge
                            variant={statusConfig.variant}
                            className="flex flex-row items-center gap-1"
                        >
                            {/* {statusConfig.icon} */}
                            {statusConfig.label}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-light-muted-text dark:text-dark-muted-text">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Start: {formatDate(form.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>End: {formatDate(form.endDate)}</span>
                        </div>
                        {form.subjectAllocation!.departmentId && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>
                                    Department:{" "}
                                    {form.subjectAllocation!.departmentId! ||
                                        `Department ${
                                            form.subjectAllocation!.departmentId
                                        }`}
                                </span>
                            </div>
                        )}
                        {form.division && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>
                                    Division:{" "}
                                    {form.division.divisionName ||
                                        `Div ${form.division.divisionName}`}
                                </span>
                            </div>
                        )}
                        {form.questions && form.questions.length > 0 && (
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>
                                    {form.questions.length} question
                                    {form.questions.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                        {form.description && (
                            <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">
                                    {form.description}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowOverrideStudents((prev) => !prev)}
                        className="flex py-1 px-3 items-center gap-1 bg-transparent border rounded-xl border-primary-main
               text-primary-main dark:text-light-highlight transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed
               dark:border-dark-highlight hover:shadow-lg dark:hover:shadow-primary-dark/20"
                    >
                        <Users className="w-4 h-4" />
                        {showOverrideStudents ? (
                            <>
                                Hide Students
                                <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Students List
                                <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => onView(form.id.toString())}
                        className="flex py-1 px-3 items-center gap-1 bg-transparent border rounded-xl border-primary-main
               text-primary-main dark:text-light-highlight transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed
               dark:border-dark-highlight hover:shadow-lg dark:hover:shadow-primary-dark/20"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </button>

                    <button
                        onClick={() => onEdit(form.id.toString())}
                        className="flex py-1 px-3 items-center gap-1 bg-transparent border rounded-xl border-primary-main
               text-primary-main dark:text-light-highlight transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed
               dark:border-dark-highlight hover:shadow-lg dark:hover:shadow-primary-dark/20"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(form.id.toString())}
                        className="flex py-1 px-3 items-center gap-1 bg-transparent border rounded-xl border-red-600
               text-red-600 dark:text-red-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:border-red-500 hover:shadow-lg dark:hover:shadow-red-700/20"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showOverrideStudents && (
                    <OverrideStudentsList
                        formId={form.id.toString()}
                        isExpanded={showOverrideStudents}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};
