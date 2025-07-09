// src/hooks/useAcademicStructure.ts

import { useQuery } from "@tanstack/react-query";
import academicStructureService from "@/services/academicStructureService"; // Adjust path as needed
import { AcademicStructureData } from "@/interfaces/academicStructure"; // Adjust path as needed

// Define the query key for the academic structure
export const ACADEMIC_STRUCTURE_QUERY_KEY = ["academicStructure"];

/**
 * Custom hook to fetch the complete academic structure.
 *
 * @returns {object} An object containing:
 * - data: The fetched AcademicStructureData.
 * - isLoading: A boolean indicating if the data is currently being fetched.
 * - isError: A boolean indicating if an error occurred during fetching.
 * - error: The error object if an error occurred.
 * - isSuccess: A boolean indicating if the data was successfully fetched.
 */
export const useAcademicStructure = () => {
    return useQuery<AcademicStructureData, Error>({
        // The unique key for this query. TanStack Query uses this for caching and revalidation.
        queryKey: ACADEMIC_STRUCTURE_QUERY_KEY,

        // The function that fetches the data. It calls your service method.
        // It must return a Promise that resolves with the data or rejects with an error.
        queryFn: academicStructureService.getAcademicStructure,

        // Optional: Add specific options for this query
        // For example, if academic structure doesn't change often, you might set a longer staleTime:
        // staleTime: Infinity, // or 1000 * 60 * 60 * 24, // 24 hours
        // refetchOnWindowFocus: false, // Prevents refetching when window regains focus if data is considered static
    });
};
