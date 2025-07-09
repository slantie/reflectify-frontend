/**
 * @file src/app/(main)/academic-year/page.tsx
 * @description Academic Year management page
 */

"use client";

import { AcademicYearManagement } from "@/components/academic-year";

export default function AcademicYearPage() {
    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <AcademicYearManagement />
            </div>
        </div>
    );
}
