// src/components/modals/EditFacultyModal.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Faculty, UpdateFacultyData } from "@/interfaces/faculty";
import { useAllDepartments } from "@/hooks/useDepartments";
import {
    designationOptions,
    DesignationEnumForZod,
} from "@/constants/designations";
import { Loader } from "@/components/common/Loader";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const editFacultySchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .optional()
        .or(z.literal("")),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .optional()
        .or(z.literal("")),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    facultyAbbreviation: z
        .string()
        .min(1, "Abbreviation is required")
        .optional()
        .or(z.literal("")),
    designation: z
        .nativeEnum(DesignationEnumForZod, {
            errorMap: () => ({ message: "Invalid designation" }),
        })
        .optional()
        .or(z.literal("")),
    departmentId: z
        .string()
        .min(1, "Department is required")
        .optional()
        .or(z.literal("")),
    seatingLocation: z
        .string()
        .min(1, "Seating location is required")
        .optional()
        .or(z.literal("")),
    joiningDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .optional()
        .or(z.literal("")),
});

type EditFacultyFormData = z.infer<typeof editFacultySchema>;

interface EditFacultyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: string, formData: UpdateFacultyData) => Promise<void>;
    faculty: Faculty | null;
}

export function EditFacultyModal({
    isOpen,
    onClose,
    onEdit,
    faculty,
}: EditFacultyModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EditFacultyFormData>({
        resolver: zodResolver(editFacultySchema),
    });

    const { data: departments = [], isLoading: isLoadingDepartments } =
        useAllDepartments();

    React.useEffect(() => {
        if (isOpen && faculty) {
            reset({
                firstName: faculty.firstName,
                lastName: faculty.lastName,
                email: faculty.email,
                facultyAbbreviation: faculty.facultyAbbreviation,
                designation: faculty.designation,
                departmentId: String(faculty.departmentId),
                seatingLocation: faculty.seatingLocation,
                joiningDate: faculty.joiningDate
                    ? faculty.joiningDate.split("T")[0]
                    : "",
            });
        } else if (!isOpen) {
            reset();
        }
    }, [isOpen, faculty, reset]);

    const onSubmit: SubmitHandler<EditFacultyFormData> = async (data) => {
        if (!faculty?.id) return;

        const updatedData: UpdateFacultyData = Object.fromEntries(
            Object.entries(data).filter(
                ([, value]) => value !== undefined && value !== ""
            )
        );

        await onEdit(faculty.id, updatedData);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            title="Edit Faculty Details"
            description="Update the details for the selected faculty member."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                    />
                    <Input
                        label="Last Name"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                    />
                </div>
                <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Faculty Abbreviation"
                        {...register("facultyAbbreviation")}
                        error={errors.facultyAbbreviation?.message}
                    />
                    <div>
                        <label
                            htmlFor="edit-designation"
                            className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
                        >
                            Designation
                        </label>
                        <div className="relative">
                            <select
                                id="edit-designation"
                                {...register("designation")}
                                className="w-full appearance-none cursor-pointer rounded-lg border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-secondary dark:border-dark-secondary focus:border-primary-main dark:focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 transition-all shadow-sm pl-3 pr-10 py-2.5"
                            >
                                <option value="">Select Designation</option>
                                {designationOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="h-5 w-5 text-light-tertiary dark:text-dark-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {errors.designation && (
                            <p className="mt-1 text-sm text-negative-main">
                                {errors.designation.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="edit-departmentId"
                        className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
                    >
                        Department
                    </label>
                    <div className="relative">
                        <select
                            id="edit-departmentId"
                            {...register("departmentId")}
                            className="w-full appearance-none cursor-pointer rounded-lg border bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text border-light-secondary dark:border-dark-secondary focus:border-primary-main dark:focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 transition-all shadow-sm pl-3 pr-10 py-2.5"
                            disabled={isLoadingDepartments}
                        >
                            <option value="">
                                {isLoadingDepartments
                                    ? "Loading..."
                                    : "Select Department"}
                            </option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={String(dept.id)}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="h-5 w-5 text-light-tertiary dark:text-dark-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.departmentId && (
                        <p className="mt-1 text-sm text-negative-main">
                            {errors.departmentId.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Seating Location"
                        {...register("seatingLocation")}
                        error={errors.seatingLocation?.message}
                    />
                    <Input
                        label="Joining Date"
                        type="date"
                        {...register("joiningDate")}
                        error={errors.joiningDate?.message}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 border-white" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
