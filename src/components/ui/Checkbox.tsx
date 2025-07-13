/**
 * @file src/components/ui/Checkbox.tsx
 * @description Standalone checkbox component with indeterminate state and group support
 */

import React, { forwardRef } from "react";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Checkbox size variants
export type CheckboxSize = "sm" | "md" | "lg";

// Individual checkbox props
export interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
    /** Label text for the checkbox */
    label?: string;
    /** Description text below the label */
    description?: string;
    /** Size variant */
    size?: CheckboxSize;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
    /** Indeterminate state (partially checked) */
    indeterminate?: boolean;
    /** Custom label class */
    labelClassName?: string;
    /** Checkbox position relative to label */
    labelPosition?: "left" | "right";
}

// Checkbox group option
export interface CheckboxOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
}

// Checkbox group props
export interface CheckboxGroupProps {
    name: string;
    /** Options for the checkbox group */
    options: CheckboxOption[];
    /** Selected values */
    value?: string[];
    /** Default selected values */
    defaultValue?: string[];
    /** Change handler */
    onChange?: (values: string[]) => void;
    /** Group label */
    label?: string;
    /** Group description */
    description?: string;
    /** Size variant */
    size?: CheckboxSize;
    /** Error state */
    error?: boolean;
    /** Error message */
    errorMessage?: string;
    /** Layout direction */
    direction?: "vertical" | "horizontal";
    /** Custom class name */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
}

// Size variants
const sizeVariants: Record<
    CheckboxSize,
    { checkbox: string; label: string; description: string }
> = {
    sm: {
        checkbox: "h-4 w-4",
        label: "text-sm",
        description: "text-xs",
    },
    md: {
        checkbox: "h-5 w-5",
        label: "text-base",
        description: "text-sm",
    },
    lg: {
        checkbox: "h-6 w-6",
        label: "text-lg",
        description: "text-base",
    },
};

// Individual Checkbox Component
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            label,
            description,
            size = "md",
            error = false,
            errorMessage,
            indeterminate = false,
            labelClassName,
            labelPosition = "right",
            className,
            disabled,
            checked,
            ...props
        },
        ref
    ) => {
        const sizeClasses = sizeVariants[size];

        // Icon component for checked/indeterminate states
        const CheckboxIcon = () => {
            if (indeterminate) {
                return (
                    <MinusIcon
                        className={cn(
                            "text-white",
                            size === "sm"
                                ? "h-3 w-3"
                                : size === "md"
                                ? "h-4 w-4"
                                : "h-5 w-5"
                        )}
                    />
                );
            }
            if (checked) {
                return (
                    <CheckIcon
                        className={cn(
                            "text-white",
                            size === "sm"
                                ? "h-3 w-3"
                                : size === "md"
                                ? "h-4 w-4"
                                : "h-5 w-5"
                        )}
                    />
                );
            }
            return null;
        };

        const checkboxElement = (
            <div className="relative">
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    className={cn(
                        // Base styles
                        "peer sr-only",
                        className
                    )}
                    {...props}
                />
                <div
                    className={cn(
                        // Base checkbox appearance
                        "flex items-center justify-center rounded border-2 transition-all duration-200",
                        sizeClasses.checkbox,

                        // Default state
                        "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",

                        // Checked/indeterminate state
                        "peer-checked:border-primary-600 peer-checked:bg-primary-600",
                        "peer-indeterminate:border-primary-600 peer-indeterminate:bg-primary-600",

                        // Hover state
                        !disabled &&
                            "hover:border-primary-300 dark:hover:border-primary-400",

                        // Focus state
                        "peer-focus:ring-2 peer-focus:ring-primary-200 peer-focus:ring-offset-2 dark:peer-focus:ring-primary-800 dark:peer-focus:ring-offset-gray-900",

                        // Error state
                        error && "border-red-500 dark:border-red-400",

                        // Disabled state
                        disabled &&
                            "cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-700",

                        // Interactive states
                        !disabled && "cursor-pointer"
                    )}
                >
                    <CheckboxIcon />
                </div>
            </div>
        );

        const labelElement = label && (
            <div className="flex flex-col">
                <label
                    className={cn(
                        "cursor-pointer select-none",
                        sizeClasses.label,
                        "text-gray-900 dark:text-gray-100",
                        disabled && "cursor-not-allowed opacity-50",
                        error && "text-red-600 dark:text-red-400",
                        labelClassName
                    )}
                >
                    {label}
                </label>
                {description && (
                    <span
                        className={cn(
                            "mt-1",
                            sizeClasses.description,
                            "text-gray-600 dark:text-gray-400",
                            disabled && "opacity-50",
                            error && "text-red-500 dark:text-red-400"
                        )}
                    >
                        {description}
                    </span>
                )}
            </div>
        );

        const content =
            labelPosition === "left"
                ? [labelElement, checkboxElement]
                : [checkboxElement, labelElement];

        return (
            <div className="flex flex-col">
                <div
                    className={cn(
                        "flex items-start gap-3",
                        labelPosition === "left" && "flex-row-reverse"
                    )}
                >
                    {content[0]}
                    {content[1]}
                </div>

                {error && errorMessage && (
                    <p
                        className={cn(
                            "mt-2 flex items-center gap-1",
                            sizeClasses.description,
                            "text-red-600 dark:text-red-400"
                        )}
                    >
                        <span>{errorMessage}</span>
                    </p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

// Checkbox Group Component
export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
    options,
    value = [],
    defaultValue,
    onChange,
    label,
    description,
    size = "md",
    error = false,
    errorMessage,
    direction = "vertical",
    className,
    disabled = false,
}) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(
        defaultValue || value
    );

    const currentValue = value.length > 0 ? value : internalValue;

    const handleChange = (optionValue: string, checked: boolean) => {
        const newValue = checked
            ? [...currentValue, optionValue]
            : currentValue.filter((v) => v !== optionValue);

        setInternalValue(newValue);
        onChange?.(newValue);
    };

    const sizeClasses = sizeVariants[size];

    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <div>
                    <label
                        className={cn(
                            "block font-medium",
                            sizeClasses.label,
                            "text-gray-900 dark:text-gray-100",
                            error && "text-red-600 dark:text-red-400"
                        )}
                    >
                        {label}
                    </label>
                    {description && (
                        <p
                            className={cn(
                                "mt-1",
                                sizeClasses.description,
                                "text-gray-600 dark:text-gray-400",
                                error && "text-red-500 dark:text-red-400"
                            )}
                        >
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div
                className={cn(
                    "space-y-3",
                    direction === "horizontal" &&
                        "flex flex-wrap gap-4 space-y-0"
                )}
            >
                {options.map((option) => (
                    <Checkbox
                        key={option.value}
                        label={option.label}
                        description={option.description}
                        size={size}
                        checked={currentValue.includes(option.value)}
                        disabled={disabled || option.disabled}
                        onChange={(e) =>
                            handleChange(option.value, e.target.checked)
                        }
                    />
                ))}
            </div>

            {error && errorMessage && (
                <p
                    className={cn(
                        "flex items-center gap-1",
                        sizeClasses.description,
                        "text-red-600 dark:text-red-400"
                    )}
                >
                    <span>{errorMessage}</span>
                </p>
            )}
        </div>
    );
};

export default Checkbox;
