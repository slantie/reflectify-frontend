// src/services/visualAnalyticsService.ts
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed
import { VISUAL_ANALYTICS_ENDPOINTS } from "@/constants/apiEndpoints"; // Adjust path as needed

// Import visual analytics interfaces
import {
    GroupedBarChartDataItem,
    FacultyLineChartDataItem,
    UniqueFaculty,
    UniqueSubject,
    FacultyRadarChartData,
    SubjectPerformanceData,
} from "@/interfaces/visualAnalytics"; // Adjust path
import { ApiResponse, IdType } from "@/interfaces/common"; // Adjust path (assuming ApiResponse and IdType are here)

const visualAnalyticsService = {
    /**
     * Generates data for a grouped bar chart comparing faculty vs. overall subject average.
     * Corresponds to GET /api/v1/analytics/visual/grouped-bar-chart/:facultyId
     */
    getGroupedBarChartData: async (
        facultyId: IdType
    ): Promise<GroupedBarChartDataItem[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<GroupedBarChartDataItem[]>
            >(VISUAL_ANALYTICS_ENDPOINTS.GROUPED_BAR_CHART_DATA(facultyId));
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch grouped bar chart data for faculty ${facultyId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves faculty performance data for a line chart, showing lecture and lab averages per semester.
     * Corresponds to GET /api/v1/analytics/visual/line-chart/:facultyId
     */
    getFacultyPerformanceDataForLineChart: async (
        facultyId: IdType
    ): Promise<FacultyLineChartDataItem[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<FacultyLineChartDataItem[]>
            >(VISUAL_ANALYTICS_ENDPOINTS.FACULTY_LINE_CHART_DATA(facultyId));
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch faculty line chart data for faculty ${facultyId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves a list of unique faculties that have received feedback responses.
     * Corresponds to GET /api/v1/analytics/visual/unique-faculties
     */
    getUniqueFacultiesWithResponses: async (): Promise<UniqueFaculty[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ faculties: UniqueFaculty[] }>
            >(VISUAL_ANALYTICS_ENDPOINTS.UNIQUE_FACULTIES_WITH_RESPONSES);
            return response.data.data.faculties;
        } catch (error) {
            console.error(
                "Failed to fetch unique faculties with responses:",
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves a list of unique subjects that have received feedback responses.
     * Corresponds to GET /api/v1/analytics/visual/unique-subjects
     */
    getUniqueSubjectsWithResponses: async (): Promise<UniqueSubject[]> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<{ subjects: UniqueSubject[] }>
            >(VISUAL_ANALYTICS_ENDPOINTS.UNIQUE_SUBJECTS_WITH_RESPONSES);
            return response.data.data.subjects;
        } catch (error) {
            console.error(
                "Failed to fetch unique subjects with responses:",
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves data for a radar chart showing lecture and lab ratings per subject for a specific faculty.
     * Corresponds to GET /api/v1/analytics/visual/radar-chart/:facultyId
     */
    getFacultyRadarData: async (
        facultyId: IdType
    ): Promise<FacultyRadarChartData> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<FacultyRadarChartData>
            >(VISUAL_ANALYTICS_ENDPOINTS.FACULTY_RADAR_CHART_DATA(facultyId));
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch faculty radar data for faculty ${facultyId}:`,
                error
            );
            throw error;
        }
    },

    /**
     * Retrieves subject performance data, grouped by faculty, division, and batch (Lecture/Lab).
     * Corresponds to GET /api/v1/analytics/visual/subject-performance/:subjectId
     */
    getSubjectPerformanceData: async (
        subjectId: IdType
    ): Promise<SubjectPerformanceData> => {
        try {
            const response = await axiosInstance.get<
                ApiResponse<SubjectPerformanceData>
            >(VISUAL_ANALYTICS_ENDPOINTS.SUBJECT_PERFORMANCE_DATA(subjectId));
            return response.data.data;
        } catch (error) {
            console.error(
                `Failed to fetch subject performance data for subject ${subjectId}:`,
                error
            );
            throw error;
        }
    },
};

export default visualAnalyticsService;
