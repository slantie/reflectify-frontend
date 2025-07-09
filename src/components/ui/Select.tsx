// src/components/ui/Select.tsx
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    id: string;
    name: string;
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
    label,
    id,
    name,
    children,
    ...props
}) => {
    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-light-text dark:text-dark-text"
                >
                    {label}
                </label>
            )}
            <select
                id={id}
                name={name}
                className="block w-full px-3 py-2 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-sm
                           bg-light-background dark:bg-dark-input-background text-light-text dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main
                           sm:text-sm transition-colors"
                {...props}
            >
                {children}
            </select>
        </div>
    );
};
