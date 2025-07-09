// src/interfaces/analytics.ts

import { IdType } from "./common"; // Assuming IdType is defined here

// --- Core Data Structures ---

// Defines the shape of a single processed feedback record, derived from raw Prisma data
export interface FeedbackSnapshot {
    id: IdType; // Response ID
    academicYearId: IdType;
    academicYearString: string;
    departmentId: IdType;
    departmentName: string;
    departmentAbbreviation: string;
    semesterId: IdType;
    semesterNumber: number;
    divisionId: IdType;
    divisionName: string;
    subjectId: IdType;
    subjectName: string;
    subjectAbbreviation: string | null;
    subjectCode: string | null;
    facultyId: IdType;
    facultyName: string;
    facultyAbbreviation: string | null;
    studentId: IdType | null;
    studentEnrollmentNumber: string;
    formId: IdType;
    formStatus: string;
    questionId: IdType;
    questionType: string; // e.g., 'rating', 'text'
    questionCategoryId: IdType;
    questionCategoryName: string;
    questionBatch: string | null; // e.g., "1", "2", "None"
    responseValue: string; // Keep as string as it comes from DB, parse to number for calculations
    batch: string | null; // Same as questionBatch, for consistency
    submittedAt: string; // Date as ISO string from backend
    createdAt: string; // Date as ISO string from backend
}

// Filter Dictionary (for dropdowns)
export interface FilterDictionary {
    academicYears: Array<{
        id: IdType;
        yearString: string;
        departments: Array<{
            id: IdType;
            name: string;
            abbreviation: string;
            subjects: Array<{
                id: IdType;
                name: string;
                code: string;
                type: string;
            }>;
            semesters: Array<{
                id: IdType;
                semesterNumber: number;
                divisions: Array<{
                    id: IdType;
                    divisionName: string;
                }>;
            }>;
        }>;
    }>;
    lectureTypes: Array<{
        value: LectureLabType;
        label: string;
    }>;
}

// Complete Analytics Data - This is what getCompleteAnalyticsData returns
export interface CompleteAnalyticsData {
    semesters: Array<{
        id: IdType;
        semesterNumber: number;
        departmentId: IdType;
        academicYearId: IdType;
        startDate: string | null;
        endDate: string | null;
        semesterType: string;
        department: {
            id: IdType;
            name: string;
            abbreviation: string;
        };
        academicYear: {
            id: IdType;
            yearString: string;
        };
        responseCount: number;
    }>;
    subjectRatings: Array<{
        subjectId: IdType;
        subjectName: string;
        subjectAbbreviation: string;
        lectureType: LectureLabType;
        averageRating: number;
        responseCount: number;
        semesterNumber: number;
        academicYearId: IdType;
        facultyId: IdType;
        facultyName: string;
    }>;
    semesterTrends: Array<{
        subject: string;
        semester: number;
        averageRating: number;
        responseCount: number;
        academicYearId: IdType;
        academicYear: string;
    }>;
    feedbackSnapshots: FeedbackSnapshot[];
}

// Analytics Filter Parameters (for passing to backend)
export interface AnalyticsFilterParams {
    academicYearId?: IdType;
    departmentId?: IdType;
    subjectId?: IdType;
    semesterId?: IdType;
    divisionId?: IdType;
    lectureType?: "LECTURE" | "LAB";
    includeDeleted?: boolean;
}

// --- Interfaces for Derived/Specific Analytics Data (used for charts/lists) ---

// 1. Overall Semester Rating
export interface OverallSemesterRating {
    averageRating: number;
    totalResponses: number;
    semesterId: IdType;
    semesterName: string;
    academicYearName: string;
    departmentName: string;
}

// 2. Semesters with Responses
export interface SemesterWithResponseCount {
    id: IdType;
    semesterNumber: number;
    departmentId: IdType;
    responseCount: number;
    academicYear: { id: IdType; yearString: string };
    department: { id: IdType; name: string; abbreviation: string };
}

// 3. Subject-Wise Lecture/Lab Rating
export type LectureLabType = "LECTURE" | "LAB";

export interface SubjectLectureLabRating {
    subjectId: IdType;
    subjectName: string;
    facultyId?: IdType;
    facultyName?: string;
    lectureAverageRating: number | null;
    labAverageRating: number | null;
    overallAverageRating: number | null;
    totalLectureResponses: number;
    totalLabResponses: number;
    totalOverallResponses: number;
}

// 4. High Impact Feedback Area
export interface HighImpactFeedbackArea {
    question: string;
    category: string;
    faculty: string;
    subject: string;
    lowRatingCount: number;
    averageRating: number;
}

// 5. Semester Trend Analysis
export interface SemesterTrend {
    subject: string;
    semester: number;
    averageRating: number;
    responseCount: number;
    academicYearId: IdType;
    academicYear: string;
}

// 6. Annual Performance Trend
export interface AnnualPerformanceTrend {
    year: string;
    averageRating: number;
    responseCount: number;
}

// 7. Division/Batch Comparison (Frontend processed from rawSnapshots for DepartmentComparisonChart)
export interface DivisionBatchComparison {
    departmentId: IdType; // Added for more specificity
    departmentName: string; // Added for display
    divisionId: IdType;
    divisionName: string;
    batch: string; // This could be 'All', 'A', 'B', etc.
    averageRating: number;
    totalResponses: number;
    // Add engagementScore if you calculate it for the chart
    engagementScore?: number; // Example: 0-5 scale for UI
}

// 8. Lab/Lecture Comparison
export interface LabLectureComparison {
    academicYearId: IdType;
    academicYear: string;
    departmentId: IdType;
    department: string;
    lectureOverallRating: number;
    labOverallRating: number;
    totalLectureResponses: number;
    totalLabResponses: number;
}

// 9. Faculty Year Performance
export interface FacultyYearPerformance {
    facultyId: IdType;
    facultyName: string;
    subjectId: IdType;
    subjectName: string;
    lectureAverageRating: number | null;
    labAverageRating: number | null;
    overallAverageRating: number | null;
    totalLectureResponses: number;
    totalLabResponses: number;
    totalOverallResponses: number;
    semesterNumber: number;
    academicYearId: IdType;
    academicYear: string;
}

// 10. Faculty Overall Performance Summary (Frontend processed from rawSnapshots for Top/Lowest Faculties)
export interface FacultyOverallPerformanceSummary {
    facultyId: IdType;
    facultyName: string;
    academicYearId: IdType; // Contextual academic year
    averageRating: number;
    totalResponses: number;
    // Add other relevant performance metrics if needed
}

// 11. Total Responses Count
export interface TotalResponsesCount {
    count: number;
}

// 12. Semester Divisions with Response Counts
export interface SemesterDivisionWithResponseCounts {
    semesterId: IdType;
    semesterNumber: number;
    departmentId: IdType;
    departmentName: string;
    divisionId: IdType;
    divisionName: string;
    responseCount: number;
}
