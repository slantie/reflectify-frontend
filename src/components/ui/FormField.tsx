/**
 * @file src/components/ui/FormField.tsx
 * @description Flexible, reusable form field wrapper with validation, labels, and error handling
 */

import React, { forwardRef, ReactNode } from "react";
import {
    ExclamationCircleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Form field types
export type FormFieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "datetime-local"
    | "time";

// Validation rules interface
export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
}

// Option interface for select and radio
export interface FormFieldOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

// Base FormField props
export interface FormFieldProps {
    type?: FormFieldType;
    name: string;
    label?: string;
    value?: any;
    defaultValue?: any;
    placeholder?: string;
    helperText?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    validation?: ValidationRule;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    helperClassName?: string;

    // Select/Radio specific
    options?: FormFieldOption[];
    multiple?: boolean;

    // Textarea specific
    rows?: number;

    // File specific
    accept?: string;

    // Custom elements
    prefix?: ReactNode;
    suffix?: ReactNode;

    // Event handlers
    onChange?: (value: any, event?: React.ChangeEvent<any>) => void;
    onBlur?: (event: React.FocusEvent<any>) => void;
    onFocus?: (event: React.FocusEvent<any>) => void;

    // HTML attributes pass-through
    [key: string]: any;
}

// FormField component with forwardRef for form libraries
export const FormField = forwardRef<any, FormFieldProps>(
    (
        {
            type = "text",
            name,
            label,
            value,
            defaultValue,
            placeholder,
            helperText,
            error,
            disabled = false,
            required = false,
            readonly = false,
            _validation,
            className = "",
            inputClassName = "",
            labelClassName = "",
            errorClassName = "",
            helperClassName = "",
            options = [],
            multiple = false,
            rows = 3,
            accept,
            prefix,
            suffix,
            onChange,
            onBlur,
            onFocus,
            ...rest
        },
        ref
    ) => {
        // Handle value changes
        const handleChange = (event: React.ChangeEvent<any>) => {
            const newValue =
                type === "checkbox"
                    ? event.target.checked
                    : type === "file"
                    ? event.target.files
                    : event.target.value;

            onChange?.(newValue, event);
        };

        // Base input classes
        const baseInputClasses = `
    w-full px-3 py-2 
    bg-light-background dark:bg-dark-background
    text-light-text dark:text-dark-text
    border border-light-secondary dark:border-dark-secondary
    rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main
    disabled:opacity-50 disabled:cursor-not-allowed
    readonly:bg-light-muted-background readonly:dark:bg-dark-muted-background
    transition-colors duration-200
    ${
        error
            ? "border-negative-main focus:ring-negative-main focus:border-negative-main"
            : ""
    }
    ${inputClassName}
  `
            .trim()
            .replace(/\s+/g, " ");

        // Render input based on type
        const renderInput = () => {
            switch (type) {
                case "textarea":
                    return (
                        <textarea
                            ref={ref}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            readOnly={readonly}
                            rows={rows}
                            className={baseInputClasses}
                            onChange={handleChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            {...rest}
                        />
                    );

                case "select":
                    return (
                        <select
                            ref={ref}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            required={required}
                            multiple={multiple}
                            className={baseInputClasses}
                            onChange={handleChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            {...rest}
                        >
                            {placeholder && !multiple && (
                                <option value="" disabled>
                                    {placeholder}
                                </option>
                            )}
                            {options.map((option: FormFieldOption) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    );

                case "checkbox":
                    return (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                ref={ref}
                                type="checkbox"
                                name={name}
                                checked={value}
                                disabled={disabled}
                                required={required}
                                readOnly={readonly}
                                className={`
                w-4 h-4 text-primary-main 
                bg-light-background dark:bg-dark-background
                border border-light-secondary dark:border-dark-secondary
                rounded focus:ring-2 focus:ring-primary-main
                disabled:opacity-50 disabled:cursor-not-allowed
                ${inputClassName}
              `}
                                onChange={handleChange}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                {...rest}
                            />
                            {label && (
                                <span
                                    className={`text-sm text-light-text dark:text-dark-text ${labelClassName}`}
                                >
                                    {label}
                                    {required && (
                                        <span className="text-negative-main ml-1">
                                            *
                                        </span>
                                    )}
                                </span>
                            )}
                        </label>
                    );

                case "radio":
                    return (
                        <div className="space-y-2">
                            {options.map((option: FormFieldOption) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        ref={ref}
                                        type="radio"
                                        name={name}
                                        value={option.value}
                                        checked={value === option.value}
                                        disabled={disabled || option.disabled}
                                        required={required}
                                        readOnly={readonly}
                                        className={`
                    w-4 h-4 text-primary-main 
                    bg-light-background dark:bg-dark-background
                    border border-light-secondary dark:border-dark-secondary
                    focus:ring-2 focus:ring-primary-main
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${inputClassName}
                  `}
                                        onChange={handleChange}
                                        onBlur={onBlur}
                                        onFocus={onFocus}
                                        {...rest}
                                    />
                                    <span className="text-sm text-light-text dark:text-dark-text">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    );

                case "file":
                    return (
                        <input
                            ref={ref}
                            type="file"
                            name={name}
                            disabled={disabled}
                            required={required}
                            accept={accept}
                            multiple={multiple}
                            className={`
              w-full px-3 py-2
              bg-light-background dark:bg-dark-background
              text-light-text dark:text-dark-text
              border border-light-secondary dark:border-dark-secondary
              rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main
              disabled:opacity-50 disabled:cursor-not-allowed
              file:mr-4 file:py-1 file:px-3
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-primary-lighter file:text-primary-dark
              hover:file:bg-primary-light
              ${inputClassName}
            `}
                            onChange={handleChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            {...rest}
                        />
                    );

                default:
                    return (
                        <div className="relative">
                            {prefix && (
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-light-muted-text dark:text-dark-muted-text text-sm">
                                        {prefix}
                                    </span>
                                </div>
                            )}

                            <input
                                ref={ref}
                                type={type}
                                name={name}
                                value={value}
                                defaultValue={defaultValue}
                                placeholder={placeholder}
                                disabled={disabled}
                                required={required}
                                readOnly={readonly}
                                className={`
                ${baseInputClasses}
                ${prefix ? "pl-10" : ""}
                ${suffix ? "pr-10" : ""}
              `}
                                onChange={handleChange}
                                onBlur={onBlur}
                                onFocus={onFocus}
                                {...rest}
                            />

                            {suffix && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-light-muted-text dark:text-dark-muted-text text-sm">
                                        {suffix}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
            }
        };

        // Don't render label wrapper for checkbox as it handles its own label
        if (type === "checkbox") {
            return (
                <div className={`space-y-1 ${className}`}>
                    {renderInput()}
                    {helperText && (
                        <div
                            className={`flex items-center gap-1 text-xs text-light-muted-text dark:text-dark-muted-text ${helperClassName}`}
                        >
                            <InformationCircleIcon className="w-3 h-3" />
                            {helperText}
                        </div>
                    )}
                    {error && (
                        <div
                            className={`flex items-center gap-1 text-xs text-negative-main ${errorClassName}`}
                        >
                            <ExclamationCircleIcon className="w-3 h-3" />
                            {error}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className={`space-y-1 ${className}`}>
                {/* Label */}
                {label && type !== "radio" && (
                    <label
                        htmlFor={name}
                        className={`block text-sm font-medium text-light-text dark:text-dark-text ${labelClassName}`}
                    >
                        {label}
                        {required && (
                            <span className="text-negative-main ml-1">*</span>
                        )}
                    </label>
                )}

                {/* Radio group label */}
                {label && type === "radio" && (
                    <div
                        className={`text-sm font-medium text-light-text dark:text-dark-text ${labelClassName}`}
                    >
                        {label}
                        {required && (
                            <span className="text-negative-main ml-1">*</span>
                        )}
                    </div>
                )}

                {/* Input */}
                {renderInput()}

                {/* Helper Text */}
                {helperText && (
                    <div
                        className={`flex items-center gap-1 text-xs text-light-muted-text dark:text-dark-muted-text ${helperClassName}`}
                    >
                        <InformationCircleIcon className="w-3 h-3" />
                        {helperText}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div
                        className={`flex items-center gap-1 text-xs text-negative-main ${errorClassName}`}
                    >
                        <ExclamationCircleIcon className="w-3 h-3" />
                        {error}
                    </div>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

export default FormField;
