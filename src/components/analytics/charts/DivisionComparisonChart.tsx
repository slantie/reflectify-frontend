/**
 * @file src/components/analytics/charts/DivisionComparisonChart.tsx
 * @description Division and batch performance comparison visualization
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
    ScatterChart,
    Scatter,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Award, BarChart3 } from "lucide-react";
import { DivisionBatchComparison } from "@/interfaces/analytics";

interface DivisionComparisonChartProps {
    data: DivisionBatchComparison[];
    isLoading?: boolean;
    chartType?: "bar" | "scatter";
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0]?.payload;
        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-semibold text-light-text dark:text-dark-text mb-3">
                    {label}
                </p>
                <div className="space-y-2">
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Division:
                        </span>
                        <span className="font-semibold text-light-text dark:text-dark-text">
                            {data?.divisionName}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Batch:
                        </span>
                        <span className="font-semibold text-light-text dark:text-dark-text">
                            {data?.batch}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Avg Rating:
                        </span>
                        <span className="font-semibold text-light-text dark:text-dark-text">
                            {data?.averageRating?.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Responses:
                        </span>
                        <span className="font-semibold text-light-text dark:text-dark-text">
                            {data?.totalResponses}
                        </span>
                    </div>
                    {data?.engagementScore && (
                        <div className="flex justify-between gap-4">
                            <span className="text-sm text-gray-600">
                                Engagement:
                            </span>
                            <span className="font-medium">
                                {data.engagementScore}/5
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export const DivisionComparisonChart: React.FC<
    DivisionComparisonChartProps
> = ({ data, isLoading = false, chartType = "bar" }) => {
    const chartData = useMemo(() => {
        // Group by division and create comparison data
        const divisionGroups = data.reduce((acc, item) => {
            const key = item.divisionName;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {} as Record<string, DivisionBatchComparison[]>);

        return Object.entries(divisionGroups)
            .map(([division, items]) => {
                const avgRating =
                    items.reduce((sum, item) => sum + item.averageRating, 0) /
                    items.length;
                const totalResponses = items.reduce(
                    (sum, item) => sum + item.totalResponses,
                    0
                );
                const avgEngagement =
                    items.reduce(
                        (sum, item) => sum + (item.engagementScore || 0),
                        0
                    ) / items.length;

                return {
                    division,
                    averageRating: Number(avgRating.toFixed(2)),
                    totalResponses,
                    engagementScore: Number(avgEngagement.toFixed(1)),
                    batchCount: items.length,
                    batches: items,
                    // For scatter plot
                    x: totalResponses,
                    y: avgRating,
                };
            })
            .sort((a, b) => b.averageRating - a.averageRating);
    }, [data]);

    const stats = useMemo(() => {
        if (!data.length) return null;

        const avgRating =
            data.reduce((sum, item) => sum + item.averageRating, 0) /
            data.length;
        const totalResponses = data.reduce(
            (sum, item) => sum + item.totalResponses,
            0
        );
        const uniqueDivisions = new Set(data.map((item) => item.divisionName))
            .size;
        const uniqueBatches = new Set(data.map((item) => item.batch)).size;

        // Find best and worst performing divisions
        const sortedByRating = chartData.sort(
            (a, b) => b.averageRating - a.averageRating
        );
        const bestDivision = sortedByRating[0];
        const worstDivision = sortedByRating[sortedByRating.length - 1];

        return {
            avgRating: Number(avgRating.toFixed(2)),
            totalResponses,
            uniqueDivisions,
            uniqueBatches,
            bestDivision,
            worstDivision,
        };
    }, [data, chartData]);

    if (isLoading) {
        return (
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <Users className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Division Performance Comparison
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                Loading division data...
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
                            <Users className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Division Performance Comparison
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-light-muted-text dark:text-dark-muted-text opacity-50" />
                            <p className="text-light-text dark:text-dark-text font-medium mb-2">
                                No division comparison data available
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
                            <Users className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Division Performance Comparison
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge
                            variant="outline"
                            className="text-primary-main border-primary-main"
                        >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Avg: {stats?.avgRating}
                        </Badge>
                        <Badge variant="outline">
                            {stats?.uniqueDivisions} Divisions
                        </Badge>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Comparing performance across {stats?.uniqueDivisions}{" "}
                    divisions and {stats?.uniqueBatches} batches •{" "}
                    {stats?.totalResponses} total responses
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === "scatter" ? (
                        <ScatterChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                            />
                            <XAxis
                                dataKey="x"
                                name="Total Responses"
                                fontSize={12}
                                stroke="#6b7280"
                                label={{
                                    value: "Total Responses",
                                    position: "insideBottom",
                                    offset: -10,
                                }}
                            />
                            <YAxis
                                dataKey="y"
                                name="Average Rating"
                                domain={[0, 5]}
                                fontSize={12}
                                stroke="#6b7280"
                                label={{
                                    value: "Average Rating",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter
                                name="Divisions"
                                dataKey="y"
                                fill="#3b82f6"
                            />
                        </ScatterChart>
                    ) : (
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f3f4f6"
                            />
                            <XAxis
                                dataKey="division"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                fontSize={12}
                                stroke="#6b7280"
                            />
                            <YAxis
                                domain={[0, 5]}
                                fontSize={12}
                                stroke="#6b7280"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px" }} />
                            <Bar
                                dataKey="averageRating"
                                fill="#3b82f6"
                                name="Average Rating"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>

                {/* Performance Insights */}
                {stats && (
                    <div className="mt-6 pt-6 border-t">
                        <h4 className="text-lg font-medium mb-4">
                            Performance Insights
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Best Performing Division */}
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="h-5 w-5 text-green-600" />
                                    <h5 className="font-medium text-green-800">
                                        Top Performer
                                    </h5>
                                </div>
                                <div className="text-sm text-green-700">
                                    <div className="font-medium">
                                        {stats.bestDivision?.division}
                                    </div>
                                    <div>
                                        Average Rating:{" "}
                                        {stats.bestDivision?.averageRating}
                                    </div>
                                    <div>
                                        {stats.bestDivision?.totalResponses}{" "}
                                        responses from{" "}
                                        {stats.bestDivision?.batchCount} batches
                                    </div>
                                </div>
                            </div>

                            {/* Areas for Improvement */}
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="h-5 w-5 text-orange-600" />
                                    <h5 className="font-medium text-orange-800">
                                        Needs Attention
                                    </h5>
                                </div>
                                <div className="text-sm text-orange-700">
                                    <div className="font-medium">
                                        {stats.worstDivision?.division}
                                    </div>
                                    <div>
                                        Average Rating:{" "}
                                        {stats.worstDivision?.averageRating}
                                    </div>
                                    <div>
                                        {stats.worstDivision?.totalResponses}{" "}
                                        responses from{" "}
                                        {stats.worstDivision?.batchCount}{" "}
                                        batches
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="mt-6">
                            <h5 className="font-medium mb-3">
                                Division Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {chartData.map((division) => (
                                    <div
                                        key={division.division}
                                        className="p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm">
                                                {division.division}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    division.averageRating >= 4
                                                        ? "text-green-600"
                                                        : division.averageRating >=
                                                          3.5
                                                        ? "text-blue-600"
                                                        : "text-orange-600"
                                                }
                                            >
                                                {division.averageRating}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div>
                                                {division.totalResponses}{" "}
                                                responses
                                            </div>
                                            <div>
                                                {division.batchCount} batches
                                            </div>
                                            <div>
                                                Engagement:{" "}
                                                {division.engagementScore}/5
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
