/**
 * @file src/components/analytics/charts/SubjectRatingsChart.tsx
 * @description Subject ratings visualization with lecture/lab breakdown
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Monitor, Laptop } from "lucide-react";
import { SubjectLectureLabRating } from "@/interfaces/analytics";

interface SubjectRatingsChartProps {
    data: SubjectLectureLabRating[];
    isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-background dark:bg-dark-muted-background p-4 border border-light-secondary dark:border-dark-secondary rounded-xl shadow-lg">
                <p className="font-semibold text-light-text dark:text-dark-text mb-3">
                    {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4 mb-2"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    entry.color === "#3b82f6"
                                        ? "bg-primary-main"
                                        : "bg-secondary-main"
                                }`}
                            />
                            <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                {entry.dataKey === "lectureAverageRating"
                                    ? "Lecture"
                                    : "Lab"}
                                :
                            </span>
                        </div>
                        <span className="font-semibold text-light-text dark:text-dark-text">
                            {entry.value ? entry.value.toFixed(2) : "N/A"}
                        </span>
                    </div>
                ))}
                {payload[0]?.payload?.totalOverallResponses && (
                    <div className="mt-3 pt-2 border-t border-light-secondary dark:border-dark-secondary">
                        <span className="text-xs text-light-muted-text dark:text-dark-muted-text">
                            Total Responses:{" "}
                            {payload[0].payload.totalOverallResponses}
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export const SubjectRatingsChart: React.FC<SubjectRatingsChartProps> = ({
    data,
    isLoading = false,
}) => {
    const chartData = useMemo(() => {
        return data
            .map((item) => ({
                subject: item.subjectName,
                lectureAverageRating: item.lectureAverageRating,
                labAverageRating: item.labAverageRating,
                overallAverageRating: item.overallAverageRating,
                totalLectureResponses: item.totalLectureResponses,
                totalLabResponses: item.totalLabResponses,
                totalOverallResponses: item.totalOverallResponses,
                facultyName: item.facultyName,
            }))
            .sort(
                (a, b) =>
                    (b.overallAverageRating || 0) -
                    (a.overallAverageRating || 0)
            );
    }, [data]);

    const stats = useMemo(() => {
        const totalSubjects = data.length;
        const avgLectureRating =
            data.reduce(
                (sum, item) => sum + (item.lectureAverageRating || 0),
                0
            ) / totalSubjects;
        const avgLabRating =
            data.reduce((sum, item) => sum + (item.labAverageRating || 0), 0) /
            totalSubjects;
        const totalResponses = data.reduce(
            (sum, item) => sum + item.totalOverallResponses,
            0
        );

        return {
            totalSubjects,
            avgLectureRating: Number(avgLectureRating.toFixed(2)),
            avgLabRating: Number(avgLabRating.toFixed(2)),
            totalResponses,
        };
    }, [data]);

    if (isLoading) {
        return (
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary-lighter dark:bg-primary-darker">
                            <BookOpen className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Subject Ratings Comparison
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-main border-t-transparent mx-auto mb-4"></div>
                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                Loading chart data...
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
                            <BookOpen className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Subject Ratings Comparison
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <div className="text-center">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-light-muted-text dark:text-dark-muted-text opacity-50" />
                            <p className="text-light-text dark:text-dark-text font-medium mb-2">
                                No subject ratings data available
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
                            <BookOpen className="h-5 w-5 text-primary-main" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Subject Ratings Comparison
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-primary-main" />
                            <Badge
                                variant="outline"
                                className="text-primary-main border-primary-main"
                            >
                                Lecture: {stats.avgLectureRating}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Laptop className="h-4 w-4 text-secondary-main" />
                            <Badge
                                variant="outline"
                                className="text-secondary-main border-secondary-main"
                            >
                                Lab: {stats.avgLabRating}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                    Comparing lecture and lab ratings across{" "}
                    {stats.totalSubjects} subjects • {stats.totalResponses}{" "}
                    total responses
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-light-secondary dark:stroke-dark-secondary opacity-30"
                        />
                        <XAxis
                            dataKey="subject"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            fontSize={12}
                            className="fill-light-muted-text dark:fill-dark-muted-text"
                        />
                        <YAxis
                            domain={[0, 5]}
                            fontSize={12}
                            className="fill-light-muted-text dark:fill-dark-muted-text"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="rect"
                        />
                        <Bar
                            dataKey="lectureAverageRating"
                            fill="hsl(var(--primary))"
                            name="Lecture Rating"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="labAverageRating"
                            fill="hsl(var(--secondary))"
                            name="Lab Rating"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Summary Statistics */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-light-secondary dark:border-dark-secondary">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {stats.totalSubjects}
                        </div>
                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Subjects Evaluated
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary-main">
                            {stats.avgLectureRating}
                        </div>
                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Avg Lecture Rating
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-secondary-main">
                            {stats.avgLabRating}
                        </div>
                        <div className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            Avg Lab Rating
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
