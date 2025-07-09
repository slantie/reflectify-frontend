// src/components/upload/FilePreviewTable.tsx
"use client";

import React from "react";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { TableData } from "@/interfaces/upload";

interface FilePreviewTableProps {
    activeTable: TableData | null;
}

export const FilePreviewTable: React.FC<FilePreviewTableProps> = ({
    activeTable,
}) => {
    if (!activeTable) {
        return (
            <div className="h-[600px] flex items-center justify-center bg-light-background dark:bg-dark-muted-background rounded-2xl border border-light-secondary dark:border-dark-secondary">
                <p className="text-light-muted-text dark:text-dark-muted-text text-lg">
                    Select a file and click preview to see the content
                </p>
            </div>
        );
    }

    const headers = Object.keys(activeTable.data[0] || {});

    return (
        <Card className="bg-light-background dark:bg-dark-muted-background shadow-sm border border-light-secondary dark:border-dark-secondary rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-light-secondary dark:border-dark-secondary">
                <div className="flex items-center gap-3">
                    <TableCellsIcon className="h-8 w-8 text-primary-main" />
                    <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text">
                        {activeTable.type} Preview
                    </h2>
                </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-light-secondary dark:scrollbar-thumb-dark-secondary scrollbar-track-transparent hover:scrollbar-thumb-light-tertiary dark:hover:scrollbar-thumb-dark-tertiary">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-light-secondary dark:divide-dark-secondary">
                        <thead className="bg-light-muted-background dark:bg-dark-noisy-background sticky top-0 z-10">
                            <tr>
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-4 text-left text-xs font-semibold text-light-muted-text dark:text-dark-muted-text uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-secondary dark:divide-dark-secondary">
                            {activeTable.data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                                >
                                    {headers.map((header, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text"
                                        >
                                            {row[header]?.toString() || ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    );
};
