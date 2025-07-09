// src/interfaces/visualAnalytics.ts

import { IdType } from "./common"; // Assuming IdType is defined here

// --- Filter/Dropdown Data Interfaces ---

export interface UniqueFaculty {
    id: IdType;
    firstName: string; // Assuming faculty has first/last name
    lastName: string;
    fullName: string; // Might be useful for display
}

export interface UniqueSubject {
    id: IdType;
    name: string; // Subject name
    code: string; // Subject code
}

// --- Chart Data Interfaces ---

// 1. Grouped Bar Chart Data (Faculty vs. Overall Subject Average)
export interface GroupedBarChartDataItem {
    subjectId: IdType;
    subjectName: string;
    facultyRating: number | null; // Rating for this specific faculty in this subject
    overallAverageRating: number | null; // Overall average rating for this subject across all faculties/forms
}

// 2. Faculty Performance Data for Line Chart (Lecture/Lab Performance over Semesters)
export interface FacultyLineChartDataItem {
    semesterId: IdType;
    semesterName: string;
    academicYearName: string;
    lectureAverage: number | null;
    labAverage: number | null;
    overallAverage: number | null; // Overall average for faculty in that semester
}

// 3. Faculty Radar Chart Data (Lecture/Lab Ratings per Subject)
// Assuming axes are subjects, and values are lecture/lab ratings
export interface FacultyRadarChartDataItem {
    subjectId: IdType;
    subjectName: string;
    lectureAverage: number | null;
    labAverage: number | null;
    // Add other relevant dimensions if your radar chart uses them (e.g., specific question categories)
}
// The service might return an array of these items, or an object containing them
export type FacultyRadarChartData = FacultyRadarChartDataItem[];

// 4. Subject Performance Data (Grouped by Faculty, Division, Batch)
export type LectureLabType = "LECTURE" | "LAB"; // Re-use if defined elsewhere

export interface SubjectPerformanceBreakdownItem {
    formId: IdType; // The specific form instance ID
    facultyId: IdType;
    facultyName: string;
    divisionId: IdType;
    divisionName: string;
    batch: string;
    semesterName: string; // Context for the form
    academicYearName: string; // Context for the form
    type: LectureLabType; // Whether this is lecture or lab data
    averageRating: number;
    totalResponses: number;
    // Potentially specific question breakdowns if needed
}

// The overall structure for getSubjectPerformanceData
export interface SubjectPerformanceData {
    subjectId: IdType;
    subjectName: string;
    breakdowns: SubjectPerformanceBreakdownItem[];
}
