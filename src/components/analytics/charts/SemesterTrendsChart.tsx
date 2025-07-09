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

interface SemesterTrendsChartProps {
    data: SemesterTrend[];
    isLoading?: boolean;
    chartType?: "line" | "area";
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-semibold text-light-text dark:text-dark-text mb-3">
                    Semester {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    entry.stroke === "#3b82f6"
                                        ? "bg-primary-main"
                                        : "bg-secondary-main"
                                }`}
                            />
                            <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                                {entry.payload.subject}
                            </span>
                        </div>
                        <div className="ml-5 text-sm text-light-muted-text dark:text-dark-muted-text">
                            Rating:{" "}
                            <span className="font-semibold text-light-text dark:text-dark-text">
                                {entry.value.toFixed(2)}
                            </span>
                        </div>
                        <div className="ml-5 text-sm text-light-muted-text dark:text-dark-muted-text">
                            Responses:{" "}
                            <span className="font-semibold text-light-text dark:text-dark-text">
                                {entry.payload.responseCount}
                            </span>
                        </div>
                    </div>
                ))}
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
    const processedData = useMemo(() => {
        // Group data by semester
        const semesterGroups = data.reduce((acc, item) => {
            if (!acc[item.semester]) {
                acc[item.semester] = [];
            }
            acc[item.semester].push(item);
            return acc;
        }, {} as Record<number, SemesterTrend[]>);

        // Create chart data structure
        const semesters = Object.keys(semesterGroups)
            .map(Number)
            .sort((a, b) => a - b);

        return semesters.map((semester) => {
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
                details: semesterData,
            };
        });
    }, [data]);

    const subjectTrends = useMemo(() => {
        // Get unique subjects and their trends across semesters
        const subjects = [...new Set(data.map((item) => item.subject))];

        return subjects.map((subject) => {
            const subjectData = data.filter((item) => item.subject === subject);
            const trend = subjectData
                .map((item) => ({
                    semester: item.semester,
                    rating: item.averageRating,
                    responses: item.responseCount,
                }))
                .sort((a, b) => a.semester - b.semester);

            return {
                subject,
                trend,
                avgRating: Number(
                    (
                        subjectData.reduce(
                            (sum, item) => sum + item.averageRating,
                            0
                        ) / subjectData.length
                    ).toFixed(2)
                ),
                totalResponses: subjectData.reduce(
                    (sum, item) => sum + item.responseCount,
                    0
                ),
            };
        });
    }, [data]);

    const stats = useMemo(() => {
        if (!data.length) return null;

        const avgRating =
            data.reduce((sum, item) => sum + item.averageRating, 0) /
            data.length;
        const totalResponses = data.reduce(
            (sum, item) => sum + item.responseCount,
            0
        );
        const uniqueSubjects = new Set(data.map((item) => item.subject)).size;
        const semesterRange =
            data.length > 0
                ? {
                      min: Math.min(...data.map((item) => item.semester)),
                      max: Math.max(...data.map((item) => item.semester)),
                  }
                : null;

        return {
            avgRating: Number(avgRating.toFixed(2)),
            totalResponses,
            uniqueSubjects,
            semesterRange,
        };
    }, [data]);

    if (isLoading) {
        return (
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <TrendingUp className="h-5 w-5 text-primary-main" />
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

    if (!data.length) {
        return (
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <TrendingUp className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Semester Performance Trends
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No trend data available</p>
                            <p className="text-sm">
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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <CardTitle>Semester Performance Trends</CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-green-600">
                            <Target className="h-3 w-3 mr-1" />
                            Avg: {stats?.avgRating}
                        </Badge>
                        <Badge variant="outline">
                            {stats?.uniqueSubjects} Subjects
                        </Badge>
                    </div>
                </div>
                {stats?.semesterRange && (
                    <div className="text-sm text-gray-500">
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
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            dataKey="semester"
                            fontSize={12}
                            stroke="#6b7280"
                            tickFormatter={(value) => `Sem ${value}`}
                        />
                        <YAxis domain={[0, 5]} fontSize={12} stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />

                        {chartType === "area" ? (
                            <Area
                                type="monotone"
                                dataKey="averageRating"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.1}
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
                                stroke="#3b82f6"
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
                    </ChartComponent>
                </ResponsiveContainer>

                {/* Subject Performance Breakdown */}
                {subjectTrends.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                        <h4 className="text-lg font-medium mb-4">
                            Subject Performance Breakdown
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjectTrends.slice(0, 6).map((subject) => (
                                <div
                                    key={subject.subject}
                                    className="p-4 border rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h5
                                            className="font-medium text-sm truncate"
                                            title={subject.subject}
                                        >
                                            {subject.subject}
                                        </h5>
                                        <Badge
                                            variant="outline"
                                            className={
                                                subject.avgRating >= 4
                                                    ? "text-green-600"
                                                    : subject.avgRating >= 3.5
                                                    ? "text-blue-600"
                                                    : "text-orange-600"
                                            }
                                        >
                                            {subject.avgRating}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {subject.totalResponses} responses
                                        across {subject.trend.length} semesters
                                    </div>
                                </div>
                            ))}
                        </div>
                        {subjectTrends.length > 6 && (
                            <div className="text-center mt-4">
                                <Badge variant="secondary">
                                    +{subjectTrends.length - 6} more subjects
                                </Badge>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
