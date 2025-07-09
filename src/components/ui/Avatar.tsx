/**
 * @file src/components/ui/Avatar.tsx
 * @description Avatar component for displaying user profile images with fallbacks
 */

import React, { useState, ReactNode } from "react";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";

// Avatar sizes
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Avatar props interface
export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    fallback?: ReactNode;
    className?: string;
    onClick?: () => void;
    status?: "online" | "offline" | "busy" | "away";
    showStatus?: boolean;
    shape?: "circle" | "square";
}

// Avatar component
export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    name,
    size = "md",
    fallback,
    className = "",
    onClick,
    status,
    showStatus = false,
    shape = "circle",
}) => {
    const [imageError, setImageError] = useState(false);

    // Size configurations
    const sizeClasses = {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-xl",
        "2xl": "w-20 h-20 text-2xl",
    };

    // Status indicator sizes
    const statusSizes = {
        xs: "w-1.5 h-1.5",
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
        xl: "w-4 h-4",
        "2xl": "w-5 h-5",
    };

    // Status colors
    const statusColors = {
        online: "bg-positive-main",
        offline: "bg-light-muted-text dark:bg-dark-muted-text",
        busy: "bg-negative-main",
        away: "bg-warning-main",
    };

    // Shape classes
    const shapeClasses = {
        circle: "rounded-full",
        square: "rounded-lg",
    };

    // Generate initials from name
    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Render fallback content
    const renderFallback = () => {
        if (fallback) return fallback;
        if (name) return getInitials(name);
        return <UserIcon className="w-1/2 h-1/2" />;
    };

    return (
        <div
            className={`
                relative inline-flex items-center justify-center
                ${sizeClasses[size]}
                ${shapeClasses[shape]}
                ${onClick ? "cursor-pointer" : ""}
                ${className}
            `}
            onClick={onClick}
        >
            {/* Avatar Image or Fallback */}
            <div
                className={`
                    w-full h-full flex items-center justify-center
                    ${shapeClasses[shape]}
                    ${
                        src && !imageError
                            ? ""
                            : "bg-light-muted-background dark:bg-dark-muted-background text-light-muted-text dark:text-dark-muted-text font-medium"
                    }
                    overflow-hidden
                `}
            >
                {src && !imageError ? (
                    <Image
                        src={src}
                        alt={alt || name || "Avatar"}
                        fill
                        className={`object-cover ${shapeClasses[shape]}`}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    renderFallback()
                )}
            </div>

            {/* Status Indicator */}
            {showStatus && status && (
                <div
                    className={`
                        absolute bottom-0 right-0
                        ${statusSizes[size]}
                        ${statusColors[status]}
                        ${shapeClasses[shape]}
                        border-2 border-light-background dark:border-dark-background
                    `}
                    aria-label={`Status: ${status}`}
                />
            )}
        </div>
    );
};

// AvatarGroup component for displaying multiple avatars
export interface AvatarGroupProps {
    children: ReactNode;
    max?: number;
    size?: AvatarSize;
    className?: string;
    spacing?: "tight" | "normal" | "loose";
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
    children,
    max = 5,
    size = "md",
    className = "",
    spacing = "normal",
}) => {
    const avatars = React.Children.toArray(children);
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    // Spacing configurations
    const spacingClasses = {
        tight: "-space-x-1",
        normal: "-space-x-2",
        loose: "-space-x-1",
    };

    // Size configurations for the counter
    const sizeClasses = {
        xs: "w-6 h-6 text-xs",
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-xl",
        "2xl": "w-20 h-20 text-2xl",
    };

    return (
        <div
            className={`flex items-center ${spacingClasses[spacing]} ${className}`}
        >
            {visibleAvatars.map((avatar, index) => (
                <div key={index} className="relative">
                    <div className="border-2 border-light-background dark:border-dark-background relative z-10 rounded-full">
                        {avatar}
                    </div>
                </div>
            ))}

            {remainingCount > 0 && (
                <div
                    className={`
                        relative flex items-center justify-center
                        ${sizeClasses[size]}
                        rounded-full
                        bg-light-muted-background dark:bg-dark-muted-background
                        text-light-muted-text dark:text-dark-muted-text
                        border-2 border-light-background dark:border-dark-background
                        font-medium z-10
                    `}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};

export default Avatar;
