/**
 * @file src/components/analytics/charts/FacultyPerformanceChart.tsx
 * @description Faculty performance visualization with rankings
 */

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Trophy, AlertTriangle } from "lucide-react";
import { FacultyOverallPerformanceSummary } from "@/interfaces/analytics";

interface FacultyPerformanceChartProps {
    data: FacultyOverallPerformanceSummary[];
    isLoading?: boolean;
    showTop?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-medium text-gray-900 mb-2">{label}</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <span className="font-medium">
                            {data?.averageRating?.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">
                            Responses:
                        </span>
                        <span className="font-medium">
                            {data?.totalResponses}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-gray-600">Rank:</span>
                        <span className="font-medium">#{data?.rank}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "#10b981"; // green
    if (rating >= 4.0) return "#3b82f6"; // blue
    if (rating >= 3.5) return "#f59e0b"; // yellow
    if (rating >= 3.0) return "#f97316"; // orange
    return "#ef4444"; // red
};

const PerformanceCard: React.FC<{
    title: string;
    faculty: FacultyOverallPerformanceSummary & { rank: number };
    icon: React.ReactNode;
    colorClass: string;
}> = ({ title, faculty, icon, colorClass }) => (
    <div className={`p-4 border rounded-lg ${colorClass}`}>
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h5 className="font-medium">{title}</h5>
        </div>
        <div className="space-y-1">
            <div className="font-medium text-sm">{faculty.facultyName}</div>
            <div className="text-sm opacity-80">
                Rating: {faculty.averageRating.toFixed(2)} •{" "}
                {faculty.totalResponses} responses
            </div>
            <div className="text-xs opacity-70">Rank #{faculty.rank}</div>
        </div>
    </div>
);

export const FacultyPerformanceChart: React.FC<
    FacultyPerformanceChartProps
> = ({ data, isLoading = false, showTop = 10 }) => {
    const processedData = useMemo(() => {
        return data
            .map((faculty, index) => ({
                ...faculty,
                rank: index + 1,
                name:
                    faculty.facultyName.length > 15
                        ? faculty.facultyName.substring(0, 15) + "..."
                        : faculty.facultyName,
                fullName: faculty.facultyName,
            }))
            .slice(0, showTop);
    }, [data, showTop]);

    const stats = useMemo(() => {
        if (!data.length) return null;

        const avgRating =
            data.reduce((sum, faculty) => sum + faculty.averageRating, 0) /
            data.length;
        const totalResponses = data.reduce(
            (sum, faculty) => sum + faculty.totalResponses,
            0
        );

        const sortedByRating = [...data].sort(
            (a, b) => b.averageRating - a.averageRating
        );
        const topPerformer = { ...sortedByRating[0], rank: 1 };
        const bottomPerformer = {
            ...sortedByRating[sortedByRating.length - 1],
            rank: sortedByRating.length,
        };

        // Find faculty who need improvement (rating < 3.5)
        const needsImprovement = data.filter(
            (f) => f.averageRating < 3.5
        ).length;
        const excellentPerformers = data.filter(
            (f) => f.averageRating >= 4.5
        ).length;

        return {
            avgRating: Number(avgRating.toFixed(2)),
            totalResponses,
            totalFaculty: data.length,
            topPerformer,
            bottomPerformer,
            needsImprovement,
            excellentPerformers,
            averageResponsesPerFaculty: Math.round(
                totalResponses / data.length
            ),
        };
    }, [data]);

    if (isLoading) {
        return (
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <GraduationCap className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Faculty Performance Rankings
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                Loading faculty data...
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
                            <GraduationCap className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Faculty Performance Rankings
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-light-muted-text dark:text-dark-muted-text opacity-50" />
                            <p className="text-light-text dark:text-dark-text font-medium mb-2">
                                No faculty performance data available
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

    return (
        <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <GraduationCap className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Faculty Performance Rankings
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-blue-600">
                            Avg: {stats?.avgRating}
                        </Badge>
                        <Badge variant="outline">
                            {stats?.totalFaculty} Faculty
                        </Badge>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Top {showTop} faculty members ranked by average rating •{" "}
                    {stats?.totalResponses} total responses
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={processedData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            fontSize={11}
                            stroke="#6b7280"
                        />
                        <YAxis domain={[0, 5]} fontSize={12} stroke="#6b7280" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />
                        <Bar
                            dataKey="averageRating"
                            name="Average Rating"
                            radius={[4, 4, 0, 0]}
                            fill="#3b82f6"
                        >
                            {processedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getRatingColor(entry.averageRating)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Performance Insights */}
                {stats && (
                    <div className="mt-6 pt-6 border-t space-y-6">
                        {/* Key Performers */}
                        <div>
                            <h4 className="text-lg font-medium mb-4">
                                Performance Highlights
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <PerformanceCard
                                    title="Top Performer"
                                    faculty={stats.topPerformer}
                                    icon={
                                        <Trophy className="h-5 w-5 text-yellow-600" />
                                    }
                                    colorClass="bg-yellow-50 border-yellow-200"
                                />
                                <PerformanceCard
                                    title="Needs Support"
                                    faculty={stats.bottomPerformer}
                                    icon={
                                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    }
                                    colorClass="bg-orange-50 border-orange-200"
                                />
                            </div>
                        </div>

                        {/* Summary Statistics */}
                        <div>
                            <h4 className="text-lg font-medium mb-4">
                                Summary Statistics
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stats.excellentPerformers}
                                    </div>
                                    <div className="text-sm text-green-700">
                                        Excellent (≥4.5)
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {stats.avgRating}
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        Average Rating
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {stats.needsImprovement}
                                    </div>
                                    <div className="text-sm text-orange-700">
                                        Need Support (&lt;3.5)
                                    </div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {stats.averageResponsesPerFaculty}
                                    </div>
                                    <div className="text-sm text-purple-700">
                                        Avg Responses
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Rankings Table (if more than shown in chart) */}
                        {data.length > showTop && (
                            <div>
                                <h4 className="text-lg font-medium mb-4">
                                    Complete Rankings
                                </h4>
                                <div className="max-h-64 overflow-y-auto border rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="text-left p-3 font-medium">
                                                    Rank
                                                </th>
                                                <th className="text-left p-3 font-medium">
                                                    Faculty
                                                </th>
                                                <th className="text-center p-3 font-medium">
                                                    Rating
                                                </th>
                                                <th className="text-center p-3 font-medium">
                                                    Responses
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((faculty, index) => (
                                                <tr
                                                    key={faculty.facultyId}
                                                    className={
                                                        index < showTop
                                                            ? "bg-blue-50"
                                                            : ""
                                                    }
                                                >
                                                    <td className="p-3">
                                                        #{index + 1}
                                                    </td>
                                                    <td className="p-3 font-medium">
                                                        {faculty.facultyName}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                faculty.averageRating >=
                                                                4
                                                                    ? "text-green-600"
                                                                    : faculty.averageRating >=
                                                                      3.5
                                                                    ? "text-blue-600"
                                                                    : "text-orange-600"
                                                            }
                                                        >
                                                            {faculty.averageRating.toFixed(
                                                                2
                                                            )}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {faculty.totalResponses}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
