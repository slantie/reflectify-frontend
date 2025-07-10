// src/app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui";
import { StatCard } from "@/components/ui/StatCard";
import {
    ArrowTrendingUpIcon,
    BookOpenIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    UserGroupIcon,
    ViewColumnsIcon,
    ChartPieIcon,
    PresentationChartLineIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import Loader from "@/components/common/Loader";
import ErrorDisplay from "@/components/common/Error";
import { AcademicYearSection } from "@/components/dashboard/AcademicYearSection";

export default function Dashboard() {
    const router = useRouter();
    // Destructure data, isLoading, and isError from the TanStack Query hook
    const { data: stats, isLoading, isError, error } = useDashboardStats();

    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        setCurrentDate(
            new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
        );
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <Loader /> {/* Use the Loader component */}
                <p className="text-light-text dark:text-dark-text ml-2">
                    Loading dashboard data...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-muted-background dark:bg-dark-background">
                <ErrorDisplay
                    message={error?.message || "Failed to load dashboard data."}
                />{" "}
                {/* Use ErrorDisplay */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content - Right Side */}
                    <div className="lg:w-full space-y-8">
                        {/* Header Section */}
                        <div className="relative bg-light-background dark:bg-dark-muted-background p-6 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary overflow-hidden">
                            {/* Optional: Subtle background pattern or gradient for modern bento feel */}
                            <div className="absolute inset-0 bg-gradient-to-br from-light-background/50 to-light-secondary/20 dark:from-dark-muted-background/50 dark:to-dark-secondary/20 opacity-30 pointer-events-none rounded-xl"></div>
                            <div className="absolute top-0 left-0 w-24 h-24 bg-primary-main rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-light-main rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                {/* Left Section: Title and Descriptions */}
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-light-text dark:text-dark-text flex items-center gap-3">
                                        Dashboard Overview
                                        <ChartBarIcon className="h-8 w-8 text-primary-main" />
                                    </h1>
                                    <p className="text-base text-light-muted-text dark:text-dark-muted-text flex items-center gap-2 mt-2">
                                        <ArrowTrendingUpIcon className="h-5 w-5 text-positive-main" />
                                        Real-time system metrics and quick
                                        actions at a glance.
                                    </p>
                                    {/* Active Academic Year */}
                                    {stats?.activeAcademicYear && (
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text flex items-center gap-2 mt-2 font-medium">
                                            <CalendarIcon className="h-4 w-4 text-primary-main" />
                                            Active Academic Year:{" "}
                                            <span className="font-semibold text-primary-main">
                                                {
                                                    stats.activeAcademicYear
                                                        .yearString
                                                }
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {/* Right Section: Response Count and Last Updated */}
                                <div className="w-full sm:w-auto text-left sm:text-right space-y-3">
                                    <div className="flex justify-start sm:justify-end">
                                        <Badge
                                            variant="default"
                                            size="lg"
                                            className="gap-2 px-4 py-2 text-lg font-semibold text-primary-foreground dark:bg-primary-dark-main dark:text-primary-dark-foreground shadow-lg"
                                        >
                                            {/* <ChartBarIcon className="h-6 w-6" /> */}
                                            <span>
                                                <CountUp
                                                    end={
                                                        stats?.responseCount ||
                                                        0
                                                    }
                                                    duration={2.5} // Slightly longer duration for smoother count
                                                    separator=","
                                                    enableScrollSpy={true}
                                                    scrollSpyOnce={true}
                                                />{" "}
                                                Total Responses
                                            </span>
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            Data last updated:
                                        </p>
                                        <p className="text-base font-semibold text-light-text dark:text-dark-text">
                                            {currentDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard
                                title="Academic Years"
                                value={stats?.academicYearCount || 0}
                                icon={CalendarIcon}
                                onClick={() => router.push("/academic-year")}
                            />
                            <StatCard
                                title="Departments"
                                value={stats?.departmentCount || 0}
                                icon={BuildingOfficeIcon}
                                onClick={() => router.push("/department")}
                            />
                            <StatCard
                                title="Faculty"
                                value={stats?.facultyCount || 0}
                                icon={AcademicCapIcon}
                                onClick={() => router.push("/faculty")}
                            />
                            <StatCard
                                title="Semesters"
                                value={stats?.semesterCount || 0}
                                icon={ClipboardDocumentListIcon}
                                onClick={() => router.push("/semester")}
                            />

                            <StatCard
                                title="Divisions"
                                value={stats?.divisionCount || 0}
                                icon={ViewColumnsIcon}
                                onClick={() => router.push("/division")}
                            />
                            <StatCard
                                title="Subjects"
                                value={stats?.subjectCount || 0}
                                icon={BookOpenIcon}
                                onClick={() => router.push("/subject")}
                            />
                        </div>

                        {/* Analytics Section */}
                        <div className="bg-light-background dark:bg-dark-muted-background p-5 rounded-xl shadow-sm border border-light-secondary dark:border-dark-secondary">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
                                    Analytics & Insights
                                    <ChartPieIcon className="h-5 w-5 text-primary-main" />
                                </h2>
                                <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-1">
                                    Access comprehensive feedback analytics and
                                    performance insights
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* General Analytics Card */}
                                <div
                                    onClick={() => router.push("/analytics")}
                                    className="relative overflow-hidden cursor-pointer bg-light-background dark:bg-dark-muted-background hover:bg-light-muted-background dark:hover:bg-dark-noisy-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main hover:shadow-lg transition-all duration-300 rounded-xl group p-6"
                                >
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary-main transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-primary-main transition-colors">
                                                General Analytics
                                            </h3>
                                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                Semester trends, subject
                                                analysis, and overall insights
                                            </p>
                                            <div className="text-xs text-primary-main font-medium">
                                                View Dashboard →
                                            </div>
                                        </div>
                                        <ChartBarIcon className="h-12 w-12 text-primary-main transition-all duration-300 group-hover:scale-110" />
                                    </div>
                                </div>

                                {/* Faculty Analytics Card */}
                                <div
                                    onClick={() =>
                                        router.push("/faculty-analytics")
                                    }
                                    className="relative overflow-hidden cursor-pointer bg-light-background dark:bg-dark-muted-background hover:bg-light-muted-background dark:hover:bg-dark-noisy-background border border-light-secondary dark:border-dark-secondary hover:border-primary-main hover:shadow-lg transition-all duration-300 rounded-xl group p-6"
                                >
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary-main transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text group-hover:text-primary-main transition-colors">
                                                Faculty Analytics
                                            </h3>
                                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                                Individual faculty performance
                                                and comparisons
                                            </p>
                                            <div className="text-xs text-primary-main font-medium">
                                                View Performance →
                                            </div>
                                        </div>
                                        <PresentationChartLineIcon className="h-12 w-12 text-primary-main transition-all duration-300 group-hover:scale-110" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Year Management Section */}
                        <AcademicYearSection />
                    </div>
                </div>
            </div>
        </div>
    );
}
