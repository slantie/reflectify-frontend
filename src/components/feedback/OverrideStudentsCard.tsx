// src/components/feedback/OverrideStudentsCard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
    UserGroupIcon,
    CloudArrowUpIcon,
    TrashIcon,
    EyeIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/lib/toast";
import { OverrideStudentUploadResult as UploadOverrideStudentsResponse } from "@/interfaces/overrideStudent";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/common/Loader";
import OverrideStudentsModal from "@/components/modals/OverrideStudentsModal";
import overrideStudentsService from "@/services/overrideStudentsService";

interface OverrideStudentsCardProps {
    formId: string;
    formStatus: string;
}

export default function OverrideStudentsCard({
    formId,
    formStatus,
}: OverrideStudentsCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentCount, setStudentCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isClearing, setIsClearing] = useState(false);

    const fetchStudentCount = useCallback(async () => {
        try {
            setIsLoading(true);
            const count =
                await overrideStudentsService.getOverrideStudentsCount(formId);
            setStudentCount(count);
        } catch (error) {
            console.error("Failed to fetch override students count:", error);
            setStudentCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [formId]);

    useEffect(() => {
        fetchStudentCount();
    }, [formId, fetchStudentCount]);

    const handleUploadSuccess = (result: UploadOverrideStudentsResponse) => {
        showToast.success(
            `Successfully uploaded ${result.rowsAffected} students${
                result.skippedRows > 0
                    ? `, skipped ${result.skippedRows} rows`
                    : ""
            }`
        );
        fetchStudentCount(); // Refresh count
    };

    const handleClearStudents = async () => {
        if (
            !confirm(
                "Are you sure you want to clear all override students? This action cannot be undone."
            )
        ) {
            return;
        }

        setIsClearing(true);
        try {
            const deletedCount =
                await overrideStudentsService.clearAllOverrideStudents(formId);
            showToast.success(`Cleared ${deletedCount} override students`);
            setStudentCount(0);
        } catch (error) {
            console.error("Failed to clear override students:", error);
            showToast.error("Failed to clear override students");
        } finally {
            setIsClearing(false);
        }
    };

    const canModifyStudents = formStatus === "DRAFT";

    return (
        <>
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                            Override Students
                        </h3>
                    </div>
                    {isLoading && <Loader size="sm" />}
                </div>

                {/* Information Banner */}
                <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                                Custom Student List
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                {studentCount && studentCount > 0
                                    ? "This form will be sent to the uploaded students instead of the regular academic structure."
                                    : "Upload a custom list of students to override the default academic structure-based distribution."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Current Count */}
                    <div className="flex items-center justify-between">
                        <span className="text-light-muted-text dark:text-dark-muted-text">
                            Students:
                        </span>
                        <span className="text-light-text dark:text-dark-text font-medium">
                            {isLoading ? (
                                <Loader size="sm" />
                            ) : (
                                `${studentCount || 0} uploaded`
                            )}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        {/* Upload Button */}
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            disabled={!canModifyStudents}
                            size="sm"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <CloudArrowUpIcon className="w-4 h-4" />
                            {studentCount && studentCount > 0
                                ? "Replace Students"
                                : "Upload Students"}
                        </Button>

                        {/* View Students Button */}
                        {studentCount && studentCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => {
                                    // TODO: Implement view students modal or page
                                    showToast.info(
                                        "View students functionality coming soon"
                                    );
                                }}
                            >
                                <EyeIcon className="w-4 h-4" />
                                View Students
                            </Button>
                        )}

                        {/* Clear Students Button */}
                        {studentCount &&
                            studentCount > 0 &&
                            canModifyStudents && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearStudents}
                                    disabled={isClearing}
                                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                                >
                                    {isClearing ? (
                                        <Loader size="sm" />
                                    ) : (
                                        <TrashIcon className="w-4 h-4" />
                                    )}
                                    {isClearing ? "Clearing..." : "Clear All"}
                                </Button>
                            )}
                    </div>

                    {/* Status Messages */}
                    {!canModifyStudents && (
                        <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                                Override students can only be modified when the
                                form is in DRAFT status.
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Override Students Modal */}
            <OverrideStudentsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formId={formId}
                onUploadSuccess={handleUploadSuccess}
            />
        </>
    );
}
