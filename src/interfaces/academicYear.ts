// src/interfaces/academicYear.ts

import { IdType } from "./common";

// Full AcademicYear Model (as returned from GET /academic-years or after create/update)
export interface AcademicYear {
    id: IdType;
    yearString: string; // e.g., "2023-2024"
    isActive: boolean; // Indicates if this is the active academic year
    isDeleted: boolean; // Backend uses isDeleted for soft deletion
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

// Data required to create a new AcademicYear
// Corresponds to createAcademicYearSchema in your backend
export interface CreateAcademicYearData {
    yearString: string;
    isActive?: boolean; // Whether this should be the active academic year
}

// Data for updating an existing AcademicYear (all fields are optional)
// Corresponds to updateAcademicYearSchema in your backend
export interface UpdateAcademicYearData {
    yearString?: string;
    isActive?: boolean; // Whether this should be the active academic year
}

// API Response types
export interface AcademicYearApiResponse {
    status: "success";
    message?: string;
    data: {
        academicYear: AcademicYear;
    };
}

export interface AcademicYearsApiResponse {
    status: "success";
    results: number;
    data: {
        academicYears: AcademicYear[];
    };
}

// Statistics for dashboard
export interface AcademicYearStats {
    totalAcademicYears: number;
    currentYear: AcademicYear | null;
    upcomingYear: AcademicYear | null;
    activeYearsCount: number;
}
