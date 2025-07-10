/**
 * @file src/hooks/useAnalyticsData.ts
 * @description React Query hooks for analytics data and processing
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

// Query keys for analytics data
export const ANALYTICS_KEYS = {
    all: ["analytics"] as const,
    filterDictionary: () =>
        [...ANALYTICS_KEYS.all, "filterDictionary"] as const,
    completeData: (filters: AnalyticsFilterParams) =>
        [...ANALYTICS_KEYS.all, "completeData", filters] as const,
    totalResponses: () => [...ANALYTICS_KEYS.all, "totalResponses"] as const,
};

// Fetch filter dictionary for dropdowns
export const useFilterDictionary = () => {
    return useQuery<FilterDictionary>({
        queryKey: ANALYTICS_KEYS.filterDictionary(),
        queryFn: analyticsService.getFilterDictionary,
        staleTime: 5 * 60 * 1000,
    });
};

// Fetch complete analytics data with filters
export const useCompleteAnalyticsData = (
    filters: AnalyticsFilterParams = {}
) => {
    return useQuery<CompleteAnalyticsData>({
        queryKey: ANALYTICS_KEYS.completeData(filters),
        queryFn: () => analyticsService.getCompleteAnalyticsData(filters),
        staleTime: 2 * 60 * 1000,
    });
};

// Fetch total responses count
export const useTotalResponses = () => {
    return useQuery({
        queryKey: ANALYTICS_KEYS.totalResponses(),
        queryFn: analyticsService.getTotalResponses,
        staleTime: 5 * 60 * 1000,
    });
};

// Processed analytics data hook
export const useProcessedAnalytics = (filters: AnalyticsFilterParams = {}) => {
    const {
        data: rawData,
        isLoading,
        error,
        refetch,
    } = useCompleteAnalyticsData(filters);
    // Memoize processed analytics data
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
    return { data: processedData, rawData, isLoading, error, refetch };
};

// Analytics cache invalidation actions
export const useAnalyticsActions = () => {
    const queryClient = useQueryClient();
    // Invalidate all analytics queries
    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ANALYTICS_KEYS.all });
    };
    // Invalidate only complete analytics data
    const invalidateCompleteData = () => {
        queryClient.invalidateQueries({
            queryKey: [...ANALYTICS_KEYS.all, "completeData"],
        });
    };
    // Invalidate only filter dictionary
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
