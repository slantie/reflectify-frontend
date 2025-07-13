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
            // Use clsx for cleaner conditional class application
            className={clsx(
                "relative overflow-hidden transition-all duration-300 rounded-2xl",
                "bg-light-background dark:bg-dark-muted-background",
                "border border-light-secondary dark:border-dark-secondary",
                "flex flex-col justify-between", // Ensure content is spaced
                {
                    "cursor-pointer group hover:shadow-lg": isClickable, // Added 'group' here for hover effects
                    "hover:border-primary-main": isClickable, // Border color change on hover
                    "hover:bg-light-muted-background dark:hover:bg-dark-noisy-background":
                        isClickable, // Background change
                },
                className
            )}
            // Add accessibility attributes for clickable cards
            {...(isClickable && {
                role: "button",
                tabIndex: 0, // Make it focusable
                "aria-label": `View details for ${title}`,
            })}
        >
            {/* Animated left border for clickable cards */}
            {isClickable && (
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-main transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            )}

            <div className="p-3 flex justify-between items-start gap-4">
                {" "}
                {/* Increased padding slightly */}
                <div className="flex-grow">
                    {" "}
                    {/* Added flex-grow */}
                    <p className="text-sm font-semibold text-light-muted-text dark:text-dark-muted-text">
                        {" "}
                        {/* Made title text slightly smaller and bolder */}
                        {title}
                    </p>
                    <div className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-dark-text group-hover:text-primary-main transition-colors duration-300">
                        {" "}
                        {/* Larger, bolder value, with primary hover color */}
                        {error ? (
                            <div
                                className="flex items-center text-negative-main" // Using negative-main for error color
                                title={error} // Added title for hover info on error
                            >
                                <AlertCircle className="w-8 h-8 mr-2" />{" "}
                                {/* Larger error icon */}
                                <span className="text-lg">Error</span>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent text-primary-main"></div>{" "}
                                {/* Larger spinner, primary color */}
                            </div>
                        ) : typeof value === "number" ? (
                            <CountUp
                                end={value}
                                duration={2.5} // Slightly longer duration for smoother animation
                                separator=","
                                enableScrollSpy={true}
                                scrollSpyOnce={true}
                            />
                        ) : (
                            value
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-light-muted-text dark:text-dark-muted-text mt-1">
                            {" "}
                            {/* Added margin top for spacing */}
                            {subtitle}
                        </p>
                    )}
                </div>
                {/* Icon scaled up and slightly repositioned on hover */}
                <Icon className="h-20 w-20 text-primary-main/70 group-hover:text-primary-main transition-all duration-300 group-hover:scale-110 flex-shrink-0" />{" "}
                {/* Larger icon, subtle default color, primary on hover */}
            </div>
        </Card>
    );
};
