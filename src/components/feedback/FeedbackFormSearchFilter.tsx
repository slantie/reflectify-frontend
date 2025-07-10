// src/components/feedback/FeedbackFormSearchFilter.tsx
"use client";

import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FeedbackFormStatus } from "@/interfaces/feedbackForm";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Select } from "../ui";

interface FeedbackFormSearchFilterProps {
    searchTerm: string;
    statusFilter: FeedbackFormStatus | "ALL";
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: FeedbackFormStatus | "ALL") => void;
}

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
                        leftIcon={
                            <MagnifyingGlassIcon className="w-5 h-5 text-light-muted-text dark:text-dark-muted-text" />
                        }
                        type="text"
                        placeholder="Search forms by title..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-light-muted-background dark:bg-dark-muted-background 
                     text-light-text dark:text-dark-text border border-light-secondary dark:border-dark-secondary 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-6 h-6 text-light-muted-text dark:text-dark-muted-text" />
                    <Select
                        id="status-select"
                        name="status-select"
                        value={statusFilter}
                        onChange={(e) =>
                            onStatusFilterChange(
                                e.target.value as FeedbackFormStatus | "ALL"
                            )
                        }
                    >
                        <option value="ALL">All Status</option>
                        <option value={FeedbackFormStatus.DRAFT}>Draft</option>
                        <option value={FeedbackFormStatus.ACTIVE}>
                            Active
                        </option>
                        <option value={FeedbackFormStatus.CLOSED}>
                            Closed
                        </option>
                    </Select>
                </div>
            </div>
        </motion.div>
    );
};
