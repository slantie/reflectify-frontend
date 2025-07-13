/**
 * @file src/components/ui/RadioGroup.tsx
 * @description Radio button group component with flexible layouts and styling
 */

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Radio size variants
export type RadioSize = "sm" | "md" | "lg";

// Radio option interface
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

// Individual radio button props
export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Label text for the radio */
  label?: string;
  /** Description text below the label */
  description?: string;
  /** Size variant */
  size?: RadioSize;
  /** Error state */
  error?: boolean;
  /** Radio value */
  value: string;
  /** Checked state */
  checked?: boolean;
  /** Custom label class */
  labelClassName?: string;
  /** Radio position relative to label */
  labelPosition?: "left" | "right";
}

// Radio group props
export interface RadioGroupProps {
  /** Name attribute for radio group */
  name: string;
  /** Options for the radio group */
  options: RadioOption[];
  /** Selected value */
  value?: string;
  /** Default selected value */
  defaultValue?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Size variant */
  size?: RadioSize;
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
  /** Required field */
  required?: boolean;
}

// Size variants
const sizeVariants: Record<
  RadioSize,
  { radio: string; label: string; description: string }
> = {
  sm: {
    radio: "h-4 w-4",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    radio: "h-5 w-5",
    label: "text-base",
    description: "text-sm",
  },
  lg: {
    radio: "h-6 w-6",
    label: "text-lg",
    description: "text-base",
  },
};

// Individual Radio Component
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      size = "md",
      error = false,
      value,
      checked,
      labelClassName,
      labelPosition = "right",
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = sizeVariants[size];

    const radioElement = (
      <div className="relative">
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={checked}
          disabled={disabled}
          className={cn(
            // Base styles
            "peer sr-only",
            className,
          )}
          {...props}
        />
        <div
          className={cn(
            // Base radio appearance
            "rounded-full border-2 transition-all duration-200 relative",
            sizeClasses.radio,

            // Default state
            "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800",

            // Checked state
            "peer-checked:border-primary-600 peer-checked:bg-white dark:peer-checked:bg-gray-800",

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
            !disabled && "cursor-pointer",
          )}
        >
          {/* Inner dot for checked state */}
          <div
            className={cn(
              "absolute inset-1 rounded-full transition-all duration-200",
              "bg-primary-600",
              checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
          />
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
            labelClassName,
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
              error && "text-red-500 dark:text-red-400",
            )}
          >
            {description}
          </span>
        )}
      </div>
    );

    const content =
      labelPosition === "left"
        ? [labelElement, radioElement]
        : [radioElement, labelElement];

    return (
      <div
        className={cn(
          "flex items-start gap-3",
          labelPosition === "left" && "flex-row-reverse",
        )}
      >
        {content[0]}
        {content[1]}
      </div>
    );
  },
);

Radio.displayName = "Radio";

// Radio Group Component
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
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
  required = false,
}) => {
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue || value || "",
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (optionValue: string) => {
    setInternalValue(optionValue);
    onChange?.(optionValue);
  };

  const sizeClasses = sizeVariants[size];

  return (
    <fieldset className={cn("space-y-3", className)}>
      {label && <legend className="sr-only">{label}</legend>}

      {label && (
        <div>
          <label
            className={cn(
              "block font-medium",
              sizeClasses.label,
              "text-gray-900 dark:text-gray-100",
              error && "text-red-600 dark:text-red-400",
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p
              className={cn(
                "mt-1",
                sizeClasses.description,
                "text-gray-600 dark:text-gray-400",
                error && "text-red-500 dark:text-red-400",
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
          direction === "horizontal" && "flex flex-wrap gap-4 space-y-0",
        )}
        role="radiogroup"
        aria-labelledby={label ? `${name}-label` : undefined}
        aria-describedby={description ? `${name}-description` : undefined}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            size={size}
            checked={currentValue === option.value}
            disabled={disabled || option.disabled}
            error={error}
            onChange={() => handleChange(option.value)}
          />
        ))}
      </div>

      {error && errorMessage && (
        <p
          className={cn(
            "flex items-center gap-1",
            sizeClasses.description,
            "text-red-600 dark:text-red-400",
          )}
          role="alert"
        >
          <span>{errorMessage}</span>
        </p>
      )}
    </fieldset>
  );
};

export default RadioGroup;
