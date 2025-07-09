// src/components/dashboard/StatCard.tsx
import { Card } from "@/components/ui/Card"; // Assuming "@/components/ui" maps to src/components/ui
import React from "react";
import CountUp from "react-countup";
import { AlertCircle } from "lucide-react";

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
            className={`relative overflow-hidden ${
                isClickable ? "cursor-pointer" : ""
            } bg-light-background dark:bg-dark-muted-background ${
                isClickable
                    ? "hover:bg-light-muted-background dark:hover:bg-dark-noisy-background hover:shadow-lg"
                    : ""
            } border border-light-secondary dark:border-dark-secondary transition-all duration-300 rounded-2xl group ${className}`}
        >
            {isClickable && (
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-main transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            )}
            <div className="p-4 flex justify-between items-center">
                <div className="space-y-1">
                    <p className="text-base font-medium text-light-muted-text dark:text-dark-muted-text">
                        {title}
                    </p>
                    <div className="text-4xl font-bold text-light-text dark:text-dark-text group-hover:text-primary-main transition-colors">
                        {error ? (
                            <div className="flex items-center text-red-500">
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
                <Icon className="h-14 w-14 text-primary-main transition-colors" />
            </div>
        </Card>
    );
};
