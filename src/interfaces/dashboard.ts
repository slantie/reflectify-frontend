// src/interfaces/dashboard.ts

export interface DashboardStats {
    responseCount: number;
    facultyCount: number;
    subjectCount: number;
    studentCount: number;
    departmentCount: number;
    divisionCount: number;
    semesterCount: number;
    academicYearCount: number;
    activeAcademicYear?: {
        id: string;
        yearString: string;
    };
}
