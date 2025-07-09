// src/components/upload/StudentPromotionSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { usePromoteStudentsByYear } from "@/hooks/useStudentPromotion";
import { showToast } from "@/lib/toast";
import {
    ArrowUpIcon,
    EyeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

interface StudentPromotionSectionProps {
    className?: string;
}

export const StudentPromotionSection: React.FC<
    StudentPromotionSectionProps
> = ({ className = "" }) => {
    const [yearString, setYearString] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [promotionResults, setPromotionResults] = useState<any>(null);

    const promoteStudentsMutation = usePromoteStudentsByYear();

    const handlePromoteStudents = async () => {
        if (!yearString.trim()) {
            showToast.error(
                "Please enter a valid academic year (e.g., 2025-2026)"
            );
            return;
        }

        // Validate year string format
        const yearPattern = /^\d{4}-\d{4}$/;
        if (!yearPattern.test(yearString.trim())) {
            showToast.error(
                "Please enter academic year in format: YYYY-YYYY (e.g., 2025-2026)"
            );
            return;
        }

        try {
            const result = await promoteStudentsMutation.mutateAsync(
                yearString.trim()
            );
            setPromotionResults(result);
            setShowResults(true);

            // Show success toast with summary
            showToast.success(
                `🎓 Promotion completed! ${result.promoted} students promoted, ${result.graduated} graduated`,
                { duration: 5000 }
            );

            // Show additional info if there were failures
            if (result.failed > 0) {
                showToast.error(
                    `⚠️ ${result.failed} students failed to promote. Check details below.`
                );
            }
        } catch (error) {
            console.error("Promotion failed:", error);
            showToast.error("Failed to promote students. Please try again.");
        }
    };

    const getNextAcademicYear = () => {
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${currentYear + 1}`;
    };

    const resetResults = () => {
        setShowResults(false);
        setPromotionResults(null);
    };

    return (
        <Card
            className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 ${className}`}
        >
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <ArrowUpIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Student Promotion
                    </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Promote all students to the next semester/academic year.
                    This will automatically create the target academic year if
                    it doesn&apos;t exist.
                </p>

                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="yearString"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Target Academic Year
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="yearString"
                                type="text"
                                placeholder="e.g., 2025-2026"
                                value={yearString}
                                onChange={(e) => setYearString(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setYearString(getNextAcademicYear())
                                }
                                className="px-3"
                            >
                                Next Year
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Format: YYYY-YYYY (e.g., {getNextAcademicYear()})
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handlePromoteStudents}
                            disabled={
                                promoteStudentsMutation.isPending ||
                                !yearString.trim()
                            }
                            className="flex items-center gap-2"
                        >
                            {promoteStudentsMutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Promoting...
                                </>
                            ) : (
                                <>
                                    <ArrowUpIcon className="h-4 w-4" />
                                    Promote All Students
                                </>
                            )}
                        </Button>

                        {showResults && (
                            <Button
                                variant="outline"
                                onClick={resetResults}
                                className="flex items-center gap-2"
                            >
                                <EyeIcon className="h-4 w-4" />
                                Hide Results
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {showResults && promotionResults && (
                    <div className="mt-6 space-y-4 border-t pt-4">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                            Promotion Results
                        </h4>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-green-800 dark:text-green-200">
                                        Promoted
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {promotionResults.promoted}
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium text-blue-800 dark:text-blue-200">
                                        Graduated
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {promotionResults.graduated}
                                </p>
                            </div>

                            {promotionResults.failed > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="flex items-center gap-2">
                                        <XCircleIcon className="h-5 w-5 text-red-600" />
                                        <span className="font-medium text-red-800 dark:text-red-200">
                                            Failed
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                                        {promotionResults.failed}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Detailed Results */}
                        {(promotionResults.details.promoted.length > 0 ||
                            promotionResults.details.failed.length > 0) && (
                            <div className="space-y-3">
                                <h5 className="font-medium text-gray-700 dark:text-gray-300">
                                    Detailed Results
                                </h5>

                                <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded border text-sm">
                                    {promotionResults.details.promoted.length >
                                        0 && (
                                        <div className="mb-3">
                                            <p className="font-medium text-green-700 dark:text-green-300 mb-1">
                                                Successfully Promoted (
                                                {
                                                    promotionResults.details
                                                        .promoted.length
                                                }
                                                )
                                            </p>
                                            {promotionResults.details.promoted
                                                .slice(0, 5)
                                                .map(
                                                    (
                                                        student: any,
                                                        index: number
                                                    ) => (
                                                        <p
                                                            key={index}
                                                            className="text-xs text-gray-600 dark:text-gray-400"
                                                        >
                                                            {
                                                                student.studentName
                                                            }
                                                            : Sem{" "}
                                                            {
                                                                student.fromSemester
                                                            }{" "}
                                                            → Sem{" "}
                                                            {student.toSemester}
                                                        </p>
                                                    )
                                                )}
                                            {promotionResults.details.promoted
                                                .length > 5 && (
                                                <p className="text-xs text-gray-500 italic">
                                                    ... and{" "}
                                                    {promotionResults.details
                                                        .promoted.length -
                                                        5}{" "}
                                                    more
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {promotionResults.details.failed.length >
                                        0 && (
                                        <div>
                                            <p className="font-medium text-red-700 dark:text-red-300 mb-1">
                                                Failed Promotions (
                                                {
                                                    promotionResults.details
                                                        .failed.length
                                                }
                                                )
                                            </p>
                                            {promotionResults.details.failed.map(
                                                (
                                                    student: any,
                                                    index: number
                                                ) => (
                                                    <p
                                                        key={index}
                                                        className="text-xs text-red-600 dark:text-red-400"
                                                    >
                                                        {student.studentName}:{" "}
                                                        {student.reason}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Warning Notice */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                Important Notice
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300">
                                This action will promote ALL students in the
                                database to the next semester. This operation
                                cannot be easily undone. Make sure you have a
                                database backup.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StudentPromotionSection;
