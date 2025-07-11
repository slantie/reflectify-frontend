/**
 * @file src/app/(main)/analytics/page.tsx
 * @description Completely revamped analytics dashboard with clean architecture
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { BarChart3, Users, Eye, RefreshCw, Download, Book } from "lucide-react";

// Import our new components
import {
    useFilterDictionary,
    useProcessedAnalytics,
    useAnalyticsActions,
} from "@/hooks/useAnalyticsData";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { SubjectRatingsChart } from "@/components/analytics/charts/SubjectRatingsChart";
import { SemesterTrendsChart } from "@/components/analytics/charts/SemesterTrendsChart";
import { DivisionComparisonChart } from "@/components/analytics/charts/DivisionComparisonChart";
import { FacultyPerformanceChart } from "@/components/analytics/charts/FacultyPerformanceChart";
import { AnalyticsFilterParams } from "@/interfaces/analytics";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const AnalyticsPage: React.FC = () => {
    // Filter state
    const [filters, setFilters] = useState<AnalyticsFilterParams>({});
    const [activeTab, setActiveTab] = useState<
        "overview" | "subjects" | "trends" | "performance"
    >("overview");

    // Data fetching
    const {
        data: filterDictionary,
        isLoading: filterDictionaryLoading,
        error: filterDictionaryError,
    } = useFilterDictionary();

    const {
        data: processedData,
        rawData,
        isLoading: analyticsDataLoading,
        error: analyticsDataError,
        refetch: refetchAnalyticsData,
    } = useProcessedAnalytics(filters);

    const { invalidateAll } = useAnalyticsActions();

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<AnalyticsFilterParams>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleRefresh = () => {
        refetchAnalyticsData();
        invalidateAll();
    };

    const handleExport = () => {
        if (rawData) {
            // Export functionality - to be implemented
            console.log("Exporting data:", rawData);
        }
    };

    // Loading state
    if (filterDictionaryLoading || analyticsDataLoading) {
        return (
            <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
                            <p className="text-light-text dark:text-dark-text text-lg font-medium">
                                Loading analytics data...
                            </p>
                            <p className="text-light-muted-text dark:text-dark-muted-text text-sm mt-1">
                                Please wait while we fetch your analytics
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (filterDictionaryError || analyticsDataError) {
        return (
            <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                                Failed to load analytics data
                            </h3>
                            <p className="text-light-muted-text dark:text-dark-muted-text mb-6">
                                We encountered an error while fetching your
                                analytics. Please try again.
                            </p>
                            <Button
                                onClick={handleRefresh}
                                className="bg-light-highlight dark:bg-dark-highlight hover:bg-primary-dark text-white"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-muted-background dark:bg-dark-background">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6 md:py-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-light-text dark:text-dark-text">
                                Analytics Dashboard
                            </h1>
                            <p className="text-light-muted-text dark:text-dark-muted-text mt-1">
                                Comprehensive feedback analytics and insights
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={analyticsDataLoading}
                                className="flex items-center gap-2 bg-transparent border border-primary-main text-light-highlight dark:text-dark-highlight py-2 px-4 rounded-xl
                            hover:bg-dark-highlight/10 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2
                            transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${
                                        analyticsDataLoading
                                            ? "animate-spin"
                                            : ""
                                    }`}
                                />
                                Refresh
                            </button>

                            <button
                                onClick={handleExport}
                                disabled={!rawData}
                                className="flex items-center gap-2 bg-transparent border border-primary-main text-light-highlight dark:text-dark-highlight py-2 px-4 rounded-xl
                            hover:bg-dark-highlight/10 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2
                            transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="h-5 w-5" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                        <AnalyticsFilters
                            filters={filters}
                            filterDictionary={filterDictionary}
                            onFiltersChange={handleFilterChange}
                            onRefresh={handleRefresh}
                            isLoading={analyticsDataLoading}
                        />
                    </Card>

                    {/* Overview Stats */}
                    <AnalyticsOverview
                        stats={processedData?.overallStats || null}
                        isLoading={analyticsDataLoading}
                    />

                    {/* Main Content */}
                    <div className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                        <Tabs
                            value={activeTab}
                            onValueChange={(value: string) =>
                                setActiveTab(value as any)
                            }
                        >
                            <div className="p-6 border-b border-light-secondary dark:border-dark-secondary">
                                <TabsList className="grid w-full grid-cols-4 gap-4 rounded-xl p-1">
                                    <TabsTrigger
                                        value="overview"
                                        className="flex items-center gap-2"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="trends"
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Trends
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="subjects"
                                        className="flex items-center gap-2"
                                    >
                                        <Book className="w-4 h-4" />
                                        Subjects
                                    </TabsTrigger>
                                    {/* <TabsTrigger
                                        value="divisions"
                                        className="flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Division Comparision
                                    </TabsTrigger> */}
                                    <TabsTrigger
                                        value="performance"
                                        className="flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        Faculty
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-6">
                                <TabsContent
                                    value="overview"
                                    className="space-y-6 mt-0"
                                >
                                    <div className="grid grid-cols-1 gap-6">
                                        <SubjectRatingsChart
                                            data={
                                                processedData?.subjectRatings ||
                                                []
                                            }
                                            isLoading={analyticsDataLoading}
                                        />
                                        {/* <DivisionComparisonChart
                                            data={
                                                processedData?.divisionComparisons ||
                                                []
                                            }
                                        /> */}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="subjects"
                                    className="space-y-6 mt-0"
                                >
                                    <SubjectRatingsChart
                                        data={
                                            processedData?.subjectRatings || []
                                        }
                                        isLoading={analyticsDataLoading}
                                    />
                                </TabsContent>

                                {/* <TabsContent
                                    value="divisions"
                                    className="space-y-6 mt-0"
                                >
                                    <DivisionComparisonChart
                                        data={
                                            processedData?.divisionComparisons ||
                                            []
                                        }
                                        isLoading={analyticsDataLoading}
                                    />
                                </TabsContent> */}

                                <TabsContent
                                    value="trends"
                                    className="space-y-6 mt-0"
                                >
                                    <SemesterTrendsChart
                                        data={
                                            processedData?.semesterTrends || []
                                        }
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="performance"
                                    className="space-y-6 mt-0"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <FacultyPerformanceChart
                                            data={
                                                processedData?.facultyPerformance ||
                                                []
                                            }
                                        />
                                        <DivisionComparisonChart
                                            data={
                                                processedData?.divisionComparisons ||
                                                []
                                            }
                                        />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
