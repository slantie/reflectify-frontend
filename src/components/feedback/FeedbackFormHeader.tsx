// src/components/feedback/FeedbackFormHeader.tsx
"use client";

import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FeedbackFormHeaderProps {
    isRefreshing: boolean;
    onRefresh: () => void;
    onCreateNew: () => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const FeedbackFormHeader = ({
    isRefreshing,
    onRefresh,
    onCreateNew,
}: FeedbackFormHeaderProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-light-background dark:bg-dark-muted-background p-6 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
                        Feedback Forms
                    </h1>
                    <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                        Manage and monitor feedback forms across departments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onRefresh}
                        variant="outline"
                        size="sm"
                        disabled={isRefreshing}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${
                                isRefreshing ? "animate-spin" : ""
                            }`}
                        />
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </Button>
                    <Button
                        onClick={onCreateNew}
                        className="bg-primary hover:bg-primary-darker text-white flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Form
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
