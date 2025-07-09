// src/constants/apiEndpoints.ts

export const NODE_ENV = process.env.NODE_ENV || "production";
export const BACKEND_DEV_URL = "http://localhost:4000";
export const BACKEND_PROD_URL = "https://backend.reflectify.live";

export const BASE_URL =
    NODE_ENV === "development" ? BACKEND_DEV_URL : BACKEND_PROD_URL;
export const API_V1_URL = `${BASE_URL}/api/v1`;

export const REFERENCE_FILE_URLS = {
    FACULTY_MATRIX:
        process.env.FACULTY_MATRIX_REFERENCE_FILE_URL ||
        "https://docs.google.com/spreadsheets/d/1yp61h5vitWgAw_BYieZLtE-Sp52tK8Rr/edit?usp=sharing&ouid=105338775516938942439&rtpof=true&sd=true",
    STUDENT_DATA:
        process.env.STUDENT_DATA_REFERENCE_FILE_URL ||
        "https://docs.google.com/spreadsheets/d/19scpTIj9cbXEM_2FHArGdeGFFBD2a78u/edit?usp=sharing&ouid=105338775516938942439&rtpof=true&sd=true",
    FACULTY_DATA:
        process.env.FACULTY_DATA_REFERENCE_FILE_URL ||
        "https://docs.google.com/spreadsheets/d/1sZ9r6jbZQTytChQUgur3wJXWp254eOts/edit?usp=sharing&ouid=105338775516938942439&rtpof=true&sd=true",
    SUBJECT_DATA:
        process.env.SUBJECT_DATA_REFERENCE_FILE_URL ||
        "https://docs.google.com/spreadsheets/d/1yeZx1qBArpu0feg-xyXTDmsbOmC04Yvv/edit?usp=sharing&ouid=105338775516938942439&rtpof=true&sd=true",
};

