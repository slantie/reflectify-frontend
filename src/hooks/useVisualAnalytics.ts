// src/hooks/useVisualAnalytics.ts

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

// --- Query Keys ---
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

// --- Query Hook: Get Grouped Bar Chart Data ---
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

// --- Query Hook: Get Faculty Performance Data for Line Chart ---
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

// --- Query Hook: Get Unique Faculties with Responses ---
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

// --- Query Hook: Get Unique Subjects with Responses ---
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

// --- Query Hook: Get Faculty Radar Data ---
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

// --- Query Hook: Get Subject Performance Data ---
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
