/**
 * @file src/components/ui/EmptyState.tsx
 * @description Flexible empty state component for displaying when no data is available
 */

import React, { ReactNode } from "react";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Button } from "./Button";

// Empty state types
export type EmptyStateType =
  | "no-data"
  | "search"
  | "error"
  | "empty-list"
  | "no-results"
  | "custom";

// Action button interface
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link"
    | "gradient";
  disabled?: boolean;
}

// EmptyState props interface
export interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ReactNode;
  illustration?: ReactNode;
  actions?: EmptyStateAction[];
  className?: string;
  size?: "sm" | "md" | "lg";
  showDefaultIcon?: boolean;
}

// Default icons for each type
const getDefaultIcon = (type: EmptyStateType): ReactNode => {
  const iconClass = "w-16 h-16 text-light-muted-text dark:text-dark-muted-text";

  switch (type) {
    case "no-data":
      return <DocumentIcon className={iconClass} />;
    case "search":
    case "no-results":
      return <MagnifyingGlassIcon className={iconClass} />;
    case "error":
      return (
        <ExclamationTriangleIcon
          className={`${iconClass} text-negative-main`}
        />
      );
    case "empty-list":
      return <InboxIcon className={iconClass} />;
    default:
      return <UserGroupIcon className={iconClass} />;
  }
};

// Default messages for each type
const getDefaultMessages = (type: EmptyStateType) => {
  switch (type) {
    case "no-data":
      return {
        title: "No data available",
        description:
          "There is no data to display at the moment. Try refreshing the page or check back later.",
      };
    case "search":
      return {
        title: "Start searching",
        description:
          "Enter a search term above to find what you're looking for.",
      };
    case "no-results":
      return {
        title: "No results found",
        description:
          "We couldn't find anything matching your search. Try adjusting your search terms or filters.",
      };
    case "error":
      return {
        title: "Something went wrong",
        description:
          "An error occurred while loading the data. Please try again or contact support if the problem persists.",
      };
    case "empty-list":
      return {
        title: "Nothing here yet",
        description: "This list is empty. Add some items to get started.",
      };
    default:
      return {
        title: "No content",
        description: "There's nothing to show here right now.",
      };
  }
};

// EmptyState component
export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "no-data",
  title,
  description,
  icon,
  illustration,
  actions = [],
  className = "",
  size = "md",
  showDefaultIcon = true,
}) => {
  const defaultMessages = getDefaultMessages(type);
  const displayTitle = title || defaultMessages.title;
  const displayDescription = description || defaultMessages.description;
  const displayIcon = icon || (showDefaultIcon ? getDefaultIcon(type) : null);

  // Size classes
  const sizeClasses = {
    sm: {
      container: "py-8 px-4",
      content: "max-w-sm",
      title: "text-lg",
      description: "text-sm",
      spacing: "space-y-3",
      actionSpacing: "space-y-2 space-x-0 sm:space-y-0 sm:space-x-3",
    },
    md: {
      container: "py-12 px-6",
      content: "max-w-md",
      title: "text-xl",
      description: "text-base",
      spacing: "space-y-4",
      actionSpacing: "space-y-2 space-x-0 sm:space-y-0 sm:space-x-3",
    },
    lg: {
      container: "py-16 px-8",
      content: "max-w-lg",
      title: "text-2xl",
      description: "text-lg",
      spacing: "space-y-6",
      actionSpacing: "space-y-3 space-x-0 sm:space-y-0 sm:space-x-4",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${currentSize.container}
        ${className}
      `}
    >
      <div className={`${currentSize.content} ${currentSize.spacing}`}>
        {/* Illustration or Icon */}
        {illustration && (
          <div className="flex justify-center mb-4">{illustration}</div>
        )}

        {!illustration && displayIcon && (
          <div className="flex justify-center mb-4">{displayIcon}</div>
        )}

        {/* Title */}
        <h3
          className={`
          font-semibold text-light-text dark:text-dark-text
          ${currentSize.title}
        `}
        >
          {displayTitle}
        </h3>

        {/* Description */}
        {displayDescription && (
          <p
            className={`
            text-light-muted-text dark:text-dark-muted-text
            ${currentSize.description}
          `}
          >
            {displayDescription}
          </p>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div
            className={`
            flex flex-col sm:flex-row items-center justify-center
            ${currentSize.actionSpacing}
          `}
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "default"}
                disabled={action.disabled}
                className="w-full sm:w-auto"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Preset empty state components for common use cases
export const NoDataEmptyState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no-data" {...props} />;

export const SearchEmptyState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="search" {...props} />;

export const NoResultsEmptyState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="no-results" {...props} />;

export const ErrorEmptyState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="error" {...props} />;

export const EmptyListState: React.FC<Omit<EmptyStateProps, "type">> = (
  props,
) => <EmptyState type="empty-list" {...props} />;

export default EmptyState;
