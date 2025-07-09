// src/components/modals/AddFacultyModal.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreateFacultyData } from "@/interfaces/faculty";
import { useAllDepartments } from "@/hooks/useDepartments";
import {
    designationOptions,
    DesignationEnumForZod,
} from "@/constants/designations";
import { Loader } from "@/components/common/Loader";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const addFacultySchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    facultyAbbreviation: z.string().min(1, "Abbreviation is required"),
    designation: z.nativeEnum(DesignationEnumForZod, {
        errorMap: () => ({ message: "Invalid designation" }),
    }),
    departmentId: z.string().min(1, "Department is required"),
    seatingLocation: z.string().min(1, "Seating location is required"),
    joiningDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

type AddFacultyFormData = z.infer<typeof addFacultySchema>;

interface AddFacultyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (formData: CreateFacultyData) => Promise<void>;
}

export function AddFacultyModal({
    isOpen,
    onClose,
    onAdd,
}: AddFacultyModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddFacultyFormData>({
        resolver: zodResolver(addFacultySchema),
    });

    const { data: departments = [], isLoading: isLoadingDepartments } =
        useAllDepartments();

    const onSubmit: SubmitHandler<AddFacultyFormData> = async (data) => {
        await onAdd(data as CreateFacultyData);
        reset();
        onClose();
    };

    React.useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            title="Add New Faculty"
            description="Fill in the details to add a new faculty member to the system."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                        placeholder="John"
                    />
                    <Input
                        label="Last Name"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                        placeholder="Doe"
                    />
                </div>
                <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="john.doe@example.com"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Faculty Abbreviation"
                        {...register("facultyAbbreviation")}
                        error={errors.facultyAbbreviation?.message}
                        placeholder="JD"
                    />
                    <div>
                        <label
                            htmlFor="designation"
                            className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
                        >
                            Designation
                        </label>
                        <div className="relative">
                            <select
                                id="designation"
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
                        htmlFor="departmentId"
                        className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
                    >
                        Department
                    </label>
                    <div className="relative">
                        <select
                            id="departmentId"
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
                        placeholder="Room 101"
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
                                Adding...
                            </>
                        ) : (
                            "Add Faculty"
                        )}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}
