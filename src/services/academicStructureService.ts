// src/services/academicStructureService.ts
import axiosInstance from "@/lib/axiosInstance";
import { ACADEMIC_STRUCTURE_ENDPOINTS } from "@/constants/apiEndpoints";
import { ApiResponse } from "@/interfaces/common";
import {
    DepartmentWithAcademicStructure,
    AcademicStructureParams,
} from "@/interfaces/academicStructure";

// Academic year information included in the response
interface AcademicYearInfo {
    id: string;
    yearString: string;
    isActive: boolean;
}

// Division interface matching the backend response
interface Division {
    id: string;
    divisionName: string;
    studentCount: number;
    departmentId: string;
    semesterId: string;
}

// Semester interface with academic year information
interface Semester {
    id: string;
    semesterNumber: number;
    departmentId: string;
    academicYearId: string;
    semesterType: string;
    academicYear: AcademicYearInfo;
    divisions: Division[];
}

// Department interface matching the backend response
interface Department {
    id: string;
    name: string;
    abbreviation: string;
    hodName: string;
    hodEmail: string;
    collegeId: string;
    semesters: Semester[];
}

interface AcademicStructureResponse {
    academicStructure: Department[];
}

const academicStructureService = {
    /**
     * Fetches the complete academic structure from the backend
     * Corresponds to GET /api/v1/academic-structure
     * Returns departments with nested semesters (including academic year info) and divisions
     * @param params - Optional parameters to filter the structure
     */
    getAcademicStructure: async (
        params?: AcademicStructureParams
    ): Promise<DepartmentWithAcademicStructure[]> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.academicYearId) {
                queryParams.append("academicYearId", params.academicYearId);
            }

            const url = `${ACADEMIC_STRUCTURE_ENDPOINTS.BASE}${
                queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`;

            const response = await axiosInstance.get<
                ApiResponse<AcademicStructureResponse>
            >(url);

            return response.data.data.academicStructure;
        } catch (error) {
            console.error("Failed to fetch academic structure:", error);
            throw error;
        }
    },

    /**
     * Fetches the academic structure for a specific academic year
     * @param academicYearId - The ID of the academic year to filter by
     */
    getAcademicStructureByYear: async (
        academicYearId: string
    ): Promise<DepartmentWithAcademicStructure[]> => {
        return academicStructureService.getAcademicStructure({
            academicYearId,
        });
    },
};

export default academicStructureService;
export type { Department, Semester, Division, AcademicYearInfo };
