/**
 * @file src/components/ui/Breadcrumb.tsx
 * @description Breadcrumb navigation component for showing the current page location
 */

import React, { ReactNode } from "react";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

// Breadcrumb item interface
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

// Breadcrumb props interface
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  showHome?: boolean;
  onHomeClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Breadcrumb component
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRightIcon className="w-4 h-4" />,
  maxItems = 5,
  showHome = true,
  onHomeClick,
  className = "",
  size = "md",
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Process items to handle overflow
  const processedItems = [...items];

  if (processedItems.length > maxItems) {
    const keepStart = 1;
    const keepEnd = maxItems - keepStart - 1; // -1 for ellipsis
    processedItems.splice(
      keepStart,
      processedItems.length - keepStart - keepEnd,
    );
    processedItems.splice(keepStart, 0, { label: "...", href: undefined });
  }

  // Render breadcrumb item
  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isClickable = !isLast && (item.href || item.onClick);
    const isEllipsis = item.label === "...";

    return (
      <li key={index} className="flex items-center">
        {/* Separator (except for first item) */}
        {index > 0 && (
          <span className="mx-2 text-light-muted-text dark:text-dark-muted-text">
            {separator}
          </span>
        )}

        {/* Breadcrumb item */}
        {isClickable ? (
          <button
            type="button"
            onClick={item.onClick}
            className={`
                            flex items-center gap-1
                            text-light-muted-text dark:text-dark-muted-text
                            hover:text-light-text dark:hover:text-dark-text
                            focus:outline-none focus:underline
                            transition-colors duration-200
                            ${sizeClasses[size]}
                        `}
            aria-current={isLast ? "page" : undefined}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span className={isEllipsis ? "cursor-default" : ""}>
              {item.label}
            </span>
          </button>
        ) : (
          <span
            className={`
                            flex items-center gap-1
                            ${
                              isLast
                                ? "text-light-text dark:text-dark-text font-medium"
                                : "text-light-muted-text dark:text-dark-muted-text"
                            }
                            ${sizeClasses[size]}
                        `}
            aria-current={isLast ? "page" : undefined}
          >
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            <span>{item.label}</span>
          </span>
        )}
      </li>
    );
  };

  return (
    <nav aria-label="Breadcrumb" className={`${className}`}>
      <ol className="flex items-center flex-wrap">
        {/* Home link */}
        {showHome && (
          <li className="flex items-center">
            <button
              type="button"
              onClick={onHomeClick}
              className={`
                                flex items-center gap-1
                                text-light-muted-text dark:text-dark-muted-text
                                hover:text-light-text dark:hover:text-dark-text
                                focus:outline-none focus:underline
                                transition-colors duration-200
                                ${sizeClasses[size]}
                            `}
              aria-label="Go to home"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </button>
            {items.length > 0 && (
              <span className="mx-2 text-light-muted-text dark:text-dark-muted-text">
                {separator}
              </span>
            )}
          </li>
        )}

        {/* Breadcrumb items */}
        {processedItems.map((item, index) =>
          renderItem(item, index, index === processedItems.length - 1),
        )}
      </ol>
    </nav>
  );
};

// BreadcrumbItem component for more flexible usage
export interface BreadcrumbItemComponentProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
  className?: string;
}

export const BreadcrumbItemComponent: React.FC<
  BreadcrumbItemComponentProps
> = ({ children, href, onClick, current = false, className = "" }) => {
  const isClickable = !current && (href || onClick);

  return (
    <li className={`flex items-center ${className}`}>
      {isClickable ? (
        <button
          type="button"
          onClick={onClick}
          className="text-light-muted-text dark:text-dark-muted-text hover:text-light-text dark:hover:text-dark-text focus:outline-none focus:underline transition-colors duration-200"
          aria-current={current ? "page" : undefined}
        >
          {children}
        </button>
      ) : (
        <span
          className={`${
            current
              ? "text-light-text dark:text-dark-text font-medium"
              : "text-light-muted-text dark:text-dark-muted-text"
          }`}
          aria-current={current ? "page" : undefined}
        >
          {children}
        </span>
      )}
    </li>
  );
};

export default Breadcrumb;
