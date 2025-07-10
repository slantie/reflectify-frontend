// src/app/(main)/faculty-matrix/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useFileUpload } from "@/hooks/upload/useFileUpload";
import { UploadHeader } from "@/components/upload/UploadHeader";
import { FilePreviewTable } from "@/components/upload/FilePreviewTable";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FacultyMatrixUploadInputs } from "@/components/upload/FacultyMatrixUploadInputs";
import { Loader } from "@/components/common/Loader";
import { FILE_ROUTES } from "@/constants/fileUploadRoutes";
import {
    DocumentArrowUpIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { REFERENCE_FILE_URLS } from "@/constants/apiEndpoints";

export default function FacultyMatrixPage() {
    const [isClient, setIsClient] = useState(false);

    const {
        files,
        loadingStates,
        activeTable,
        facultyMatrixParams,
        handleFileChange,
        handleClearFile,
        handlePreview,
        handleSubmitUpload,
        setFacultyMatrixParams,
    } = useFileUpload();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleParamChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFacultyMatrixParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const facultyMatrixRoute = FILE_ROUTES.facultyMatrix;
    const file = files.facultyMatrix;
    const isLoading = loadingStates.facultyMatrix;

    const canSubmit =
        file &&
        facultyMatrixParams.academicYear &&
        facultyMatrixParams.semesterRun &&
        facultyMatrixParams.deptAbbreviation;

    // Reference file Google Drive link - you can update this with your actual link
    const referenceFileUrl = REFERENCE_FILE_URLS.FACULTY_MATRIX;

    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="space-y-8">
                    {/* Header Section */}
                    <UploadHeader title="Faculty Matrix Upload" />

                    {/* Faculty Matrix Upload Card */}
                    <Card className="bg-light-background dark:bg-dark-muted-background shadow-sm border border-light-secondary dark:border-dark-secondary p-6 rounded-2xl">
                        <div className="space-y-6">
                            {/* Header with icon */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-lighter rounded-xl">
                                        <DocumentArrowUpIcon className="h-6 w-6 text-primary-dark" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-light-text dark:text-text">
                                            {facultyMatrixRoute.label}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Upload faculty teaching assignments
                                            and schedules
                                        </p>
                                    </div>
                                </div>

                                {/* Reference File Download */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        window.open(referenceFileUrl, "_blank")
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    Reference File
                                </Button>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Faculty Matrix File (Excel)
                                </label>
                                <input
                                    name="facultyMatrix"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    title="Upload Faculty Matrix Excel file"
                                    placeholder="Choose Faculty Matrix Excel file"
                                    onChange={(e) =>
                                        handleFileChange(e, "facultyMatrix")
                                    }
                                    className="block w-full text-sm text-light-muted-text dark:text-dark-muted-text
                                        file:mr-4 file:py-2.5 file:px-4
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary-lighter file:text-primary-dark
                                        hover:file:bg-primary-light
                                        transition-all cursor-pointer"
                                />
                            </div>

                            {/* File Info */}
                            {file && (
                                <div className="flex items-center justify-between bg-primary-lighter/50 p-3 rounded-lg">
                                    <p className="text-sm text-primary-dark font-medium flex items-center gap-2 truncate max-w-[60%]">
                                        <span className="w-2 h-2 bg-light-highlight dark:bg-dark-highlight rounded-full flex-shrink-0"></span>
                                        <span className="truncate">
                                            {file.name}
                                        </span>
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleClearFile("facultyMatrix")
                                        }
                                        className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors flex-shrink-0"
                                        title="Clear file"
                                        aria-label="Clear file"
                                    >
                                        <XMarkIcon className="h-4 w-4 text-light-tertiary dark:text-dark-tertiary" />
                                    </button>
                                </div>
                            )}

                            {/* Faculty Matrix Upload Inputs */}
                            <FacultyMatrixUploadInputs
                                params={facultyMatrixParams}
                                onParamChange={handleParamChange}
                            />

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                <Button
                                    onClick={() =>
                                        handlePreview("facultyMatrix")
                                    }
                                    disabled={!file}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Preview Data
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleSubmitUpload("facultyMatrix")
                                    }
                                    disabled={!canSubmit || isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader className="h-4 w-4 border-white" />
                                            Processing...
                                        </span>
                                    ) : (
                                        "Upload Faculty Matrix"
                                    )}
                                </Button>
                            </div>

                            {/* Information Panel */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Faculty Matrix Upload Guidelines:
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>
                                        • Download the reference file to see the
                                        required format
                                    </li>
                                    <li>
                                        • Ensure all faculty and subject data is
                                        uploaded before matrix upload
                                    </li>
                                    <li>
                                        • Select the correct academic year and
                                        semester
                                    </li>
                                    <li>
                                        • Verify department abbreviation matches
                                        your department code
                                    </li>
                                    <li>
                                        • Consider promoting students to the
                                        next academic year if needed
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Preview Section - Full Width */}
                    <div className="w-full">
                        <FilePreviewTable activeTable={activeTable} />
                    </div>
                </div>
            </div>
        </div>
    );
}
