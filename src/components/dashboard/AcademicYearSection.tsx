/**
 * @file src/components/dashboard/AcademicYearSection.tsx
 * @description  academic year management with better space utilization.
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { AcademicYearForm } from "@/components/academic-year/AcademicYearForm";
import {
    useAllAcademicYears,
    useUpdateAcademicYear,
    useSoftDeleteAcademicYear,
    useCreateAcademicYear,
} from "@/hooks/useAcademicYears";
import {
    AcademicYear,
    CreateAcademicYearData,
    UpdateAcademicYearData,
} from "@/interfaces/academicYear";
import {
    Calendar,
    Plus,
    Edit2,
    Trash2,
    Clock,
    CheckCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const AcademicYearSection: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingAcademicYear, setEditingAcademicYear] =
        useState<AcademicYear | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
        null
    );

    // Queries and mutations
    const { data: academicYears = [], isLoading } = useAllAcademicYears();
    const createMutation = useCreateAcademicYear();
    const updateMutation = useUpdateAcademicYear();
    const deleteMutation = useSoftDeleteAcademicYear();

    const handleCreate = () => {
        setEditingAcademicYear(null);
        setShowForm(true);
        setIsExpanded(true);
    };

    const handleEdit = (academicYear: AcademicYear) => {
        setEditingAcademicYear(academicYear);
        setShowForm(true);
        setIsExpanded(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingAcademicYear(null);
    };

    const handleSubmit = async (
        data: CreateAcademicYearData | UpdateAcademicYearData
    ) => {
        try {
            if (editingAcademicYear) {
                await updateMutation.mutateAsync({
                    id: editingAcademicYear.id,
                    data: data as UpdateAcademicYearData,
                });
            } else {
                await createMutation.mutateAsync(
                    data as CreateAcademicYearData
                );
            }
            handleCloseForm();
        } catch {
            // Error handling is done in the hooks
        }
    };

    const handleDelete = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (showDeleteConfirm) {
            try {
                await deleteMutation.mutateAsync(showDeleteConfirm);
                setShowDeleteConfirm(null);
            } catch {
                // Error handling is done in the hooks
            }
        }
    };

    const getAcademicYearStatus = (academicYear: AcademicYear) => {
        return academicYear.isActive ? "active" : "inactive";
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
                        Active
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs">
                        Inactive
                    </Badge>
                );
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-4">
            {/* Academic Year Overview Card */}
            <Card className="bg-light-background dark:bg-dark-muted-background border border-light-secondary dark:border-dark-secondary rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-light-text dark:text-dark-text">
                            <div className="p-2 rounded-lg bg-primary-lighter dark:bg-primary-darker">
                                <Calendar className="h-4 w-4 text-light-highlight dark:text-dark-highlight" />
                            </div>
                            Academic Year Management
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleCreate}
                                size="sm"
                                className="bg-light-highlight dark:bg-dark-highlight hover:bg-primary-dark text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Year
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        <StatCard
                            title="Total Years"
                            value={academicYears.length}
                            icon={Calendar}
                            isLoading={isLoading}
                            subtitle="Created"
                        />
                        <StatCard
                            title="Active Year"
                            value={
                                academicYears.find((year) => year.isActive)
                                    ?.yearString || "None"
                            }
                            icon={CheckCircle}
                            isLoading={isLoading}
                            subtitle="Currently Active"
                            className={
                                academicYears.some((year) => year.isActive)
                                    ? "bg-primary-lighter dark:bg-primary-darker"
                                    : ""
                            }
                        />
                        <StatCard
                            title="Last Updated"
                            value={
                                academicYears.length > 0
                                    ? new Date(
                                          academicYears[0].updatedAt
                                      ).toLocaleDateString()
                                    : "Never"
                            }
                            icon={Clock}
                            isLoading={isLoading}
                            subtitle="Latest Changes"
                        />
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                        <div className="space-y-4 border-t border-light-secondary dark:border-dark-secondary pt-4">
                            {/* Form */}
                            {showForm && (
                                <AcademicYearForm
                                    academicYear={
                                        editingAcademicYear || undefined
                                    }
                                    onSubmit={handleSubmit}
                                    onCancel={handleCloseForm}
                                    isLoading={isSubmitting}
                                    mode={
                                        editingAcademicYear ? "edit" : "create"
                                    }
                                />
                            )}

                            {/* Academic Years List */}
                            {!showForm && (
                                <div>
                                    <h4 className="text-base font-semibold text-light-text dark:text-dark-text mb-3">
                                        Existing Academic Years (
                                        {academicYears.length})
                                    </h4>

                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-main border-t-transparent"></div>
                                            <span className="ml-2 text-light-muted-text dark:text-dark-muted-text">
                                                Loading...
                                            </span>
                                        </div>
                                    ) : academicYears.length === 0 ? (
                                        <div className="text-center py-6">
                                            <Calendar className="h-6 w-6 mx-auto text-light-muted-text dark:text-dark-muted-text opacity-50 mb-2" />
                                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                                No academic years found. Create
                                                one to get started.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {academicYears
                                                .slice(0, 6)
                                                .map((academicYear) => {
                                                    const status =
                                                        getAcademicYearStatus(
                                                            academicYear
                                                        );

                                                    return (
                                                        <div
                                                            key={
                                                                academicYear.id
                                                            }
                                                            className="p-3 border border-light-secondary dark:border-dark-secondary rounded-lg hover:bg-light-muted-background dark:hover:bg-dark-noisy-background transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h5 className="font-semibold text-light-text dark:text-dark-text">
                                                                            {
                                                                                academicYear.yearString
                                                                            }
                                                                        </h5>
                                                                        {academicYear.isActive && (
                                                                            <Badge className="bg-primary-lighter text-light-highlight dark:text-dark-highlight dark:bg-primary-darker">
                                                                                Active
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {getStatusBadge(
                                                                        status
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                academicYear
                                                                            )
                                                                        }
                                                                        className="h-7 w-7 p-0"
                                                                    >
                                                                        <Edit2 className="h-3 w-3" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                academicYear.id
                                                                            )
                                                                        }
                                                                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-light-muted-text dark:text-dark-muted-text">
                                                                Created:{" "}
                                                                {new Date(
                                                                    academicYear.createdAt
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}

                                    {academicYears.length > 6 && (
                                        <div className="text-center mt-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    window.open(
                                                        "/academic-year",
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View All {academicYears.length}{" "}
                                                Academic Years
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-light-background dark:bg-dark-muted-background rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                            Delete Academic Year
                        </h3>
                        <p className="text-light-muted-text dark:text-dark-muted-text mb-6">
                            Are you sure you want to delete this academic year?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmDelete}
                                disabled={deleteMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleteMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
