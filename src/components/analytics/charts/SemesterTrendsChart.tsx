/**
 * @file src/components/analytics/charts/SemesterTrendsChart.tsx
 * @description Semester performance trends visualization
 */

import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { SemesterTrend } from "@/interfaces/analytics";

// Assuming SemesterTrend interface is defined elsewhere, e.g., in analytics.ts
// It should look something like this:
// interface SemesterTrend {
//     semester: number;
//     subject: string;
//     averageRating: number;
//     responseCount: number;
// }

interface SemesterTrendsChartProps {
    data: SemesterTrend[];
    isLoading?: boolean;
    chartType?: "line" | "area";
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // Find the main payload for the overall average rating line/area
        const mainTrend = payload.find(
            (p: any) => p.dataKey === "averageRating"
        );
        const semesterDetails = mainTrend?.payload?.details || []; // Access the 'details' array for individual subjects

        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-semibold text-light-text dark:text-dark-text mb-3">
                    Semester {label}
                </p>
                {/* Display overall average rating for the semester */}
                {mainTrend && (
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary-main" />
                            <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                Overall Avg Rating:
                            </span>
                        </div>
                        <span className="font-bold text-lg text-primary-main">
                            {mainTrend.value
                                ? mainTrend.value.toFixed(2)
                                : "N/A"}
                        </span>
                    </div>
                )}

