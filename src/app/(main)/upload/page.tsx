// src/app/(main)/upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FILE_ROUTES } from "@/constants/fileUploadRoutes";
import { useFileUpload } from "@/hooks/upload/useFileUpload";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { DataTable } from "@/components/ui/DataTable";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "lucide-react";

export default function UploadPage() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const {
        files,
        loadingStates,
        activeTable,
        handleFileChange,
        handleClearFile,
        handlePreview,
        handleSubmitUpload,
    } = useFileUpload();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    // For debugging pagination - create extended test data when there's little data
    const getTableDataForDisplay = () => {
        if (!activeTable) return null;

        // If there's less than 30 rows, duplicate some rows for pagination testing
        const displayData = [...activeTable.data];

        return {
            ...activeTable,
            data: displayData,
        };
    };

    const displayTable = getTableDataForDisplay();

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full transition-colors text-light-muted-text dark:text-dark-muted-text hover:bg-light-hover dark:hover:bg-dark-hover"
                            title="Go back"
                            aria-label="Go back"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
                            Data Upload Center
                        </h1>
                    </div>

                    {/* Upload Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {Object.entries(FILE_ROUTES)
                            .filter(
                                ([key]) =>
                                    key !== "facultyMatrix" &&
                                    key !== "studentData"
                            ) // Exclude Faculty Matrix
                            .map(([key, routeConfig]) => (
                                <FileUploadCard
                                    key={key}
                                    fileKey={key}
                                    routeConfig={routeConfig}
                                    file={files[key]}
                                    isLoading={loadingStates[key]}
                                    onFileChange={handleFileChange}
                                    onClearFile={handleClearFile}
                                    onPreview={handlePreview}
                                    onSubmitUpload={handleSubmitUpload}
                                />
                            ))}
                    </div>
                    <div className="w-full">
                        {/* Stats Bar for Preview */}
                        {displayTable && displayTable.data.length > 0 && (
                            <div className="mb-4 p-4 bg-light-background dark:bg-dark-muted-background rounded-lg border border-light-secondary dark:border-dark-secondary">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            <span className="font-semibold text-light-text dark:text-dark-text">
                                                {displayTable.data.length}
                                            </span>{" "}
                                            rows{" "}
                                            {displayTable.data.length !==
                                                (activeTable?.data.length ||
                                                    0) &&
                                                "(including test data)"}
                                        </div>
                                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            <span className="font-semibold text-light-text dark:text-dark-text">
                                                {
                                                    Object.keys(
                                                        displayTable.data[0] ||
                                                            {}
                                                    ).length
                                                }
                                            </span>{" "}
                                            columns
                                        </div>
                                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            <span className="font-semibold text-light-text dark:text-dark-text">
                                                {Math.ceil(
                                                    displayTable.data.length /
                                                        20
                                                )}
                                            </span>{" "}
                                            pages (Page size: 20)
                                        </div>
                                    </div>
                                    <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                        File Name:{" "}
                                        <span className="font-semibold text-light-text dark:text-dark-text capitalize">
                                            {displayTable.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DataTable
                            data={displayTable?.data || []}
                            columns={[]}
                            autoGenerateColumns={true}
                            previewMode={true}
                            previewTitle={
                                displayTable
                                    ? `${displayTable.type} Preview`
                                    : undefined
                            }
                            previewIcon={TableCellsIcon}
                            showCard={true}
                            showSearch={
                                displayTable?.data &&
                                displayTable.data.length > 5
                            }
                            showPagination={true} // Always show pagination for debugging
                            pageSize={10}
                            emptyMessage="Select a file and click preview to see the content"
                            searchPlaceholder="Search in file data..."
                            className="w-full"
                            stickyHeader={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
