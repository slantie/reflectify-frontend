// src/hooks/useAnalytics.ts

import { useQuery } from "@tanstack/react-query";
import analyticsService from "@/services/analyticsService"; // Adjust path as needed
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
    LectureLabType,
} from "@/interfaces/analytics"; // Adjust path as needed
import { IdType } from "@/interfaces/common"; // Adjust path as needed

// --- Query Keys ---
export const ANALYTICS_QUERY_KEYS = {
    all: ["analytics"] as const,
    overallSemesterRating: (
        semesterId: IdType,
        divisionId?: IdType,
        batch?: string
    ) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "overallSemesterRating",
            semesterId,
            divisionId,
            batch,
        ] as const,
    semestersWithResponses: (academicYearId?: IdType, departmentId?: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "semestersWithResponses",
            academicYearId,
            departmentId,
        ] as const,
    subjectWiseLectureLabRating: (semesterId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "subjectWiseLectureLabRating",
            semesterId,
        ] as const,
    highImpactFeedbackAreas: (semesterId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "highImpactFeedbackAreas",
            semesterId,
        ] as const,
    semesterTrendAnalysis: (subjectId?: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "semesterTrendAnalysis",
            subjectId,
        ] as const,
    annualPerformanceTrend: () =>
        [...ANALYTICS_QUERY_KEYS.all, "annualPerformanceTrend"] as const,
    divisionBatchComparisons: (semesterId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "divisionBatchComparisons",
            semesterId,
        ] as const,
    labLectureComparison: (semesterId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "labLectureComparison",
            semesterId,
        ] as const,
    facultyPerformanceYearData: (facultyId: IdType, academicYearId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "facultyPerformanceYearData",
            facultyId,
            academicYearId,
        ] as const,
    allFacultyPerformanceData: (academicYearId: IdType) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "allFacultyPerformanceData",
            academicYearId,
        ] as const,
    totalResponses: () =>
        [...ANALYTICS_QUERY_KEYS.all, "totalResponses"] as const,
    semesterDivisionsWithResponseCounts: () =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "semesterDivisionsWithResponseCounts",
        ] as const,
    filterDictionary: () =>
        [...ANALYTICS_QUERY_KEYS.all, "filterDictionary"] as const,
    completeAnalyticsData: (
        academicYearId?: IdType,
        departmentId?: IdType,
        subjectId?: IdType,
        semesterId?: IdType,
        divisionId?: IdType,
        lectureType?: LectureLabType,
        includeDeleted?: boolean
    ) =>
        [
            ...ANALYTICS_QUERY_KEYS.all,
            "completeAnalyticsData",
            academicYearId,
            departmentId,
            subjectId,
            semesterId,
            divisionId,
            lectureType,
            includeDeleted,
        ] as const,
};

// --- Query Hook: Get Overall Semester Rating ---
interface UseOverallSemesterRatingParams {
    semesterId: IdType;
    divisionId?: IdType;
    batch?: string;
    enabled?: boolean; // Optional: for conditional fetching
}
export const useOverallSemesterRating = ({
    semesterId,
    divisionId,
    batch,
    enabled = true,
}: UseOverallSemesterRatingParams) => {
    return useQuery<OverallSemesterRating, Error>({
        queryKey: ANALYTICS_QUERY_KEYS.overallSemesterRating(
            semesterId,
            divisionId,
            batch
        ),
        queryFn: () =>
            analyticsService.getOverallSemesterRating(
                semesterId,
                divisionId,
                batch
            ),
        enabled: enabled && !!semesterId, // Ensure semesterId is provided and query is enabled
    });
};

// --- Query Hook: Get Semesters With Responses ---
interface UseSemestersWithResponsesParams {
    academicYearId?: IdType;
    departmentId?: IdType;
}
export const useSemestersWithResponses = (
    params?: UseSemestersWithResponsesParams
) => {
    return useQuery<SemesterWithResponseCount[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.semestersWithResponses(
            params?.academicYearId,
            params?.departmentId
        ),
        queryFn: () =>
            analyticsService.getSemestersWithResponses(
                params?.academicYearId,
                params?.departmentId
            ),
    });
};

// --- Query Hook: Get Subject-Wise Lecture/Lab Rating ---
interface UseSubjectWiseLectureLabRatingParams {
    semesterId: IdType;
    enabled?: boolean;
}
export const useSubjectWiseLectureLabRating = ({
    semesterId,
    enabled = true,
}: UseSubjectWiseLectureLabRatingParams) => {
    return useQuery<SubjectLectureLabRating[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.subjectWiseLectureLabRating(semesterId),
        queryFn: () =>
            analyticsService.getSubjectWiseLectureLabRating(semesterId),
        enabled: enabled && !!semesterId,
    });
};

// --- Query Hook: Get High Impact Feedback Areas ---
interface UseHighImpactFeedbackAreasParams {
    semesterId: IdType;
    enabled?: boolean;
}
export const useHighImpactFeedbackAreas = ({
    semesterId,
    enabled = true,
}: UseHighImpactFeedbackAreasParams) => {
    return useQuery<HighImpactFeedbackArea[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.highImpactFeedbackAreas(semesterId),
        queryFn: () => analyticsService.getHighImpactFeedbackAreas(semesterId),
        enabled: enabled && !!semesterId,
    });
};

