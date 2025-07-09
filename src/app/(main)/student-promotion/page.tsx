// src/app/(main)/student-promotion/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { StudentPromotionSection } from "@/components/upload/StudentPromotionSection";
import { ArrowLeftIcon, GraduationCapIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function StudentPromotionPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="p-2"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <GraduationCapIcon className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
                                    Student Promotion
                                </h1>
                                <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                    Promote all students to the next academic
                                    year and semester
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Student Promotion Section */}
                    <StudentPromotionSection />

                    {/* Information Section */}
                    <div className="bg-light-background dark:bg-dark-background rounded-xl p-6 border border-light-secondary dark:border-dark-secondary">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                            How Student Promotion Works
                        </h3>
                        <div className="space-y-3 text-sm text-light-muted-text dark:text-dark-muted-text">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    1
                                </span>
                                <p>
                                    <strong>Automatic Year Creation:</strong> If
                                    the target academic year doesn&apos;t exist,
                                    it will be created automatically (e.g.,
                                    &quot;2025-2026&quot;).
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    2
                                </span>
                                <p>
                                    <strong>Semester Progression:</strong>{" "}
                                    Students are moved to the next semester
                                    (Semester 1 → 2, Semester 3 → 4, etc.).
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    3
                                </span>
                                <p>
                                    <strong>Structure Creation:</strong> New
                                    semesters and divisions are automatically
                                    created in the target academic year as
                                    needed.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    4
                                </span>
                                <p>
                                    <strong>Graduation Handling:</strong>{" "}
                                    Students in their final semester (typically
                                    Semester 8) are marked as graduated instead
                                    of promoted.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    5
                                </span>
                                <p>
                                    <strong>Audit Trail:</strong> All promotions
                                    are recorded in the promotion history for
                                    tracking and potential rollback purposes.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4">
                            Best Practices
                        </h3>
                        <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                            <li>
                                • Create a database backup before running bulk
                                promotions
                            </li>
                            <li>
                                • Run promotions during maintenance windows when
                                possible
                            </li>
                            <li>
                                • Verify student data accuracy before promotion
                            </li>
                            <li>
                                • Communicate with faculty about the promotion
                                schedule
                            </li>
                            <li>
                                • Review the promotion results and handle any
                                failed cases
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
