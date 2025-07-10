/**
@file src/hooks/useVisualAnalytics.ts
@description React Query hooks for visual analytics data
*/

import { useQuery } from "@tanstack/react-query";
import visualAnalyticsService from "@/services/visualAnalyticsService"; // Adjust path
import {
    GroupedBarChartDataItem,
    FacultyLineChartDataItem,
    UniqueFaculty,
    UniqueSubject,
    FacultyRadarChartData,
    SubjectPerformanceData,
} from "@/interfaces/visualAnalytics"; // Adjust path
import { IdType } from "@/interfaces/common"; // Adjust path

// Query keys for visual analytics
export const VISUAL_ANALYTICS_QUERY_KEYS = {
    all: ["visualAnalytics"] as const,
    groupedBarChart: (facultyId: IdType) =>
        [
            ...VISUAL_ANALYTICS_QUERY_KEYS.all,
            "groupedBarChart",
            facultyId,
        ] as const,
    facultyLineChart: (facultyId: IdType) =>
        [
            ...VISUAL_ANALYTICS_QUERY_KEYS.all,
            "facultyLineChart",
            facultyId,
        ] as const,
    uniqueFaculties: () =>
        [...VISUAL_ANALYTICS_QUERY_KEYS.all, "uniqueFaculties"] as const,
    uniqueSubjects: () =>
        [...VISUAL_ANALYTICS_QUERY_KEYS.all, "uniqueSubjects"] as const,
    facultyRadarChart: (facultyId: IdType) =>
        [
            ...VISUAL_ANALYTICS_QUERY_KEYS.all,
            "facultyRadarChart",
            facultyId,
        ] as const,
    subjectPerformance: (subjectId: IdType) =>
        [
            ...VISUAL_ANALYTICS_QUERY_KEYS.all,
            "subjectPerformance",
            subjectId,
        ] as const,
};

// Get grouped bar chart data
interface UseGroupedBarChartDataParams {
    facultyId: IdType;
    enabled?: boolean;
}

export const useGroupedBarChartData = ({
    facultyId,
    enabled = true,
}: UseGroupedBarChartDataParams) => {
    return useQuery<GroupedBarChartDataItem[], Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.groupedBarChart(facultyId),
        queryFn: () => visualAnalyticsService.getGroupedBarChartData(facultyId),
        enabled: enabled && !!facultyId, // Only run if facultyId is provided and enabled
    });
};

// Get faculty performance data for line chart
interface UseFacultyPerformanceDataForLineChartParams {
    facultyId: IdType;
    enabled?: boolean;
}

export const useFacultyPerformanceDataForLineChart = ({
    facultyId,
    enabled = true,
}: UseFacultyPerformanceDataForLineChartParams) => {
    return useQuery<FacultyLineChartDataItem[], Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.facultyLineChart(facultyId),
        queryFn: () =>
            visualAnalyticsService.getFacultyPerformanceDataForLineChart(
                facultyId
            ),
        enabled: enabled && !!facultyId, // Only run if facultyId is provided and enabled
    });
};

// Get unique faculties with responses
interface UseUniqueFacultiesWithResponsesParams {
    enabled?: boolean;
}

export const useUniqueFacultiesWithResponses = ({
    enabled = true,
}: UseUniqueFacultiesWithResponsesParams = {}) => {
    return useQuery<UniqueFaculty[], Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.uniqueFaculties(),
        queryFn: visualAnalyticsService.getUniqueFacultiesWithResponses,
        enabled: enabled,
        staleTime: 5 * 60 * 1000, // Data for unique entities can be relatively stale
        gcTime: 10 * 60 * 1000,
    });
};

// Get unique subjects with responses
interface UseUniqueSubjectsWithResponsesParams {
    enabled?: boolean;
}

export const useUniqueSubjectsWithResponses = ({
    enabled = true,
}: UseUniqueSubjectsWithResponsesParams = {}) => {
    return useQuery<UniqueSubject[], Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.uniqueSubjects(),
        queryFn: visualAnalyticsService.getUniqueSubjectsWithResponses,
        enabled: enabled,
        staleTime: 5 * 60 * 1000, // Data for unique entities can be relatively stale
        gcTime: 10 * 60 * 1000,
    });
};

// Get faculty radar data
interface UseFacultyRadarDataParams {
    facultyId: IdType;
    enabled?: boolean;
}

export const useFacultyRadarData = ({
    facultyId,
    enabled = true,
}: UseFacultyRadarDataParams) => {
    return useQuery<FacultyRadarChartData, Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.facultyRadarChart(facultyId),
        queryFn: () => visualAnalyticsService.getFacultyRadarData(facultyId),
        enabled: enabled && !!facultyId, // Only run if facultyId is provided and enabled
    });
};

// Get subject performance data
interface UseSubjectPerformanceDataParams {
    subjectId: IdType;
    enabled?: boolean;
}

export const useSubjectPerformanceData = ({
    subjectId,
    enabled = true,
}: UseSubjectPerformanceDataParams) => {
    return useQuery<SubjectPerformanceData, Error>({
        queryKey: VISUAL_ANALYTICS_QUERY_KEYS.subjectPerformance(subjectId),
        queryFn: () =>
            visualAnalyticsService.getSubjectPerformanceData(subjectId),
        enabled: enabled && !!subjectId, // Only run if subjectId is provided and enabled
    });
};
