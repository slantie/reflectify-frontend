/**
 * @file src/components/dashboard/DashboardStatsGrid.tsx
 * @description Displays a grid of statistical cards for various entities in the system, adapted for bento grid.
 */

import { StatCard } from "@/components/ui/StatCard"; // Ensure StatCard has bento-like styling
import {
    AcademicCapIcon,
    BookOpenIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ClipboardDocumentListIcon,
    ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DashboardStats } from "@/interfaces/dashboard";

interface DashboardStatsGridProps {
    stats: DashboardStats | undefined;
    router: AppRouterInstance;
}

export function DashboardStatsGrid({ stats, router }: DashboardStatsGridProps) {
    return (
        // This div now contributes directly to the main dashboard's grid.
        // Each StatCard will be an individual bento item.
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            <StatCard
                title="Academic Years"
                value={stats?.academicYearCount || 0}
                icon={CalendarIcon}
                onClick={() => router.push("/academic-year")}
                className="col-span-1" // Ensure it takes one column
            />
            <StatCard
                title="Departments"
                value={stats?.departmentCount || 0}
                icon={BuildingOfficeIcon}
                onClick={() => router.push("/department")}
                className="col-span-1"
            />
            <StatCard
                title="Faculty"
                value={stats?.facultyCount || 0}
                icon={AcademicCapIcon}
                onClick={() => router.push("/faculty")}
                className="col-span-1"
            />
            <StatCard
                title="Semesters"
                value={stats?.semesterCount || 0}
                icon={ClipboardDocumentListIcon}
                onClick={() => router.push("/semester")}
                className="col-span-1"
            />
            <StatCard
                title="Divisions"
                value={stats?.divisionCount || 0}
                icon={ViewColumnsIcon}
                onClick={() => router.push("/division")}
                className="col-span-1"
            />
            <StatCard
                title="Subjects"
                value={stats?.subjectCount || 0}
                icon={BookOpenIcon}
                onClick={() => router.push("/subject")}
                className="col-span-1"
            />
        </div>
    );
}
