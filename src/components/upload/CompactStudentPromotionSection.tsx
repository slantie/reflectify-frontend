// src/components/upload/CompactStudentPromotionSection.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePromoteStudentsByYear } from "@/hooks/useStudentPromotion";
import { showToast } from "@/lib/toast";
import {
    ArrowUpIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

interface CompactStudentPromotionSectionProps {
    className?: string;
    onPromotionComplete?: (results: any) => void;
}

export const CompactStudentPromotionSection: React.FC<
    CompactStudentPromotionSectionProps
> = ({ className = "", onPromotionComplete }) => {
    const [yearString, setYearString] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [promotionResults, setPromotionResults] = useState<any>(null);

    const promoteStudentsMutation = usePromoteStudentsByYear();

    const handlePromoteStudents = async () => {
        if (!yearString.trim()) {
            showToast.error("Please enter a valid academic year (e.g., 2025-2026)");
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

            // Call callback if provided
            onPromotionComplete?.(result);
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
        <div
            className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 ${className}`}
        >
            <div className="flex items-center gap-2 mb-3">
                <ArrowUpIcon className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    Student Promotion
                </h4>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Promote all students to the next semester/academic year before
                uploading faculty matrix.
            </p>

            <div className="space-y-3">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="e.g., 2025-2026"
                        value={yearString}
                        onChange={(e) => setYearString(e.target.value)}
                        className="flex-1 text-sm"
                        size="sm"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setYearString(getNextAcademicYear())}
                        className="text-xs px-2"
                    >
                        Next Year
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handlePromoteStudents}
                        disabled={
                            promoteStudentsMutation.isPending ||
                            !yearString.trim()
                        }
                        size="sm"
                        className="flex items-center gap-2 text-sm"
                    >
                        {promoteStudentsMutation.isPending ? (
                            <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                Promoting...
                            </>
                        ) : (
                            <>
                                <ArrowUpIcon className="h-3 w-3" />
                                Promote All Students
                            </>
                        )}
                    </Button>

                    {showResults && (
                        <Button
                            variant="outline"
                            onClick={resetResults}
                            size="sm"
                            className="text-sm"
                        >
                            Hide Results
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Section - Compact */}
            {showResults && promotionResults && (
                <div className="mt-4 space-y-3 border-t pt-3">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        Results
                    </h5>

                    {/* Summary Cards - Compact */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-1">
                                <CheckCircleIcon className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-800 dark:text-green-200">
                                    Promoted
                                </span>
                            </div>
                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                                {promotionResults.promoted}
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-1">
                                <CheckCircleIcon className="h-3 w-3 text-blue-600" />
                                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                                    Graduated
                                </span>
                            </div>
                            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                {promotionResults.graduated}
                            </p>
                        </div>

                        {promotionResults.failed > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                                <div className="flex items-center gap-1">
                                    <XCircleIcon className="h-3 w-3 text-red-600" />
                                    <span className="text-xs font-medium text-red-800 dark:text-red-200">
                                        Failed
                                    </span>
                                </div>
                                <p className="text-lg font-bold text-red-900 dark:text-red-100">
                                    {promotionResults.failed}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Detailed Results - Compact */}
                    {promotionResults.details && (
                        <div className="max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-2 rounded border text-xs">
                            {promotionResults.details.promoted.length > 0 && (
                                <div className="mb-2">
                                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">
                                        Successfully Promoted (
                                        {
                                            promotionResults.details.promoted
                                                .length
                                        }
                                        )
                                    </p>
                                    {promotionResults.details.promoted
                                        .slice(0, 3)
                                        .map((student: any, index: number) => (
                                            <p
                                                key={index}
                                                className="text-xs text-gray-600 dark:text-gray-400"
                                            >
                                                {student.studentName}: Sem{" "}
                                                {student.fromSemester} → Sem{" "}
                                                {student.toSemester}
                                            </p>
                                        ))}
                                    {promotionResults.details.promoted.length >
                                        3 && (
                                        <p className="text-xs text-gray-500 italic">
                                            ... and{" "}
                                            {promotionResults.details.promoted
                                                .length - 3}{" "}
                                            more
                                        </p>
                                    )}
                                </div>
                            )}

                            {promotionResults.details.failed.length > 0 && (
                                <div>
                                    <p className="font-medium text-red-700 dark:text-red-300 mb-1">
                                        Failed Promotions (
                                        {promotionResults.details.failed.length}
                                        )
                                    </p>
                                    {promotionResults.details.failed.map(
                                        (student: any, index: number) => (
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
                    )}
                </div>
            )}

            {/* Warning Notice - Compact */}
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs">
                <div className="flex items-start gap-1">
                    <ExclamationTriangleIcon className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Important Notice
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                            This promotes ALL students. Backup database before
                            proceeding.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactStudentPromotionSection;
