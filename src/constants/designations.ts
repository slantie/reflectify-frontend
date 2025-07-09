// src/constants/designations.ts

// Define the enum/literal types for designations
export type Designation = "HoD" | "Asst_Prof" | "Lab_Asst";

// A map for displaying full designation names (for UI)
export const designationDisplayMap: Record<Designation, string> = {
    HoD: "Head of Department",
    Asst_Prof: "Assistant Professor",
    Lab_Asst: "Lab Assistant",
    // Add other mappings here
};

// This is the object that z.nativeEnum expects.
// It maps the enum string value to itself.
export const DesignationEnumForZod = {
    HoD: "HoD",
    Asst_Prof: "Asst_Prof",
    Lab_Asst: "Lab_Asst",
    // Ensure all values from `Designation` type are present here
} as const; // 'as const' is crucial here for Zod's type inference

// Optional: If you want a list for dropdowns
export const designationOptions = Object.entries(designationDisplayMap).map(
    ([value, label]) => ({
        value: value as Designation,
        label: label,
    })
);
