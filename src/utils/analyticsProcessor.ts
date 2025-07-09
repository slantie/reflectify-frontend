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
    if (typeof responseValue === "number") return responseValue;
    if (typeof responseValue === "string") {
        const parsed = parseFloat(responseValue);
        return !isNaN(parsed) ? parsed : null;
    }
    if (typeof responseValue === "object" && responseValue?.score) {
        return typeof responseValue.score === "number"
            ? responseValue.score
            : null;
    }
    return null;
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
                numericResponses.length > 0
                    ? Number(
                          (
                              numericResponses.reduce(
                                  (sum, val) => sum + val,
                                  0
                              ) / numericResponses.length
                          ).toFixed(2)
                      )
                    : null,
            uniqueSubjects,
            uniqueFaculties,
            uniqueStudents,
            uniqueDepartments,
            responseRate: validSnapshots.length > 0 ? 100 : 0, // Placeholder calculation
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
            const lectureAvg =
                group.lectureResponses.length > 0
                    ? group.lectureResponses.reduce(
                          (sum, val) => sum + val,
                          0
                      ) / group.lectureResponses.length
                    : null;

            const labAvg =
                group.labResponses.length > 0
                    ? group.labResponses.reduce((sum, val) => sum + val, 0) /
                      group.labResponses.length
                    : null;

            const allResponses = [
                ...group.lectureResponses,
                ...group.labResponses,
            ];
            const overallAvg =
                allResponses.length > 0
                    ? allResponses.reduce((sum, val) => sum + val, 0) /
                      allResponses.length
                    : null;

            return {
                subjectId: group.subjectId,
                subjectName: group.subjectName,
                facultyId: group.facultyId,
                facultyName: group.facultyName,
                lectureAverageRating: lectureAvg
                    ? Number(lectureAvg.toFixed(2))
                    : null,
                labAverageRating: labAvg ? Number(labAvg.toFixed(2)) : null,
                overallAverageRating: overallAvg
                    ? Number(overallAvg.toFixed(2))
                    : null,
                totalLectureResponses: group.lectureResponses.length,
                totalLabResponses: group.labResponses.length,
                totalOverallResponses: allResponses.length,
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
                5,
                Math.round(group.responses.length / 10)
            ), // Engagement based on response count
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

        const lectureAvg =
            lectureResponses.length > 0
                ? lectureResponses.reduce((sum, val) => sum + val, 0) /
                  lectureResponses.length
                : 0;

        const labAvg =
            labResponses.length > 0
                ? labResponses.reduce((sum, val) => sum + val, 0) /
                  labResponses.length
                : 0;

        return {
            lectureAverageRating: Number(lectureAvg.toFixed(2)),
            labAverageRating: Number(labAvg.toFixed(2)),
            totalLectureResponses: lectureResponses.length,
            totalLabResponses: labResponses.length,
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
