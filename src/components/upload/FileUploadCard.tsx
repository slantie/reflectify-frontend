// src/components/upload/FileUploadCard.tsx
"use client";

import React, { useEffect } from "react";
import {
    DocumentArrowUpIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";
import {
    FileUploadRoute,
    FacultyMatrixUploadParams,
} from "@/interfaces/upload";
import { FacultyMatrixUploadInputs } from "./FacultyMatrixUploadInputs"; // Import the new component

interface FileUploadCardProps {
    fileKey: string;
    routeConfig: FileUploadRoute;
    file: File | null;
    isLoading: boolean;
    onFileChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        fileKey: string
    ) => void;
    onClearFile: (fileKey: string) => void;
    onPreview: (fileKey: string) => Promise<void>;
    onSubmitUpload: (fileKey: string) => Promise<void>;
    // Props for Faculty Matrix specific parameters
    facultyMatrixParams: FacultyMatrixUploadParams;
    onFacultyMatrixParamsChange: React.Dispatch<
        React.SetStateAction<FacultyMatrixUploadParams>
    >;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
    fileKey,
    routeConfig,
    file,
    isLoading,
    onFileChange,
    onClearFile,
    onPreview,
    onSubmitUpload,
    facultyMatrixParams,
    onFacultyMatrixParamsChange,
}) => {
    const { label, icon, requiredParams, referenceFileUrl, description } =
        routeConfig;

    // Reset params when fileKey changes or file is cleared
    useEffect(() => {
        if (fileKey === "facultyMatrix" && !file) {
            onFacultyMatrixParamsChange({
                academicYear: "",
                semesterRun: "",
                deptAbbreviation: "",
            });
        }
    }, [fileKey, file, onFacultyMatrixParamsChange]);

    const handleParamChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        onFacultyMatrixParamsChange((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isFacultyMatrixUpload = fileKey === "facultyMatrix";
    const canSubmit =
        file &&
        (!isFacultyMatrixUpload ||
            (facultyMatrixParams.academicYear &&
                facultyMatrixParams.semesterRun &&
                facultyMatrixParams.deptAbbreviation));

    return (
        <Card className="bg-light-background dark:bg-dark-muted-background shadow-sm border border-light-secondary dark:border-dark-secondary p-6 rounded-2xl">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-lighter rounded-xl">
                            {typeof icon === "string" && icon.length < 3 ? (
                                <span className="text-xl">{icon}</span>
                            ) : (
                                <DocumentArrowUpIcon className="h-5 w-5 text-primary-dark" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-light-text dark:text-text">
                                {label}
                            </h2>
                            {description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reference File Download Button */}
                    {referenceFileUrl && (
                        <button
                            onClick={() =>
                                window.open(referenceFileUrl, "_blank")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-dark bg-primary-lighter rounded-lg hover:bg-primary-light transition-colors"
                            title="Download reference file"
                        >
                            <ArrowDownTrayIcon className="h-3 w-3" />
                            File Format
                        </button>
                    )}
                </div>

                <input
                    name={fileKey}
                    type="file"
                    accept=".xlsx,.xls"
                    title={`Upload ${label} Excel file`}
                    placeholder={`Choose ${label} Excel file`}
                    onChange={(e) => onFileChange(e, fileKey)}
                    className="block w-full text-sm text-light-muted-text dark:text-dark-muted-text
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-lighter file:text-primary-dark
                        hover:file:bg-primary-light
                        transition-all cursor-pointer"
                />

                {file && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-primary-dark font-medium flex items-center gap-2 truncate max-w-[60%]">
                            <span className="w-2 h-2 bg-light-highlight dark:bg-dark-highlight rounded-full flex-shrink-0"></span>
                            <span className="truncate">{file.name}</span>
                        </p>
                        <button
                            onClick={() => onClearFile(fileKey)}
                            className="p-1.5 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors flex-shrink-0"
                            title="Clear file"
                            aria-label="Clear file"
                        >
                            <XMarkIcon className="h-4 w-4 text-light-tertiary dark:text-dark-tertiary" />
                        </button>
                    </div>
                )}

                {/* Render the new component for Faculty Matrix specific inputs */}
                {isFacultyMatrixUpload && requiredParams && (
                    <FacultyMatrixUploadInputs
                        params={facultyMatrixParams}
                        onParamChange={handleParamChange}
                    />
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => onPreview(fileKey)}
                        disabled={!file}
                        className="flex-1 bg-transparent border-2 border-primary-main text-light-highlight dark:text-dark-highlight py-2.5 px-4 rounded-xl
                            hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2
                            transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Preview
                    </button>
                    <button
                        onClick={() => onSubmitUpload(fileKey)}
                        disabled={!canSubmit || isLoading}
                        className="flex-1 bg-light-highlight dark:bg-dark-highlight text-white py-2.5 px-4 rounded-xl
                            hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2
                            transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="h-4 w-4 border-white" />
                                Processing
                            </span>
                        ) : (
                            "Upload"
                        )}
                    </button>
                </div>
            </div>
        </Card>
    );
};
