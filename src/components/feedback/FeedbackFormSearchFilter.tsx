// src/components/feedback/FeedbackFormSearchFilter.tsx
"use client";

import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FeedbackFormStatus } from "@/interfaces/feedbackForm";

interface FeedbackFormSearchFilterProps {
    searchTerm: string;
    statusFilter: FeedbackFormStatus | "ALL";
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: FeedbackFormStatus | "ALL") => void;
}

// Status configuration for display
const getStatusConfig = (status: FeedbackFormStatus) => {
    switch (status) {
        case FeedbackFormStatus.DRAFT:
            return { label: "Draft" };
        case FeedbackFormStatus.ACTIVE:
            return { label: "Active" };
        case FeedbackFormStatus.COMPLETED:
            return { label: "Completed" };
        case FeedbackFormStatus.ARCHIVED:
            return { label: "Archived" };
        default:
            return { label: "Unknown" };
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const FeedbackFormSearchFilter = ({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
}: FeedbackFormSearchFilterProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-light-background dark:bg-dark-muted-background p-4 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-muted-text dark:text-dark-muted-text w-4 h-4" />
                    <Input
                        placeholder="Search forms by title..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-light-muted-text dark:text-dark-muted-text" />
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            onStatusFilterChange(
                                e.target.value as FeedbackFormStatus | "ALL"
                            )
                        }
                        className="px-3 py-2 rounded-md border border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                        title="Filter forms by status"
                        aria-label="Filter forms by status"
                    >
                        <option value="ALL">All Status</option>
                        {Object.values(FeedbackFormStatus).map((status) => (
                            <option key={status} value={status}>
                                {getStatusConfig(status).label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>
    );
};
