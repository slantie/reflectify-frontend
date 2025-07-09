// src/services/analyticsService.ts
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { ANALYTICS_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import analytics interfaces
import {
    OverallSemesterRating,
    SemesterWithResponseCount,
    SubjectLectureLabRating,
    HighImpactFeedbackArea,
    SemesterTrend,
    AnnualPerformanceTrend,
    DivisionBatchComparison,
    LabLectureComparison,
    FacultyYearPerformance,
    FacultyOverallPerformanceSummary,
    TotalResponsesCount,
    SemesterDivisionWithResponseCounts,
    FilterDictionary,
    CompleteAnalyticsData,
    AnalyticsFilterParams,
} from "@/interfaces/analytics"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path

const analyticsService = {
    /**
     * Retrieves overall average rating for a specific semester, with optional filters.
     * Corresponds to GET /api/v1/analytics/semesters/:id/overall-rating
     */
    getOverallSemesterRating: async (
        semesterId: IdType,
        divisionId?: IdType,
        batch?: string
    ): Promise<OverallSemesterRating> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<OverallSemesterRating>
            >(ANALYTICS_ENDPOINTS.OVERALL_SEMESTER_RATING(semesterId), {
                params: { divisionId, batch },
            });
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch overall semester rating for semester ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves a list of semesters that have associated feedback responses, with optional filtering.
     * Corresponds to GET /api/v1/analytics/semesters-with-responses
     */
    getSemestersWithResponses: async (
        academicYearId?: IdType,
        departmentId?: IdType
    ): Promise<SemesterWithResponseCount[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ semesters: SemesterWithResponseCount[] }>
            >(ANALYTICS_ENDPOINTS.SEMESTERS_WITH_RESPONSES, {
                params: { academicYearId, departmentId },
            });
            return response.data.data.semesters || [];
        } catch (error) {
            console.error("Failed to fetch semesters with responses:", error);
            return [];
        }
    },

    /**
     * Calculates subject-wise ratings for a given semester, broken down by lecture type.
     * Corresponds to GET /api/v1/analytics/semesters/:id/subject-wise-rating
     */
    getSubjectWiseLectureLabRating: async (
        semesterId: IdType
    ): Promise<SubjectLectureLabRating[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ ratings: SubjectLectureLabRating[] }>
            >(ANALYTICS_ENDPOINTS.SUBJECT_WISE_LECTURE_LAB_RATING(semesterId));
            return response.data.data.ratings;
        } catch (error) {
            console.error(
                `Failed to fetch subject-wise lecture/lab ratings for semester ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Identifies high-impact feedback areas (questions with significant low ratings) for a given semester.
     * Corresponds to GET /api/v1/analytics/semesters/:id/high-impact-areas
     */
    getHighImpactFeedbackAreas: async (
        semesterId: IdType
    ): Promise<HighImpactFeedbackArea[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ impactAreas: HighImpactFeedbackArea[] }>
            >(ANALYTICS_ENDPOINTS.HIGH_IMPACT_AREAS(semesterId));
            return response.data.data.impactAreas;
        } catch (error) {
            console.error(
                `Failed to fetch high impact feedback areas for semester ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Provides trend analysis of average ratings across semesters, optionally filtered by subject.
     * Corresponds to GET /api/v1/analytics/semester-trend-analysis
     */
    getSemesterTrendAnalysis: async (
        subjectId?: IdType
    ): Promise<SemesterTrend[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ trends: SemesterTrend[] }>
            >(ANALYTICS_ENDPOINTS.SEMESTER_TREND_ANALYSIS, {
                params: { subjectId },
            });
            return response.data.data.trends || [];
        } catch (error) {
            console.error("Failed to fetch semester trend analysis:", error);
            return [];
        }
    },

    /**
     * Retrieves annual performance trends based on aggregated feedback analytics.
     * Corresponds to GET /api/v1/analytics/annual-performance-trend
     */
    getAnnualPerformanceTrend: async (): Promise<AnnualPerformanceTrend[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ trends: AnnualPerformanceTrend[] }>
            >(ANALYTICS_ENDPOINTS.ANNUAL_PERFORMANCE_TREND);
            return response.data.data.trends;
        } catch (error) {
            console.error("Failed to fetch annual performance trend:", error);
            throw error;
        }
    },

    /**
     * Compares average ratings across different divisions and batches for a given semester.
     * Corresponds to GET /api/v1/analytics/semesters/:id/division-batch-comparisons
     */
    getDivisionBatchComparisons: async (
        semesterId: IdType
    ): Promise<DivisionBatchComparison[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ comparisons: DivisionBatchComparison[] }>
            >(ANALYTICS_ENDPOINTS.DIVISION_BATCH_COMPARISONS(semesterId));
            return response.data.data.comparisons;
        } catch (error) {
            console.error(
                `Failed to fetch division/batch comparisons for semester ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Compares average ratings between different lecture types (e.g., LECTURE, LAB) for a given semester.
     * Corresponds to GET /api/v1/analytics/semesters/:id/lab-lecture-comparison
     */
    getLabLectureComparison: async (
        semesterId: IdType
    ): Promise<LabLectureComparison[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ comparisons: LabLectureComparison[] }>
            >(ANALYTICS_ENDPOINTS.LAB_LECTURE_COMPARISON(semesterId));
            return response.data.data.comparisons;
        } catch (error) {
            console.error(
                `Failed to fetch lab/lecture comparison for semester ${semesterId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves performance data for a single faculty member across semesters for a given academic year.
     * Corresponds to GET /api/v1/analytics/faculty/:facultyId/performance/:academicYearId
     */
    getFacultyPerformanceYearData: async (
        facultyId: IdType,
        academicYearId: IdType
    ): Promise<FacultyYearPerformance> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<FacultyYearPerformance>
            >(
                ANALYTICS_ENDPOINTS.GET_FACULTY_PERFORMANCE_YEAR_DATA(
                    facultyId,
                    academicYearId
                )
            );
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch faculty performance data for faculty ${facultyId} in academic year ${academicYearId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves performance data for all faculty members for a given academic year.
     * Corresponds to GET /api/v1/analytics/faculty/performance/:academicYearId
     */
    getAllFacultyPerformanceData: async (
        academicYearId: IdType
    ): Promise<FacultyOverallPerformanceSummary[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ data: FacultyOverallPerformanceSummary[] }>
            >( // Note the extra 'data' nesting here from the controller.
                ANALYTICS_ENDPOINTS.GET_ALL_FACULTY_PERFORMANCE_DATA(
                    academicYearId
                )
            );
            return response.data.data.data || []; // Return empty array if undefined
        } catch (error) {
            console.error(
                `Failed to fetch all faculty performance data for academic year ${academicYearId}:`,
                error
            );
            return []; // Return empty array on error instead of throwing
        }
    },

    /**
     * Retrieves the total number of student responses.
     * Corresponds to GET /api/v1/analytics/total-responses
     */
    getTotalResponses: async (): Promise<TotalResponsesCount> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<TotalResponsesCount>
            >(ANALYTICS_ENDPOINTS.TOTAL_RESPONSES);
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch total responses:", error);
            throw error;
        }
    },

    /**
     * Retrieves semesters and their divisions, including response counts for each division.
     * Corresponds to GET /api/v1/analytics/semester-divisions-with-responses
     */
    getSemesterDivisionsWithResponseCounts: async (): Promise<
        SemesterDivisionWithResponseCounts[]
    > => {
        try {
            // Note: The controller returns `success: true, data: data`, not `status: 'success', data: { data: data }`.
            // So, ApiResponse needs to be flexible or we adjust the access.
            const response = await axiosInstance.get<{
                success: boolean;
                data: SemesterDivisionWithResponseCounts[];
            }>(ANALYTICS_ENDPOINTS.SEMESTER_DIVISIONS_WITH_RESPONSES); // Adjusting for specific controller response
            return response.data.data;
        } catch (error) {
            console.error(
                "Failed to fetch semester divisions with response counts:",
                error
            );
            throw error;
        }
    },

    /**
     * NEW: Get filter dictionary with hierarchical structure
     * Academic Years → Departments → Subjects
     * Corresponds to GET /api/v1/analytics/filter-dictionary
     */
    getFilterDictionary: async (): Promise<FilterDictionary> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<FilterDictionary>
            >("/api/v1/analytics/filter-dictionary");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch filter dictionary:", error);
            throw error;
        }
    },

    /**
     * NEW: Get complete analytics data with optional filters
     * Returns all filtered data in one request for client-side processing
     * Corresponds to GET /api/v1/analytics/complete-data
     */
    getCompleteAnalyticsData: async (
        filters?: AnalyticsFilterParams
    ): Promise<CompleteAnalyticsData> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<CompleteAnalyticsData>
            >("/api/v1/analytics/complete-data", {
                params: filters,
            });
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch complete analytics data:", error);
            throw error;
        }
    },
};

export default analyticsService;
