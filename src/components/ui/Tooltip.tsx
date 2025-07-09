/**
 * @file src/components/ui/Tooltip.tsx
 * @description Tooltip component with flexible positioning and styling
 */

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// Tooltip placement options
export type TooltipPlacement =
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";

// Tooltip trigger options
export type TooltipTrigger = "hover" | "click" | "focus" | "manual";

// Tooltip props
export interface TooltipProps {
    /** Content to display in tooltip */
    content: React.ReactNode;
    /** Children that trigger the tooltip */
    children: React.ReactNode;
    /** Tooltip placement */
    placement?: TooltipPlacement;
    /** Trigger type */
    trigger?: TooltipTrigger;
    /** Show/hide tooltip (for manual control) */
    open?: boolean;
    /** Delay before showing tooltip (ms) */
    showDelay?: number;
    /** Delay before hiding tooltip (ms) */
    hideDelay?: number;
    /** Disable the tooltip */
    disabled?: boolean;
    /** Custom tooltip class */
    className?: string;
    /** Custom arrow class */
    arrowClassName?: string;
    /** Show arrow */
    showArrow?: boolean;
    /** Z-index for tooltip */
    zIndex?: number;
}

// Placement classes for positioning
const placementClasses: Record<
    TooltipPlacement,
    {
        tooltip: string;
        arrow: string;
        transform: string;
    }
> = {
    top: {
        tooltip: "bottom-full left-1/2 mb-2",
        arrow: "top-full left-1/2 border-l-transparent border-r-transparent border-b-transparent",
        transform: "-translate-x-1/2",
    },
    "top-start": {
        tooltip: "bottom-full left-0 mb-2",
        arrow: "top-full left-2 border-l-transparent border-r-transparent border-b-transparent",
        transform: "",
    },
    "top-end": {
        tooltip: "bottom-full right-0 mb-2",
        arrow: "top-full right-2 border-l-transparent border-r-transparent border-b-transparent",
        transform: "",
    },
    bottom: {
        tooltip: "top-full left-1/2 mt-2",
        arrow: "bottom-full left-1/2 border-l-transparent border-r-transparent border-t-transparent",
        transform: "-translate-x-1/2",
    },
    "bottom-start": {
        tooltip: "top-full left-0 mt-2",
        arrow: "bottom-full left-2 border-l-transparent border-r-transparent border-t-transparent",
        transform: "",
    },
    "bottom-end": {
        tooltip: "top-full right-0 mt-2",
        arrow: "bottom-full right-2 border-l-transparent border-r-transparent border-t-transparent",
        transform: "",
    },
    left: {
        tooltip: "right-full top-1/2 mr-2",
        arrow: "left-full top-1/2 border-t-transparent border-b-transparent border-r-transparent",
        transform: "-translate-y-1/2",
    },
    "left-start": {
        tooltip: "right-full top-0 mr-2",
        arrow: "left-full top-2 border-t-transparent border-b-transparent border-r-transparent",
        transform: "",
    },
    "left-end": {
        tooltip: "right-full bottom-0 mr-2",
        arrow: "left-full bottom-2 border-t-transparent border-b-transparent border-r-transparent",
        transform: "",
    },
    right: {
        tooltip: "left-full top-1/2 ml-2",
        arrow: "right-full top-1/2 border-t-transparent border-b-transparent border-l-transparent",
        transform: "-translate-y-1/2",
    },
    "right-start": {
        tooltip: "left-full top-0 ml-2",
        arrow: "right-full top-2 border-t-transparent border-b-transparent border-l-transparent",
        transform: "",
    },
    "right-end": {
        tooltip: "left-full bottom-0 ml-2",
        arrow: "right-full bottom-2 border-t-transparent border-b-transparent border-l-transparent",
        transform: "",
    },
};

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    placement = "top",
    trigger = "hover",
    open,
    showDelay = 200,
    hideDelay = 200,
    disabled = false,
    className,
    arrowClassName,
    showArrow = true,
    zIndex = 50,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isControlled = open !== undefined;
    const shouldShow = isControlled ? open : isVisible;

    const showTooltip = () => {
        if (disabled || isControlled) return;

        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        showTimeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, showDelay);
    };

    const hideTooltip = () => {
        if (disabled || isControlled) return;

        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
        }

        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, hideDelay);
    };

    const handleMouseEnter = () => {
        if (trigger === "hover") showTooltip();
    };

    const handleMouseLeave = () => {
        if (trigger === "hover") hideTooltip();
    };

    const handleClick = () => {
        if (trigger === "click") {
            if (shouldShow) {
                hideTooltip();
            } else {
                showTooltip();
            }
        }
    };

    const handleFocus = () => {
        if (trigger === "focus") showTooltip();
    };

    const handleBlur = () => {
        if (trigger === "focus") hideTooltip();
    };

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    const placementConfig = placementClasses[placement];

    const tooltipElement =
        shouldShow && !disabled ? (
            <div
                ref={tooltipRef}
                className={cn("absolute pointer-events-none", `z-[${zIndex}]`)}
            >
                <div
                    className={cn(
                        // Base tooltip styles
                        "px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg",
                        "dark:bg-gray-700 dark:text-white",
                        "max-w-xs break-words",

                        // Placement styles
                        placementConfig.tooltip,
                        placementConfig.transform,

                        // Custom className
                        className
                    )}
                >
                    {content}

                    {/* Arrow */}
                    {showArrow && (
                        <div
                            className={cn(
                                "absolute w-0 h-0 border-4 border-gray-900 dark:border-gray-700",
                                placementConfig.arrow,
                                placementConfig.transform,
                                arrowClassName
                            )}
                        />
                    )}
                </div>
            </div>
        ) : null;

    return (
        <div
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="relative inline-block"
        >
            {children}
            {tooltipElement}
        </div>
    );
};

export default Tooltip;
