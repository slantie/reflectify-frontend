// src/components/feedback/FeedbackFormList.tsx
"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { FeedbackForm } from "@/interfaces/feedbackForm";
import { FeedbackFormListItem } from "@/components/feedback/FeedbackFormListItem";

interface FeedbackFormListProps {
    forms: FeedbackForm[];
    totalForms: number;
    onView: (formId: string) => void;
    onEdit: (formId: string) => void;
    onDelete: (formId: string) => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const FeedbackFormList = ({
    forms,
    totalForms,
    onView,
    onEdit,
    onDelete,
}: FeedbackFormListProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-light-background dark:bg-dark-muted-background rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary overflow-hidden"
        >
            <div className="p-4 border-b border-light-secondary dark:border-dark-secondary">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                        Forms ({forms.length})
                    </h2>
                    <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                        Total: {totalForms} forms
                    </div>
                </div>
            </div>

            {forms.length === 0 ? (
                <div className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-light-muted-text dark:text-dark-muted-text mb-4" />
                    <p className="text-light-muted-text dark:text-dark-muted-text">
                        {totalForms === 0
                            ? "No feedback forms found. Create your first form to get started."
                            : "No forms match your current filters."}
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-light-secondary dark:divide-dark-secondary">
                    {forms.map((form, index) => (
                        <FeedbackFormListItem
                            key={form.id}
                            form={form}
                            index={index}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};
