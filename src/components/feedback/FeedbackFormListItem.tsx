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
    BookOpen,
    School,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FeedbackForm, FeedbackFormStatus } from "@/interfaces/feedbackForm";
import { OverrideStudentsList } from "./OverrideStudentsList";

interface FeedbackFormListItemProps {
    form: FeedbackForm;
    index: number;
    onView: (formId: string) => void;
    onEdit: (formId: string) => void;
    onDelete: (formId: string) => void;
}

// Status badge configuration
const getStatusConfig = (status: FeedbackFormStatus) => {
    switch (status) {
        case FeedbackFormStatus.DRAFT:
            return {
                variant: "secondary" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Draft",
                color: "text-gray-600 dark:text-gray-400",
            };
        case FeedbackFormStatus.ACTIVE:
            return {
                variant: "default" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Active",
                color: "text-green-600 dark:text-green-400",
            };
        case FeedbackFormStatus.COMPLETED:
            return {
                variant: "outline" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Completed",
                color: "text-blue-600 dark:text-blue-400",
            };
        case FeedbackFormStatus.ARCHIVED:
            return {
                variant: "destructive" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Archived",
                color: "text-red-600 dark:text-red-400",
            };
        default:
            return {
                variant: "secondary" as const,
                icon: <FileText className="w-3 h-3" />,
                label: "Unknown",
                color: "text-gray-600 dark:text-gray-400",
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
                            className="flex items-center gap-1"
                        >
                            {statusConfig.icon}
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
                        {form.division && (
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>
                                    Division:{" "}
                                    {form.division.name ||
                                        `Div ${form.divisionId}`}
                                </span>
                            </div>
                        )}
                        {form.subject && (
                            <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{form.subject.name}</span>
                            </div>
                        )}
                        {form.faculty && (
                            <div className="flex items-center gap-1">
                                <School className="w-4 h-4" />
                                <span>{form.faculty.name}</span>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setShowOverrideStudents(!showOverrideStudents)
                        }
                        className="flex items-center gap-1"
                    >
                        <Users className="w-4 h-4" />
                        {showOverrideStudents ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Hide Students
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Override Students
                            </>
                        )}
                        <Users className="w-4 h-4" />
                        {showOverrideStudents ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Hide Students
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Override Students
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(form.id.toString())}
                        className="flex items-center gap-1"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(form.id.toString())}
                        className="flex items-center gap-1"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(form.id.toString())}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
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
