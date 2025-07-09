// Example usage of the enhanced faculty matrix upload with detailed toast feedback
// This is a demonstration component showing how to handle the new response format

import React, { useState } from "react";
import { useUploadFacultyMatrix } from "@/hooks/useUploads";
import { FacultyMatrixUploadInputs } from "@/components/upload/FacultyMatrixUploadInputs";
import { StudentPromotionSection } from "@/components/upload/StudentPromotionSection";
import {
    FacultyMatrixUploadParams,
    FacultyMatrixUploadResult,
} from "@/interfaces/upload";
import { SemesterTypeEnum } from "@/constants/semesterTypes";
import { formatDetailedErrorInfo } from "@/utils/facultyMatrixToasts";
import { showToast } from "@/lib/toast";

export const EnhancedFacultyMatrixUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [params, setParams] = useState<FacultyMatrixUploadParams>({
        academicYear: "",
        semesterRun: "",
        deptAbbreviation: "",
    });
    const [detailedLog, setDetailedLog] = useState<string>("");
    const [showDetails, setShowDetails] = useState(false);

    const uploadFacultyMatrix = useUploadFacultyMatrix({
        onSuccessCallback: (data: FacultyMatrixUploadResult) => {
            // Store detailed log for debugging/review
            setDetailedLog(formatDetailedErrorInfo(data));

            // Show a summary toast if there were any issues
            const hasAnyIssues =
                data.missingFaculties.length > 0 ||
                data.missingSubjects.length > 0 ||
                data.flaskWarnings.length > 0 ||
                data.flaskErrors.length > 0;

            if (hasAnyIssues) {
                showToast.info(
                    '📋 Upload completed with some issues. Click "View Details" for more information.',
                    { duration: 8000 }
                );
            }
        },
        onErrorCallback: (error: Error) => {
            showToast.error(`Upload failed: ${error.message}`);
            console.error("Faculty matrix upload error:", error);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleParamChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            showToast.warning("Please select a file to upload");
            return;
        }

        if (
            !params.academicYear ||
            !params.semesterRun ||
            !params.deptAbbreviation
        ) {
            showToast.warning("Please fill in all required fields");
            return;
        }

        try {
            await uploadFacultyMatrix.mutateAsync({
                file,
                academicYear: params.academicYear,
                semesterRun: params.semesterRun as SemesterTypeEnum,
                deptAbbreviation: params.deptAbbreviation,
            });
        } catch {
            // Error is already handled by onErrorCallback
        }
    };

    const copyDetailsToClipboard = () => {
        navigator.clipboard
            .writeText(detailedLog)
            .then(() => {
                showToast.success("Detailed log copied to clipboard");
            })
            .catch(() => {
                showToast.error("Failed to copy to clipboard");
            });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Faculty Matrix Upload</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* File input */}
                <div>
                    <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Faculty Matrix File (Excel)
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                    />
                </div>

                {/* Parameter inputs */}
                <FacultyMatrixUploadInputs
                    params={params}
                    onParamChange={handleParamChange}
                />

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={uploadFacultyMatrix.isPending}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {uploadFacultyMatrix.isPending
                        ? "Uploading..."
                        : "Upload Faculty Matrix"}
                </button>
            </form>

            {/* Show detailed log if available */}
            {detailedLog && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            Upload Summary
                        </h3>
                        <div className="space-x-2">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                {showDetails ? "Hide Details" : "View Details"}
                            </button>
                            <button
                                onClick={copyDetailsToClipboard}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                                Copy Log
                            </button>
                        </div>
                    </div>

                    {showDetails && (
                        <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96 whitespace-pre-wrap">
                            {detailedLog}
                        </pre>
                    )}
                </div>
            )}

            {/* Toast Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">
                    What to expect:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• ✅ Success toasts for processed rows</li>
                    <li>
                        • ⚠️ Warning toasts for Flask warnings and missing
                        entities
                    </li>
                    <li>• ❌ Error toasts for Flask processing errors</li>
                    <li>• ℹ️ Info toasts for skipped rows summary</li>
                    <li>
                        • Each type of issue gets a separate toast for clarity
                    </li>
                </ul>
            </div>

            {/* Student Promotion Section */}
            <StudentPromotionSection className="mt-8" />
        </div>
    );
};

export default EnhancedFacultyMatrixUpload;
