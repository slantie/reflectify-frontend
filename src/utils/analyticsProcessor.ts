/**
 * @file src/utils/analyticsProcessor.ts
 * @description Analytics data processing utilities for frontend charts and stats
 */

import {
    FeedbackSnapshot,
    SubjectLectureLabRating,
    SemesterTrend,
    DivisionBatchComparison,
    FacultyOverallPerformanceSummary,
    LectureLabType,
} from "@/interfaces/analytics";

export const parseResponseValue = (responseValue: any): number | null => {
    let value: number | null = null;

    if (typeof responseValue === "number") {
        value = responseValue;
    } else if (typeof responseValue === "string") {
        const parsed = parseFloat(responseValue);
        value = !isNaN(parsed) ? parsed : null;
    } else if (typeof responseValue === "object" && responseValue?.score) {
        value =
            typeof responseValue.score === "number"
                ? responseValue.score
                : null;
    }

    // Convert from 0-5 scale to 0-10 scale, but keep zero as zero
    return value !== null ? (value === 0 ? 0 : value) : null;
};

export const determineLectureType = (
    snapshot: FeedbackSnapshot
): LectureLabType => {
    const categoryName = snapshot.questionCategoryName?.toLowerCase() || "";
    const batch = snapshot.questionBatch?.toLowerCase() || "";

    if (
        categoryName.includes("lab") ||
        categoryName.includes("laboratory") ||
        (batch !== "none" && batch !== "")
    ) {
        return "LAB";
    }
    return "LECTURE";
};

export class AnalyticsDataProcessor {
    static processOverallStats(snapshots: FeedbackSnapshot[]) {
        const validSnapshots = snapshots.filter(
            (s) => s && s.responseValue !== undefined
        );

        const numericResponses = validSnapshots
            .map((s) => parseResponseValue(s.responseValue))
            .filter((val): val is number => val !== null);

        // Filter out zero ratings for average calculation
        const nonZeroResponses = numericResponses;

        const uniqueSubjects = new Set(validSnapshots.map((s) => s.subjectId))
            .size;
        const uniqueFaculties = new Set(validSnapshots.map((s) => s.facultyId))
            .size;
        const uniqueStudents = new Set(
            validSnapshots.map((s) => s.studentId || "unknown")
        ).size;
        const uniqueDepartments = new Set(
            validSnapshots.map((s) => s.departmentId)
        ).size;

        return {
            totalResponses: validSnapshots.length,
            averageRating:
                nonZeroResponses.length > 0
                    ? Number(
                          (
                              nonZeroResponses.reduce(
                                  (sum, val) => sum + val,
                                  0
                              ) / nonZeroResponses.length
                          ).toFixed(2)
                      )
                    : null,
            uniqueSubjects,
            uniqueFaculties,
            uniqueStudents,
            uniqueDepartments,
            responseRate: validSnapshots.length > 0 ? 100 : 0,
        };
    }