// 1. Authentication Routes (/api/v1/auth)
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_V1_URL}/auth/login`,
    LOGOUT: `${API_V1_URL}/auth/logout`,
    VERIFY_TOKEN: `${API_V1_URL}/auth/verify-token`,
    CHANGE_PASSWORD: `${API_V1_URL}/auth/change-password`,
    ME: `${API_V1_URL}/auth/me`,
    UPDATE_PROFILE: `${API_V1_URL}/auth/update-profile`,
    FORGOT_PASSWORD: `${API_V1_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_V1_URL}/auth/reset-password/`,
};

// 2. Dashboard Routes (/api/v1/dashboard)
export const DASHBOARD_ENDPOINTS = {
    STATS: `${API_V1_URL}/dashboard/stats`,
    DELETE_ALL_DATA: `${API_V1_URL}/dashboard/delete-all-data`,
};

// 3. Faculty Management Routes (/api/v1/faculties)
export const FACULTY_ENDPOINTS = {
    BASE: `${API_V1_URL}/faculties`,
    getById: (id: string | number) => `${API_V1_URL}/faculties/${id}`,
    BATCH: `${API_V1_URL}/faculties/batch`,
    getAbbreviations: (deptAbbr?: string) =>
        deptAbbr
            ? `${API_V1_URL}/faculties/abbreviations/${deptAbbr}`
            : `${API_V1_URL}/faculties/abbreviations`,
};

// 4. Department Management Routes (/api/v1/departments)
export const DEPARTMENT_ENDPOINTS = {
    BASE: `${API_V1_URL}/departments`,
    getById: (id: string | number) => `${API_V1_URL}/departments/${id}`,
    BATCH: `${API_V1_URL}/departments/batch`,
};

// 5. Student Management Routes (/api/v1/students)
export const STUDENT_ENDPOINTS = {
    BASE: `${API_V1_URL}/students`,
    getById: (id: string | number) => `${API_V1_URL}/students/${id}`,
    BATCH: `${API_V1_URL}/students/batch`,
};

// 6. Subject Management Routes (/api/v1/subjects)
export const SUBJECT_ENDPOINTS = {
    BASE: `${API_V1_URL}/subjects`,
    getById: (id: string | number) => `${API_V1_URL}/subjects/${id}`,
    getBySemester: (semesterId: string | number) =>
        `${API_V1_URL}/subjects/semester/${semesterId}`,
    getAbbreviations: (deptAbbr?: string) =>
        deptAbbr
            ? `${API_V1_URL}/subjects/abbreviations/${deptAbbr}`
            : `${API_V1_URL}/subjects/abbreviations`,
    BATCH: `${API_V1_URL}/subjects/batch`,
};

// 7. College Management Routes (/api/v1/colleges)
export const COLLEGE_ENDPOINTS = {
    BASE: `${API_V1_URL}/colleges`,
    PRIMARY: `${API_V1_URL}/colleges/primary`,
    BATCH_UPDATE_PRIMARY: `${API_V1_URL}/colleges/primary/batch-update`,
};

// 8. Academic Year Routes (/api/v1/academic-years)
export const ACADEMIC_YEAR_ENDPOINTS = {
    BASE: `${API_V1_URL}/academic-years`, // GET all, POST create
    getById: (id: string | number) => `${API_V1_URL}/academic-years/${id}`,
    ACTIVE: `${API_V1_URL}/academic-years/active`, // GET active academic year
};

// 9. Academic Structure Routes (/api/v1/academic-structure)
export const ACADEMIC_STRUCTURE_ENDPOINTS = {
    BASE: `${API_V1_URL}/academic-structure`,
};

// 10. Database Management Routes (/api/v1/database)
export const DATABASE_ENDPOINTS = {
    CLEAN: `${API_V1_URL}/database/clean`, // DELETE clean database
};

// 11. Division Management Routes (/api/v1/divisions)
export const DIVISION_ENDPOINTS = {
    BASE: `${API_V1_URL}/divisions`, // GET all (with optional query params), POST create
    getById: (id: string | number) => `${API_V1_URL}/divisions/${id}`, // GET by ID, PATCH update, DELETE soft-delete
    BATCH: `${API_V1_URL}/divisions/batch`, // POST batch create
};

// 12. Email Management Routes (/api/v1/emails)
export const EMAIL_ENDPOINTS = {
    SEND_FORM_ACCESS: `${API_V1_URL}/emails/send-form-access`, // POST send form access emails
};

// 13. Subject Allocattion Routes (/api/v1/subject-allocations)
export const SUBJECT_ALLOCATION_ENDPOINTS = {
    BASE: `${API_V1_URL}/subject-allocations`, // GET all, POST create
    getById: (id: string | number) => `${API_V1_URL}/subject-allocations/${id}`, // GET by ID, PATCH update, DELETE soft-delete
};

// 14. Feedback Form Routes (/api/v1/feedback-forms)
export const FEEDBACK_FORM_ENDPOINTS = {
    BASE: `${API_V1_URL}/feedback-forms`, // GET all forms
    getById: (id: string | number) => `${API_V1_URL}/feedback-forms/${id}`, // GET by ID, PATCH update, DELETE soft-delete
    GENERATE: `${API_V1_URL}/feedback-forms/generate`, // POST generate forms
    ADD_QUESTION: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/questions`, // POST add question to form
    UPDATE_STATUS: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/status`, // PATCH update single form status
    BULK_UPDATE_STATUS: `${API_V1_URL}/feedback-forms/bulk-status`, // PATCH bulk update form status
    ACCESS_BY_TOKEN: (token: string) =>
        `${API_V1_URL}/feedback-forms/access/${token}`, // GET form by access token (public)

    // Override Students endpoints
    OVERRIDE_STUDENTS: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/override-students`, // GET, DELETE
    OVERRIDE_STUDENTS_ALL: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/override-students/all`, // GET all without pagination
    OVERRIDE_STUDENTS_COUNT: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/override-students/count`, // GET count
    OVERRIDE_STUDENTS_UPLOAD: (id: string | number) =>
        `${API_V1_URL}/feedback-forms/${id}/override-students/upload`, // POST upload
    OVERRIDE_STUDENT: (formId: string | number, studentId: string | number) =>
        `${API_V1_URL}/feedback-forms/${formId}/override-students/${studentId}`, // PATCH update, DELETE
};

// 15. Semester Management Routes (/api/v1/semesters)
export const SEMESTER_ENDPOINTS = {
    BASE: `${API_V1_URL}/semesters`, // GET all (with optional query params), POST create
    getById: (id: string | number) => `${API_V1_URL}/semesters/${id}`, // GET by ID, PATCH update, DELETE soft-delete
    BATCH: `${API_V1_URL}/semesters/batch`, // POST batch create
    GET_BY_DEPARTMENT: (departmentId: string | number) =>
        `${API_V1_URL}/semesters/dept/${departmentId}`, // GET semesters by department ID
};

// 16. Feedback Question Routes (/api/v1/feedback-questions)
export const FEEDBACK_QUESTION_ENDPOINTS = {
    BASE: `${API_V1_URL}/feedback-questions`, // Base for this module
    // Question Categories
    CATEGORIES: `${API_V1_URL}/feedback-questions/categories`, // GET all, POST create category
    getCategoryById: (id: string | number) =>
        `${API_V1_URL}/feedback-questions/categories/${id}`, // GET by ID, PATCH update, DELETE soft-delete category
    // Feedback Questions
    QUESTIONS_BY_FORM: (formId: string | number) =>
        `${API_V1_URL}/feedback-questions/form/${formId}/questions`, // GET questions by form ID, POST create question for form
    getQuestionById: (id: string | number) =>
        `${API_V1_URL}/feedback-questions/questions/${id}`, // PATCH update, DELETE soft-delete question
    BATCH_UPDATE_QUESTIONS: `${API_V1_URL}/feedback-questions/questions/batch`, // PATCH batch update questions
};

