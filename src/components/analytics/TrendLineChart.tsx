// src/components/analytics/TrendLineChart.tsx

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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp } from "lucide-react"; // Using TrendingUp for trend charts

// Actual backend trend data structure
interface ActualTrendData {
    semester: number;
    subject: string; // Keeping subject here, but XAxis will use semester for chronological order
    averageRating: number;
    responseCount: number;
}

interface TrendLineChartProps {
    data: ActualTrendData[];
    isLoading?: boolean;
    title?: string;
    subtitle?: string;
    height?: number; // Defaulting to 400 for consistency with BarChart ResponsiveContainer height
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload; // Get the full data object for the hovered point
        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-semibold text-light-text dark:text-dark-text mb-3">
                    Semester: {label}
                </p>
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                        <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Average Rating:
                        </span>
                    </div>
                    <span className="font-semibold text-light-text dark:text-dark-text">
                        {dataPoint.averageRating
                            ? dataPoint.averageRating.toFixed(2)
                            : "N/A"}
                    </span>
                </div>
                {dataPoint.responseCount && (
                    <div className="mt-3 pt-2 border-t border-light-secondary dark:border-dark-secondary">
                        <span className="text-xs text-light-muted-text dark:text-dark-muted-text">
                            Total Responses:{" "}
                            <span className="font-semibold text-light-text dark:text-dark-text">
                                {dataPoint.responseCount}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
    data,
    isLoading = false,
    title = "Rating Trends Over Time",
    subtitle = "Track performance changes across semesters",
    height = 400, // Adjusted for consistency with SubjectRatingsChart's ResponsiveContainer height
}) => {
    const chartData = useMemo(() => {
        // Sort data by semester to ensure correct trend line
        return [...data].sort((a, b) => a.semester - b.semester);
    }, [data]);

    const stats = useMemo(() => {
        const totalSemesters = new Set(data.map((d) => d.semester)).size;
        const totalResponses = data.reduce(
            (sum, d) => sum + d.responseCount,
            0
        );

        const validRatings = data
            .filter((d) => d.averageRating > 0)
            .map((d) => d.averageRating);
        const overallAverageRating =
            validRatings.length > 0
                ? (
                      validRatings.reduce((sum, rating) => sum + rating, 0) /
                      validRatings.length
                  ).toFixed(2)
                : "N/A";

        return {
            totalSemesters,
            totalResponses,
            overallAverageRating,
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
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        style={{ height: height }}
                        className="flex items-center justify-center"
                    >
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
                            {title}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div
                        style={{ height: height }}
                        className="flex items-center justify-center"
                    >
                        <div className="text-center">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-light-muted-text dark:text-dark-muted-text opacity-50" />
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

    return (
        <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <TrendingUp className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            {title}
                        </CardTitle>
                    </div>
                    {/* Placeholder for additional stats or filters on the right, similar to SubjectRatingsChart */}
                    <div className="flex items-center gap-4">
                        <Badge
                            variant="outline"
                            className="text-sm text-light-text dark:text-dark-text"
                        >
                            Avg Rating: {stats.overallAverageRating}
                        </Badge>
                    </div>
                </div>
                <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                    {subtitle} • {stats.totalResponses} total responses across{" "}
                    {stats.totalSemesters} semesters
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        className="fill-light-text dark:fill-dark-text"
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#AAAAAA"
                            strokeOpacity={0.2}
                        />
                        <XAxis
                            dataKey="semester" // Use semester for chronological trend
                            textAnchor="middle"
                            height={10}
                            interval={0}
                            fontSize={12}
                            stroke="#AAAAAA" // Color for axis line and tick text
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            fontSize={12}
                            stroke="#AAAAAA" // Color for axis line and tick text
                            label={{
                                value: "Rating (0-10)",
                                angle: -90,
                                position: "insideLeft",
                                offset: -10,
                                style: {
                                    fontSize: 12,
                                    fill: "#AAAAAA"
                                },
                            }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                fill: "#f97316", // Primary brand color
                                opacity: 0.15,
                                radius: 5,
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
                        <Line
                            type="monotone" // For smooth curve
                            dataKey="averageRating"
                            stroke="#f97316" // Primary color for the line
                            name="Average Rating"
                            dot={true} // Show dots on data points
                            activeDot={{
                                stroke: "#f97316",
                                strokeWidth: 2,
                                r: 8,
                            }} // Larger dot on hover
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Summary Statistics */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-light-secondary dark:border-dark-secondary">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {stats.totalSemesters}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Semesters
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {stats.totalResponses}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Total Responses
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#f97316]">
                            {stats.overallAverageRating}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Overall Avg Rating
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TrendLineChart;
