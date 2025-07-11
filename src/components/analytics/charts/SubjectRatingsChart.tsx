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
                    {label} {/* Display subjectAbbreviation as the label */}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4 mb-2"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    entry.color === "#f97316"
                                        ? "bg-[#f97316]"
                                        : "bg-[#9ba2ae]"
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
                            <span className="font-semibold text-light-text dark:text-dark-text">
                                {payload[0].payload.totalOverallResponses}
                            </span>
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
        // Group data by subjectAbbreviation to aggregate multiple faculty entries for same subject
        const subjectGroups = new Map<
            string,
            {
                subjectAbbreviation: string;
                lectureRatings: number[];
                labRatings: number[];
                overallRatings: number[];
                totalLectureResponses: number;
                totalLabResponses: number;
                totalOverallResponses: number;
                facultyNames: string[];
            }
        >();

        data.forEach((item) => {
            const key = item.subjectAbbreviation || item.subjectName;

            if (!subjectGroups.has(key)) {
                subjectGroups.set(key, {
                    subjectAbbreviation:
                        item.subjectAbbreviation || item.subjectName,
                    lectureRatings: [],
                    labRatings: [],
                    overallRatings: [],
                    totalLectureResponses: 0,
                    totalLabResponses: 0,
                    totalOverallResponses: 0,
                    facultyNames: [],
                });
            }

            const group = subjectGroups.get(key)!;

            // Collect ratings (only non-null and > 0)
            if (item.lectureAverageRating && item.lectureAverageRating > 0) {
                group.lectureRatings.push(item.lectureAverageRating);
            }
            if (item.labAverageRating && item.labAverageRating > 0) {
                group.labRatings.push(item.labAverageRating);
            }
            if (item.overallAverageRating && item.overallAverageRating > 0) {
                group.overallRatings.push(item.overallAverageRating);
            }

            // Sum responses
            group.totalLectureResponses += item.totalLectureResponses;
            group.totalLabResponses += item.totalLabResponses;
            group.totalOverallResponses += item.totalOverallResponses;

            // Collect faculty names
            if (
                item.facultyName &&
                !group.facultyNames.includes(item.facultyName)
            ) {
                group.facultyNames.push(item.facultyName);
            }
        });

        // Convert to chart data format
        return Array.from(subjectGroups.values())
            .map((group) => ({
                subject: group.subjectAbbreviation,
                lectureAverageRating:
                    group.lectureRatings.length > 0
                        ? Number(
                              (
                                  group.lectureRatings.reduce(
                                      (sum, r) => sum + r,
                                      0
                                  ) / group.lectureRatings.length
                              ).toFixed(2)
                          )
                        : null,
                labAverageRating:
                    group.labRatings.length > 0
                        ? Number(
                              (
                                  group.labRatings.reduce(
                                      (sum, r) => sum + r,
                                      0
                                  ) / group.labRatings.length
                              ).toFixed(2)
                          )
                        : null,
                overallAverageRating:
                    group.overallRatings.length > 0
                        ? Number(
                              (
                                  group.overallRatings.reduce(
                                      (sum, r) => sum + r,
                                      0
                                  ) / group.overallRatings.length
                              ).toFixed(2)
                          )
                        : null,
                totalLectureResponses: group.totalLectureResponses,
                totalLabResponses: group.totalLabResponses,
                totalOverallResponses: group.totalOverallResponses,
                facultyName: group.facultyNames.join(", "), // Multiple faculties
            }))
            .sort(
                (a, b) =>
                    (b.overallAverageRating || 0) -
                    (a.overallAverageRating || 0)
            );
    }, [data]);

    const stats = useMemo(() => {
        // Group by subjectAbbreviation to get unique subjects
        const subjectGroups = new Map<
            string,
            {
                lectureRatings: number[];
                labRatings: number[];
                totalLectureResponses: number;
                totalLabResponses: number;
                totalOverallResponses: number;
            }
        >();

        // Group data by subject abbreviation
        data.forEach((item) => {
            const key = item.subjectAbbreviation || item.subjectName;

            if (!subjectGroups.has(key)) {
                subjectGroups.set(key, {
                    lectureRatings: [],
                    labRatings: [],
                    totalLectureResponses: 0,
                    totalLabResponses: 0,
                    totalOverallResponses: 0,
                });
            }

            const group = subjectGroups.get(key)!;

            // Add lecture rating if it exists and is > 0
            if (item.lectureAverageRating && item.lectureAverageRating > 0) {
                group.lectureRatings.push(item.lectureAverageRating);
            }

            // Add lab rating if it exists and is > 0
            if (item.labAverageRating && item.labAverageRating > 0) {
                group.labRatings.push(item.labAverageRating);
            }

            // Sum up responses
            group.totalLectureResponses += item.totalLectureResponses;
            group.totalLabResponses += item.totalLabResponses;
            group.totalOverallResponses += item.totalOverallResponses;
        });

        // Calculate aggregated stats
        const uniqueSubjects = subjectGroups.size;
        let totalLectureRatings = 0;
        let totalLabRatings = 0;
        let lectureRatingCount = 0;
        let labRatingCount = 0;
        let totalResponses = 0;

        subjectGroups.forEach((group) => {
            // Calculate average for this subject's lecture ratings
            if (group.lectureRatings.length > 0) {
                const subjectLectureAvg =
                    group.lectureRatings.reduce(
                        (sum, rating) => sum + rating,
                        0
                    ) / group.lectureRatings.length;
                totalLectureRatings += subjectLectureAvg;
                lectureRatingCount++;
            }

            // Calculate average for this subject's lab ratings
            if (group.labRatings.length > 0) {
                const subjectLabAvg =
                    group.labRatings.reduce((sum, rating) => sum + rating, 0) /
                    group.labRatings.length;
                totalLabRatings += subjectLabAvg;
                labRatingCount++;
            }

            totalResponses += group.totalOverallResponses;
        });

        const avgLectureRating =
            lectureRatingCount > 0
                ? totalLectureRatings / lectureRatingCount
                : 0;
        const avgLabRating =
            labRatingCount > 0 ? totalLabRatings / labRatingCount : 0;

        console.log("Aggregated Stats by Subject:", {
            uniqueSubjects,
            subjectsWithLectureRatings: lectureRatingCount,
            subjectsWithLabRatings: labRatingCount,
            avgLectureRating: Number(avgLectureRating.toFixed(2)),
            avgLabRating: Number(avgLabRating.toFixed(2)),
            totalResponses,
            subjectBreakdown: Array.from(subjectGroups.entries()).map(
                ([subject, group]) => ({
                    subject,
                    lectureAvg:
                        group.lectureRatings.length > 0
                            ? (
                                  group.lectureRatings.reduce(
                                      (sum, r) => sum + r,
                                      0
                                  ) / group.lectureRatings.length
                              ).toFixed(2)
                            : "N/A",
                    labAvg:
                        group.labRatings.length > 0
                            ? (
                                  group.labRatings.reduce(
                                      (sum, r) => sum + r,
                                      0
                                  ) / group.labRatings.length
                              ).toFixed(2)
                            : "N/A",
                    responses: group.totalOverallResponses,
                })
            ),
        });

        return {
            totalSubjects: uniqueSubjects,
            avgLectureRating: Number(avgLectureRating.toFixed(2)),
            avgLabRating: Number(avgLabRating.toFixed(2)),
            totalResponses,
        };
    }, [data]);

    if (isLoading) {
        return (
            <Card className=" border rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <BookOpen className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
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
            <Card className=" border border-light-secondary dark:border-dark-secondary rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <BookOpen className="h-5 w-5" />
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
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                            <BookOpen className="h-5 w-5 text-light-highlight dark:text-dark-highlight" />
                        </div>
                        <CardTitle className="text-light-text dark:text-dark-text">
                            Subject Ratings Comparison
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-light-text dark:text-dark-text" />
                            <Badge
                                variant="outline"
                                className="text-sm text-light-text dark:text-dark-text"
                            >
                                Lecture: {stats.avgLectureRating}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Laptop className="h-5 w-5 text-light-text dark:text-dark-text" />
                            <Badge
                                variant="outline"
                                className="text-sm text-light-text dark:text-dark-text"
                            >
                                Lab: {stats.avgLabRating}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                    Comparing ratings across {stats.totalSubjects} subjects •{" "}
                    {stats.totalResponses} total responses
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={425}>
                    <BarChart
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
                            dataKey="subject"
                            textAnchor="middle"
                            height={10}
                            interval={0}
                            fontSize={12}
                            stroke="#AAAAAA"
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            fontSize={12}
                            stroke="#AAAAAA"
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                fill: "#f97316",
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
                        <Bar
                            dataKey="lectureAverageRating"
                            fill="#f97316"
                            name="Lecture Rating"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="labAverageRating"
                            fill="#9ca3af"
                            name="Lab Rating"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Summary Statistics */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-light-secondary dark:border-dark-secondary">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {stats.totalSubjects}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Subjects
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                            {stats.totalResponses}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Responses
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#f97316]">
                            {stats.avgLectureRating}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Avg Lecture Rating
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-[#9ca3af]">
                            {stats.avgLabRating}
                        </div>
                        <div className="text-md text-light-muted-text dark:text-dark-muted-text">
                            Avg Lab Rating
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
