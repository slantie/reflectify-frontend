/**
@file src/constants/designations.ts
@description Designation types, display map, and options for faculty roles
*/

// Designation literal type
export type Designation = "HoD" | "Asst_Prof" | "Lab_Asst";

// Display map for designations
export const designationDisplayMap: Record<Designation, string> = {
  HoD: "Head of Department",
  Asst_Prof: "Assistant Professor",
  Lab_Asst: "Lab Assistant",
};

// Enum-like object for Zod validation
export const DesignationEnumForZod = {
  HoD: "HoD",
  Asst_Prof: "Asst_Prof",
  Lab_Asst: "Lab_Asst",
} as const;

// Dropdown options for designations
export const designationOptions = Object.entries(designationDisplayMap).map(
  ([value, label]) => ({
    value: value as Designation,
    label,
  }),
);