    static processSubjectRatings(
        snapshots: FeedbackSnapshot[]
    ): SubjectLectureLabRating[] {
        const subjectGroups = new Map<
            string,
            {
                subjectId: string;
                subjectName: string;
                facultyId?: string;
                facultyName?: string;
                lectureResponses: number[];
                labResponses: number[];
                subjectAbbreviation?: string;
            }
        >();

        snapshots.forEach((snapshot) => {
            const key = `${snapshot.subjectId}-${
                snapshot.facultyId || "unknown"
            }`;
            const score = parseResponseValue(snapshot.responseValue);
            const lectureType = determineLectureType(snapshot);

            if (score === null) return;

            if (!subjectGroups.has(key)) {
                subjectGroups.set(key, {
                    subjectId: snapshot.subjectId,
                    subjectName: snapshot.subjectName,
                    subjectAbbreviation: snapshot.subjectAbbreviation || "",
                    facultyId: snapshot.facultyId,
                    facultyName: snapshot.facultyName,
                    lectureResponses: [],
                    labResponses: [],
                });
            }

            const group = subjectGroups.get(key)!;
            if (lectureType === "LECTURE") {
                group.lectureResponses.push(score);
            } else {
                group.labResponses.push(score);
            }
        });

        return Array.from(subjectGroups.values()).map((group) => {
            const nonZeroLectureResponses = group.lectureResponses.filter(
                (val) => val > 0
            );
            const nonZeroLabResponses = group.labResponses.filter(
                (val) => val > 0
            );

            const lectureAvg =
                nonZeroLectureResponses.length > 0
                    ? nonZeroLectureResponses.reduce(
                          (sum, val) => sum + val,
                          0
                      ) / nonZeroLectureResponses.length
                    : null;

            const labAvg =
                nonZeroLabResponses.length > 0
                    ? nonZeroLabResponses.reduce((sum, val) => sum + val, 0) /
                      nonZeroLabResponses.length
                    : null;

            const allNonZeroResponses = [
                ...nonZeroLectureResponses,
                ...nonZeroLabResponses,
            ];
            const overallAvg =
                allNonZeroResponses.length > 0
                    ? allNonZeroResponses.reduce((sum, val) => sum + val, 0) /
                      allNonZeroResponses.length
                    : null;

            return {
                subjectId: group.subjectId,
                subjectName: group.subjectName,
                subjectAbbreviation: group.subjectAbbreviation || "",
                facultyId: group.facultyId,
                facultyName: group.facultyName,
                lectureAverageRating: lectureAvg
                    ? Number(lectureAvg.toFixed(2))
                    : null,
                labAverageRating: labAvg ? Number(labAvg.toFixed(2)) : null,
                overallAverageRating: overallAvg
                    ? Number(overallAvg.toFixed(2))
                    : null,
                totalLectureResponses: nonZeroLectureResponses.length,
                totalLabResponses: nonZeroLabResponses.length,
                totalOverallResponses: allNonZeroResponses.length,
            };
        });
    }

    static processSemesterTrends(
        snapshots: FeedbackSnapshot[]
    ): SemesterTrend[] {
        const trendGroups = new Map<
            string,
            {
                subject: string;
                semester: number;
                academicYearId: string;
                academicYear: string;
                responses: number[];
            }
        >();

        snapshots.forEach((snapshot) => {
            const key = `${snapshot.subjectName}-${snapshot.semesterNumber}`;
            const score = parseResponseValue(snapshot.responseValue);

            if (score === null) return;

            if (!trendGroups.has(key)) {
                trendGroups.set(key, {
                    subject: snapshot.subjectName,
                    semester: snapshot.semesterNumber,
                    academicYearId: snapshot.academicYearId,
                    academicYear: snapshot.academicYearString,
                    responses: [],
                });
            }

            trendGroups.get(key)!.responses.push(score);
        });

        return Array.from(trendGroups.values())
            .map((group) => ({
                subject: group.subject,
                semester: group.semester,
                academicYearId: group.academicYearId,
                academicYear: group.academicYear,
                averageRating: Number(
                    (
                        group.responses.reduce((sum, val) => sum + val, 0) /
                        group.responses.length
                    ).toFixed(2)
                ),
                responseCount: group.responses.length,
            }))
            .sort(
                (a, b) =>
                    a.semester - b.semester ||
                    a.subject.localeCompare(b.subject)
            );
    }

    static processDivisionComparisons(
        snapshots: FeedbackSnapshot[]
    ): DivisionBatchComparison[] {
        const divisionGroups = new Map<
            string,
            {
                departmentId: string;
                departmentName: string;
                divisionId: string;
                divisionName: string;
                batch: string;
                responses: number[];
            }
        >();

        snapshots.forEach((snapshot) => {
            const batch = snapshot.batch || "General";
            const key = `${snapshot.divisionId}-${batch}`;
            const score = parseResponseValue(snapshot.responseValue);

            if (score === null) return;

            if (!divisionGroups.has(key)) {
                divisionGroups.set(key, {
                    departmentId: snapshot.departmentId,
                    departmentName: snapshot.departmentName,
                    divisionId: snapshot.divisionId,
                    divisionName: snapshot.divisionName,
                    batch,
                    responses: [],
                });
            }

            divisionGroups.get(key)!.responses.push(score);
        });

        return Array.from(divisionGroups.values()).map((group) => ({
            departmentId: group.departmentId,
            departmentName: group.departmentName,
            divisionId: group.divisionId,
            divisionName: group.divisionName,
            batch: group.batch,
            averageRating: Number(
                (
                    group.responses.reduce((sum, val) => sum + val, 0) /
                    group.responses.length
                ).toFixed(2)
            ),
            totalResponses: group.responses.length,
            engagementScore: Math.min(
                10,
                Math.round(group.responses.length / 5)
            ), // Engagement based on response count (scaled to 0-10)
        }));
    }