// 17. Student Response Routes (/api/v1/student-responses)
export const STUDENT_RESPONSE_ENDPOINTS = {
    BASE: `${API_V1_URL}/student-responses`, // Base for this module

    SUBMIT_RESPONSES: (token: string) =>
        `${API_V1_URL}/student-responses/submit/${token}`, // POST submit responses
    CHECK_SUBMISSION: (token: string) =>
        `${API_V1_URL}/student-responses/check-submission/${token}`, // GET check submission status
};

// 18. Analysis Routes (/api/v1/analytics)
export const ANALYTICS_ENDPOINTS = {
    BASE: `${API_V1_URL}/analytics`, // Base for all analytics routes
    // Semester-level analytics
    SEMESTERS_WITH_RESPONSES: `${API_V1_URL}/analytics/semesters-with-responses`, // GET
    OVERALL_SEMESTER_RATING: (semesterId: string | number) =>
        `${API_V1_URL}/analytics/semesters/${semesterId}/overall-rating`, // GET
    SUBJECT_WISE_LECTURE_LAB_RATING: (semesterId: string | number) =>
        `${API_V1_URL}/analytics/semesters/${semesterId}/subject-wise-rating`, // GET
    HIGH_IMPACT_AREAS: (semesterId: string | number) =>
        `${API_V1_URL}/analytics/semesters/${semesterId}/high-impact-areas`, // GET
    DIVISION_BATCH_COMPARISONS: (semesterId: string | number) =>
        `${API_V1_URL}/analytics/semesters/${semesterId}/division-batch-comparisons`, // GET
    LAB_LECTURE_COMPARISON: (semesterId: string | number) =>
        `${API_V1_URL}/analytics/semesters/${semesterId}/lab-lecture-comparison`, // GET
    // Trend analysis
    SEMESTER_TREND_ANALYSIS: `${API_V1_URL}/analytics/semester-trend-analysis`, // GET
    ANNUAL_PERFORMANCE_TREND: `${API_V1_URL}/analytics/annual-performance-trend`, // GET
    // Faculty performance
    GET_FACULTY_PERFORMANCE_YEAR_DATA: (
        facultyId: string | number,
        academicYearId: string | number
    ) =>
        `${API_V1_URL}/analytics/faculty/${facultyId}/performance/${academicYearId}`, // GET
    GET_ALL_FACULTY_PERFORMANCE_DATA: (academicYearId: string | number) =>
        `${API_V1_URL}/analytics/faculty/performance/${academicYearId}`, // GET

    // Other aggregated data
    TOTAL_RESPONSES: `${API_V1_URL}/analytics/total-responses`, // GET
    SEMESTER_DIVISIONS_WITH_RESPONSES: `${API_V1_URL}/analytics/semester-divisions-with-responses`, // GET
};

// 19. Visual Analytics Routes (/api/v1/analytics/visual)
export const VISUAL_ANALYTICS_ENDPOINTS = {
    BASE: `${API_V1_URL}/analytics/visual`, // Base for all visual analytics routes
    // Chart-specific data endpoints
    GROUPED_BAR_CHART_DATA: (facultyId: string | number) =>
        `${API_V1_URL}/analytics/visual/grouped-bar-chart/${facultyId}`,
    FACULTY_LINE_CHART_DATA: (facultyId: string | number) =>
        `${API_V1_URL}/analytics/visual/line-chart/${facultyId}`,
    FACULTY_RADAR_CHART_DATA: (facultyId: string | number) =>
        `${API_V1_URL}/analytics/visual/radar-chart/${facultyId}`,
    SUBJECT_PERFORMANCE_DATA: (subjectId: string | number) =>
        `${API_V1_URL}/analytics/visual/subject-performance/${subjectId}`,

    // Filter/Dropdown data endpoints
    UNIQUE_FACULTIES_WITH_RESPONSES: `${API_V1_URL}/analytics/visual/unique-faculties`,
    UNIQUE_SUBJECTS_WITH_RESPONSES: `${API_V1_URL}/analytics/visual/unique-subjects`,
};

// 20. Uplaod Routes
export const UPLOAD_ENDPOINTS = {
    BASE: `${API_V1_URL}/upload`,
    UPLOAD_STUDENT_DATA: `${API_V1_URL}/upload/student-data`, // POST
    UPLOAD_FACULTY_DATA: `${API_V1_URL}/upload/faculty-data`, // POST
    UPLOAD_SUBJECT_DATA: `${API_V1_URL}/upload/subject-data`, // POST
    UPLOAD_FACULTY_MATRIX: `${API_V1_URL}/upload/faculty-matrix`, // POST
};
