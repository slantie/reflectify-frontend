/**
 * @file src/interfaces/visualAnalytics.ts
 * @description Interfaces for visual analytics data and chart structures
 */

import { IdType } from "./common";

/**
 * Unique faculty for dropdowns/filters.
 */
export interface UniqueFaculty {
    id: IdType;
    firstName: string;
    lastName: string;
    fullName: string;
}

/**
 * Unique subject for dropdowns/filters.
 */
export interface UniqueSubject {
    id: IdType;
    name: string;
    code: string;
}

/**
 * Grouped bar chart data (faculty vs. overall subject average).
 */
export interface GroupedBarChartDataItem {
    subjectId: IdType;
    subjectName: string;
    facultyRating: number | null;
    overallAverageRating: number | null;
}

/**
 * Faculty performance data for line chart (lecture/lab performance over semesters).
 */
export interface FacultyLineChartDataItem {
    semesterId: IdType;
    semesterName: string;
    academicYearName: string;
    lectureAverage: number | null;
    labAverage: number | null;
    overallAverage: number | null;
}

/**
 * Faculty radar chart data (lecture/lab ratings per subject).
 */
export interface FacultyRadarChartDataItem {
    subjectId: IdType;
    subjectName: string;
    lectureAverage: number | null;
    labAverage: number | null;
}
export type FacultyRadarChartData = FacultyRadarChartDataItem[];

/**
 * Type for lecture/lab distinction (re-used from analytics if needed).
 */
export type LectureLabType = "LECTURE" | "LAB";

/**
 * Subject performance breakdown item (grouped by faculty, division, batch).
 */
export interface SubjectPerformanceBreakdownItem {
    formId: IdType;
    facultyId: IdType;
    facultyName: string;
    divisionId: IdType;
    divisionName: string;
    batch: string;
    semesterName: string;
    academicYearName: string;
    type: LectureLabType;
    averageRating: number;
    totalResponses: number;
}

/**
 * Overall structure for getSubjectPerformanceData.
 */
export interface SubjectPerformanceData {
    subjectId: IdType;
    subjectName: string;
    breakdowns: SubjectPerformanceBreakdownItem[];
}
