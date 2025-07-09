// src/components/feedback/FeedbackFormStats.tsx
"use client";

import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle,
    Clock,
    Archive,
    AlertCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { FeedbackForm, FeedbackFormStatus } from "@/interfaces/feedbackForm";

interface FeedbackFormStatsProps {
    forms: FeedbackForm[];
    onStatClick?: (status: FeedbackFormStatus) => void;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Status configuration for stats
const getStatusConfig = (status: FeedbackFormStatus) => {
    switch (status) {
        case FeedbackFormStatus.DRAFT:
            return {
                title: "Draft Forms",
                icon: FileText,
            };
        case FeedbackFormStatus.ACTIVE:
            return {
                title: "Active Forms",
                icon: CheckCircle,
            };
        case FeedbackFormStatus.COMPLETED:
            return {
                title: "Completed Forms",
                icon: Clock,
            };
        case FeedbackFormStatus.ARCHIVED:
            return {
                title: "Archived Forms",
                icon: Archive,
            };
        default:
            return {
                title: "Unknown Status",
                icon: AlertCircle,
            };
    }
};

export const FeedbackFormStats = ({
    forms,
    onStatClick = () => {},
}: FeedbackFormStatsProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
            {Object.values(FeedbackFormStatus).map((status) => {
                const count = forms.filter(
                    (form) => form.status === status
                ).length;
                const config = getStatusConfig(status);

                return (
                    <StatCard
                        key={status}
                        title={config.title}
                        value={count}
                        icon={config.icon}
                        onClick={() => onStatClick(status)}
                    />
                );
            })}
        </motion.div>
    );
};
