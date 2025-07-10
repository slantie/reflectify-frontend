// src/components/dashboard/StatCard.tsx
import { Card } from "@/components/ui/Card"; // Assuming "@/components/ui" maps to src/components/ui
import React from "react";
import CountUp from "react-countup";
import { AlertCircle } from "lucide-react";
import clsx from "clsx"; // Import clsx for cleaner class management

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    isLoading?: boolean;
    error?: string | null;
    subtitle?: string;
    className?: string;
}

export const StatCard = ({
    title,
    value,
    icon: Icon,
    onClick,
    isLoading = false,
    error = null,
    subtitle,
    className = "",
}: StatCardProps) => {
    const isClickable = !!onClick;

    return (
        <Card
            onClick={onClick}
            className={clsx(
                "relative overflow-hidden transition-all duration-300 rounded-2xl group",
                "bg-light-background dark:bg-dark-muted-background",
                "border border-light-secondary dark:border-dark-secondary",
                {
                    "cursor-pointer": isClickable,
                    "hover:bg-light-muted-background dark:hover:bg-dark-noisy-background hover:shadow-lg":
                        isClickable,
                },
                className
            )}
        >
            {isClickable && (
                <div className="absolute top-0 left-0 w-2 h-full bg-light-highlight dark:bg-dark-highlight transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            )}
            <div className="p-4 flex justify-between items-center">
                <div className="space-y-1">
                    <p className="text-base font-medium text-light-muted-text dark:text-dark-muted-text">
                        {title}
                    </p>
                    <div className="text-4xl font-bold group-hover:text-light-highlight dark:text-dark-highlight transition-colors">
                        {error ? (
                            <div
                                className="flex items-center text-red-500"
                                title={error}
                            >
                                {" "}
                                {/* Added title for hover info */}
                                <AlertCircle className="w-6 h-6 mr-2" />
                                <span className="text-sm">Error</span>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
                            </div>
                        ) : typeof value === "number" ? (
                            <CountUp
                                end={value}
                                duration={2}
                                separator=","
                                enableScrollSpy={true}
                                scrollSpyOnce={true}
                            />
                        ) : (
                            value
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-light-muted-text dark:text-dark-muted-text">
                            {subtitle}
                        </p>
                    )}
                </div>
                {/* Icon to be scaled up when the card is hovered */}
                <Icon className="h-14 w-14 text-light-highlight dark:text-dark-highlight transition-all duration-300 group-hover:scale-110" />
            </div>
        </Card>
    );
};
