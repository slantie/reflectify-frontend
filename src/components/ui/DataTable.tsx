/**
 * @file src/components/ui/DataTable.tsx
 * @description Advanced, flexible data table component with sorting, filtering, pagination, and responsive design
 */

import React, { useState, useMemo } from "react";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Column definition interface
export interface DataTableColumn<T> {
    key: keyof T | string;
    header: string;
    accessor?: (item: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

// Sort configuration
export interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

// DataTable props
export interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    loading?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    showPagination?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
    onRowClick?: (item: T, index: number) => void;
    className?: string;
    rowClassName?: string | ((item: T, index: number) => string);
    headerClassName?: string;
    cellClassName?: string;
    stickyHeader?: boolean;
    maxHeight?: string;
}

// Generic DataTable component
export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    emptyMessage = "No data available",
    pageSize = 10,
    showPagination = true,
    showSearch = true,
    searchPlaceholder = "Search...",
    onRowClick,
    className = "",
    rowClassName = "",
    headerClassName = "",
    cellClassName = "",
    stickyHeader = false,
    maxHeight,
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Handle sorting
    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort data
    const processedData = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter((item) =>
                columns.some((column) => {
                    const value = column.accessor
                        ? column.accessor(item)
                        : item[column.key as keyof T];
                    return String(value)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                })
            );
        }

        // Apply sorting
        if (sortConfig) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue)
                    return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue)
                    return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig, columns]);

    // Pagination calculations
    const totalPages = Math.ceil(processedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = showPagination
        ? processedData.slice(startIndex, startIndex + pageSize)
        : processedData;

    // Get sort icon
    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "asc" ? (
            <ChevronUpIcon className="w-4 h-4" />
        ) : (
            <ChevronDownIcon className="w-4 h-4" />
        );
    };

    // Generate pagination buttons
    const getPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(i);
        }

        return buttons;
    };

    return (
        <div
            className={`bg-light-background dark:bg-dark-background rounded-lg border border-light-secondary dark:border-dark-secondary ${className}`}
        >
            {/* Search Bar */}
            {showSearch && (
                <div className="p-4 border-b border-light-secondary dark:border-dark-secondary">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-light-muted-background dark:bg-dark-muted-background 
                     text-light-text dark:text-dark-text border border-light-secondary dark:border-dark-secondary 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                    />
                </div>
            )}

            {/* Table Container */}
            <div className={`overflow-auto ${maxHeight ? "max-h-96" : ""}`}>
                <table className="w-full">
                    {/* Table Header */}
                    <thead
                        className={`bg-light-muted-background dark:bg-dark-muted-background ${
                            stickyHeader ? "sticky top-0 z-10" : ""
                        } ${headerClassName}`}
                    >
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={String(column.key) + index}
                                    className={`px-4 py-3 text-left text-sm font-medium text-light-muted-text dark:text-dark-muted-text 
                           border-b border-light-secondary dark:border-dark-secondary
                           ${
                               column.sortable
                                   ? "cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover"
                                   : ""
                           }
                           ${column.align === "center" ? "text-center" : ""}
                           ${column.align === "right" ? "text-right" : ""}
                           ${column.width ? `w-[${column.width}]` : ""}
                           ${column.className || ""}`}
                                    onClick={() =>
                                        column.sortable &&
                                        handleSort(String(column.key))
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {column.sortable &&
                                            getSortIcon(String(column.key))}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
                                        <span className="ml-2 text-light-muted-text dark:text-dark-muted-text">
                                            Loading...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-light-muted-text dark:text-dark-muted-text"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={`border-b border-light-secondary dark:border-dark-secondary 
                           hover:bg-light-hover dark:hover:bg-dark-hover transition-colors
                           ${onRowClick ? "cursor-pointer" : ""}
                           ${
                               typeof rowClassName === "function"
                                   ? rowClassName(item, rowIndex)
                                   : rowClassName
                           }`}
                                    onClick={() =>
                                        onRowClick && onRowClick(item, rowIndex)
                                    }
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={String(column.key) + colIndex}
                                            className={`px-4 py-3 text-sm text-light-text dark:text-dark-text
                               ${column.align === "center" ? "text-center" : ""}
                               ${column.align === "right" ? "text-right" : ""}
                               ${cellClassName}`}
                                        >
                                            {column.accessor
                                                ? column.accessor(item)
                                                : String(
                                                      item[
                                                          column.key as keyof T
                                                      ] || ""
                                                  )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-light-secondary dark:border-dark-secondary">
                    <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(startIndex + pageSize, processedData.length)}{" "}
                        of {processedData.length} results
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() =>
                                setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            title="Previous page"
                            className="px-3 py-1 text-sm border border-light-secondary dark:border-dark-secondary 
                       bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text
                       rounded hover:bg-light-hover dark:hover:bg-dark-hover 
                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>

                        {/* Page Numbers */}
                        {getPaginationButtons().map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-sm border rounded
                         ${
                             page === currentPage
                                 ? "bg-light-highlight dark:bg-dark-highlight text-white border-primary-main"
                                 : "border-light-secondary dark:border-dark-secondary bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
                         }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() =>
                                setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            title="Next page"
                            className="px-3 py-1 text-sm border border-light-secondary dark:border-dark-secondary 
                       bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text
                       rounded hover:bg-light-hover dark:hover:bg-dark-hover 
                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;
