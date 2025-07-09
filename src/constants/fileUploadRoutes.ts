// src/constants/fileUploadRoutes.ts

import { FileUploadRoute } from "@/interfaces/upload";
import { UPLOAD_ENDPOINTS } from "./apiEndpoints";
import { REFERENCE_FILE_URLS } from "./apiEndpoints"; // Import reference file URLs

export const FILE_ROUTES: { [key: string]: FileUploadRoute } = {
    studentData: {
        route: UPLOAD_ENDPOINTS.UPLOAD_STUDENT_DATA,
        label: "Student Data",
        icon: "👨‍🎓",
        description: "Upload student enrollment and academic information",
        referenceFileUrl: REFERENCE_FILE_URLS.STUDENT_DATA,
    },
    facultyData: {
        route: UPLOAD_ENDPOINTS.UPLOAD_FACULTY_DATA,
        label: "Faculty Data",
        icon: "👨‍🏫",
        description:
            "Upload faculty member profiles and department assignments",
        referenceFileUrl: REFERENCE_FILE_URLS.FACULTY_DATA,
    },
    subjectData: {
        route: UPLOAD_ENDPOINTS.UPLOAD_SUBJECT_DATA,
        label: "Subject Data",
        icon: "📚",
        description: "Upload course and subject information",
        referenceFileUrl: REFERENCE_FILE_URLS.SUBJECT_DATA,
    },
    facultyMatrix: {
        route: UPLOAD_ENDPOINTS.UPLOAD_FACULTY_MATRIX,
        label: "Faculty Matrix",
        icon: "📊",
        description: "Upload faculty teaching assignments and schedules",
        requiredParams: ["academicYear", "semesterRun", "deptAbbreviation"],
        referenceFileUrl: REFERENCE_FILE_URLS.FACULTY_MATRIX,
    },
};