                {/* Display individual subject ratings if available for this semester */}
                {semesterDetails.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-light-secondary dark:border-dark-secondary">
                        <p className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                            Subject Breakdown:
                        </p>
                        {semesterDetails.map(
                            (detail: SemesterTrend, index: number) => (
                                <div
                                    key={index}
                                    className="flex flex-col mb-1 last:mb-0"
                                >
                                    <span className="text-xs font-medium text-light-text dark:text-dark-text truncate">
                                        {detail.subjectAbbreviation}:{" "}
                                        <span className="font-bold text-primary-main">
                                            {detail.averageRating.toFixed(2)}
                                        </span>{" "}
                                        ({detail.responseCount} responses)
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export const SemesterTrendsChart: React.FC<SemesterTrendsChartProps> = ({
    data,
    isLoading = false,
    chartType = "line",
}) => {
    // Process data to get overall semester trends and detailed subject trends
    const { processedData, subjectTrends, stats } = useMemo(() => {
        // Group data by semester to calculate overall average rating and total responses per semester
        const semesterGroups = data.reduce((acc, item) => {
            if (!acc[item.semester]) {
                acc[item.semester] = [];
            }
            acc[item.semester].push(item);
            return acc;
        }, {} as Record<number, SemesterTrend[]>);

        // Create main chart data structure for semester averages
        const semesters = Object.keys(semesterGroups)
            .map(Number)
            .sort((a, b) => a - b);

        const processedChartData = semesters.map((semester) => {
            const semesterData = semesterGroups[semester];
            const avgRating =
                semesterData.reduce(
                    (sum, item) => sum + item.averageRating,
                    0
                ) / semesterData.length;
            const totalResponses = semesterData.reduce(
                (sum, item) => sum + item.responseCount,
                0
            );

            return {
                semester,
                averageRating: Number(avgRating.toFixed(2)),
                totalResponses,
                subjects: semesterData.length,
                details: semesterData, // Keep original data for detailed tooltip
            };
        });

        // Get unique subjects and their overall trends/stats
        const uniqueSubjects = [...new Set(data.map((item) => item.subject))];

        const calculatedSubjectTrends = uniqueSubjects.map((subject) => {
            const subjectData = data.filter((item) => item.subject === subject);
            const trend = subjectData
                .map((item) => ({
                    semester: item.semester,
                    rating: item.averageRating,
                    responses: item.responseCount,
                }))
                .sort((a, b) => a.semester - b.semester);

            const avgRating =
                subjectData.reduce((sum, item) => sum + item.averageRating, 0) /
                subjectData.length;
            const totalResponses = subjectData.reduce(
                (sum, item) => sum + item.responseCount,
                0
            );

            return {
                subject,
                trend,
                avgRating: Number(avgRating.toFixed(2)),
                totalResponses,
            };
        });

        // Calculate overall statistics
        const overallAvgRating =
            data.reduce((sum, item) => sum + item.averageRating, 0) /
            data.length;
        const overallTotalResponses = data.reduce(
            (sum, item) => sum + item.responseCount,
            0
        );
        const semesterRange =
            data.length > 0
                ? {
                      min: Math.min(...data.map((item) => item.semester)),
                      max: Math.max(...data.map((item) => item.semester)),
                  }
                : null;

        const calculatedStats =
            data.length > 0
                ? {
                      avgRating: Number(overallAvgRating.toFixed(2)),
                      totalResponses: overallTotalResponses,
                      uniqueSubjects: uniqueSubjects.length,
                      semesterRange,
                  }
                : null;

        return {
            processedData: processedChartData,
            subjectTrends: calculatedSubjectTrends,
            stats: calculatedStats,
        };
    }, [data]);

    // --- Loading State ---
    if (isLoading) {
        return (
            <Card className="border rounded-2xl shadow-sm bg-light-background dark:bg-dark-muted-background">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <TrendingUp className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Semester Performance Trends
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                Loading trend data...
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // --- No Data State ---
    if (!data.length) {
        return (
            <Card className="border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm bg-light-background dark:bg-dark-muted-background">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <TrendingUp className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Semester Performance Trends
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-light-muted-text dark:text-dark-muted-text opacity-50" />
                            <p className="text-light-text dark:text-dark-text font-medium mb-2">
                                No trend data available
                            </p>
                            <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                Try adjusting your filters
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const ChartComponent = chartType === "area" ? AreaChart : LineChart;

    return (
        <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
            <CardHeader className="">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <TrendingUp className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Semester Performance Trends
                        </CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                        {stats?.avgRating && (
                            <Badge
                                variant="outline"
                                className="text-sm text-light-text dark:text-dark-text"
                            >
                                Avg Overall: {stats.avgRating}
                            </Badge>
                        )}
                        {stats?.uniqueSubjects && (
                            <Badge
                                variant="outline"
                                className="text-sm text-light-text dark:text-dark-text"
                            >
                                Subjects: {stats.uniqueSubjects}
                            </Badge>
                        )}
                    </div>
                </div>
                {stats?.semesterRange && (
                    <div className="text-md text-light-muted-text dark:text-dark-muted-text md:text-sm sm:text-xs text-center md:text-left">
                        Tracking performance from Semester{" "}
                        {stats.semesterRange.min} to {stats.semesterRange.max} •{" "}
                        {stats.totalResponses} total responses
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ChartComponent
                        data={processedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        className="fill-light-text dark:fill-dark-text"
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#AAAAAA"
                            strokeOpacity={0.2}
                        />
                        <XAxis
                            dataKey="semester"
                            fontSize={12}
                            stroke="#AAAAAA"
                            tickFormatter={(value) => `Sem ${value}`}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            fontSize={12}
                            stroke="#AAAAAA"
                            label={{
                                value: "Rating (0-10)",
                                angle: -90,
                                position: "insideLeft",
                                offset: -10,
                                style: {
                                    fontSize: 12,
                                    fill: "#AAAAAA",
                                },
                            }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                fill: "currentColor", // Tailwind current color, adjust for specific highlight
                                opacity: 0.05,
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => (
                                <span className="text-md gap-2 text-light-text dark:text-dark-text">
                                    {value}
                                </span>
                            )}
                        />

                        {chartType === "area" ? (
                            <Area
                                type="monotone"
                                dataKey="averageRating"
                                stroke="#3b82f6" // Primary color for the line/area
                                fill="url(#colorAverageRating)" // Refer to gradient fill below
                                fillOpacity={1}
                                strokeWidth={2}
                                name="Average Rating"
                                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                                activeDot={{
                                    r: 6,
                                    stroke: "#3b82f6",
                                    strokeWidth: 2,
                                }}
                            />
                        ) : (
                            <Line
                                type="monotone"
                                dataKey="averageRating"
                                stroke="#3b82f6" // Primary color for the line
                                strokeWidth={2}
                                name="Average Rating"
                                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                                activeDot={{
                                    r: 6,
                                    stroke: "#3b82f6",
                                    strokeWidth: 2,
                                }}
                            />
                        )}
                        {/* Define a gradient for the area chart fill */}
                        {chartType === "area" && (
                            <defs>
                                <linearGradient
                                    id="colorAverageRating"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.2}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                        )}
                    </ChartComponent>
                </ResponsiveContainer>

                {/* Subject Performance Breakdown */}
                {subjectTrends.length > 0 && (
                    <>
                        <h4 className="text-lg font-medium text-light-text dark:text-dark-text mt-6 pt-6 border-t border-light-secondary dark:border-dark-secondary mb-4">
                            Subject Performance Breakdown
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjectTrends.slice(0, 6).map((subject) => (
                                <div
                                    key={subject.subject}
                                    className="p-4 border border-light-secondary dark:border-dark-secondary rounded-lg bg-light-secondary dark:bg-dark-tertiary"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h5
                                            className="font-semibold text-light-text dark:text-dark-text text-md truncate"
                                            title={subject.subject}
                                        >
                                            {subject.subject}
                                        </h5>
                                        <Badge
                                            variant="outline"
                                            className={`text-sm ${
                                                subject.avgRating >= 8
                                                    ? "text-green-600 border-green-600/50"
                                                    : subject.avgRating >= 7.0
                                                    ? "text-blue-600 border-blue-600/50"
                                                    : "text-orange-600 border-orange-600/50"
                                            }`}
                                        >
                                            {subject.avgRating}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-light-muted-text dark:text-dark-muted-text">
                                        {subject.totalResponses} responses
                                        across {subject.trend.length} semesters
                                    </div>
                                </div>
                            ))}
                        </div>
                        {subjectTrends.length > 6 && (
                            <div className="text-center mt-4">
                                <Badge
                                    variant="outline"
                                    className="text-sm text-light-muted-text dark:text-dark-muted-text"
                                >
                                    +{subjectTrends.length - 6} more subjects
                                </Badge>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default SemesterTrendsChart;
