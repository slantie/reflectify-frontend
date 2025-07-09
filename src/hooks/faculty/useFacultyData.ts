// src/hooks/useFacultyData.ts
import { useState, useMemo, useCallback } from "react";
import { useAllFaculties } from "./useFaculties";
import { useAllDepartments } from "../useDepartments";
import { Faculty } from "@/interfaces/faculty";
import { Department } from "@/interfaces/department"; // Correct import for Department
import { IdType } from "@/interfaces/common";

// Define and EXPORT the SortOrder type
export type SortOrder = "asc" | "desc";

// Define the structure for department statistics
interface DepartmentStats {
    departmentName: string;
    count: number;
}

interface UseFacultyDataResult {
    faculty: Faculty[];
    departments: Department[];
    departmentStats: DepartmentStats[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedDepartment: IdType | "";
    setSelectedDepartment: (id: IdType | "") => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    filteredAndSortedFaculty: Faculty[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetchFaculty: () => void;
    refetchDepartments: () => void;
}

export const useFacultyData = (): UseFacultyDataResult => {
    // State for filters and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<IdType | "">(
        ""
    );
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc"); // Use SortOrder type

    // Fetch faculty data using TanStack Query hook
    const {
        data: allFaculty = [],
        isLoading: isLoadingFaculty,
        isError: isErrorFaculty,
        error: facultyError,
        refetch: refetchAllFaculty,
    } = useAllFaculties();

    // Fetch department data using TanStack Query hook
    const {
        data: allDepartments = [],
        isLoading: isLoadingDepartments,
        isError: isErrorDepartments,
        error: departmentsError,
        refetch: refetchAllDepartments,
    } = useAllDepartments();

    // Combine loading and error states
    const isLoading = isLoadingFaculty || isLoadingDepartments;
    const isError = isErrorFaculty || isErrorDepartments;
    const error = facultyError || departmentsError;

    // Memoize department statistics calculation
    const departmentStats = useMemo(() => {
        const statsMap = new Map<string, number>();
        allFaculty.forEach((f) => {
            const deptName =
                allDepartments.find((dept) => dept.id === f.departmentId)
                    ?.name ||
                f.departmentAbbreviation || // Used as a fallback
                "Unknown Department";

            statsMap.set(deptName, (statsMap.get(deptName) || 0) + 1);
        });
        return Array.from(statsMap.entries()).map(
            ([departmentName, count]) => ({
                departmentName,
                count,
            })
        );
    }, [allFaculty, allDepartments]);

    const filteredAndSortedFaculty = useMemo(() => {
        const filtered = allFaculty.filter((f) => {
            const matchesSearch =
                (f.name?.toLowerCase() || "").includes(
                    searchTerm.toLowerCase()
                ) || // Use f.name here
                (f.email?.toLowerCase() || "").includes(
                    searchTerm.toLowerCase()
                ) ||
                (f.abbreviation?.toLowerCase() || "").includes(
                    searchTerm.toLowerCase()
                ); // Keep this if it's a valid search field

            const matchesDepartment =
                selectedDepartment === "" ||
                f.departmentId === selectedDepartment;

            return matchesSearch && matchesDepartment;
        });

        // Sort by the 'name' property directly
        filtered.sort((a, b) => {
            const nameA = (a.name || "").toLowerCase(); // Use f.name here
            const nameB = (b.name || "").toLowerCase(); // Use f.name here
            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB);
            }
            return nameB.localeCompare(nameA);
        });

        return filtered;
    }, [allFaculty, searchTerm, selectedDepartment, sortOrder]);

    // Expose refetch functions
    const refetchFaculty = useCallback(() => {
        refetchAllFaculty();
    }, [refetchAllFaculty]);

    const refetchDepartments = useCallback(() => {
        refetchAllDepartments();
    }, [refetchAllDepartments]);

    return {
        faculty: allFaculty,
        departments: allDepartments,
        departmentStats,
        searchTerm,
        setSearchTerm,
        selectedDepartment,
        setSelectedDepartment,
        sortOrder,
        setSortOrder,
        filteredAndSortedFaculty,
        isLoading,
        isError,
        error,
        refetchFaculty,
        refetchDepartments,
    };
};
