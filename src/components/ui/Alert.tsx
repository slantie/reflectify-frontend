/**
 * @file src/components/ui/Alert.tsx
 * @description Alert component for displaying important messages and notifications
 */

import React, { ReactNode } from "react";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Alert variant types
export type AlertVariant = "info" | "success" | "warning" | "error";

// Alert props interface
export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Alert component
export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = "",
  size = "md",
}) => {
  // Default icons for each variant
  const defaultIcons = {
    info: <InformationCircleIcon className="w-5 h-5" />,
    success: <CheckCircleIcon className="w-5 h-5" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5" />,
    error: <XCircleIcon className="w-5 h-5" />,
  };

  // Variant styles
  const variantStyles = {
    info: {
      container: "bg-info-lighter dark:bg-info-darker border-info-main",
      icon: "text-info-main",
      title: "text-info-dark dark:text-info-light",
      content: "text-info-dark dark:text-info-light",
    },
    success: {
      container:
        "bg-positive-lighter dark:bg-positive-darker border-positive-main",
      icon: "text-positive-main",
      title: "text-positive-dark dark:text-positive-light",
      content: "text-positive-dark dark:text-positive-light",
    },
    warning: {
      container:
        "bg-warning-lighter dark:bg-warning-darker border-warning-main",
      icon: "text-warning-main",
      title: "text-warning-dark dark:text-warning-light",
      content: "text-warning-dark dark:text-warning-light",
    },
    error: {
      container:
        "bg-negative-lighter dark:bg-negative-darker border-negative-main",
      icon: "text-negative-main",
      title: "text-negative-dark dark:text-negative-light",
      content: "text-negative-dark dark:text-negative-light",
    },
  };

  // Size styles
  const sizeStyles = {
    sm: {
      container: "p-3",
      icon: "w-4 h-4",
      title: "text-sm font-medium",
      content: "text-sm",
    },
    md: {
      container: "p-4",
      icon: "w-5 h-5",
      title: "text-base font-medium",
      content: "text-sm",
    },
    lg: {
      container: "p-5",
      icon: "w-6 h-6",
      title: "text-lg font-medium",
      content: "text-base",
    },
  };

  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];
  const displayIcon = icon || (showIcon ? defaultIcons[variant] : null);

  return (
    <div
      className={`
                relative rounded-lg border
                ${styles.container}
                ${sizes.container}
                ${className}
            `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        {/* Icon */}
        {displayIcon && (
          <div className={`flex-shrink-0`}>
            <span className={`${sizes.icon} ${styles.icon} block`}>
              {displayIcon}
            </span>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${displayIcon ? "ml-3" : ""}`}>
          {title && (
            <h3 className={`${sizes.title} ${styles.title} mb-1`}>{title}</h3>
          )}
          <div className={`${sizes.content} ${styles.content}`}>{children}</div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <div className="flex-shrink-0 ml-3">
            <button
              type="button"
              className={`
                                inline-flex rounded-md p-1.5
                                ${styles.icon}
                                hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10
                                focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2
                                transition-colors duration-200
                            `}
              onClick={onDismiss}
              aria-label="Dismiss alert"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// AlertTitle component (for more structured content)
export interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

export const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className = "",
}) => {
  return <h4 className={`font-medium mb-1 ${className}`}>{children}</h4>;
};

// AlertDescription component (for more structured content)
export interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = "",
}) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

export default Alert;
