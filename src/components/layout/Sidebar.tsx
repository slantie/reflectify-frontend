/**
 * @file src/components/layout/Sidebar.tsx
 * @description Responsive navigation sidebar with collapsible sections and dark/light mode support
 */

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Navigation item interface
export interface NavItem {
  id: string;
  label?: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  separator?: boolean;
}

// Sidebar props interface
export interface SidebarProps {
  items: NavItem[];
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  logo?: ReactNode;
  logoHref?: string;
  footer?: ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
}

// Individual navigation item component
interface NavItemComponentProps {
  item: NavItem;
  level?: number;
  isCollapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
}

// Navigation item component
const NavItemComponent: React.FC<NavItemComponentProps> = ({
  item,
  level = 0,
  isCollapsed = false,
  onItemClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;
  const isParentActive =
    hasChildren && item.children?.some((child) => child.href === pathname);

  // Handle item click
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    onItemClick?.(item);
  };

  // Render separator
  if (item.separator) {
    return (
      <div className="my-2 border-t border-light-secondary dark:border-dark-secondary" />
    );
  }

  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={`
            flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg
            transition-all duration-200 group
            ${
              isActive
                ? "bg-primary-lighter dark:bg-primary-darker text-primary-dark dark:text-primary-light"
                : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
            }
            ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${level > 0 ? `pl-[${1 + level * 0.75}rem]` : "pl-3"}
          `}
          onClick={() => onItemClick?.(item)}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span
                className={`
                w-5 h-5 flex-shrink-0
                ${
                  isActive
                    ? "text-light-highlight dark:text-dark-highlight"
                    : "text-light-muted-text dark:text-dark-muted-text"
                }
                ${isCollapsed ? "mx-auto" : ""}
              `}
              >
                {item.icon}
              </span>
            )}
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>

          {!isCollapsed && item.badge && (
            <span className="px-2 py-1 text-xs font-medium bg-light-highlight dark:bg-dark-highlight text-white rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          disabled={item.disabled}
          className={`
            flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg
            transition-all duration-200 group
            ${
              isParentActive
                ? "bg-primary-lighter dark:bg-primary-darker text-primary-dark dark:text-primary-light"
                : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
            }
            ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${level > 0 ? `pl-[${1 + level * 0.75}rem]` : "pl-3"}
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span
                className={`
                w-5 h-5 flex-shrink-0
                ${
                  isParentActive
                    ? "text-light-highlight dark:text-dark-highlight"
                    : "text-light-muted-text dark:text-dark-muted-text"
                }
                ${isCollapsed ? "mx-auto" : ""}
              `}
              >
                {item.icon}
              </span>
            )}
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="px-2 py-1 text-xs font-medium bg-light-highlight dark:bg-dark-highlight text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span className="w-4 h-4 transition-transform duration-200">
                  {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </span>
              )}
            </div>
          )}
        </button>
      )}

      {/* Render children if expanded */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              isCollapsed={isCollapsed}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Sidebar component
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpen = true,
  onToggle,
  logo,
  logoHref = "/",
  footer,
  className = "",
  width = "md",
  collapsible = false,
  defaultCollapsed = false,
  onItemClick,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Width classes
  const widthClasses = {
    sm: isCollapsed ? "w-16" : "w-48",
    md: isCollapsed ? "w-16" : "w-64",
    lg: isCollapsed ? "w-16" : "w-80",
  };

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle mobile toggle
  const handleMobileToggle = () => {
    onToggle?.(!isOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleMobileToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full
          bg-light-background dark:bg-dark-background
          border-r border-light-secondary dark:border-dark-secondary
          transition-all duration-300 ease-in-out
          ${widthClasses[width]}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:static lg:translate-x-0
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-secondary dark:border-dark-secondary">
          {/* Logo */}
          {logo && (
            <div className={`${isCollapsed ? "mx-auto" : ""}`}>
              {logoHref ? (
                <Link href={logoHref} className="flex items-center">
                  {logo}
                </Link>
              ) : (
                <div className="flex items-center">{logo}</div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Collapse toggle (desktop) */}
            {collapsible && (
              <button
                onClick={handleCollapseToggle}
                className="p-1 rounded-lg text-light-muted-text dark:text-dark-muted-text 
                         hover:bg-light-hover dark:hover:bg-dark-hover hidden lg:block"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}

            {/* Mobile close button */}
            <button
              onClick={handleMobileToggle}
              className="p-1 rounded-lg text-light-muted-text dark:text-dark-muted-text 
                       hover:bg-light-hover dark:hover:bg-dark-hover lg:hidden"
              title="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {items.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                onItemClick={onItemClick}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        {footer && !isCollapsed && (
          <div className="p-4 border-t border-light-secondary dark:border-dark-secondary">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
