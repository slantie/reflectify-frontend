/**
 * @file src/app/(main)/analytics/AnalyticsPage.tsx
 * @description Completely revamped analytics dashboard with clean architecture
 */

"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
    BarChart3,
    TrendingUp,
    Users,
    Eye,
    RefreshCw,
    Download,
    Settings,
} from "lucide-react";

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

    // Computed states
    const isLoading = filterDictionaryLoading || analyticsDataLoading;
    const hasError = filterDictionaryError || analyticsDataError;
    const hasData = processedData && processedData.overallStats;

    // Event handlers
    const handleFiltersChange = (newFilters: AnalyticsFilterParams) => {
        setFilters(newFilters);
    };

    const handleRefresh = async () => {
        await invalidateAll();
        await refetchAnalyticsData();
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log("Exporting analytics data...", { filters, data: rawData });
    };

    // Memoized tab content to prevent unnecessary re-renders
    const tabContent = useMemo(
        () => ({
            overview: (
                <div className="space-y-6">
                    <AnalyticsOverview
                        stats={processedData?.overallStats}
                        isLoading={isLoading}
                    />

                    {hasData && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <SubjectRatingsChart
                                data={processedData.subjectRatings.slice(0, 8)}
                                isLoading={isLoading}
                            />
                            <DivisionComparisonChart
                                data={processedData.divisionComparisons.slice(
                                    0,
                                    6
                                )}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>
            ),
            subjects: (
                <div className="space-y-6">
                    <SubjectRatingsChart
                        data={processedData?.subjectRatings || []}
                        isLoading={isLoading}
                    />

                    {processedData?.lectureLabComparison && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-4">
                                    <BarChart3 className="h-5 w-5" />
                                    Lecture vs Lab Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {
                                                processedData
                                                    .lectureLabComparison
                                                    .lectureAverageRating
                                            }
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Lecture Average
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {
                                                processedData
                                                    .lectureLabComparison
                                                    .totalLectureResponses
                                            }{" "}
                                            responses
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {
                                                processedData
                                                    .lectureLabComparison
                                                    .labAverageRating
                                            }
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Lab Average
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {
                                                processedData
                                                    .lectureLabComparison
                                                    .totalLabResponses
                                            }{" "}
                                            responses
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {(
                                                (processedData
                                                    .lectureLabComparison
                                                    .lectureAverageRating +
                                                    processedData
                                                        .lectureLabComparison
                                                        .labAverageRating) /
                                                2
                                            ).toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Combined Average
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {processedData.lectureLabComparison
                                                .totalLectureResponses +
                                                processedData
                                                    .lectureLabComparison
                                                    .totalLabResponses}{" "}
                                            total responses
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            ),
            divisions: <div className="space-y-6"></div>,
            trends: (
                <div className="space-y-6">
                    <SemesterTrendsChart
                        data={processedData?.semesterTrends || []}
                        isLoading={isLoading}
                        chartType="area"
                    />
                    <SemesterTrendsChart
                        data={processedData?.semesterTrends || []}
                        isLoading={isLoading}
                        chartType="line"
                    />
                </div>
            ),
            performance: (
                <div className="space-y-6">
                    <FacultyPerformanceChart
                        data={processedData?.facultyPerformance || []}
                        isLoading={isLoading}
                        showTop={12}
                    />
                    <DivisionComparisonChart
                        data={processedData?.divisionComparisons || []}
                        isLoading={isLoading}
                        chartType="scatter"
                    />
                </div>
            ),
        }),
        [processedData, isLoading, hasData]
    );

    // Error state
    if (hasError) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="text-red-600 mb-4">
                                <BarChart3 className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-red-900 mb-2">
                                Error Loading Analytics Data
                            </h3>
                            <p className="text-red-700 mb-4">
                                {filterDictionaryError?.message ||
                                    analyticsDataError?.message ||
                                    "An unexpected error occurred"}
                            </p>
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                className="border-red-300 text-red-700"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6 bg-light-background dark:bg-dark-background">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Comprehensive feedback analytics and insights
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={!hasData}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <button
                        onClick={handleExport}
                        disabled={!hasData}
                        className="flex-1 bg-transparent border-2 border-primary-main text-light-highlight dark:text-dark-highlight py-2.5 px-4 rounded-xl
                            hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2
                            transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Export
                    </button>
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isLoading}
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${
                                isLoading ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {/* Filters */}
            <AnalyticsFilters
                filterDictionary={filterDictionary}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onRefresh={handleRefresh}
                isLoading={isLoading}
            />
            {/* Quick Stats */}
            {hasData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-700 text-sm font-medium">
                                        Total Responses
                                    </p>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {processedData.overallStats?.totalResponses?.toLocaleString() ||
                                            0}
                                    </p>
                                </div>
                                <Eye className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-700 text-sm font-medium">
                                        Average Rating
                                    </p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {processedData.overallStats?.averageRating?.toFixed(
                                            2
                                        ) || "N/A"}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-700 text-sm font-medium">
                                        Faculty Evaluated
                                    </p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {processedData.overallStats
                                            ?.uniqueFaculties || 0}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-700 text-sm font-medium">
                                        Subjects Covered
                                    </p>
                                    <p className="text-2xl font-bold text-orange-900">
                                        {processedData.overallStats
                                            ?.uniqueSubjects || 0}
                                    </p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {/* Main Content Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(value: any) => setActiveTab(value)}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="overview"
                        className="flex items-center gap-4"
                    >
                        <Eye className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="subjects"
                        className="flex items-center gap-4"
                    >
                        <BarChart3 className="h-4 w-4" />
                        Subjects
                    </TabsTrigger>
                    <TabsTrigger
                        value="trends"
                        className="flex items-center gap-4"
                    >
                        <TrendingUp className="h-4 w-4" />
                        Trends
                    </TabsTrigger>
                    <TabsTrigger
                        value="performance"
                        className="flex items-center gap-4"
                    >
                        <Users className="h-4 w-4" />
                        Performance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {tabContent.overview}
                </TabsContent>

                <TabsContent value="subjects" className="space-y-6">
                    {tabContent.subjects}
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    {tabContent.performance}
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                    {tabContent.trends}
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    {tabContent.performance}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AnalyticsPage;
