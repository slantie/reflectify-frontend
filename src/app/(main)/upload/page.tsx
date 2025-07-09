// src/app/(main)/upload/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FILE_ROUTES } from "@/constants/fileUploadRoutes";
import { useFileUpload } from "@/hooks/upload/useFileUpload";
import { UploadHeader } from "@/components/upload/UploadHeader";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { FilePreviewTable } from "@/components/upload/FilePreviewTable";

export default function UploadPage() {
    const [isClient, setIsClient] = useState(false);

    const {
        files,
        loadingStates,
        activeTable,
        facultyMatrixParams, // New: Get faculty matrix params
        handleFileChange,
        handleClearFile,
        handlePreview,
        handleSubmitUpload,
        setFacultyMatrixParams, // New: Get setter for faculty matrix params
    } = useFileUpload();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="space-y-8">
                    {/* Header Section */}
                    <UploadHeader title="Data Upload Center" />

                    {/* Upload Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(FILE_ROUTES)
                            .filter(([key]) => key !== "facultyMatrix") // Exclude Faculty Matrix
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
                                    facultyMatrixParams={facultyMatrixParams}
                                    onFacultyMatrixParamsChange={
                                        setFacultyMatrixParams
                                    }
                                />
                            ))}
                    </div>

                    {/* Preview Section - Full Width */}
                    <div className="w-full">
                        <FilePreviewTable activeTable={activeTable} />
                    </div>
                </div>
            </div>
        </div>
    );
}