// --- Query Hook: Get Semester Trend Analysis ---
interface UseSemesterTrendAnalysisParams {
    subjectId?: IdType;
    enabled?: boolean;
}
export const useSemesterTrendAnalysis = ({
    subjectId,
    enabled = true,
}: UseSemesterTrendAnalysisParams = {}) => {
    return useQuery<SemesterTrend[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.semesterTrendAnalysis(subjectId),
        queryFn: () => analyticsService.getSemesterTrendAnalysis(subjectId),
        enabled: enabled,
    });
};

// --- Query Hook: Get Annual Performance Trend ---
export const useAnnualPerformanceTrend = () => {
    return useQuery<AnnualPerformanceTrend[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.annualPerformanceTrend(),
        queryFn: analyticsService.getAnnualPerformanceTrend,
    });
};

// --- Query Hook: Get Division Batch Comparisons ---
interface UseDivisionBatchComparisonsParams {
    semesterId: IdType;
    enabled?: boolean;
}
export const useDivisionBatchComparisons = ({
    semesterId,
    enabled = true,
}: UseDivisionBatchComparisonsParams) => {
    return useQuery<DivisionBatchComparison[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.divisionBatchComparisons(semesterId),
        queryFn: () => analyticsService.getDivisionBatchComparisons(semesterId),
        enabled: enabled && !!semesterId,
    });
};

// --- Query Hook: Get Lab/Lecture Comparison ---
interface UseLabLectureComparisonParams {
    semesterId: IdType;
    enabled?: boolean;
}
export const useLabLectureComparison = ({
    semesterId,
    enabled = true,
}: UseLabLectureComparisonParams) => {
    return useQuery<LabLectureComparison[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.labLectureComparison(semesterId),
        queryFn: () => analyticsService.getLabLectureComparison(semesterId),
        enabled: enabled && !!semesterId,
    });
};

// --- Query Hook: Get Faculty Performance Year Data ---
interface UseFacultyPerformanceYearDataParams {
    facultyId: IdType;
    academicYearId: IdType;
    enabled?: boolean;
}
export const useFacultyPerformanceYearData = ({
    facultyId,
    academicYearId,
    enabled = true,
}: UseFacultyPerformanceYearDataParams) => {
    return useQuery<FacultyYearPerformance, Error>({
        queryKey: ANALYTICS_QUERY_KEYS.facultyPerformanceYearData(
            facultyId,
            academicYearId
        ),
        queryFn: () =>
            analyticsService.getFacultyPerformanceYearData(
                facultyId,
                academicYearId
            ),
        enabled: enabled && !!facultyId && !!academicYearId, // Ensure both IDs are provided and query is enabled
    });
};

// --- Query Hook: Get All Faculty Performance Data ---
interface UseAllFacultyPerformanceDataParams {
    academicYearId: IdType;
    enabled?: boolean;
}
export const useAllFacultyPerformanceData = ({
    academicYearId,
    enabled = true,
}: UseAllFacultyPerformanceDataParams) => {
    return useQuery<FacultyOverallPerformanceSummary[], Error>({
        queryKey:
            ANALYTICS_QUERY_KEYS.allFacultyPerformanceData(academicYearId),
        queryFn: () =>
            analyticsService.getAllFacultyPerformanceData(academicYearId),
        enabled: enabled && !!academicYearId, // Ensure academicYearId is provided and query is enabled
    });
};

// --- Query Hook: Get Total Responses ---
export const useTotalResponses = () => {
    return useQuery<TotalResponsesCount, Error>({
        queryKey: ANALYTICS_QUERY_KEYS.totalResponses(),
        queryFn: analyticsService.getTotalResponses,
    });
};

// --- Query Hook: Get Semester Divisions With Response Counts ---
export const useSemesterDivisionsWithResponseCounts = () => {
    return useQuery<SemesterDivisionWithResponseCounts[], Error>({
        queryKey: ANALYTICS_QUERY_KEYS.semesterDivisionsWithResponseCounts(),
        queryFn: analyticsService.getSemesterDivisionsWithResponseCounts,
    });
};

// --- NEW Query Hook: Get Filter Dictionary ---
export const useFilterDictionary = () => {
    return useQuery<FilterDictionary, Error>({
        queryKey: ANALYTICS_QUERY_KEYS.filterDictionary(),
        queryFn: analyticsService.getFilterDictionary,
        staleTime: 5 * 60 * 1000, // 5 minutes - this data doesn't change often
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// --- NEW Query Hook: Get Complete Analytics Data ---
interface UseCompleteAnalyticsDataParams extends AnalyticsFilterParams {
    enabled?: boolean;
}

export const useCompleteAnalyticsData = (
    params?: UseCompleteAnalyticsDataParams
) => {
    const {
        academicYearId,
        departmentId,
        subjectId,
        semesterId,
        divisionId,
        lectureType,
        includeDeleted,
        enabled = true,
    } = params || {};

    return useQuery<CompleteAnalyticsData, Error>({
        queryKey: ANALYTICS_QUERY_KEYS.completeAnalyticsData(
            academicYearId,
            departmentId,
            subjectId,
            semesterId,
            divisionId,
            lectureType,
            includeDeleted
        ),
        queryFn: () =>
            analyticsService.getCompleteAnalyticsData({
                academicYearId,
                departmentId,
                subjectId,
                semesterId,
                divisionId,
                lectureType,
                includeDeleted,
            }),
        enabled,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};
