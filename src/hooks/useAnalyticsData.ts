/**
 * @file src/hooks/useAnalyticsData.ts
 * @description Clean, simplified hooks for analytics data management
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import analyticsService from "@/services/analyticsService";
import { AnalyticsDataProcessor } from "@/utils/analyticsProcessor";
import {
    AnalyticsFilterParams,
    FilterDictionary,
    CompleteAnalyticsData,
} from "@/interfaces/analytics";

// Query keys
export const ANALYTICS_KEYS = {
    all: ["analytics"] as const,
    filterDictionary: () =>
        [...ANALYTICS_KEYS.all, "filterDictionary"] as const,
    completeData: (filters: AnalyticsFilterParams) =>
        [...ANALYTICS_KEYS.all, "completeData", filters] as const,
    totalResponses: () => [...ANALYTICS_KEYS.all, "totalResponses"] as const,
};

/**
 * Hook to get filter dictionary for dropdowns
 */
export const useFilterDictionary = () => {
    return useQuery<FilterDictionary>({
        queryKey: ANALYTICS_KEYS.filterDictionary(),
        queryFn: analyticsService.getFilterDictionary,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to get complete analytics data with filters
 */
export const useCompleteAnalyticsData = (
    filters: AnalyticsFilterParams = {}
) => {
    return useQuery<CompleteAnalyticsData>({
        queryKey: ANALYTICS_KEYS.completeData(filters),
        queryFn: () => analyticsService.getCompleteAnalyticsData(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to get total responses count
 */
export const useTotalResponses = () => {
    return useQuery({
        queryKey: ANALYTICS_KEYS.totalResponses(),
        queryFn: analyticsService.getTotalResponses,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Main hook that processes all analytics data
 */
export const useProcessedAnalytics = (filters: AnalyticsFilterParams = {}) => {
    const {
        data: rawData,
        isLoading,
        error,
        refetch,
    } = useCompleteAnalyticsData(filters);

    const processedData = useMemo(() => {
        if (!rawData || !rawData.feedbackSnapshots) {
            return {
                overallStats: null,
                subjectRatings: [],
                semesterTrends: [],
                divisionComparisons: [],
                facultyPerformance: [],
                lectureLabComparison: null,
                filteringOptions: null,
                rawSnapshots: [],
            };
        }

        const snapshots = rawData.feedbackSnapshots;

        return {
            overallStats: AnalyticsDataProcessor.processOverallStats(snapshots),
            subjectRatings:
                AnalyticsDataProcessor.processSubjectRatings(snapshots),
            semesterTrends:
                AnalyticsDataProcessor.processSemesterTrends(snapshots),
            divisionComparisons:
                AnalyticsDataProcessor.processDivisionComparisons(snapshots),
            facultyPerformance:
                AnalyticsDataProcessor.processFacultyPerformance(snapshots),
            lectureLabComparison:
                AnalyticsDataProcessor.processLectureLabComparison(snapshots),
            filteringOptions:
                AnalyticsDataProcessor.getFilteringOptions(snapshots),
            rawSnapshots: snapshots,
        };
    }, [rawData]);

    return {
        data: processedData,
        rawData,
        isLoading,
        error,
        refetch,
    };
};

/**
 * Hook for invalidating analytics cache
 */
export const useAnalyticsActions = () => {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });
    };

    const invalidateCompleteData = () => {
        queryClient.invalidateQueries({
            queryKey: [...ANALYTICS_KEYS.all, "completeData"],
        });
    };

    const invalidateFilterDictionary = () => {
        queryClient.invalidateQueries({
            queryKey: ANALYTICS_KEYS.filterDictionary(),
        });
    };

    return {
        invalidateAll,
        invalidateCompleteData,
        invalidateFilterDictionary,
    };
};
