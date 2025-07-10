/**
 * @file src/services/visualAnalyticsService.ts
 * @description Service for visual analytics API operations
 */

import axiosInstance from "@/lib/axiosInstance";
import { VISUAL_ANALYTICS_ENDPOINTS } from "@/constants/apiEndpoints";
import {
    GroupedBarChartDataItem,
    FacultyLineChartDataItem,
    UniqueFaculty,
    UniqueSubject,
    FacultyRadarChartData,
    SubjectPerformanceData,
} from "@/interfaces/visualAnalytics";
import { ApiResponse, IdType } from "@/interfaces/common";

const visualAnalyticsService = {
    // Get grouped bar chart data comparing faculty vs. overall subject average
    getGroupedBarChartData: async (
        facultyId: IdType
    ): Promise<GroupedBarChartDataItem[]> => {
        const response = await axiosInstance.get<
            ApiResponse<GroupedBarChartDataItem[]>
        >(VISUAL_ANALYTICS_ENDPOINTS.GROUPED_BAR_CHART_DATA(facultyId));
        return response.data.data;
    },

    // Get faculty performance data for a line chart
    getFacultyPerformanceDataForLineChart: async (
        facultyId: IdType
    ): Promise<FacultyLineChartDataItem[]> => {
        const response = await axiosInstance.get<
            ApiResponse<FacultyLineChartDataItem[]>
        >(VISUAL_ANALYTICS_ENDPOINTS.FACULTY_LINE_CHART_DATA(facultyId));
        return response.data.data;
    },

    // Get unique faculties that have received feedback responses
    getUniqueFacultiesWithResponses: async (): Promise<UniqueFaculty[]> => {
        const response = await axiosInstance.get<
            ApiResponse<{ faculties: UniqueFaculty[] }>
        >(VISUAL_ANALYTICS_ENDPOINTS.UNIQUE_FACULTIES_WITH_RESPONSES);
        return response.data.data.faculties;
    },

    // Get unique subjects that have received feedback responses
    getUniqueSubjectsWithResponses: async (): Promise<UniqueSubject[]> => {
        const response = await axiosInstance.get<
            ApiResponse<{ subjects: UniqueSubject[] }>
        >(VISUAL_ANALYTICS_ENDPOINTS.UNIQUE_SUBJECTS_WITH_RESPONSES);
        return response.data.data.subjects;
    },

    // Get radar chart data for a specific faculty
    getFacultyRadarData: async (
        facultyId: IdType
    ): Promise<FacultyRadarChartData> => {
        const response = await axiosInstance.get<
            ApiResponse<FacultyRadarChartData>
        >(VISUAL_ANALYTICS_ENDPOINTS.FACULTY_RADAR_CHART_DATA(facultyId));
        return response.data.data;
    },

    // Get subject performance data, grouped by faculty, division, and batch
    getSubjectPerformanceData: async (
        subjectId: IdType
    ): Promise<SubjectPerformanceData> => {
        const response = await axiosInstance.get<
            ApiResponse<SubjectPerformanceData>
        >(VISUAL_ANALYTICS_ENDPOINTS.SUBJECT_PERFORMANCE_DATA(subjectId));
        return response.data.data;
    },
};

export default visualAnalyticsService;
