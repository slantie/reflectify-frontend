// src/interfaces/subjectAllocation.ts

import { IdType } from "./common";
import { Subject } from "./subject"; // Assuming you want to link to Subject details
import { Faculty } from "./faculty"; // Assuming you want to link to Faculty details
import { Division } from "./division"; // Assuming you want to link to Division details

// Full Subject Allocation Model (as returned from GET /subject-allocations or after create/update)
export interface SubjectAllocation {
    id: IdType;
    subjectId: IdType;
    facultyId: IdType;
    divisionId: IdType;
    // You might include nested data from related models for display purposes
    subject?: Subject; // Optional, if populated by your backend
    faculty?: Faculty; // Optional, if populated by your backend
    division?: Division; // Optional, if populated by your backend
    // Add any other fields present in your SubjectAllocation Prisma model
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    isActive: boolean; // For soft delete
}

// Data required to create a new Subject Allocation
// Corresponds to createSubjectAllocationSchema in your backend
export interface CreateSubjectAllocationData {
    subjectId: IdType;
    facultyId: IdType;
    divisionId: IdType;
}

// Data for updating an existing Subject Allocation (all fields are optional)
// Corresponds to updateSubjectAllocationSchema in your backend
export interface UpdateSubjectAllocationData {
    subjectId?: IdType;
    facultyId?: IdType;
    divisionId?: IdType;
    isActive?: boolean; // If you allow changing active status
}
