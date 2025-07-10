/**
 * @file src/interfaces/division.ts
 * @description Interfaces for Division entity and related API data
 */

import { IdType } from "./common";

/**
 * Represents a division entity.
 */
export interface Division {
    id: IdType;
    name: string;
    departmentId: IdType;
    semesterId: IdType;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

/**
 * Data required to create a new division.
 */
export interface CreateDivisionData {
    name: string;
    departmentId: IdType;
    semesterId: IdType;
}

/**
 * Data for updating an existing division (all fields optional).
 */
export interface UpdateDivisionData {
    name?: string;
    departmentId?: IdType;
    semesterId?: IdType;
    isActive?: boolean;
}

/**
 * Data structure for batch creation of divisions.
 */
export interface BatchCreateDivisionInput {
    divisions: CreateDivisionData[];
}