    static processFacultyPerformance(
        snapshots: FeedbackSnapshot[]
    ): FacultyOverallPerformanceSummary[] {
        const facultyGroups = new Map<
            string,
            {
                facultyId: string;
                facultyName: string;
                academicYearId: string;
                responses: number[];
            }
        >();

        snapshots.forEach((snapshot) => {
            const key = `${snapshot.facultyId}-${snapshot.academicYearId}`;
            const score = parseResponseValue(snapshot.responseValue);

            if (score === null) return;

            if (!facultyGroups.has(key)) {
                facultyGroups.set(key, {
                    facultyId: snapshot.facultyId,
                    facultyName: snapshot.facultyName,
                    academicYearId: snapshot.academicYearId,
                    responses: [],
                });
            }

            facultyGroups.get(key)!.responses.push(score);
        });

        return Array.from(facultyGroups.values())
            .map((group) => ({
                facultyId: group.facultyId,
                facultyName: group.facultyName,
                academicYearId: group.academicYearId,
                averageRating: Number(
                    (
                        group.responses.reduce((sum, val) => sum + val, 0) /
                        group.responses.length
                    ).toFixed(2)
                ),
                totalResponses: group.responses.length,
            }))
            .sort((a, b) => b.averageRating - a.averageRating);
    }

    static processLectureLabComparison(snapshots: FeedbackSnapshot[]) {
        const lectureResponses: number[] = [];
        const labResponses: number[] = [];

        snapshots.forEach((snapshot) => {
            const score = parseResponseValue(snapshot.responseValue);
            if (score === null) return;

            const lectureType = determineLectureType(snapshot);
            if (lectureType === "LECTURE") {
                lectureResponses.push(score);
            } else {
                labResponses.push(score);
            }
        });

        const nonZeroLectureResponses = lectureResponses.filter(
            (val) => val > 0
        );
        const nonZeroLabResponses = labResponses.filter((val) => val > 0);

        const lectureAvg =
            nonZeroLectureResponses.length > 0
                ? nonZeroLectureResponses.reduce((sum, val) => sum + val, 0) /
                  nonZeroLectureResponses.length
                : null;

        const labAvg =
            nonZeroLabResponses.length > 0
                ? nonZeroLabResponses.reduce((sum, val) => sum + val, 0) /
                  nonZeroLabResponses.length
                : null;

        return {
            lectureAverageRating: lectureAvg
                ? Number(lectureAvg.toFixed(2))
                : 0,
            labAverageRating: labAvg ? Number(labAvg.toFixed(2)) : 0,
            totalLectureResponses: nonZeroLectureResponses.length,
            totalLabResponses: nonZeroLabResponses.length,
        };
    }

    static getFilteringOptions(snapshots: FeedbackSnapshot[]) {
        const academicYears = [
            ...new Set(snapshots.map((s) => s.academicYearString)),
        ].sort();
        const departments = [
            ...new Set(snapshots.map((s) => s.departmentName)),
        ].sort();
        const subjects = [
            ...new Set(snapshots.map((s) => s.subjectName)),
        ].sort();
        const semesters = [
            ...new Set(snapshots.map((s) => s.semesterNumber)),
        ].sort((a, b) => a - b);
        const divisions = [
            ...new Set(snapshots.map((s) => s.divisionName)),
        ].sort();

        return {
            academicYears,
            departments,
            subjects,
            semesters,
            divisions,
        };
    }
}
